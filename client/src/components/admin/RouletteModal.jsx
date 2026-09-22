'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Trophy, Users, ArrowRightLeft, Sparkles, Flame, Eye, EyeOff } from 'lucide-react';
import { sounds, triggerHaptic } from '../../lib/soundEffects';

const SAMPLE_PENALTIES = [
  'Imitar el sonido de aceleración de un motor V10 de Fórmula 1 durante 5 segundos.',
  'Explicar el concepto de "3-Way Matching" de NetSuite en 15 segundos sin trabarse.',
  'Hacer una pose aerodinámica de monoplaza de F1 con 2 miembros de tu equipo.',
  'Nombrar 3 transacciones contables de NetSuite antes de que pasen 5 segundos.',
  'Bailar el festejo oficial de victoria en el podio frente al escenario.'
];

export default function RouletteModal({
  teamsProfiles = {},
  onClose,
  onTransferParticipant,
  isGiantScreen = false,
  rouletteState = null,
  onSyncRoulette = null
}) {
  const [mode, setMode] = useState(rouletteState?.mode || 'TRANSFER'); // TRANSFER | PENALTY
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(rouletteState?.winner || null);
  const [transferTargetTeam, setTransferTargetTeam] = useState(rouletteState?.transferTargetTeam || null);
  const [penaltyText, setPenaltyText] = useState(rouletteState?.penaltyText || '');
  const [rotationAngle, setRotationAngle] = useState(rouletteState?.rotationAngle || 0);
  const [isProjected, setIsProjected] = useState(rouletteState?.active || false);

  const prevSpinningRef = useRef(false);

  // Extraer lista de participantes reales de todos los equipos
  const participantsList = [];
  Object.keys(teamsProfiles).forEach(teamId => {
    const prof = teamsProfiles[teamId] || {};
    const teamNum = Number(teamId);
    const parts = prof.participants || [];
    parts.forEach(name => {
      participantsList.push({
        name,
        teamId: teamNum,
        teamName: `Escudería ${teamNum}`,
        subname: prof.subname || ''
      });
    });
  });

  // Si no hay participantes registrados aún, rellenar con nombres de muestra
  const candidates = participantsList.length > 0 ? participantsList : [
    { name: 'Carlos Morales', teamId: 1, teamName: 'Escudería 1 (Red Bull)', subname: 'Toros Rápidos' },
    { name: 'Ana Gómez', teamId: 2, teamName: 'Escudería 2 (Ferrari)', subname: 'Los Intrépidos' },
    { name: 'Roberto Mora', teamId: 3, teamName: 'Escudería 3 (Mercedes)', subname: 'Flechas ERP' },
    { name: 'Sofía Ruiz', teamId: 4, teamName: 'Escudería 4 (McLaren)', subname: 'Los Manglaren' },
    { name: 'Martín Peña', teamId: 5, teamName: 'Escudería 5 (Aston Martin)', subname: 'Espías Pits' },
    { name: 'Lucía Fernández', teamId: 6, teamName: 'Escudería 6 (Alpine)', subname: 'Fuerza Azul' },
    { name: 'Diego Soto', teamId: 7, teamName: 'Escudería 7 (Williams)', subname: 'Tradición Pits' },
    { name: 'Camila Pardo', teamId: 8, teamName: 'Escudería 8 (RB)', subname: 'Toros Jóvenes' }
  ];

  // Si estamos en pantalla gigante, sincronizar con rouletteState
  useEffect(() => {
    if (isGiantScreen && rouletteState) {
      if (rouletteState.rotationAngle !== undefined) {
        setRotationAngle(rouletteState.rotationAngle);
      }
      setIsSpinning(!!rouletteState.isSpinning);
      setSelectedWinner(rouletteState.winner || null);
      setTransferTargetTeam(rouletteState.transferTargetTeam || null);
      setPenaltyText(rouletteState.penaltyText || '');
      setMode(rouletteState.mode || 'TRANSFER');

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
          penaltyText,
          transferTargetTeam
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
    setTransferTargetTeam(null);
    setPenaltyText('');
    if (onSyncRoulette && isProjected) {
      onSyncRoulette({
        active: true,
        isSpinning: false,
        rotationAngle,
        winner: null,
        mode: newMode,
        penaltyText: '',
        transferTargetTeam: null
      });
    }
  };

  const spinRoulette = () => {
    if (isSpinning || candidates.length === 0) return;

    setIsSpinning(true);
    setSelectedWinner(null);
    setTransferTargetTeam(null);
    setPenaltyText('');
    sounds.playSelect();

    // Ángulo aleatorio de 5 a 8 vueltas completas más desfase
    const winnerIndex = Math.floor(Math.random() * candidates.length);
    const sliceAngle = 360 / candidates.length;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const targetAngle = rotationAngle + extraSpins + (360 - (winnerIndex * sliceAngle));

    setRotationAngle(targetAngle);

    // Calcular ganador
    const winner = candidates[winnerIndex];
    let newTransferTeam = null;
    let newPenalty = '';

    if (mode === 'TRANSFER') {
      const otherTeams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(id => id !== winner.teamId);
      newTransferTeam = otherTeams[Math.floor(Math.random() * otherTeams.length)];
    } else if (mode === 'PENALTY') {
      newPenalty = SAMPLE_PENALTIES[Math.floor(Math.random() * SAMPLE_PENALTIES.length)];
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
        transferTargetTeam: null,
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
      setTransferTargetTeam(newTransferTeam);
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
          transferTargetTeam: newTransferTeam,
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
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-f1-dark border border-f1-border text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DIRECCIÓN DE CARRERA • DINÁMICA DE PARTICIPANTES</span>
        </div>

        <h2 className={`${isGiantScreen ? 'text-3xl md:text-4xl' : 'text-2xl'} font-black text-white italic uppercase tracking-tight mb-4`}>
          🎡 Ruleta Oficial de Pilotos
        </h2>

        {/* Selector de Modo (visible en admin) */}
        {!isGiantScreen ? (
          <div className="space-y-3 mb-6">
            <div className="flex bg-f1-dark p-1 rounded-xl border border-f1-border max-w-md mx-auto">
              <button
                onClick={() => handleModeChange('TRANSFER')}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'TRANSFER' ? 'bg-f1-yellow text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Traspaso de Piloto</span>
              </button>
              <button
                onClick={() => handleModeChange('PENALTY')}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'PENALTY' ? 'bg-f1-yellow text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Penitencia de Pits</span>
              </button>
            </div>

            {/* Toggle de Proyección en Pantalla Gigante */}
            <div className="flex justify-center items-center gap-2">
              <button
                type="button"
                onClick={toggleProjection}
                className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 border ${
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
              MODO: {mode === 'TRANSFER' ? '🔄 TRASPASO DE PILOTO' : '🔥 PENITENCIA DE PITS'}
            </span>
          </div>
        )}

        {/* Gráfico de la Ruleta F1 */}
        <div className={`relative ${isGiantScreen ? 'w-80 h-80' : 'w-64 h-64'} mx-auto my-4 flex items-center justify-center`}>
          {/* Marcador / Flecha indicadora superior */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[24px] border-t-yellow-400 drop-shadow-[0_2px_12px_rgba(250,204,21,0.9)]" />

          {/* Disco giratorio con CSS transition */}
          <div
            className="w-full h-full rounded-full border-4 border-slate-700 shadow-2xl relative overflow-hidden transition-transform duration-[3500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              background: `conic-gradient(
                #E10600 0deg 45deg,
                #3671C6 45deg 90deg,
                #27F4D2 90deg 135deg,
                #FF8000 135deg 180deg,
                #229971 180deg 225deg,
                #0093CC 225deg 270deg,
                #52E252 270deg 315deg,
                #B6BABD 315deg 360deg
              )`
            }}
          >
            {/* Eje central */}
            <div className={`absolute inset-0 m-auto ${isGiantScreen ? 'w-20 h-20 text-sm' : 'w-16 h-16 text-xs'} rounded-full bg-slate-950 border-4 border-yellow-400 flex items-center justify-center text-yellow-400 font-mono font-black shadow-inner`}>
              F1 PITS
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
          <div className={`mt-4 p-5 md:p-6 bg-f1-dark/95 rounded-2xl border-2 border-yellow-400/80 text-center space-y-3 animate-scale-in ${isGiantScreen ? 'max-w-2xl mx-auto' : ''}`}>
            <span className="text-xs font-mono uppercase tracking-widest text-yellow-400 font-black block">
              🏆 PARTICIPANTE SELECCIONADO
            </span>
            <h3 className={`${isGiantScreen ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'} font-black text-white italic uppercase`}>
              {selectedWinner.name}
            </h3>
            <p className="text-xs md:text-sm font-mono text-slate-300">
              Pertenece a: <span className="text-white font-bold">{selectedWinner.teamName}</span>
              {selectedWinner.subname && ` ("${selectedWinner.subname}")`}
            </p>

            {mode === 'TRANSFER' && transferTargetTeam && (
              <div className="p-3.5 bg-f1-cyan/15 border border-f1-cyan/40 rounded-xl text-f1-cyan font-mono text-sm font-bold flex items-center justify-center gap-2">
                <ArrowRightLeft className="w-5 h-5 flex-shrink-0" />
                <span>¡TRASPASO CONFIRMADO! Pasa a integrarse a la Escudería #{transferTargetTeam}</span>
              </div>
            )}

            {mode === 'PENALTY' && penaltyText && (
              <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 font-mono text-sm md:text-base font-bold">
                ⚠️ PENITENCIA DE PITS: &ldquo;{penaltyText}&rdquo;
              </div>
            )}
          </div>
        )}

        <p className="text-[11px] font-mono text-slate-500 mt-4">
          Nómina actual cargada: {candidates.length} participantes registrados.
        </p>
      </div>
    </div>
  );
}
