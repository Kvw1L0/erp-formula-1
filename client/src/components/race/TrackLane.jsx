'use client';

import React from 'react';
import { motion } from 'framer-motion';
import F1CarSvg from './F1CarSvg';
import NitroEffect from './NitroEffect';
import SkidSparks from './SkidSparks';
import TireSmoke from './TireSmoke';
import { Zap, Wind } from 'lucide-react';

export default function TrackLane({
  laneNumber,
  team,
  result,
  telemetry,
  isRevealed,
  isCarsAdvancing = false,
  isNitroActive,
  isCloseBattle = false
}) {
  const currentPos = telemetry?.currentPosition || laneNumber;
  const isLeader = currentPos === 1;
  const isBoosted = telemetry?.isFastestPerfect || result?.isFastestPerfect;
  const isDRS = telemetry?.isDRSActive || result?.isDRSActive;

  const previousDist = telemetry?.previousDistance ?? 0;
  const targetDist = telemetry?.currentDistance ?? 0;

  // Mientras se muestra la cinemática o el suspenso de 2s, mantener en posición previa.
  // Una vez iniciada la aceleración o en reposo, mostrar la distancia objetivo alcanzada.
  const displayPercent = (isRevealed && !isCarsAdvancing)
    ? previousDist
    : targetDist;

  // Mapeo seguro al carril visual sin columna derecha (0% -> 1%, 100% -> 93%)
  const visualLeftPercent = Math.max(1, Math.min(93, (displayPercent / 100) * 91));

  const teamInventedName = telemetry?.subname || team.subname;

  return (
    <div className={`relative flex items-center h-16 md:h-20 min-h-[64px] md:min-h-[80px] my-1.5 bg-f1-card/90 border-y transition-all overflow-hidden ${
      isCloseBattle
        ? 'border-yellow-400/50 bg-yellow-400/5 shadow-inner'
        : 'border-f1-border/40 hover:bg-f1-cardHover'
    }`}>
      {/* Columna Izquierda: Identificador Jugador (J1..J6) y Escudería */}
      <div className="w-56 md:w-64 flex-shrink-0 flex items-center gap-3 px-3.5 border-r border-f1-border/60 z-20 bg-f1-card/95 h-full">
        {/* Badge Oficial Jugador (J1, J2, J3, J4, J5, J6) */}
        <div
          className="w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center flex-shrink-0 shadow-md text-white border-2"
          style={{
            backgroundColor: team.color || '#E10600',
            borderColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: `0 0 12px ${team.color}70`
          }}
          title={`Jugador ${laneNumber}`}
        >
          J{laneNumber}
        </div>

        {/* Barra vertical de color de escudería */}
        <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: team.color || '#E10600' }} />

        {/* Cuadro de Nombre de Escudería y Nombre Inventado */}
        <div className="truncate flex-1">
          <span className="text-xs md:text-sm font-black text-white block truncate uppercase tracking-tight">
            {teamInventedName ? teamInventedName : `Escudería ${laneNumber}`}
          </span>
          {teamInventedName ? (
            <span className="text-[10px] font-mono text-slate-400 block truncate">
              Escudería {laneNumber}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-slate-500 block">
              Sin nombre asignado
            </span>
          )}
        </div>
      </div>

      {/* Carril de Pista Central Horizontal (Extendido hasta el final) */}
      <div className="flex-1 relative h-full min-h-[64px] md:min-h-[80px] flex items-center px-2 overflow-hidden f1-track-bg">
        {/* Líneas de Sectores S1 a S10 en el fondo */}
        <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20 text-[9px] font-mono text-slate-400 px-4 items-center">
          <span>0%</span>
          <span>S1</span>
          <span>S2</span>
          <span>S3</span>
          <span>S4</span>
          <span>S5</span>
          <span>S6</span>
          <span>S7</span>
          <span>S8</span>
          <span>S9</span>
          <span className="text-f1-red font-bold">🏁 META</span>
        </div>

        {/* Línea de Meta Cuadriculada en el extremo derecho */}
        <div className="absolute right-4 top-0 bottom-0 w-3.5 f1-kerb opacity-90 pointer-events-none" />

        {/* Monoplaza animado progresivamente con Framer Motion */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center pointer-events-none"
          initial={{ left: `${Math.max(1, (previousDist / 100) * 91)}%` }}
          animate={{
            left: `${visualLeftPercent}%`,
            transition: {
              duration: isBoosted && isNitroActive ? 1.2 : isDRS ? 1.6 : 2.5,
              ease: isBoosted && isNitroActive ? 'easeOut' : [0.25, 1, 0.5, 1]
            }
          }}
        >
          {/* Fuego Nitro si ganó el Pole Position Boost (plasma trasero) */}
          {isBoosted && isNitroActive && <NitroEffect showText={false} />}

          {/* Emblema Flotante Pole Boost Centrado Sobre el Vehículo (Alineado y Sin Recortes) */}
          {isBoosted && isNitroActive && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-f1-cyan via-blue-500 to-indigo-600 border border-white text-[9px] font-mono font-black text-black tracking-wider shadow-[0_0_15px_#00F0FF] animate-bounce whitespace-nowrap">
              <Zap className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              <span>POLE BOOST +20%</span>
            </div>
          )}

          {/* Badge Flotante DRS si está activo */}
          {isDRS && !isNitroActive && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-black font-mono font-black text-[9px] uppercase shadow-[0_0_10px_#10B981] animate-pulse whitespace-nowrap">
              <Wind className="w-3 h-3" />
              <span>DRS +10%</span>
            </div>
          )}

          {/* Partículas de escape de titanio SIEMPRE activas */}
          <SkidSparks count={isBoosted && isNitroActive ? 14 : isCarsAdvancing ? 8 : 4} />

          {/* Humo / propulsión de neumáticos SIEMPRE activo */}
          <TireSmoke />

          {/* Monoplaza SVG */}
          <F1CarSvg
            color={team.color || '#E10600'}
            number={laneNumber}
            isBoosted={isBoosted && isNitroActive}
          />
        </motion.div>
      </div>
    </div>
  );
}
