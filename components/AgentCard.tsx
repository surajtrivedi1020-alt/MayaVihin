
import React from 'react';
import { AgentResult, Verdict } from '../types';
import { COLORS } from '../constants';

interface AgentCardProps {
  agent: AgentResult;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const getVerdictColor = (v: Verdict) => {
    if (v === 'Real') return COLORS.real;
    if (v === 'Fake') return COLORS.fake;
    return COLORS.uncertain;
  };

  const getVerdictBg = (v: Verdict) => {
    if (v === 'Real') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (v === 'Fake') return 'bg-red-500/10 text-red-400 border-red-500/30';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  };

  return (
    <div className="bg-indigo-950/40 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-cyan-500/40 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-orbitron font-semibold text-white/90 group-hover:text-cyan-300 transition-colors">
            {agent.name}
          </h4>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold border ${getVerdictBg(agent.verdict)}`}>
            {agent.verdict.toUpperCase()}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-orbitron">
            {agent.confidence}%
          </div>
          <div className="text-[10px] text-white/50 uppercase tracking-widest">Confidence</div>
        </div>
      </div>

      <div className="w-full h-1.5 bg-black/40 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full transition-all duration-1000"
          style={{ 
            width: `${agent.confidence}%`,
            backgroundColor: getVerdictColor(agent.verdict)
          }}
        />
      </div>

      <p className="text-sm text-white/70 leading-relaxed italic">
        "{agent.reasoning}"
      </p>
    </div>
  );
};
