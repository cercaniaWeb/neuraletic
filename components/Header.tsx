
import React from 'react';
import { Shield, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  xp: number;
  status?: 'success' | 'error' | 'security_alert';
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ xp, status = 'success', children }) => {
  const statusMap = {
    success: { text: 'STABLE', color: 'text-emerald-400', pingColor: 'bg-emerald-400', finalColor: 'bg-emerald-500' },
    error: { text: 'DIAGNOSTIC', color: 'text-amber-400', pingColor: 'bg-amber-400', finalColor: 'bg-amber-500' },
    security_alert: { text: 'CRITICAL', color: 'text-rose-400', pingColor: 'bg-rose-400', finalColor: 'bg-rose-500' },
  };
  const currentStatus = statusMap[status] || statusMap.success;

  return (
    <header className="glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
        >
          <Shield className="h-6 w-6 text-cyan-400" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            CyberPath <span className="px-2 py-0.5 bg-cyan-500 text-black text-[10px] rounded font-black tracking-tst uppercase">v2.0</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Neural Education Interface</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* ACTION AREA (For buttons like Neural Map) */}
        {children}

        <div className="hidden md:block h-6 w-px bg-white/10" />

        <div className="hidden md:flex items-center gap-3">
          <Target className="h-4 w-4 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Neural XP</span>
            <span className="text-sm font-bold text-white leading-none">{xp.toLocaleString()}</span>
          </div>
        </div>

        <div className="h-8 w-px bg-white/5 hidden md:block" />

        <div className={`flex items-center gap-3 ${currentStatus.color}`}>
          <Activity className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-mono uppercase leading-none hidden md:block">Kernel Status</span>
            <div className="flex items-center gap-2 mt-0 md:mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentStatus.pingColor} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${currentStatus.finalColor}`}></span>
              </span>
              <span className="text-[11px] font-bold font-mono tracking-wider leading-none hidden sm:block">{currentStatus.text}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
