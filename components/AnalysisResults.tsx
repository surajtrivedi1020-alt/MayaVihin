
import React from 'react';
import { AnalysisRecord } from '../types';
import { AgentCard } from './AgentCard';
import { COLORS } from '../constants';

interface AnalysisResultsProps {
  record: AnalysisRecord;
  onClose?: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ record, onClose }) => {
  const isFake = record.verdict === 'Fake';
  const isReal = record.verdict === 'Real';
  
  const getStatusColor = () => {
    if (isReal) return COLORS.real;
    if (isFake) return COLORS.fake;
    return COLORS.uncertain;
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative bg-gradient-to-br from-indigo-900/60 to-violet-900/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden">
        {/* Glow behind result */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-40"
          style={{ backgroundColor: getStatusColor() }}
        />

        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="flex-shrink-0 w-48 h-48 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 relative group overflow-hidden">
            {record.thumbnail ? (
              <img src={record.thumbnail} alt="Analysis Target" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="text-white/20">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/40 transition-all rounded-2xl pointer-events-none" />
          </div>

          <div className="flex-grow text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-orbitron font-black mb-2 tracking-tight">
              VERDICT: <span style={{ color: getStatusColor() }}>{record.verdict.toUpperCase()}</span>
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="px-4 py-1.5 rounded-full bg-black/40 border border-white/10 text-white/90 font-medium">
                {record.overallConfidence}% Confidence Score
              </div>
              <div className="text-white/40 text-sm">
                ID: {record.id.slice(0, 8)}...
              </div>
            </div>
            <p className="text-white/80 leading-relaxed text-lg max-w-2xl">
              {record.explanation}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {record.agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
        {/* Placeholder for total visual forensic detail */}
        <div className="lg:col-span-2 bg-black/20 rounded-xl p-6 border border-white/5 flex flex-col justify-center">
            <h3 className="text-white/40 uppercase tracking-[0.2em] text-xs font-bold mb-4">Analysis Timeline & Forensic Markers</h3>
            <div className="flex flex-wrap gap-2">
              {['Noise Pattern Mapping', 'Deep Convolutional Trace', 'Spectral Artifacts', 'GAN Signature', 'Facial Landmark Sync'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
        </div>
      </div>

      {onClose && (
        <div className="flex justify-center mt-12">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white text-black font-orbitron font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-lg shadow-white/5"
          >
            START NEW ANALYSIS
          </button>
        </div>
      )}
    </div>
  );
};
