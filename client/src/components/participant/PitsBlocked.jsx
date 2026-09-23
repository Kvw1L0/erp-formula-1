'use client';

import React from 'react';
import { Tv, Radio, Clock, Compass, Sparkles } from 'lucide-react';

export default function PitsBlocked({ team, durationFormatted, currentPosition, sectorIndex = 1, totalSectors = 5 }) {
  const teamColor = team?.color || '#E10600';
  const teamDisplayName = team?.subname || team?.name || `Escudería ${team?.id}`;

  return (
    <div className="max-w-xl mx-auto w-full bg-f1-card p-6 md:p-8 rounded-3xl border border-f1-cyan/40 shadow-2xl shadow-f1-cyan/10 text-center relative overflow-hidden my-auto animate-fadeIn">
      {/* Luz de fondo animada */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-f1-cyan/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-f1-red/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* 1. SECTOR / PREGUNTA */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-f1-yellow/15 border border-f1-yellow/40 text-xs md:text-sm font-mono text-f1-yellow font-black mb-5 shadow-sm">
        <Compass className="w-4 h-4 animate-spin-slow" />
        <span>SECTOR {sectorIndex} DE {totalSectors}</span>
      </div>

      {/* 2. ESCUDERÍA EN GRANDE */}
      <div className="mb-6 p-5 rounded-2xl bg-f1-dark/90 border border-f1-border/80 shadow-lg relative">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl font-mono text-xl font-black text-white flex items-center justify-center shadow-lg border-2 border-white/60"
            style={{ backgroundColor: teamColor, boxShadow: `0 0 16px ${teamColor}80` }}
          >
            {team?.id || 1}
          </div>
          <div className="text-left">
            <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
              ESCUDERÍA {team?.id}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight italic truncate max-w-[280px] sm:max-w-xs">
              {teamDisplayName}
            </h1>
          </div>
        </div>
      </div>

      {/* 3. LLAMADO DESTACADO A MIRAR LA PANTALLA GIGANTE */}
      <div className="p-5 bg-gradient-to-b from-f1-cyan/15 to-transparent rounded-2xl border-2 border-f1-cyan/60 mb-6 space-y-2 shadow-lg shadow-f1-cyan/10">
        <div className="flex items-center justify-center gap-2.5 text-f1-cyan font-mono text-lg md:text-xl font-black uppercase tracking-wide">
          <Tv className="w-6 h-6 animate-bounce text-f1-cyan" />
          <span>¡MIRA LA PANTALLA GIGANTE!</span>
        </div>
        <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
          Tus respuestas fueron transmitidas exitosamente. La carrera se define ahora en la pista.
        </p>
      </div>

      {/* 4. TIEMPO REGISTRADO EN GRANDE */}
      <div className="p-4 bg-f1-dark/80 rounded-2xl border border-f1-border flex flex-col items-center justify-center">
        <span className="text-slate-400 block text-[11px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-f1-cyan" /> TIEMPO REGISTRADO
        </span>
        <span className="text-3xl md:text-4xl font-black font-mono text-f1-cyan tracking-wider drop-shadow-[0_0_12px_#00F0FF80]">
          {durationFormatted || 'Calculando...'}
        </span>
      </div>
    </div>
  );
}
