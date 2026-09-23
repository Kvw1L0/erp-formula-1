'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Trophy, Users, Sparkles, Flame, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { sounds, triggerHaptic } from '../../lib/soundEffects';

const OFFICIAL_TEAMS_ROULETTE = [
  { id: 1, name: "Escudería 1", color: "#3671C6" },
  { id: 2, name: "Escudería 2", color: "#E80020" },
  { id: 3, name: "Escudería 3", color: "#27F4D2" },
  { id: 4, name: "Escudería 4", color: "#FF8000" },
  { id: 5, name: "Escudería 5", color: "#229971" },
  { id: 6, name: "Escudería 6", color: "#0093CC" }
];

const TEAM_CHALLENGES = [
  'Todo el equipo debe imitar el sonido de aceleración de un motor V10 de F1 al unísono durante 5 segundos.',
  'El equipo debe explicar el concepto de "3-Way Matching" de NetSuite en 20 segundos sin dudar.',
  'Todo el equipo debe realizar una pose aerodinámica de monoplaza de F1 frente a la sala.',
  'Nombrar entre todos 5 transacciones o módulos contables de NetSuite antes de que pasen 10 segundos.',
  'Festejo oficial de podio: todo el equipo debe simular destapar una botella de champagne en el escenario.',
  'El equipo debe entonar el himno o grito de guerra de su escudería frente a todos.',
  'Explicar en 15 segundos cuál es la ventaja de automatizar el cierre contable con NetSuite.',
  'Hacer una ronda rápida de aplausos estilo parada en boxes en menos de 2 segundos.'
];

