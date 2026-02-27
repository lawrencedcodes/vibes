import React from 'react';
import { motion } from 'motion/react';
import { Zap, Target, Activity, Heart, Code2, TrendingUp } from 'lucide-react';

interface AnalysisViewProps {
  analysis: {
    valueProps: string[];
    painPoints: string[];
    complexity: number;
    soul: string;
    language?: string;
    improvements?: string[];
  };
}

export function AnalysisView({ analysis }: AnalysisViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
    >
      {/* Complexity & Soul */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <Activity size={20} />
            <h3 className="font-mono font-bold uppercase tracking-wider text-sm">Technical Profile</h3>
          </div>
          {analysis.language && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300">
              <Code2 size={12} />
              {analysis.language}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-xs font-mono text-zinc-500 mb-2">
            <span>COMPLEXITY_SCORE</span>
            <span>{analysis.complexity}/10</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${analysis.complexity * 10}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase">
              <Heart size={12} />
              <span>Soul Assessment</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed italic border-l-2 border-zinc-700 pl-3">
              "{analysis.soul}"
            </p>
          </div>

          {analysis.improvements && analysis.improvements.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase">
                <TrendingUp size={12} />
                <span>Key Improvements</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.improvements.map((imp, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
                  >
                    {imp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Value Props & Pain Points */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 text-amber-400">
            <Zap size={20} />
            <h3 className="font-mono font-bold uppercase tracking-wider text-sm">Value Propositions</h3>
          </div>
          <ul className="space-y-2">
            {analysis.valueProps.map((prop, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-amber-500/50 mt-1">▹</span>
                {prop}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-3 text-rose-400">
            <Target size={20} />
            <h3 className="font-mono font-bold uppercase tracking-wider text-sm">Pain Points Solved</h3>
          </div>
          <ul className="space-y-2">
            {analysis.painPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-rose-500/50 mt-1">▹</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
