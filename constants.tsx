
import React from 'react';

export const COLORS = {
  indigo: '#1a1a2e',
  violet: '#16213e',
  cyan: '#0f3460',
  accent: '#a78bfa', // violet-400
  fake: '#ef4444', // red-500
  real: '#10b981', // emerald-500
  uncertain: '#f59e0b', // amber-500
  gold: '#d4af37'
};

export const LOGOS = {
  CodeBlooded: () => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)] flex items-center justify-center font-bold italic text-white text-xs">CB</div>
      <span className="text-red-500 font-orbitron font-bold tracking-tighter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">CODE BLOODED</span>
    </div>
  ),
  Mayavihin: ({ className = "h-8" }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-8 h-8 fill-cyan-400">
        <path d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="15" fill="currentColor" className="animate-pulse" />
        <path d="M50 20 L50 35 M50 65 L50 80 M20 50 L35 50 M65 50 L80 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="font-orbitron font-black text-xl tracking-widest text-white">MAYAVIHIN</span>
    </div>
  )
};
