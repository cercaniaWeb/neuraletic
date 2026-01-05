import React, { useEffect, useRef, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { SKILL_TREE_DATA, SkillNode } from '../data/skillTree';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TraineeGraphProps {
    onClose: () => void;
    currentModuleId: string; // To highlight position
    completedModuleIds: string[];
}

export const TraineeGraph: React.FC<TraineeGraphProps> = ({ onClose, currentModuleId, completedModuleIds }) => {
    const graphRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ w: 800, h: 600 });
    const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                w: containerRef.current.clientWidth,
                h: containerRef.current.clientHeight
            });
        }
    }, []);

    // Process data to highlight current status
    const graphData = useMemo(() => {
        const nodes = SKILL_TREE_DATA.nodes.map(node => {
            let color = '#334155'; // locked (slate-700)
            let val = 1;

            // Highlight current active module
            if (node.id === currentModuleId) {
                color = '#00f2ff'; // active/current (Cyan)
                val = 3;
            } else if (completedModuleIds.includes(node.id)) {
                color = '#22c55e'; // completed (Green)
                val = 2;
            }

            return { ...node, color, val };
        });
        return { nodes, links: SKILL_TREE_DATA.links };
    }, [currentModuleId, completedModuleIds]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <div className="relative w-full max-w-5xl h-[80vh] bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 bg-black/40">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-widest uppercase">
                            <span className="text-cyan-500">Neural</span> Skill Graph
                        </h2>
                        <p className="text-slate-400 text-sm">Visualización de Rutas Sinápticas</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Graph Container */}
                <div ref={containerRef} className="flex-1 relative bg-[url('/grid.svg')] bg-center">
                    <ForceGraph2D
                        ref={graphRef}
                        width={dimensions.w}
                        height={dimensions.h}
                        graphData={graphData}
                        nodeLabel={node => `${node.label} \n [Click para detalles]`}
                        nodeColor={node => (node as any).color}
                        linkColor={() => '#1e293b'}
                        backgroundColor="#00000000"
                        nodeRelSize={6}
                        linkWidth={2}
                        linkDirectionalParticles={2}
                        linkDirectionalParticleSpeed={0.005}
                        d3VelocityDecay={0.1}
                        onNodeClick={node => {
                            setSelectedNode(node as unknown as SkillNode);
                            graphRef.current?.centerAt(node.x, node.y, 1000);
                            graphRef.current?.zoom(4, 2000);
                        }}
                        onBackgroundClick={() => setSelectedNode(null)}
                    />

                    {/* Node Details Panel */}
                    <AnimatePresence>
                        {selectedNode && (
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 50, opacity: 0 }}
                                className="absolute top-6 right-6 w-80 bg-black/90 backdrop-blur-md border border-cyan-500/30 p-6 rounded-xl shadow-2xl z-10"
                            >
                                <h3 className="text-xl font-bold text-cyan-400 mb-1">{selectedNode.label}</h3>

                                {/* Status Logic */}
                                {(() => {
                                    let statusText = 'BLOQUEADO';
                                    let statusColor = 'bg-slate-600';
                                    if (selectedNode.id === currentModuleId) {
                                        statusText = 'EN PROGRESO';
                                        statusColor = 'bg-cyan-500 animate-pulse';
                                    } else if (completedModuleIds.includes(selectedNode.id)) {
                                        statusText = 'DOMINADO';
                                        statusColor = 'bg-green-500';
                                    }

                                    return (
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                                                {statusText}
                                            </span>
                                        </div>
                                    );
                                })()}

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-cyan-500/70 font-bold uppercase">Descripción del Nodo</label>
                                        <p className="text-sm text-slate-300 leading-relaxed mt-1">
                                            {selectedNode.description}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-xs text-cyan-500/70 font-bold uppercase">Nivel de Acceso</label>
                                        <div className="mt-1 flex gap-1">
                                            {[1, 2, 3].map(lvl => (
                                                <div key={lvl} className={`h-1 flex-1 rounded-full ${lvl <= selectedNode.group ? 'bg-cyan-500' : 'bg-slate-800'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Legend Overlay */}
                    <div className="absolute bottom-6 left-6 p-4 bg-black/60 backdrop-blur border border-white/10 rounded-xl space-y-2 pointer-events-none">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            <span className="text-xs text-slate-300 font-mono">DOMINADO</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                            <span className="text-xs text-slate-300 font-mono">EN PROGRESO</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <span className="text-xs text-slate-500 font-mono">BLOQUEADO</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
