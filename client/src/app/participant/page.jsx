'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import PinLogin from '../../components/participant/PinLogin';
import CountdownBar from '../../components/participant/CountdownBar';
import CaseFlow from '../../components/participant/CaseFlow';
import PitsBlocked from '../../components/participant/PitsBlocked';
import TeamEventOverlay from '../../components/race/TeamEventOverlay';
import { Flag, Activity, Wifi, WifiOff, Clock, Compass, Zap, ShieldAlert, Radio, AlertOctagon, CloudRain, Users, CheckCircle2 } from 'lucide-react';
import { sounds, triggerHaptic } from '../../lib/soundEffects';

export default function ParticipantPage() {
  const { socket, isConnected, gameState, cloudActions } = useSocket();
  const [team, setTeam] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionTimeFormatted, setSubmissionTimeFormatted] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [hasAcknowledgedSummon, setHasAcknowledgedSummon] = useState(false);
  const lastSummonTimestampRef = useRef(null);

  // 1. Cargar equipo de sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('f1_participant_team');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTeam(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 2. Blindaje Hard Reset: si el servidor emite HARD_RESET, expulsar a foja cero inmediatamente
  useEffect(() => {
    if (gameState?.status === 'HARD_RESET') {
      console.warn('🔥 HARD RESET RECIBIDO: Expulsando terminal y borrando sesión');
      sessionStorage.removeItem('f1_participant_team');
      localStorage.removeItem('f1_draft_answers');
      setTeam(null);
      setHasSubmitted(false);
      setSubmissionTimeFormatted(null);
      setHasAcknowledgedSummon(false);
      triggerHaptic([100, 50, 100]);
    }
  }, [gameState?.status, gameState?.hardResetTimestamp]);

  // 3. Sincronizar unión al socket
  useEffect(() => {
    if (socket && isConnected && team) {
      socket.emit('join_participant', { teamId: team.id, pin: team.pin || team.id }, (res) => {
        if (res && res.success) {
          console.log('✅ Unido a sala de participantes:', res.team);
        }
      });
    }
  }, [socket, isConnected, team]);

  // 4. Convocatoria a escenario: detectar si este equipo fue llamado
  const isSummoned = gameState?.stageSummon?.active && Number(gameState?.stageSummon?.teamId) === Number(team?.id);

  useEffect(() => {
    if (isSummoned && gameState?.stageSummon?.timestamp !== lastSummonTimestampRef.current) {
      lastSummonTimestampRef.current = gameState?.stageSummon?.timestamp;
      setHasAcknowledgedSummon(false);
      sounds.playStageSummon();
      triggerHaptic([300, 100, 300, 100, 500]);
    }
  }, [isSummoned, gameState?.stageSummon?.timestamp]);

  // 5. Escuchar eventos de socket
  useEffect(() => {
    if (!socket) return;

    socket.on('submission_locked', (data) => {
      setHasSubmitted(true);
      if (data?.durationFormatted) {
        setSubmissionTimeFormatted(data.durationFormatted);
      }
      if (data?.currentPosition) {
        setCurrentPosition(data.currentPosition);
      }
    });

    socket.on('case_locked', () => {
      setHasSubmitted(true);
    });

    socket.on('lobby_reset', () => {
      setHasSubmitted(false);
      setSubmissionTimeFormatted(null);
    });

    socket.on('hard_reset', () => {
      sessionStorage.removeItem('f1_participant_team');
      setTeam(null);
      setHasSubmitted(false);
    });

    return () => {
      socket.off('submission_locked');
      socket.off('case_locked');
      socket.off('lobby_reset');
      socket.off('hard_reset');
    };
  }, [socket]);

  // Sincronización de inicio de nueva ronda: resetear envíos y habilitar preguntas inmediatamente
  useEffect(() => {
    if (gameState?.status === 'ACTIVE_CASE' || gameState?.status === 'ACTIVE') {
      const alreadySubmitted = !!(team?.id && gameState?.submissions?.[team.id]);
      setHasSubmitted(alreadySubmitted);
      setIsSubmitting(false);
      if (!alreadySubmitted) {
        setSubmissionTimeFormatted(null);
      }
    } else if (gameState?.status === 'LOBBY') {
      setHasSubmitted(false);
      setIsSubmitting(false);
      setSubmissionTimeFormatted(null);
    }
  }, [gameState?.status, gameState?.startTime, gameState?.currentSectorIndex, gameState?.submissions, team?.id]);

  // 6. Login exitoso con subnombre y nómina
  const handleLoginSuccess = async (teamData, pin, subname, participants) => {
    const fullTeam = {
      ...teamData,
      pin,
      subname: subname || teamData.subname,
      participants: participants || teamData.participants || []
    };
    setTeam(fullTeam);
    sessionStorage.setItem('f1_participant_team', JSON.stringify(fullTeam));

    // Si la ronda ya está en curso, habilitar preguntas
    if (gameState?.status === 'ACTIVE_CASE' || gameState?.status === 'ACTIVE') {
      const alreadySubmitted = !!(fullTeam.id && gameState?.submissions?.[fullTeam.id]);
      setHasSubmitted(alreadySubmitted);
      setIsSubmitting(false);
    }

    if (socket) {
      socket.emit('join_participant', { teamId: fullTeam.id, pin });
    }

    // Sincronizar en Firebase o Cloud State
    try {
      await cloudActions.updateTeamProfile(fullTeam.id, fullTeam.subname, fullTeam.participants);
    } catch (e) {
      console.warn('Sincronización de perfil cloud:', e);
    }
  };

  const handleSubmitAnswers = async (answers) => {
    if (!team) return;

    setIsSubmitting(true);
    try {
      const res = await cloudActions.submitAnswers(
        team.id,
        answers,
        gameState?.startTime,
        gameState?.currentCase
      );
      if (res?.success) {
        setHasSubmitted(true);
        if (res.durationSeconds) {
          setSubmissionTimeFormatted(`${res.durationSeconds}s`);
        } else if (res.durationFormatted) {
          setSubmissionTimeFormatted(res.durationFormatted);
        }
        sounds.playSuccess();
        triggerHaptic([100, 50, 100]);
      }
    } catch (err) {
      console.error('Error al enviar respuestas:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveTeam = () => {
    sessionStorage.removeItem('f1_participant_team');
    setTeam(null);
    setHasSubmitted(false);
  };

  if (!team) {
    return (
      <div className="min-h-screen bg-carbon flex flex-col justify-center items-center p-4">
        <PinLogin onLoginSuccess={handleLoginSuccess} isConnecting={!isConnected} />
      </div>
    );
  }

  const isCaseActive = (gameState?.status === 'ACTIVE_CASE' || gameState?.status === 'ACTIVE') && !!gameState?.currentCase;
  const sectorIndex = gameState?.currentSectorIndex || 1;
  const totalSectors = gameState?.totalSectors || 10;
  const isRedFlag = !!gameState?.isRedFlagActive;
  const isWetRace = !!gameState?.isWetRaceActive;

  return (
    <div className="min-h-screen bg-carbon flex flex-col justify-between pt-16 pb-6 px-4 md:px-8 relative selection:bg-f1-red selection:text-white">
      {/* 🚨 OVERLAY DE CONVOCATORIA AL ESCENARIO */}
      {isSummoned && !hasAcknowledgedSummon && (
        <div className="fixed inset-0 z-50 bg-red-950/95 backdrop-blur-lg flex items-center justify-center p-6 select-none animate-pulse">
          <div className="max-w-md w-full bg-black/90 border-2 border-red-500 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_50px_rgba(255,0,0,0.6)] space-y-4">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl shadow-red-600/50 animate-bounce">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-mono text-xs font-black uppercase tracking-wider inline-block">
              LLAMADO OFICIAL DE DIRECCIÓN DE CARRERA
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase leading-tight">
              ¡ATENCIÓN ESCUDERÍA {team.name}!
            </h2>
            {team.subname && (
              <p className="text-sm font-bold text-yellow-400 font-mono">
                &ldquo;{team.subname}&rdquo;
              </p>
            )}
            <div className="p-4 bg-red-900/30 rounded-2xl border border-red-500/40 text-left space-y-2">
              <p className="text-xs text-white font-sans leading-relaxed">
                Todo el equipo ha sido convocado a presentarse <span className="font-bold underline">INMEDIATAMENTE EN EL ESCENARIO</span> para cumplir una dinámica presencial.
              </p>
              {gameState?.stageSummon?.reason && (
                <p className="text-[11px] font-mono text-amber-300">
                  MOTIVO: {gameState.stageSummon.reason}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setHasAcknowledgedSummon(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 text-white font-mono font-black text-sm uppercase tracking-wider shadow-xl active:scale-95 transition-all"
            >
              ¡ENTERADOS, VAMOS AL ESCENARIO!
            </button>
          </div>
        </div>
      )}

      {/* 🏆 OVERLAY DE DINÁMICA DE EQUIPO / EVENTO EN ESCENARIO */}
      {gameState?.isTeamEventActive && (
        <TeamEventOverlay
          title={gameState?.teamEventTitle || '¡DINÁMICA DE EQUIPO EN VIVO!'}
          description={gameState?.teamEventDescription || 'Todos los pilotos deben seguir las instrucciones del Facilitador en el escenario.'}
          canClose={false}
        />
      )}

      {/* 🚨 BANNER DE BANDERA ROJA */}
      {isRedFlag && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-red-600 text-white py-2.5 px-4 font-mono font-black text-xs uppercase flex items-center justify-center gap-2 shadow-2xl animate-pulse">
          <AlertOctagon className="w-4 h-4 fill-white text-red-600 flex-shrink-0" />
          <span>🚨 BANDERA ROJA EN PISTA: CARRERA DETENIDA POR DIRECCIÓN DE CARRERA • ESPERA INDICACIONES</span>
        </div>
      )}

      {/* 📢 BANNER DE COMUNICADO DE RADIO */}
      {gameState?.radioMessage?.message && (
        <div className="fixed top-11 left-4 right-4 z-40 max-w-lg mx-auto bg-amber-500/90 text-black py-2 px-4 rounded-xl font-mono font-bold text-xs uppercase flex items-center gap-2 shadow-xl animate-fade-in">
          <Radio className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">RADIO PITS: {gameState.radioMessage.message}</span>
        </div>
      )}

      {/* Barra de tiempo fija */}
      {isCaseActive && !hasSubmitted && !isRedFlag && (
        <CountdownBar
          startTime={gameState.startTime}
          durationSeconds={gameState.durationLimitSeconds || 60}
          onTimeExpired={() => {
            console.log('Cronómetro de Pits cumplido en este sector');
          }}
        />
      )}

      {/* Header del Participante con Número de Escudería y Nombre Inventado */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between gap-4 pb-4 border-b border-f1-border">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-black text-xl text-white shadow-xl flex-shrink-0"
            style={{ backgroundColor: team.color || '#E10600' }}
          >
            {team.id}
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              ESCUDERÍA {team.id}
            </span>
            <h1 className="text-lg md:text-xl font-black text-white leading-tight">
              {team.subname || team.name}
            </h1>
          </div>
        </div>

        {/* Estado Conexión */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <div className="px-3 py-1.5 bg-f1-dark rounded-xl border border-f1-border text-slate-400">
            {isConnected ? (
              <span className="flex items-center gap-1.5 text-f1-green font-bold text-[11px]">
                <Wifi className="w-3.5 h-3.5" /> <span className="hidden sm:inline">ONLINE</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-f1-red font-bold text-[11px]">
                <WifiOff className="w-3.5 h-3.5" /> <span className="hidden sm:inline">RECONECTANDO</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Cuerpo Principal */}
      <main className="my-auto py-6 max-w-4xl mx-auto w-full flex flex-col justify-center">
        {hasSubmitted ? (
          <PitsBlocked
            team={team}
            durationFormatted={submissionTimeFormatted}
            currentPosition={currentPosition}
            sectorIndex={sectorIndex}
            totalSectors={totalSectors}
          />
        ) : isCaseActive && !isRedFlag ? (
          <CaseFlow
            currentCase={gameState.currentCase}
            onSubmitAnswers={handleSubmitAnswers}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="max-w-sm mx-auto w-full bg-f1-card p-6 md:p-8 rounded-3xl border border-f1-border text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 bg-f1-dark border border-f1-cyan/40 rounded-2xl flex items-center justify-center mx-auto text-f1-cyan shadow-lg shadow-f1-cyan/10 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white">
                Escudería Lista
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Esperando inicio de carrera...
              </p>
            </div>

            {/* Resumen Simple del Equipo */}
            <div className="p-4 bg-f1-dark/90 rounded-2xl border border-f1-border text-center space-y-1">
              <div className="w-9 h-9 rounded-xl font-mono font-black text-base text-white flex items-center justify-center mx-auto shadow" style={{ backgroundColor: team.color || '#E10600' }}>
                {team.id}
              </div>
              <span className="text-xs font-mono text-slate-400 block uppercase">Escudería {team.id}</span>
              <span className="text-base font-black text-white block">
                {team.subname || team.name}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLeaveTeam}
              className="text-xs font-mono text-slate-400 hover:text-red-400 transition-colors underline cursor-pointer block mx-auto pt-2"
            >
              ← Cambiar de Escudería
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto w-full text-center text-[11px] font-mono text-slate-500 pt-4 border-t border-f1-border/40">
        VELTIS RACING ERP • CAPACITACIÓN GAMIFICADA EN TIEMPO REAL
      </footer>
    </div>
  );
}
