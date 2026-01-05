
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Terminal } from './components/Terminal';
import { LessonPanel } from './components/LessonPanel';
import { FeedbackPanel } from './components/FeedbackPanel';
import { sendToCyberPathEngine } from './services/geminiService';
import { CyberPathResponse, LessonState, CommandHistoryItem } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

const MODULE_PIPELINE = ['Fundamentos', 'SQL Injection', 'Web Exploitation', 'Network Scanning'];

import { ACADEMIC_CURRICULUM } from './data/curriculum';

// ... (imports remain)
import { evaluateOffline } from './services/offlineEvaluator';

import { TraineeGraph } from './components/TraineeGraph';
import { Network } from 'lucide-react';

// ... (imports remain)

const App: React.FC = () => {
  const [lesson, setLesson] = useState<LessonState | null>(null);
  const [feedback, setFeedback] = useState<CyberPathResponse | null>(null);
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const fetchInitialLesson = useCallback(async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const initialModuleKey = MODULE_PIPELINE[0]; // 'Fundamentos'
      const staticContent = ACADEMIC_CURRICULUM[initialModuleKey];

      if (!staticContent) throw new Error(`Curriculum data missing for module: ${initialModuleKey}`);

      const response = await sendToCyberPathEngine({
        action: 'generate_lesson',
        module_id: initialModuleKey,
        difficulty: 'Principiante'
      });

      if (response?.header.status === 'success') {
        setCurrentModuleIndex(0);

        // Use STATIC CONTENT for the theory to ensure quality
        const theoryText = staticContent.theory_block;
        const aiObjective = response.payload?.next_content?.lab_setup || "";
        const finalLabSetup = `TARGET: ${staticContent.lab_config.target_ip}\n${aiObjective}`;

        setLesson({
          title: staticContent.title,
          objective: theoryText,
          xp: 0,
        });

        setCommandHistory([{
          command: 'system_init',
          output: `Módulo cargado: ${staticContent.title}.\nObjetivo Primario: ${staticContent.lab_config.target_ip}`
        }]);

        setFeedback({
          ...response,
          payload: {
            ...response.payload,
            next_content: {
              theory: theoryText,
              lab_setup: finalLabSetup
            }
          }
        });
      } else {
        throw new Error(response?.payload?.evaluation?.feedback || "Fallo en la respuesta del motor de IA.");
      }
    } catch (err) {
      console.warn("AI Engine unreachable, switching to OFFLINE MODE.");

      const initialModuleKey = MODULE_PIPELINE[0];
      const staticContent = ACADEMIC_CURRICULUM[initialModuleKey];

      if (staticContent) {
        // Fallback: Load static content if AI fails
        setCurrentModuleIndex(0);
        setLesson({
          title: staticContent.title,
          objective: staticContent.theory_block,
          xp: 0,
        });
        setCommandHistory([{
          command: 'system_init',
          output: `\x1b[1;33m⚠️ CONEXIÓN NEURONAL INESTABLE. MODO OFFLINE ACTIVADO.\x1b[0m\n\nMódulo cargado: ${staticContent.title}.\nObjetivo: ${staticContent.lab_config.target_ip}`
        }]);

        setFeedback({
          header: { status: 'error', timestamp: new Date().toISOString() },
          payload: {
            evaluation: { is_correct: false, score: 0, feedback: "AI Offline", technical_details: "Offline" },
            next_content: { theory: staticContent.theory_block, lab_setup: `TARGET: ${staticContent.lab_config.target_ip}` },
            hints: ["La IA no está disponible, pero puedes seguir el manual."]
          }
        });
        // Do NOT set error state to avoid blocking UI
        setError(null);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido de conexión';
        setError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialLesson();
  }, [fetchInitialLesson]);

  const handleRequestNewModule = async () => {
    const nextModuleIndex = currentModuleIndex + 1;
    if (nextModuleIndex >= MODULE_PIPELINE.length) {
      setError("ENTRENAMIENTO COMPLETADO: Has dominado todos los módulos disponibles.");
      setIsLessonComplete(false);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setIsLessonComplete(false);

    const nextModuleKey = MODULE_PIPELINE[nextModuleIndex];

    try {
      const response = await sendToCyberPathEngine({
        action: 'generate_lesson',
        module_id: nextModuleKey,
        difficulty: 'Intermedio'
      });

      if (response?.payload?.next_content && response.header.status === 'success') {
        setCurrentModuleIndex(nextModuleIndex);
        setLesson(prev => ({
          title: `Módulo ${nextModuleIndex + 1}: ${nextModuleKey}`,
          objective: response.payload!.next_content!.theory,
          xp: prev?.xp || 0,
        }));
        setFeedback(response);
        setCommandHistory(prev => [...prev, { command: `load_module ${nextModuleKey}`, output: 'Nuevo escenario cargado correctamente.' }]);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (err) {
      // Offline Fallback for Next Module
      const staticContent = ACADEMIC_CURRICULUM[nextModuleKey];
      if (staticContent) {
        setCurrentModuleIndex(nextModuleIndex);
        setLesson(prev => ({
          title: staticContent.title,
          objective: staticContent.theory_block,
          xp: prev?.xp || 0,
        }));

        setFeedback({
          header: { status: 'success', timestamp: new Date().toISOString() }, // Treat as success for offline flow
          payload: {
            evaluation: { is_correct: true, score: 0, feedback: "Modo Offline: Módulo cargado.", technical_details: "Loaded from local cache" },
            next_content: {
              theory: staticContent.theory_block,
              lab_setup: `TARGET: ${staticContent.lab_config.target_ip}\nOFFLINE MODE ACTIVE`
            },
            hints: ["Estás en modo offline. Sigue la teoría proporcionada."]
          }
        });
        setCommandHistory(prev => [...prev, {
          command: `load_module ${nextModuleKey}`,
          output: `\x1b[1;33m⚠️ MODO OFFLINE.\x1b[0m\nMódulo cargado: ${staticContent.title}`
        }]);
      } else {
        setError(`Error al cargar ${nextModuleKey}: No hay contenido offline disponible.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommandSubmit = async (command: string) => {
    if (!lesson) return;
    setIsProcessing(true);
    setError(null);

    setCommandHistory(prev => [...prev, { command, output: 'Executing...' }]);

    try {
      const response = await sendToCyberPathEngine({
        action: "evaluate",
        lesson_objective: lesson.objective,
        user_command: command,
        terminal_output: `Simulated execution of ${command}`
      });

      setFeedback(response);

      setCommandHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].output = response.payload?.evaluation?.feedback || 'Analysis complete.';
        return newHistory;
      });

      if (response.payload?.evaluation?.is_correct) {
        setLesson(prev => prev ? ({ ...prev, xp: prev.xp + (response.payload?.evaluation?.score || 100) }) : null);
        if (!response.payload?.next_content?.theory) {
          setIsLessonComplete(true);
        }
      }

      if (response.payload?.next_content?.theory) {
        setIsLessonComplete(false);
        setLesson(prev => prev ? ({
          ...prev,
          objective: response.payload!.next_content!.theory
        }) : null);
      }

    } catch (err) {
      // Offline Evaluation Fallback
      console.warn("Switching to local evaluation engine.");
      const currentModuleKey = MODULE_PIPELINE[currentModuleIndex];
      const offlineResponse = evaluateOffline(command, currentModuleKey);

      setFeedback(offlineResponse);

      setCommandHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].output = offlineResponse.payload?.evaluation?.feedback || 'Offline Analysis complete.';
        return newHistory;
      });

      if (offlineResponse.payload?.evaluation?.is_correct) {
        setLesson(prev => prev ? ({ ...prev, xp: prev.xp + 50 }) : null); // Fewer XP for offline? Or same.
        // In offline mode, we might not fetch "new" content dynamically, but we mark as complete
        // If we want to simulate progression within a module, we'd need sub-steps.
        // For now, let's assume one correct command = module mastery or step forward.
        setIsLessonComplete(true);
      }

      // Don't show critical error, show offline status
      setError(null);

    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-300 font-sans selection:bg-cyan-500/30">
      <Header xp={lesson?.xp || 0} status={feedback?.header.status === 'success' ? 'success' : (error ? 'security_alert' : 'error')}>
        <button
          onClick={() => setShowGraph(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-all group"
        >
          <Network className="w-4 h-4 text-cyan-500 group-hover:text-cyan-400" />
          <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-100 uppercase tracking-wider">Neural Map</span>
        </button>
      </Header>

      <main className="h-[calc(100vh-80px)] p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left Column: UI Panels */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {error && !lesson ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-2xl border-rose-500/20 text-center space-y-4"
              >
                <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter">System Malfunction</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-mono">{error}</p>
                <button
                  onClick={fetchInitialLesson}
                  className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  RETRY INITIALIZATION
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex-1 min-h-0">
                  <LessonPanel
                    lesson={lesson}
                    isComplete={isLessonComplete}
                    isLoading={isProcessing}
                    onRequestNewModule={handleRequestNewModule}
                  />
                </div>
                <div className="flex-1 min-h-0">
                  <FeedbackPanel data={feedback?.payload} loading={isProcessing} />
                </div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Interactive Terminal */}
        <div className="flex-1 h-full relative group">
          <Terminal
            commandHistory={commandHistory}
            onCommandSubmit={handleCommandSubmit}
            isLoading={isProcessing}
          />
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 rounded-xl flex items-center justify-center pointer-events-none"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-6 w-6 border-2 border-cyan-500/10 border-b-cyan-500 rounded-full animate-spin-slow" />
                    </div>
                  </div>
                  <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase animate-pulse">Analyzing Maneuver</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>
      <AnimatePresence>
        {showGraph && (
          <TraineeGraph
            currentModuleId={MODULE_PIPELINE[currentModuleIndex]}
            onClose={() => setShowGraph(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;