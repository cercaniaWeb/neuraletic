
import React from 'react';
import { Payload } from '../types';
import { Cpu, Terminal as TerminalIcon, Info, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackPanelProps {
  data: Payload | null | undefined;
  loading: boolean;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ data, loading }) => {
  const renderStatus = (isCorrect: boolean | undefined) => {
    if (isCorrect === true) {
      return (
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
          <CheckCircle2 className="h-3 w-3" />
          <span className="text-[10px] font-black tracking-widest uppercase">Validated</span>
        </div>
      );
    }
    if (isCorrect === false) {
      return (
        <div className="flex items-center gap-1.5 text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full border border-rose-400/20">
          <XCircle className="h-3 w-3" />
          <span className="text-[10px] font-black tracking-widest uppercase">Rejected</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col min-h-0 overflow-hidden border border-white/5">
      <div className="bg-white/5 p-4 border-b border-white/5 flex items-center gap-2">
        <Cpu className="h-4 w-4 text-cyan-400" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Kernel Analysis</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-white/5 rounded w-1/4 animate-pulse" />
                  <div className="h-12 bg-white/5 rounded-xl animate-pulse w-full" />
                </div>
              ))}
            </motion.div>
          ) : !data ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
              <TerminalIcon className="h-8 w-8 text-slate-700" />
              <p className="text-xs text-slate-500 font-mono">Awaiting kernel input for behavioral analysis...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {data.evaluation && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Evaluation</span>
                    {renderStatus(data.evaluation.is_correct)}
                  </div>
                  <div className="bg-black/60 rounded-xl p-4 border border-white/5 text-sm text-slate-300 leading-relaxed">
                    {data.evaluation.feedback}
                  </div>

                  {data.evaluation.technical_details && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Technical Debrief</span>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-[11px] font-mono text-slate-400 border border-white/5 leading-relaxed">
                        {data.evaluation.technical_details}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {data.hints && data.hints.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-3 w-3 text-cyan-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Intel</span>
                  </div>
                  <div className="space-y-2">
                    {data.hints.map((hint, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-cyan-500/5 p-3 rounded-lg border border-cyan-500/10 text-xs text-cyan-200/80 leading-relaxed"
                      >
                        {hint}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