export default function RouletteModal({
  teamsProfiles = {},
  onClose,
  isGiantScreen = false,
  rouletteState = null,
  onSyncRoulette = null
}) {
  const [mode, setMode] = useState(rouletteState?.mode || 'PENALTY'); // PENALTY | SUMMON
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(rouletteState?.winner || null);
  const [penaltyText, setPenaltyText] = useState(rouletteState?.penaltyText || '');
  const [rotationAngle, setRotationAngle] = useState(rouletteState?.rotationAngle || 0);
  const [isProjected, setIsProjected] = useState(rouletteState?.active || false);

  const prevSpinningRef = useRef(false);

  // Lista de las 6 Escuderías con sus nombres inventados
  const candidates = OFFICIAL_TEAMS_ROULETTE.map(team => {
    const prof = teamsProfiles[team.id] || {};
    return {
      id: team.id,
      teamId: team.id,
      name: team.name,
      color: team.color,
      subname: prof.subname || '',
      displayName: prof.subname ? `"${prof.subname}"` : team.name
    };
  });

  // Si estamos en pantalla gigante, sincronizar con rouletteState
  useEffect(() => {
    if (isGiantScreen && rouletteState) {
      if (rouletteState.rotationAngle !== undefined) {
        setRotationAngle(rouletteState.rotationAngle);
      }
      setIsSpinning(!!rouletteState.isSpinning);
      setSelectedWinner(rouletteState.winner || null);
      setPenaltyText(rouletteState.penaltyText || '');
      setMode(rouletteState.mode || 'PENALTY');

      // Detectar inicio de giro para audio
      if (rouletteState.isSpinning && !prevSpinningRef.current) {
        sounds.playSelect();
        let tickCount = 0;
        const tickInterval = setInterval(() => {
          tickCount++;
          sounds.playRouletteTick();
          if (tickCount > 25) clearInterval(tickInterval);
        }, 120);
      }

      // Detectar ganador anunciado
      if (!rouletteState.isSpinning && prevSpinningRef.current && rouletteState.winner) {
        sounds.playRouletteWinner();
      }

      prevSpinningRef.current = !!rouletteState.isSpinning;
    }
  }, [isGiantScreen, rouletteState]);

  const toggleProjection = () => {
    const nextState = !isProjected;
    setIsProjected(nextState);
    if (onSyncRoulette) {
      if (nextState) {
        onSyncRoulette({
          active: true,
          isSpinning,
          rotationAngle,
          winner: selectedWinner,
          mode,
          penaltyText
        });
      } else {
        onSyncRoulette(null);
      }
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedWinner(null);
    setPenaltyText('');
    if (onSyncRoulette && isProjected) {
      onSyncRoulette({
        active: true,
        isSpinning: false,
        rotationAngle,
        winner: null,
        mode: newMode,
        penaltyText: ''
      });
    }
  };

  const spinRoulette = () => {
    if (isSpinning || candidates.length === 0) return;

    setIsSpinning(true);
    setSelectedWinner(null);
    setPenaltyText('');
    sounds.playSelect();

    const winnerIndex = Math.floor(Math.random() * candidates.length);
    const sliceAngle = 360 / candidates.length; // 60 deg
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const sliceCenter = winnerIndex * sliceAngle + (sliceAngle / 2);
    const targetAngle = rotationAngle + extraSpins + ((360 - (rotationAngle % 360) + 360 - sliceCenter) % 360);

    setRotationAngle(targetAngle);

    // Calcular ganador
    const winner = candidates[winnerIndex];
    let newPenalty = '';

    if (mode === 'PENALTY') {
      newPenalty = TEAM_CHALLENGES[Math.floor(Math.random() * TEAM_CHALLENGES.length)];
    } else {
      newPenalty = '¡La escudería seleccionada debe subir al escenario a defender su estrategia en vivo!';
    }

    // Sincronizar inicio de giro con Pantalla Gigante
    if (onSyncRoulette) {
      onSyncRoulette({
        active: true,
        isSpinning: true,
        rotationAngle: targetAngle,
        winner: null,
        mode,
        penaltyText: '',
        timestamp: Date.now()
      });
    }

    // Sonidos de clic mientras gira
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      sounds.playRouletteTick();
      triggerHaptic([15]);
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    // Detener la ruleta y anunciar ganador
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedWinner(winner);
      setPenaltyText(newPenalty);
      sounds.playRouletteWinner();
      triggerHaptic([100, 50, 150]);

      // Sincronizar resultado con Pantalla Gigante
      if (onSyncRoulette) {
        onSyncRoulette({
          active: true,
          isSpinning: false,
          rotationAngle: targetAngle,
          winner,
          mode,
          penaltyText: newPenalty,
          timestamp: Date.now()
        });
      }
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className={`w-full ${isGiantScreen ? 'max-w-4xl p-8 md:p-10' : 'max-w-2xl p-6'} bg-f1-card border border-f1-border rounded-3xl shadow-2xl relative text-center`}>
        {/* Botón Cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-f1-dark border border-f1-border text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DIRECCIÓN DE CARRERA • DINÁMICA DE ESCUDERÍAS</span>
        </div>

        <h2 className={`${isGiantScreen ? 'text-3xl md:text-5xl' : 'text-2xl'} font-black text-white italic uppercase tracking-tight mb-4`}>
          🎡 Ruleta de Escuderías
        </h2>

        {/* Selector de Modo (visible en admin) */}
        {!isGiantScreen ? (
          <div className="space-y-3 mb-6">
            <div className="flex bg-f1-dark p-1 rounded-xl border border-f1-border max-w-md mx-auto">
              <button
                onClick={() => handleModeChange('PENALTY')}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'PENALTY' ? 'bg-f1-yellow text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Desafío de Pits</span>
              </button>
              <button
                onClick={() => handleModeChange('SUMMON')}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'SUMMON' ? 'bg-f1-yellow text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Llamado a Escenario</span>
              </button>
            </div>

            {/* Toggle de Proyección en Pantalla Gigante */}
            <div className="flex justify-center items-center gap-2">
              <button
                type="button"
                onClick={toggleProjection}
                className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 border cursor-pointer ${
                  isProjected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {isProjected ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{isProjected ? 'Proyectando en Pantalla Gigante (ACTIVO)' : 'Proyectar en Pantalla Gigante'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <span className="px-3.5 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-xs font-mono font-bold uppercase">
              MODO: {mode === 'PENALTY' ? '🔥 DESAFÍO DE PITS' : '📢 LLAMADO A ESCENARIO'}
            </span>
          </div>
        )}

        {/* Gráfico de la Ruleta F1 (6 Escuderías) */}
        <div className={`relative ${isGiantScreen ? 'w-80 h-80 md:w-96 md:h-96' : 'w-64 h-64'} mx-auto my-4 flex items-center justify-center`}>
          {/* Marcador / Flecha indicadora superior */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[24px] border-t-yellow-400 drop-shadow-[0_2px_12px_rgba(250,204,21,0.9)]" />

          {/* Disco giratorio con CSS transition (6 sectores de 60deg con colores de las 6 Escuderías) */}
          <div
            className="w-full h-full rounded-full border-4 border-slate-700 shadow-2xl relative overflow-hidden transition-transform duration-[3500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              background: `conic-gradient(
                #3671C6 0deg 60deg,
                #E80020 60deg 120deg,
                #27F4D2 120deg 180deg,
                #FF8000 180deg 240deg,
                #229971 240deg 300deg,
                #0093CC 300deg 360deg
              )`
            }}
          >
            {/* Números 1 a 6 impresos en cada rebanada */}
            {[1, 2, 3, 4, 5, 6].map((num, i) => (
              <div
                key={num}
                className="absolute inset-0 flex items-start justify-center pt-3 text-white font-mono font-black text-sm md:text-base drop-shadow-md select-none pointer-events-none"
                style={{
                  transform: `rotate(${i * 60 + 30}deg)`,
                  transformOrigin: '50% 50%'
                }}
              >
                {num}
              </div>
            ))}

            {/* Eje central */}
            <div className={`absolute inset-0 m-auto ${isGiantScreen ? 'w-24 h-24 text-base' : 'w-18 h-18 text-xs'} rounded-full bg-slate-950 border-4 border-yellow-400 flex flex-col items-center justify-center text-yellow-400 font-mono font-black shadow-inner z-10`}>
              <span>F1</span>
              <span className="text-[10px] text-slate-300">PITS</span>
            </div>
          </div>
        </div>

        {/* Botón de Giro (Visible en Admin) */}
        {!isGiantScreen && (
          <div className="my-5">
            <button
              type="button"
              onClick={spinRoulette}
              disabled={isSpinning}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 text-black font-mono font-black text-sm uppercase tracking-wider shadow-xl shadow-yellow-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{isSpinning ? 'GIRANDO RULETA...' : 'GIRAR RULETA AHORA'}</span>
            </button>
          </div>
        )}

        {/* Resultado Ganador */}
        {selectedWinner && (
          <div
            className={`mt-4 p-5 md:p-6 bg-f1-dark/95 rounded-2xl border-2 text-center space-y-3 animate-scale-in ${isGiantScreen ? 'max-w-2xl mx-auto' : ''}`}
            style={{ borderColor: selectedWinner.color || '#EAB308' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase"
              style={{ backgroundColor: `${selectedWinner.color}25`, color: selectedWinner.color }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedWinner.color }} />
              <span>ESCUDERÍA {selectedWinner.id} SELECCIONADA</span>
            </div>

            <h3 className={`${isGiantScreen ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} font-black text-white italic uppercase tracking-tight`}>
              {selectedWinner.subname ? `"${selectedWinner.subname}"` : selectedWinner.name}
            </h3>

            {selectedWinner.subname && (
              <p className="text-xs md:text-sm font-mono text-slate-400">
                Identificación de Pista: <span className="text-white font-bold">{selectedWinner.name}</span>
              </p>
            )}

            {penaltyText && (
              <div
                className={`p-4 rounded-xl font-mono text-sm md:text-base font-bold ${
                  mode === 'PENALTY'
                    ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                    : 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                }`}
              >
                {mode === 'PENALTY' ? '⚠️ DESAFÍO EN VIVO: ' : '📢 DINÁMICA: '}
                &ldquo;{penaltyText}&rdquo;
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 mt-4 text-[11px] font-mono text-slate-500">
          <span>6 Escuderías en Pista</span>
          <span>•</span>
          <span>Sincronizado en Tiempo Real</span>
        </div>
      </div>
    </div>
  );
}
