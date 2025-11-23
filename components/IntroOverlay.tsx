
import React, { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';

interface IntroOverlayProps {
  onComplete: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // 1. Show logo for 1.2 seconds
    const timer1 = setTimeout(() => {
      setIsOpen(true); // Trigger curtain opening
    }, 1200);

    // 2. Remove component from DOM after animation completes (1s duration)
    const timer2 = setTimeout(() => {
      setIsHidden(true);
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (isHidden) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-none">
      
      {/* Left Curtain Panel - Width 51% to overlap center and prevent gaps */}
      <div 
        className={`absolute top-0 left-0 w-[51%] h-full bg-[#0f172a] z-20 transition-transform duration-[1000ms] ease-in-out will-change-transform
        ${isOpen ? '-translate-x-full' : 'translate-x-0'}`}
      ></div>

      {/* Right Curtain Panel - Width 51% to overlap center and prevent gaps */}
      <div 
        className={`absolute top-0 right-0 w-[51%] h-full bg-[#0f172a] z-20 transition-transform duration-[1000ms] ease-in-out will-change-transform
        ${isOpen ? 'translate-x-full' : 'translate-x-0'}`}
      ></div>

      {/* Center Logo Content (Fades out when curtains open) */}
      <div 
        className={`relative z-30 flex flex-col items-center justify-center transition-all duration-700
        ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-2xl mb-4">
          <Palette size={36} />
        </div>
        
        <h1 className="text-3xl font-bold text-white tracking-[0.2em] font-mono">
          FLEX<span className="text-indigo-400">DESIGN</span>
        </h1>
        
        <div className="mt-4 flex gap-1">
           <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
           <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
           <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"></span>
        </div>
      </div>

    </div>
  );
};
