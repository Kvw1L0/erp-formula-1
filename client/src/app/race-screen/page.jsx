'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import TrackLane from '../../components/race/TrackLane';
import PodiumModal from '../../components/race/PodiumModal';
import CinematicVideoModal from '../../components/race/CinematicVideoModal';
import CaseSolutionModal from '../../components/race/CaseSolutionModal';
import DebriefModal from '../../components/race/DebriefModal';
import SafetyCarOverlay from '../../components/race/SafetyCarOverlay';
import OvertakeBanner from '../../components/race/OvertakeBanner';
import QrConnectModal from '../../components/common/QrConnectModal';
import TeamEventOverlay from '../../components/race/TeamEventOverlay';
import RouletteModal from '../../components/admin/RouletteModal';
import { exportTrainingReportCsv } from '../../lib/reportExporter';
import { sounds } from '../../lib/soundEffects';
import { Flag, Zap, Volume2, VolumeX, Maximize, Trophy, Clock, Users, Compass, BookOpen, Film, AlertTriangle, TrendingUp, FastForward, AlertOctagon, CloudRain, ShieldAlert, QrCode, FileSpreadsheet } from 'lucide-react';

const TEAMS_LIST = [
  { id: 1, name: "Escudería 1", color: "#3671C6" },
  { id: 2, name: "Escudería 2", color: "#E80020" },
  { id: 3, name: "Escudería 3", color: "#27F4D2" },
  { id: 4, name: "Escudería 4", color: "#FF8000" },
  { id: 5, name: "Escudería 5", color: "#229971" },
  { id: 6, name: "Escudería 6", color: "#0093CC" }
];

function normalizeResults(raw) {
  if (!raw) return null;
  const ranking = Array.isArray(raw.ranking) ? raw.ranking : Object.values(raw.ranking || {});
  const teams = Array.isArray(raw.teams) ? raw.teams : Object.values(raw.teams || {});
  return {
    ...raw,
    ranking,
    teams
  };
}

