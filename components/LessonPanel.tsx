
import React from 'react';
import { LessonState } from '../types';
import { BookOpen, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface LessonPanelProps {
    lesson: LessonState | null;
    isComplete: boolean;
    isLoading: boolean;
    onRequestNewModule: () => void;
}

export const LessonPanel: React.FC<LessonPanelProps> = ({ lesson, isComplete, isLoading, onRequestNewModule }) => {
    return (
        <div className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden border border-white/5">
            <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Mission Briefing</h2>
                </div>
                {isLoading && <Loader2 className="h-4 w-4 text-cyan-500 animate-spin" />}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence mode="wait">
                    {!lesson ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="h-8 bg-white/5 rounded-lg animate-pulse w-3/4" />
                            <div className="space-y-2">
                                <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
                                <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
                                <div className="h-4 bg-white/5 rounded animate-pulse w-4/6" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={lesson.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">{lesson.title}</h3>
                                <div className="h-1 w-12 bg-cyan-500 rounded-full" />
                            </div>

                            <div className="bg-black/40 rounded-xl p-5 border border-white/5 shadow-inner">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="h-3 w-3 text-cyan-400" />
                                    <span className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-tighter">Current Objective</span>
                                </div>
                                <div className="text-slate-300 text-sm leading-relaxed font-sans prose prose-invert max-w-none prose-p:my-2 prose-headings:text-cyan-400 prose-headings:text-sm prose-headings:font-bold prose-headings:uppercase prose-strong:text-white prose-ul:list-disc prose-ul:pl-4 prose-li:my-1">
                                    <ReactMarkdown>{lesson.objective}</ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-500/5 border-t border-emerald-500/20"
                >
                    <button
                        onClick={onRequestNewModule}
                        disabled={isLoading}
                        className="group flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <span>PROCEED TO NEXT MODULE</span>
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </motion.div>
            )}
        </div>
    );
};
