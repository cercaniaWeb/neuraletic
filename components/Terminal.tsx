
import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { CommandHistoryItem } from '../types';
import { useCyberSound } from '../hooks/useCyberSound';

interface TerminalProps {
  commandHistory: CommandHistoryItem[];
  onCommandSubmit: (command: string) => void;
  isLoading: boolean;
}

const THEME = {
  background: '#0a0a0a',
  foreground: '#00f2ff',
  cursor: '#00f2ff',
  selectionBackground: 'rgba(0, 242, 255, 0.3)',
  black: '#000000',
  red: '#ff5555',
  green: '#50fa7b',
  yellow: '#f1fa8c',
  blue: '#bd93f9',
  magenta: '#ff79c6',
  cyan: '#8be9fd',
  white: '#f8f8f2',
};

export const Terminal: React.FC<TerminalProps> = ({ commandHistory, onCommandSubmit, isLoading }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const commandBufferRef = useRef('');
  const onCommandSubmitRef = useRef(onCommandSubmit);
  const { playTyping } = useCyberSound();

  useEffect(() => {
    onCommandSubmitRef.current = onCommandSubmit;
  }, [onCommandSubmit]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: THEME,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 14,
      letterSpacing: 1,
      rows: 24,
      cols: 80,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln('\x1b[1;36mCyberPath OS [Version 2.0.1]\x1b[0m');
    term.writeln('\x1b[1;32mSecure connection established. AI Mentor Online.\x1b[0m');
    term.write('\n\r\x1b[1;34mroot@cyberpath\x1b[0m:\x1b[1;35m~\x1b[0m# ');

    term.onData(data => {
      playTyping();
      const code = data.charCodeAt(0);

      // Handle Enter
      if (code === 13) {
        term.write('\r\n');
        const cmd = commandBufferRef.current;
        if (cmd.trim()) {
          onCommandSubmitRef.current(cmd);
          commandBufferRef.current = '';
        } else {
          term.write('\x1b[1;34mroot@cyberpath\x1b[0m:\x1b[1;35m~\x1b[0m# ');
        }
      }
      // Handle Backspace
      else if (code === 127 || code === 8) {
        if (commandBufferRef.current.length > 0) {
          term.write('\b \b');
          commandBufferRef.current = commandBufferRef.current.slice(0, -1);
        }
      }
      // Handle Normal Input & Paste (length >= 1)
      else if (code >= 32 || data.length > 1) {
        // Prevent control characters if it's a single char, but allow pastes
        // For pastes, we might get chunks. We'll simply append them.
        // We should probably strip newlines from pasted text to avoid accidental submits or weird formatting, 
        // or handle them. For now, let's just strip \r and \n to keep it on one line.
        const cleanData = data.replace(/[\r\n]+/g, '');

        if (cleanData.length > 0) {
          term.write(cleanData);
          commandBufferRef.current += cleanData;
        }
      }
    });

    xtermRef.current = term;

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Only init once

  // Handle command history updates (outputs from AI)
  useEffect(() => {
    if (!xtermRef.current || commandHistory.length === 0) return;

    const last = commandHistory[commandHistory.length - 1];

    // We only write the output if it's not the 'Executing...' placeholder
    if (last.output !== 'Executing...' && last.output !== 'Lección inicial generada. ¡Lista para operar!') {
      xtermRef.current.writeln(`\r\x1b[0m${last.output}`);
      xtermRef.current.write('\r\n\x1b[1;34mroot@cyberpath\x1b[0m:\x1b[1;35m~\x1b[0m# ');
    }
  }, [commandHistory]);

  return (
    <div className="w-full h-full p-1 bg-black rounded-xl overflow-hidden border border-slate-800/50 shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  );
};
