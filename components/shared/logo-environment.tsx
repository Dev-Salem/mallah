'use client';

import React from 'react';
import { Logo } from '@/components/ui/logo';

export function LogoEnvironment() {
  return (
    <div className="relative flex items-center justify-center py-20 group">
      {/* The "Celestial Light Leak" - Moves behind the glass */}
      <div 
        className="absolute w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none transition-all duration-[10s] ease-in-out group-hover:bg-primary/30"
        style={{
          animation: 'float-mesh 15s ease-in-out infinite alternate',
        }}
      />
      
      {/* Aura Core */}
      <div className="absolute w-[200px] h-[200px] bg-primary/40 blur-[60px] rounded-full -z-10" />

      {/* Grid HUD Overlay (Subtle) */}
      <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none" />

      {/* The Glass Logo */}
      <div className="relative scale-[1.3] transition-all duration-700 hover:scale-[1.35] hover:-translate-y-2">
        <Logo size={420} isGlass={true} />
      </div>

      <style jsx global>{`
        @keyframes float-mesh {
          0% { transform: translate(-10%, -10%) scale(1); }
          50% { transform: translate(10%, 5%) scale(1.1); }
          100% { transform: translate(-5%, 15%) scale(0.9); }
        }
        @keyframes shine {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
      `}</style>
    </div>
  );
}
