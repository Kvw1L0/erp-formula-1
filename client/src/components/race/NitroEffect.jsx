'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export default function NitroEffect({ showText = false }) {
  return (
    <div className="absolute left-[-55px] top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-20 select-none">
      {/* Estela de Plasma Supersónica (Tron Trail) */}
      <div className="relative flex items-center">
        {/* Haz de luz neón largo */}
        <div className="w-20 h-3.5 bg-gradient-to-l from-f1-cyan via-blue-500/70 to-transparent blur-[2px] rounded-full animate-pulse" />
        
        {/* Núcleo de propulsión incandescente */}
        <div className="absolute right-0 w-7 h-5 bg-gradient-to-r from-cyan-200 via-f1-cyan to-blue-600 rounded-full blur-[1px] shadow-[0_0_20px_#00F0FF]" />
        
        {/* Destellos de plasma */}
        <div className="absolute right-2 w-2.5 h-2.5 bg-white rounded-full animate-ping opacity-90" />
      </div>

      {showText && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-f1-cyan via-blue-500 to-indigo-600 border border-white text-[9px] font-mono font-black text-black tracking-wider shadow-[0_0_15px_#00F0FF] animate-bounce whitespace-nowrap">
          <Zap className="w-3 h-3 fill-yellow-300 text-yellow-300" />
          <span>POLE BOOST +20%</span>
        </div>
      )}
    </div>
  );
}
