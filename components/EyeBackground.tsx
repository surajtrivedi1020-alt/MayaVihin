
import React from 'react';

interface EyeBackgroundProps {
  isActive: boolean;
}

export const EyeBackground: React.FC<EyeBackgroundProps> = ({ isActive }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-30 select-none">
      <div 
        className={`relative transition-all duration-1000 ease-in-out transform ${
          isActive ? 'scale-110 opacity-50' : 'scale-100 opacity-20 grayscale'
        }`}
      >
        {/* Eye Outer Glow */}
        <div className="absolute inset-0 bg-cyan-500/20 blur-[120px] rounded-full w-[600px] h-[300px]" />
        
        {/* Sclera / Outer Eye */}
        <div 
          className={`w-[500px] h-[250px] border-2 border-cyan-500/30 rounded-[100%] transition-all duration-1000 overflow-hidden relative flex items-center justify-center ${
            isActive ? 'h-[250px]' : 'h-[10px]'
          }`}
        >
          {/* Iris */}
          <div 
            className={`w-[200px] h-[200px] bg-gradient-to-br from-indigo-500 via-cyan-400 to-violet-600 rounded-full flex items-center justify-center border-4 border-cyan-200/20 shadow-[0_0_50px_rgba(34,211,238,0.4)] transition-transform duration-1000 ${
              isActive ? 'scale-100' : 'scale-0'
            }`}
          >
            {/* Pupil */}
            <div className="w-[80px] h-[80px] bg-black rounded-full flex items-center justify-center overflow-hidden">
               <div className="w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
            </div>
            
            {/* Glint */}
            <div className="absolute top-1/4 left-1/4 w-8 h-4 bg-white/40 blur-sm rounded-full transform -rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
};
