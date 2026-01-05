import { useCallback, useRef } from 'react';

export const useCyberSound = (enabled: boolean = true) => {
    const audioContext = useRef<AudioContext | null>(null);

    const initAudio = () => {
        if (!audioContext.current) {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    };

    const playOscillator = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
        if (!enabled) return;

        initAudio();
        if (!audioContext.current) return;

        const ctx = audioContext.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    const playTyping = useCallback(() => {
        // Very short, high pitch, mechanical click
        // Randomize pitch slightly for realism
        const freq = 600 + Math.random() * 200;
        playOscillator(freq, 'square', 0.05, 0.02);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    const playSuccess = useCallback(() => {
        // Ascending arpeggio
        setTimeout(() => playOscillator(440, 'sine', 0.3, 0.1), 0);
        setTimeout(() => playOscillator(554, 'sine', 0.3, 0.1), 100);
        setTimeout(() => playOscillator(659, 'sine', 0.3, 0.1), 200);
        setTimeout(() => playOscillator(880, 'sine', 0.6, 0.1), 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    const playError = useCallback(() => {
        // Descending / dissonance
        setTimeout(() => playOscillator(150, 'sawtooth', 0.4, 0.1), 0);
        setTimeout(() => playOscillator(100, 'sawtooth', 0.4, 0.1), 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    const playGlitch = useCallback(() => {
        // Random noise burst
        playOscillator(Math.random() * 1000, 'sawtooth', 0.1, 0.05);
        setTimeout(() => playOscillator(Math.random() * 1000, 'square', 0.1, 0.05), 50);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    return { playTyping, playSuccess, playError, playGlitch };
};