export default function RaceScreenPage() {
  const { socket, isConnected, gameState, cloudActions } = useSocket();
  const [isMuted, setIsMuted] = useState(false);
  const [isNitroActive, setIsNitroActive] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false);
  const [cinematicType, setCinematicType] = useState('START'); // 'START' | 'RACE_BATTLE'
  const [showPodium, setShowPodium] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [enableCinematic, setEnableCinematic] = useState(true);
  const [recentOvertakes, setRecentOvertakes] = useState([]);
  const [isSuspenseWait, setIsSuspenseWait] = useState(false);
  const [isCarsAdvancing, setIsCarsAdvancing] = useState(true);

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('join_race_screen');
    }
  }, [socket, isConnected]);

  // Manejar sonido ambiente en reposo
  useEffect(() => {
    if (gameState?.status === 'ACTIVE_CASE' && !isMuted) {
      sounds.startAmbientEngine();
    } else {
      sounds.stopAmbientEngine();
    }

    return () => {
      sounds.stopAmbientEngine();
    };
  }, [gameState?.status, isMuted]);

  // Manejar revelación de resultados con secuencia: Video 2 (Carrera) -> 2s Pausa -> Movimiento Monoplazas (Firebase Cloud)
  const lastProcessedResultsKeyRef = useRef(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (gameState?.status === 'REVEALED' && gameState?.calculatedResults) {
      const results = normalizeResults(gameState.calculatedResults);
      const resultsKey = results.calculatedAt || results.timestamp || results.roundTimestamp || (results.ranking && results.ranking[0] ? `${results.ranking[0].teamId}_${results.ranking[0].score}` : 'rev');
      
      // En la primera carga de la pantalla: sincronizar estado existente SIN lanzar video automático ni bloqueo
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        lastProcessedResultsKeyRef.current = resultsKey;
        setResultsData(results);
        setIsCarsAdvancing(true);
        setIsNitroActive(false);
        setShowCinematic(false);
        return;
      }

      if (lastProcessedResultsKeyRef.current !== resultsKey) {
        lastProcessedResultsKeyRef.current = resultsKey;
        setResultsData(results);
        setIsCarsAdvancing(false);
        setIsNitroActive(false);
        setShowPodium(false);

        if (results?.ranking && Array.isArray(results.ranking)) {
          const overtakes = results.ranking
            .filter(r => r && r.positionDelta > 0)
            .sort((a, b) => b.positionDelta - a.positionDelta)
            .map(r => {
              const prof = gameState?.teamsProfiles?.[r.teamId] || {};
              return {
                teamId: r.teamId,
                teamName: prof.subname ? `"${prof.subname}"` : (r.teamName || `Escudería ${r.teamId}`),
                color: r.color,
                newPos: r.currentPosition,
                delta: r.positionDelta
              };
            });
          setRecentOvertakes(overtakes);
        }

        if (enableCinematic) {
          setCinematicType('RACE_BATTLE');
          setShowCinematic(true);
        } else {
          triggerSuspenseAndTrackAnimation(results);
        }
      }
    } else if (gameState?.status === 'LOBBY' || gameState?.status === 'HARD_RESET') {
      hasMountedRef.current = true;
      lastProcessedResultsKeyRef.current = null;
      setResultsData(null);
      setIsCarsAdvancing(true);
      setIsNitroActive(false);
      setShowCinematic(false);
      setShowPodium(false);
      setShowSolution(false);
      setShowDebrief(false);
      setRecentOvertakes([]);
    } else {
      hasMountedRef.current = true;
    }
  }, [gameState?.status, gameState?.calculatedResults, enableCinematic]);

  // Fallback para WebSocket local Socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on('results_revealed', (rawResults) => {
      const results = normalizeResults(rawResults);
      setResultsData(results);
      setIsCarsAdvancing(false);
      setIsNitroActive(false);
      setShowPodium(false);

      if (results?.ranking && Array.isArray(results.ranking)) {
        const overtakes = results.ranking
          .filter(r => r && r.positionDelta > 0)
          .sort((a, b) => b.positionDelta - a.positionDelta)
          .map(r => {
            const prof = gameState?.teamsProfiles?.[r.teamId] || {};
            return {
              teamId: r.teamId,
              teamName: prof.subname ? `"${prof.subname}"` : (r.teamName || `Escudería ${r.teamId}`),
              color: r.color,
              newPos: r.currentPosition,
              delta: r.positionDelta
            };
          });
        setRecentOvertakes(overtakes);
      }

      if (enableCinematic) {
        setCinematicType('RACE_BATTLE');
        setShowCinematic(true);
      } else {
        triggerSuspenseAndTrackAnimation(results);
      }
    });

    socket.on('lobby_reset', () => {
      setResultsData(null);
      setIsCarsAdvancing(true);
      setIsNitroActive(false);
      setShowCinematic(false);
      setShowPodium(false);
      setShowSolution(false);
      setShowDebrief(false);
      setRecentOvertakes([]);
    });

    return () => {
      socket.off('results_revealed');
      socket.off('lobby_reset');
    };
  }, [socket, enableCinematic]);

  // Pausa dramática de 2 segundos antes de que los vehículos avancen
  const triggerSuspenseAndTrackAnimation = (results) => {
    setShowCinematic(false);
    setIsCarsAdvancing(false);
    setIsSuspenseWait(true);
    try { sounds?.playCountdownTick?.(); } catch (e) {}

    setTimeout(() => {
      setIsSuspenseWait(false);
      setIsCarsAdvancing(true);
      triggerTrackAnimation(results);
    }, 2000);
  };

  const triggerTrackAnimation = (results) => {
    sounds.stopAmbientEngine();
    sounds.playRaceStart();

    // Pausa de 1.8 segundos antes de activar Nitro (+20%) y DRS (+10%)
    const nitroTimer = setTimeout(() => {
      if (results?.fastestPerfectTeamId) {
        setIsNitroActive(true);
        sounds.playNitroBoost();
      }

      const teamsList = Array.isArray(results?.teams) ? results.teams : Object.values(results?.teams || {});
      const hasDRS = teamsList.some(t => t?.isDRSActive);
      if (hasDRS) {
        setTimeout(() => sounds.playDRSActive(), 600);
      }
    }, 1800);

    return () => clearTimeout(nitroTimer);
  };

  const handleCinematicFinish = () => {
    if (cinematicType === 'RACE_BATTLE') {
      triggerSuspenseAndTrackAnimation(resultsData || gameState?.calculatedResults);
    } else {
      setShowCinematic(false);
    }
  };

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    sounds.setMuted(nextState);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const currentSectorIndex = gameState?.currentSectorIndex || 1;
  const totalSectors = gameState?.totalSectors || 5;
  const trackBackground = gameState?.trackBackground || 'asphalt-dark';
  const isRevealed = gameState?.status === 'REVEALED' || resultsData !== null;
  const isCaseActive = gameState?.status === 'ACTIVE_CASE';
  const isSafetyCarActive = gameState?.isSafetyCarActive || false;
  const isRedFlagActive = !!gameState?.isRedFlagActive;
  const isWetRaceActive = !!gameState?.isWetRaceActive;
  const stageSummon = gameState?.stageSummon;

  // Telemetría fusionada con perfiles (subnombres)
  const teamTelemetry = useMemo(() => {
    const telem = gameState?.teamTelemetry || {};
    const profiles = gameState?.teamsProfiles || {};
    const merged = {};

    TEAMS_LIST.forEach(t => {
      const base = telem[t.id] || {
        currentPosition: t.id,
        currentDistance: 0,
        previousDistance: 0,
        positionDelta: 0,
        cumulativeScore: 0
      };
      const prof = profiles[t.id] || {};
      merged[t.id] = {
        ...base,
        subname: prof.subname || base.subname || '',
        participants: prof.participants || base.participants || []
      };
    });

    return merged;
  }, [gameState?.teamTelemetry, gameState?.teamsProfiles]);

  // Detector de autos en batalla cuerpo a cuerpo (< 3% de distancia)
  const closeBattleTeamIds = useMemo(() => {
    const ids = new Set();
    const activeEntries = Object.values(teamTelemetry);
    for (let i = 0; i < activeEntries.length; i++) {
      for (let j = i + 1; j < activeEntries.length; j++) {
        const d1 = activeEntries[i].currentDistance || 0;
        const d2 = activeEntries[j].currentDistance || 0;
        if (Math.abs(d1 - d2) <= 3 && Math.max(d1, d2) > 0) {
          ids.add(activeEntries[i].teamId);
          ids.add(activeEntries[j].teamId);
        }
      }
    }
    return ids;
  }, [teamTelemetry]);

  const handleNextSectorFromScreen = async () => {
    const nextIdx = Math.min(totalSectors, currentSectorIndex + 1);
    await cloudActions.nextSector(nextIdx, totalSectors);
    setShowPodium(false);
    setShowDebrief(false);
  };

  const handleExportCsv = async () => {
    let historyData = {};
    if (cloudActions?.getChampionshipHistory) {
      historyData = await cloudActions.getChampionshipHistory();
    }
    exportTrainingReportCsv({
      gameState,
      telemetry: teamTelemetry,
      teamsProfiles: gameState?.teamsProfiles || {},
      history: historyData
    });
  };

  return (
    <div className="min-h-screen bg-carbon text-slate-100 flex flex-col justify-between p-3 md:p-6 select-none overflow-hidden relative selection:bg-f1-red selection:text-white">
      {/* 1. CINEMÁTICA DE VIDEO INTERCALADA (Video 1 o Video 2 de Batalla) */}
      {showCinematic && (
        <CinematicVideoModal
          videoType={cinematicType}
          sectorIndex={currentSectorIndex}
          totalSectors={totalSectors}
          videoUrl={resultsData?.battleVideoUrl || gameState?.currentCase?.battleVideoUrl}
          battleTitle={resultsData?.battleTitle || gameState?.currentCase?.battleTitle}
          battleDescription={resultsData?.battleDescription || gameState?.currentCase?.battleDescription}
          onFinish={handleCinematicFinish}
        />
      )}

      {/* 2. OVERLAY DE SUSPENSO (2 SEGUNDOS DE PAUSA) */}
      {isSuspenseWait && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
          <div className="bg-f1-card/90 border border-f1-cyan/50 p-6 rounded-3xl text-center shadow-[0_0_50px_rgba(0,240,255,0.4)] space-y-2">
            <span className="text-xs font-mono text-f1-cyan uppercase tracking-widest font-black animate-pulse">
              TELEMETRÍA DE PITS CALCULADA
            </span>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
              ¡LOS VEHÍCULOS SE MUEVEN EN 2 SEGUNDOS!
            </h2>
            <div className="w-48 h-1.5 bg-white/20 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-f1-cyan animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* 3. ALERTA DE CONVOCATORIA AL ESCENARIO */}
      {stageSummon?.active && (
        <div className="fixed top-4 left-4 right-4 z-40 max-w-2xl mx-auto bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 rounded-2xl shadow-2xl border-2 border-white flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-yellow-300 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-mono uppercase text-yellow-300 font-bold block">
                🚨 CONVOCATORIA OFICIAL DE CARRERA AL ESCENARIO
              </span>
              <h3 className="text-base font-black italic uppercase leading-tight">
                ESCUDERÍA #{stageSummon.teamId} {stageSummon.teamName}
                {stageSummon.subname && ` - "${stageSummon.subname}"`}
              </h3>
              <p className="text-xs text-slate-100 font-sans">
                Todo el equipo debe presentarse de inmediato con el Facilitador.
              </p>
            </div>
          </div>
          <button
            onClick={() => cloudActions.triggerStageSummon(stageSummon.teamId, '', false)}
            className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white font-mono text-xs font-bold transition-all border border-white/30"
          >
            CERRAR
          </button>
        </div>
      )}

      {/* 4. OVERLAY DE BANDERA ROJA */}
      {isRedFlagActive && (
        <div className="fixed inset-0 z-40 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-pulse">
          <div className="max-w-md bg-black/90 p-8 rounded-3xl border-2 border-red-500 shadow-2xl space-y-3">
            <AlertOctagon className="w-16 h-16 text-red-500 mx-auto" />
            <span className="text-xs font-mono font-black text-red-400 uppercase tracking-widest block">
              DIRECCIÓN DE CARRERA • FIA PITS
            </span>
            <h2 className="text-3xl font-black text-white italic uppercase">
              🚨 BANDERA ROJA EN PISTA
            </h2>
            <p className="text-sm text-slate-300 font-sans">
              Carrera temporalmente detenida por el facilitador. Atención a las instrucciones en la sala.
            </p>
          </div>
        </div>
      )}

      {/* 5. OVERLAY DE VIRTUAL SAFETY CAR */}
      <SafetyCarOverlay isActive={isSafetyCarActive} />

      {/* 6. ALERTA TELEVISIVA DE ADELANTAMIENTOS */}
      <OvertakeBanner overtakes={recentOvertakes} />

      {/* Header Oficial F1 con Claridad Permanente de Caso y Sector */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-f1-card px-4 py-3 rounded-2xl border border-f1-border shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-f1-red rounded-xl flex items-center justify-center text-white shadow-md shadow-f1-red/30 flex-shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight">
                GRAN PREMIO DE LA EFICIENCIA
              </h1>
              <span className="text-f1-red text-xs font-mono font-black bg-f1-red/10 border border-f1-red/30 px-2.5 py-0.5 rounded-full not-italic">
                SECTOR {currentSectorIndex} DE {totalSectors}
              </span>
              {isWetRaceActive && (
                <span className="text-cyan-300 text-xs font-mono font-bold bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5" /> LLUVIA ACTIVA
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-slate-300 flex items-center gap-1.5 mt-0.5">
              <span className="text-f1-yellow font-bold">CASO ACTIVO:</span>
              <span>{gameState?.currentCase?.title || 'SECTOR EN PREPARACIÓN'}</span>
            </p>
          </div>
        </div>

        {/* Controles Esenciales de Emisión */}
        <div className="flex items-center gap-2.5 self-end md:self-auto font-mono text-xs">
          {/* Mute */}
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-f1-dark border border-f1-border text-slate-400 hover:text-white transition-colors"
            title={isMuted ? 'Activar Sonido F1' : 'Silenciar Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-f1-green" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-f1-dark border border-f1-border text-slate-400 hover:text-white transition-colors"
            title="Pantalla Completa"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* PISTA DE CARRERAS: 6 CARRILES */}
      <main className={`flex-1 my-3 flex flex-col justify-center bg-f1-card/60 rounded-2xl border border-f1-border p-2 md:p-3 overflow-hidden shadow-2xl relative track-bg-${trackBackground}`}>
        {TEAMS_LIST.map((team, index) => {
          const laneNum = index + 1;
          const teamsList = Array.isArray(resultsData?.teams) ? resultsData.teams : Object.values(resultsData?.teams || {});
          const result = teamsList.find(t => t?.teamId === laneNum);
          const telemetry = teamTelemetry[laneNum] || {
            currentPosition: laneNum,
            currentDistance: 0,
            previousDistance: 0,
            positionDelta: 0
          };

          const isCloseBattle = closeBattleTeamIds.has(laneNum);

          return (
            <TrackLane
              key={team.id}
              laneNumber={laneNum}
              team={team}
              result={result}
              telemetry={telemetry}
              isRevealed={isRevealed}
              isCarsAdvancing={isCarsAdvancing}
              isNitroActive={isNitroActive}
              isCloseBattle={isCloseBattle}
              trackBackground={trackBackground}
            />
          );
        })}
      </main>

      {/* MODALES Y OVERLAYS ACTIVADOS DESDE DIRECCIÓN DE CARRERA */}
      {(gameState?.showPodium || showPodium) && (resultsData || gameState?.calculatedResults) && (
        <PodiumModal
          results={resultsData || gameState?.calculatedResults}
          sectorIndex={currentSectorIndex}
          totalSectors={totalSectors}
          onClose={() => {
            setShowPodium(false);
            cloudActions.togglePodium(false);
          }}
        />
      )}

      {(gameState?.showSolutionsOverlay || showSolution) && gameState?.currentCase && (
        <CaseSolutionModal
          caseData={gameState.currentCase}
          onClose={() => {
            setShowSolution(false);
            cloudActions.toggleSolutionsOverlay(false);
          }}
        />
      )}

      {(gameState?.showQrModal || showQrModal) && (
        <QrConnectModal onClose={() => {
          setShowQrModal(false);
          cloudActions.toggleQrModal(false);
        }} />
      )}

      {gameState?.isTeamEventActive && (
        <TeamEventOverlay
          title={gameState?.teamEventTitle || '¡DINÁMICA DE EQUIPO EN VIVO!'}
          description={gameState?.teamEventDescription || 'Todos los pilotos deben seguir las instrucciones del Facilitador en el escenario.'}
          canClose={true}
          onClose={() => cloudActions.toggleTeamEvent(false)}
        />
      )}

      {gameState?.roulette?.active && (
        <RouletteModal
          teamsProfiles={gameState?.teamsProfiles || {}}
          isGiantScreen={true}
          rouletteState={gameState.roulette}
          onClose={() => cloudActions.setRouletteState(null)}
        />
      )}
    </div>
  );
}
