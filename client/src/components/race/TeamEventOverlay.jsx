'use client';

import React, { useEffect } from 'react';
import { Trophy, Sparkles, Users, X, Flame } from 'lucide-react';
import { sounds, triggerHaptic } from '../../lib/soundEffects';

export default function TeamEventOverlay({
  title = 'DINÁMICA DE EQUIPO EN ESCENARIO',
  description = 'Todos los pilotos deben seguir las instrucciones del Facilitador en el escenario.',
  onClose,
  canClose = false
}) {
  useEffect(() => {
    try {
      sounds.playRaceStart();
      triggerHaptic([150, 80, 150, 80, 300]);
    } catch (e) {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
      {/* Luces y resplandor de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.2)_0%,rgba(147,51,234,0.25)_40%,transparent_70%)] pointer-events-none animate-pulse" />

      <div className="max-w-2xl w-full bg-gradient-to-b from-slate-900 via-carbon to-black p-8 md:p-12 rounded-3xl border-2 border-yellow-400/80 shadow-[0_0_80px_rgba(234,179,8,0.4)] space-y-6 relative overflow-hidden">
        {/* Adorno superior estilo F1 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-purple-500 animate-pulse" />

        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-3xl flex items-center justify-center mx-auto text-black shadow-[0_0_40px_rgba(234,179,8,0.6)] animate-bounce">
          <Trophy className="w-11 h-11" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-xs font-mono font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>ACTIVIDAD INTERACTIVA ESPECIAL • PITS LIVE</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tight leading-none drop-shadow-md">
            {title}
          </h2>

          <p className="text-base md:text-lg text-amber-200/90 font-sans font-medium max-w-xl mx-auto pt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Indicador de Atención a Escenario */}
        <div className="p-4 bg-purple-950/40 border border-purple-500/40 rounded-2xl flex items-center justify-center gap-3 text-purple-200 font-mono text-xs md:text-sm font-bold">
          <Users className="w-5 h-5 text-purple-400 animate-pulse" />
          <span>¡TODAS LAS ESCUDERÍAS ATENTAS AL FACILITADOR!</span>
        </div>
      </div>
    </div>
  );
}
