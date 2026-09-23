'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import LiveTelemetry from '../../components/admin/LiveTelemetry';
import CaseEditor from '../../components/admin/CaseEditor';
import DebriefModal from '../../components/race/DebriefModal';
import RouletteModal from '../../components/admin/RouletteModal';
import QrConnectModal from '../../components/common/QrConnectModal';
import { exportTrainingReportCsv } from '../../lib/reportExporter';
import {
  Flag, Play, Lock, Eye, RotateCcw, ShieldCheck, Trophy, Sparkles,
  FastForward, Zap, Compass, Flame, AlertOctagon, Users, BarChart3,
  Radio, Clock, AlertTriangle, CloudRain, ShieldAlert, CheckCircle2,
  Volume2, ArrowRightLeft, Send, Trash2, QrCode, FileSpreadsheet, BookOpen, Lightbulb,
  Upload, Image as ImageIcon
} from 'lucide-react';
import { OFFICIAL_TEAMS } from '../../components/participant/PinLogin';

import { DEFAULT_CASES, TRACK_BACKGROUND_OPTIONS } from '../../lib/defaultCases';

export default function AdminPage() {
  const { socket, isConnected, isCloudFirebase, gameState, cloudActions } = useSocket();
  const [activeTab, setActiveTab] = useState('race');
  const [cases, setCases] = useState(DEFAULT_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState('case-01');
  const [adminState, setAdminState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [showDebrief, setShowDebrief] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [summonTeamId, setSummonTeamId] = useState('1');
  const [summonReason, setSummonReason] = useState('Dinámica en Escenario');
  const [radioText, setRadioText] = useState('');
  const [customBgUrl, setCustomBgUrl] = useState('');

  const handleExportCsv = async () => {
    let historyData = {};
    if (cloudActions?.getChampionshipHistory) {
      historyData = await cloudActions.getChampionshipHistory();
    }
    const res = exportTrainingReportCsv({
      gameState,
      telemetry: gameState?.teamTelemetry || {},
      teamsProfiles: gameState?.teamsProfiles || {},
      history: historyData
    });
    if (res?.success) {
      setNotification(`📊 Reporte Excel descargado: ${res.filename}`);
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const isVSCActive = gameState?.isSafetyCarActive || false;
  const isRedFlagActive = !!gameState?.isRedFlagActive;
  const isWetRaceActive = !!gameState?.isWetRaceActive;
  const currentSector = gameState?.currentSectorIndex || 1;
  const totalSectors = gameState?.totalSectors || 5;
  const currentStatus = gameState?.status || 'LOBBY';

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const teamsProfiles = gameState?.teamsProfiles || {};
  const enrolledTeamsCount = Object.values(teamsProfiles).filter(t => Boolean(t?.subname || (t?.participants?.length || 0) > 0)).length;

  const handleStartCase = async () => {
    setIsLoading(true);
    const res = await cloudActions.startCase(selectedCase, currentSector, totalSectors);
    setIsLoading(false);
    if (res?.success) {
      setNotification(`🚀 Sector ${currentSector} iniciado con éxito.`);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleAutoFinishCase = async () => {
    setIsLoading(true);
    const res = await cloudActions.autoFinishCase(selectedCase, currentSector, totalSectors);
    setIsLoading(false);
    if (res?.success) {
      setNotification(`⚡ Ronda finalizada: Video Batalla (${selectedCase.battleTitle || 'Sector ' + currentSector}) activado y cálculo de avances.`);
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleNextSector = async () => {
    const nextIdx = Math.min(totalSectors, currentSector + 1);
    const res = await cloudActions.nextSector(nextIdx, totalSectors);
    if (res?.success) {
      const nextCasePadded = `case-${String(nextIdx).padStart(2, '0')}`;
      const foundCase = cases.find(c => c.id === nextCasePadded);
      if (foundCase) {
        setSelectedCaseId(nextCasePadded);
      }
      setNotification(`⏩ Preparado para el Sector ${nextIdx}. Caso y Video de Batalla alineados.`);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleToggleTeamEvent = async () => {
    setIsLoading(true);
    const newStatus = !gameState?.isTeamEventActive;
    await cloudActions.toggleTeamEvent(
      newStatus,
      '¡DINÁMICA DE EQUIPO EN VIVO!',
      'Todos los pilotos deben seguir las instrucciones del Facilitador en el escenario.'
    );
    setIsLoading(false);
    setNotification(newStatus ? '🏆 Dinámica de Equipo ACTIVADA en Pantalla Gigante y Tablets.' : '🟢 Dinámica de Equipo finalizada.');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleToggleSolutions = async () => {
    setIsLoading(true);
    const newStatus = !gameState?.showSolutionsOverlay;
    await cloudActions.toggleSolutionsOverlay(newStatus);
    setIsLoading(false);
    setNotification(newStatus ? '💡 Soluciones técnicas y fundamentación proyectadas en Pantalla Gigante.' : '💡 Soluciones ocultadas de Pantalla Gigante.');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleTogglePodium = async () => {
    setIsLoading(true);
    const newStatus = !gameState?.showPodium;
    await cloudActions.togglePodium(newStatus);
    setIsLoading(false);
    setNotification(newStatus ? '🏆 Podio y Clasificación proyectados en Pantalla Gigante.' : '🏆 Podio ocultado de Pantalla Gigante.');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleToggleRedFlag = async () => {
    const newStatus = !isRedFlagActive;
    await cloudActions.setRedFlag(newStatus);
    setNotification(newStatus ? '🚨 BANDERA ROJA ACTIVADA: Carrera detenida en todas las pantallas.' : '🟢 Bandera Roja levantada. Carrera reanudada.');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleExtendTimer = async () => {
    await cloudActions.extendTimer(30);
    setNotification('⏱️ +30 Segundos añadidos en tiempo real al cronómetro.');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleSendRadio = async (e) => {
    if (e) e.preventDefault();
    if (!radioText.trim()) return;
    await cloudActions.sendPitRadioMessage(radioText);
    setRadioText('');
    setNotification('📢 Comunicado de radio transmitido a todas las tablets.');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleTriggerSummon = async () => {
    await cloudActions.triggerStageSummon(summonTeamId, summonReason, true);
    setNotification(`📣 Escudería #${summonTeamId} convocada al escenario.`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleCancelSummon = async () => {
    const activeTeamId = gameState?.stageSummon?.teamId || summonTeamId;
    await cloudActions.triggerStageSummon(activeTeamId, '', false);
    setNotification(`Alerta de convocatoria cancelada.`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSimulate10Teams = async () => {
    setIsLoading(true);
    const res = await cloudActions.simulate10Teams(selectedCase, currentSector, totalSectors);
    setIsLoading(false);
    if (res?.success) {
      setNotification('🏎️ Simulación de 6 Escuderías en vivo ejecutada.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  // Hard Reset de máxima seguridad (Foja Cero)
  const handleHardReset = async () => {
    const confirmed = confirm('⚠️ ¿ESTÁS SEGURO DE EJECUTAR UN RESET TOTAL?\n\nEsta acción:\n- EXPULSARÁ a TODAS las tablets conectadas a la pantalla inicial de PIN.\n- BORRARÁ las sesiones de los participantes.\n- REINICIARÁ el campeonato y los 6 monoplazas al 0% (foja cero).\n- Limpiará todas las alertas de carrera.');
    if (!confirmed) return;

    const secondCheck = confirm('Última confirmación: ¿Proceder con el HARD RESET TOTAL?');
    if (!secondCheck) return;

    setIsLoading(true);
    await cloudActions.hardReset();
    setIsLoading(false);
    setNotification('🔥 RESET TOTAL COMPLETADO: Todos los dispositivos expulsados y campeonato en foja cero.');
    setTimeout(() => setNotification(''), 5000);
  };

  // Sincronizar automáticamente el caso seleccionado con el sector actual
  useEffect(() => {
    if (currentSector) {
      const casePadded = `case-${String(currentSector).padStart(2, '0')}`;
      if (cases.some(c => c.id === casePadded)) {
        setSelectedCaseId(casePadded);
      }
    }
  }, [currentSector, cases]);

  const handleSetTrackBackground = async (bgPreset) => {
    await cloudActions.setTrackBackground(bgPreset);
    const name = TRACK_BACKGROUND_OPTIONS.find(o => o.id === bgPreset)?.name || bgPreset;
    setNotification(`🎨 Fondo de pista actualizado a: ${name}`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleFileUploadBg = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (PNG, JPG o WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawBase64 = event.target?.result;
      if (!rawBase64) return;

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1920;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const optimizedDataUrl = canvas.toDataURL(mimeType, 0.85);

        await cloudActions.setTrackBackground(optimizedDataUrl);
        setNotification('🖼️ Fondo de pista personalizado (PNG/JPG) cargado y activado.');
        setTimeout(() => setNotification(''), 4000);
      };
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
  };

  const handleCustomUrlBg = async (e) => {
    if (e) e.preventDefault();
    if (!customBgUrl.trim()) return;
    await cloudActions.setTrackBackground(customBgUrl.trim());
    setNotification('🌐 Fondo de pista por URL activado.');
    setCustomBgUrl('');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSaveCase = (caseData, existingId) => {
    if (existingId) {
      setCases(prev => prev.map(c => c.id === existingId ? { ...caseData, id: existingId } : c));
    } else {
      setCases(prev => [...prev, { ...caseData, id: `case-${Date.now()}` }]);
    }
    setNotification('✅ Caso guardado en el catálogo.');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDeleteCase = (caseId) => {
    setCases(prev => prev.filter(c => c.id !== caseId));
    setNotification('🗑️ Caso eliminado.');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="min-h-screen bg-carbon text-slate-100 p-4 md:p-8 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-f1-card p-6 rounded-2xl border border-f1-border shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-f1-yellow rounded-xl flex items-center justify-center text-black shadow-lg shadow-f1-yellow/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">
                  Dirección de Carrera <span className="text-f1-yellow">F1 Pits</span>
                </h1>
                {isCloudFirebase && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" /> FIREBASE CLOUD
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{enrolledTeamsCount} / 6 ESCUDERÍAS CONECTADAS</span>
                </span>
                {isRedFlagActive && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-mono text-[10px] font-black uppercase flex items-center gap-1 animate-pulse">
                    🚨 BANDERA ROJA ACTIVA
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-400">
                SISTEMA PROGRESIVO DE 5 SECTORES • GRAN PREMIO ERP
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={async () => {
                const nextState = !gameState?.showQrModal;
                await cloudActions.toggleQrModal(nextState);
                setNotification(nextState ? '📱 Código QR desplegado en Pantalla Gigante para los participantes.' : '📱 Código QR cerrado en Pantalla Gigante.');
                setTimeout(() => setNotification(''), 3000);
              }}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold uppercase flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
                gameState?.showQrModal
                  ? 'bg-cyan-500 text-black border border-cyan-300 animate-pulse shadow-cyan-500/30'
                  : 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40'
              }`}
              title="Mostrar u ocultar código QR en la Pantalla Gigante"
            >
              <QrCode className="w-4 h-4" />
              <span>{gameState?.showQrModal ? 'QR en Pantalla (ACTIVO)' : 'Conectar Tablets (QR)'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold uppercase flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              title="Descargar reporte completo de capacitación en formato CSV / Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Excel</span>
            </button>

            <div className="flex items-center gap-2 bg-f1-dark p-1 rounded-xl border border-f1-border">
              <button
                onClick={() => setActiveTab('race')}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                  activeTab === 'race' ? 'bg-f1-yellow text-black shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Consola de Carrera
              </button>
              <button
                onClick={() => setActiveTab('crud')}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                  activeTab === 'crud' ? 'bg-f1-yellow text-black shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Gestión de Casos (CRUD)
              </button>
            </div>
          </div>
        </header>

        {/* Notificación */}
        {notification && (
          <div className="p-4 bg-f1-cyan/15 border border-f1-cyan/40 rounded-xl text-f1-cyan text-xs font-mono font-bold flex items-center gap-2 shadow-lg">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {activeTab === 'race' && (
          <div className="space-y-6">
            {/* 1. Panel de Control de Carrera */}
            <div className="bg-f1-card p-6 rounded-2xl border border-f1-border space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-f1-border">
                <div className="flex items-center gap-4">
                  <div className="px-3.5 py-1.5 rounded-xl bg-f1-dark border border-f1-border font-mono text-xs">
                    <span className="text-slate-400 block text-[10px]">TRAMO ACTUAL:</span>
                    <span className="text-f1-yellow font-black text-sm">SECTOR {currentSector} / {totalSectors}</span>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-f1-dark border border-f1-border font-mono text-xs">
                    <span className="text-slate-400 block text-[10px]">ESTADO:</span>
                    <span className="text-f1-cyan font-black text-sm">{currentStatus}</span>
                  </div>
                </div>

                <div className="w-full sm:w-96">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase">
                      CASO ERP ASOCIADO A ESTE SECTOR:
                    </label>
                    {selectedCase?.battleVideoUrl && (
                      <span className="text-[10px] font-mono text-f1-cyan flex items-center gap-1 font-bold">
                        🎬 {selectedCase.battleVideoUrl.replace('/videos/', '')}
                      </span>
                    )}
                  </div>
                  <select
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    disabled={currentStatus === 'ACTIVE_CASE'}
                    className="w-full bg-f1-dark border border-f1-border rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-f1-yellow focus:outline-none"
                  >
                    {cases.map((c, idx) => (
                      <option key={c.id} value={c.id}>
                        {c.sector ? `Sector ${c.sector}: ` : `Sector ${idx + 1}: `}{c.title} ({c.timeLimitSeconds}s)
                      </option>
                    ))}
                  </select>
                  {selectedCase?.battleTitle && (
                    <div className="mt-1 text-[10px] font-mono text-slate-400 truncate">
                      <span className="text-f1-yellow font-bold">Batalla:</span> {selectedCase.battleTitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Fila 1: Botones de Operación de Carrera */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  1. OPERACIÓN DE RONDA (FLUJO PRINCIPAL):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* 1. Iniciar Caso con Video 1 (o Reiniciar si está activa) */}
                  <button
                    type="button"
                    onClick={handleStartCase}
                    disabled={isLoading}
                    className={`p-4 rounded-xl font-mono font-bold text-xs uppercase flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer ${
                      currentStatus === 'ACTIVE_CASE'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black shadow-amber-500/20 border border-yellow-300/40'
                        : 'bg-gradient-to-r from-f1-green to-emerald-600 hover:from-emerald-500 text-black shadow-f1-green/20'
                    }`}
                  >
                    {currentStatus === 'ACTIVE_CASE' ? (
                      <>
                        <RotateCcw className="w-5 h-5 text-black" />
                        <span>1. REINICIAR / FORZAR RONDA</span>
                        <span className="text-[9px] opacity-90 font-normal">Reinicia 60s y reactiva tablets</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current" />
                        <span>1. INICIAR RONDA</span>
                        <span className="text-[9px] opacity-85 font-normal">Video 1 Arranque & Habilita tablets</span>
                      </>
                    )}
                  </button>

                  {/* 2. Finalizar Automáticamente con Video 2 */}
                  <button
                    type="button"
                    onClick={handleAutoFinishCase}
                    disabled={isLoading}
                    className="p-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 border border-cyan-400/40"
                  >
                    <Zap className="w-5 h-5 fill-current" />
                    <span>2. FINALIZAR RONDA</span>
                    <span className="text-[9px] opacity-90 font-normal">Video 2 Batalla + 2s + Avance</span>
                  </button>

                  {/* 3. Siguiente Sector */}
                  <button
                    type="button"
                    onClick={handleNextSector}
                    disabled={isLoading}
                    className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-f1-border font-mono font-bold text-xs uppercase flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <FastForward className="w-5 h-5 text-f1-yellow" />
                    <span>3. SIGUIENTE SECTOR</span>
                    <span className="text-[9px] opacity-60 font-normal">Conserva kilometraje acumulado</span>
                  </button>

                  {/* 4. Simulación 6 Escuderías */}
                  <button
                    type="button"
                    onClick={handleSimulate10Teams}
                    disabled={isLoading}
                    className="p-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 text-white font-mono font-bold text-xs uppercase flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-600/25 active:scale-95 border border-purple-400/30"
                  >
                    <Users className="w-5 h-5 fill-current" />
                    <span>🏎️ SIMULAR 6 ESCUDERÍAS</span>
                    <span className="text-[9px] opacity-85 font-normal">Demo instantánea de carrera</span>
                  </button>
                </div>
              </div>

              {/* Fila 2: Controles Tácticos de Dirección de Carrera */}
              <div className="pt-2 border-t border-f1-border/40">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  2. CONTROLES TÁCTICOS EN VIVO:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {/* 1. Dinámica de Equipo / Evento en Escenario (Reemplazo Safety Car) */}
                  <button
                    type="button"
                    onClick={handleToggleTeamEvent}
                    disabled={isLoading}
                    className={`p-3 rounded-xl font-mono font-bold text-xs uppercase flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border cursor-pointer ${
                      gameState?.isTeamEventActive
                        ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-purple-600 text-black border-yellow-300 animate-pulse shadow-lg shadow-yellow-500/40'
                        : 'bg-purple-950/40 text-purple-300 border-purple-500/40 hover:bg-purple-900/50'
                    }`}
                    title="Lanzar dinámica interactiva con banner dorado/púrpura en la pantalla gigante y tablets"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>{gameState?.isTeamEventActive ? '🛑 Finalizar Evento' : '🏆 Dinámica Equipo'}</span>
                  </button>

                  {/* 2. Soluciones Técnicas en Pantalla Gigante */}
                  <button
                    type="button"
                    onClick={handleToggleSolutions}
                    disabled={isLoading}
                    className={`p-3 rounded-xl font-mono font-bold text-xs uppercase flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border cursor-pointer ${
                      gameState?.showSolutionsOverlay
                        ? 'bg-cyan-500 text-black border-cyan-300 animate-pulse shadow-cyan-500/40'
                        : 'bg-slate-800 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10'
                    }`}
                    title="Proyectar las respuestas correctas y fundamentación en la pantalla gigante"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{gameState?.showSolutionsOverlay ? 'Ocultar Solución' : '💡 Mostrar Solución'}</span>
                  </button>

                  {/* 3. Podio y Clasificación en Pantalla Gigante */}
                  <button
                    type="button"
                    onClick={handleTogglePodium}
                    disabled={isLoading}
                    className={`p-3 rounded-xl font-mono font-bold text-xs uppercase flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border cursor-pointer ${
                      gameState?.showPodium
                        ? 'bg-yellow-500 text-black border-yellow-300 animate-pulse shadow-yellow-500/40'
                        : 'bg-slate-800 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/10'
                    }`}
                    title="Proyectar el podio y clasificación oficial en la pantalla gigante"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{gameState?.showPodium ? 'Ocultar Podio' : '🏆 Mostrar Podio'}</span>
                  </button>

                  {/* 4. Ruleta de Escuderías en Pantalla Gigante */}
                  <button
                    type="button"
                    onClick={() => setShowRoulette(true)}
                    className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs uppercase flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                    title="Abrir ruleta interactiva sincronizada para la pantalla gigante"
                  >
                    <span className="text-base">🎡</span>
                    <span>Ruleta Escuderías</span>
                  </button>

                  {/* 5. Bandera Roja Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleRedFlag}
                    className={`p-3 rounded-xl font-mono font-bold text-xs uppercase flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border cursor-pointer ${
                      isRedFlagActive
                        ? 'bg-red-600 text-white border-red-300 animate-pulse shadow-red-600/40'
                        : 'bg-slate-800 text-red-400 border-red-500/30 hover:bg-red-500/10'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{isRedFlagActive ? 'Reanudar Carrera' : 'Bandera Roja'}</span>
                  </button>

                  {/* 6. Prórroga +30s */}
                  <button
                    type="button"
                    onClick={handleExtendTimer}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-mono font-bold text-xs uppercase flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>+30s Prórroga</span>
                  </button>
                </div>
              </div>

              {/* Fila 2.1: Selector de Fondo de Pista (Presets y Carga de PNG/JPG Personalizado) */}
              <div className="pt-2 border-t border-f1-border/40 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    3. FONDO DE PISTA (PANTALLA GIGANTE):
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-f1-cyan font-bold">
                      ACTIVO: {
                        (gameState?.trackBackground?.startsWith('data:') || gameState?.trackBackground?.startsWith('http'))
                          ? '🖼️ Imagen Personalizada'
                          : (TRACK_BACKGROUND_OPTIONS.find(o => o.id === (gameState?.trackBackground || 'asphalt-dark'))?.name || 'Asfalto F1 Nocturno')
                      }
                    </span>
                    {(gameState?.trackBackground?.startsWith('data:') || gameState?.trackBackground?.startsWith('http')) && (
                      <button
                        type="button"
                        onClick={() => handleSetTrackBackground('asphalt-dark')}
                        className="px-2 py-0.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold transition-all cursor-pointer"
                        title="Restablecer fondo al asfalto F1 predeterminado"
                      >
                        Restablecer a Asfalto
                      </button>
                    )}
                  </div>
                </div>

                {/* 5 Presets Oficiales */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {TRACK_BACKGROUND_OPTIONS.map((bg) => {
                    const isActive = (gameState?.trackBackground || 'asphalt-dark') === bg.id;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => handleSetTrackBackground(bg.id)}
                        className={`p-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                          isActive
                            ? 'bg-f1-cyan/20 border-f1-cyan text-f1-cyan shadow-lg shadow-f1-cyan/20 ring-1 ring-f1-cyan'
                            : 'bg-f1-dark/80 border-f1-border text-slate-300 hover:bg-f1-dark hover:border-slate-500'
                        }`}
                      >
                        <span className="text-base">{bg.icon}</span>
                        <span className="truncate">{bg.name}</span>
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-f1-cyan ml-auto flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Carga de Imagen Local PNG / JPG y Enlace URL Externo */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-f1-dark/60 p-2.5 rounded-xl border border-f1-border/60">
                  {/* Botón de Subida de Archivo */}
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-f1-cyan/15 hover:bg-f1-cyan/25 border border-f1-cyan/40 text-f1-cyan font-mono text-xs font-bold cursor-pointer transition-all flex-shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Subir Imagen PNG / JPG</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={handleFileUploadBg}
                      className="hidden"
                    />
                  </label>

                  {/* Formulario de URL Externa */}
                  <form onSubmit={handleCustomUrlBg} className="flex items-center gap-1.5 flex-1">
                    <input
                      type="url"
                      placeholder="O ingresa la URL de un PNG/JPG externo (https://...)"
                      value={customBgUrl}
                      onChange={(e) => setCustomBgUrl(e.target.value)}
                      className="flex-1 bg-f1-card border border-f1-border rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-f1-cyan min-w-0"
                    />
                    <button
                      type="submit"
                      disabled={!customBgUrl.trim()}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 border border-slate-600 text-slate-200 font-mono text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-f1-cyan" />
                      <span>Aplicar URL</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Fila 3: Convocatoria a Escenario & Comunicado de Radio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-f1-border/40">
                {/* Convocatoria al Escenario */}
                <div className="bg-f1-dark/80 p-4 rounded-xl border border-f1-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-f1-yellow font-bold uppercase flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Convocatoria al Escenario (En Vivo)</span>
                    </span>
                    {gameState?.stageSummon?.active && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-mono font-bold animate-pulse">
                        LLAMADO ACTIVO: #{gameState.stageSummon.teamId}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={summonTeamId}
                      onChange={(e) => setSummonTeamId(e.target.value)}
                      className="bg-f1-card border border-f1-border rounded-xl px-3 py-2 text-xs font-mono text-white flex-1 focus:outline-none"
                    >
                      {OFFICIAL_TEAMS.map(t => {
                        const prof = teamsProfiles[t.id] || {};
                        const teamLabel = prof.subname ? `"${prof.subname}" (Escudería ${t.id})` : `Escudería ${t.id}`;
                        return (
                          <option key={t.id} value={t.id}>
                            #{t.id} {teamLabel}
                          </option>
                        );
                      })}
                    </select>

                    {gameState?.stageSummon?.active ? (
                      <button
                        type="button"
                        onClick={handleCancelSummon}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase transition-all flex items-center gap-1 shadow-md shadow-amber-500/30 animate-pulse cursor-pointer"
                      >
                        <span>🛑 Desactivar Llamado (#{gameState.stageSummon.teamId})</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleTriggerSummon}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase transition-all flex items-center gap-1 shadow-md shadow-red-600/30 cursor-pointer"
                      >
                        <span>📢 Convocar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Comunicado de Radio */}
                <form onSubmit={handleSendRadio} className="bg-f1-dark/80 p-4 rounded-xl border border-f1-border space-y-3">
                  <span className="text-xs font-mono text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                    <Radio className="w-4 h-4" />
                    <span>Comunicado de Radio Pits a las Tablets</span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={radioText}
                      onChange={(e) => setRadioText(e.target.value)}
                      placeholder="Ej: Atención con el 3-way matching en el Paso 3..."
                      className="bg-f1-card border border-f1-border rounded-xl px-3 py-2 text-xs font-mono text-white flex-1 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      disabled={!radioText.trim()}
                      className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-mono font-bold text-xs uppercase flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmitir</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Fila 4: Zona de Peligro / Foja Cero */}
              <div className="pt-4 border-t border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-red-950/20 p-4 rounded-xl border border-red-900/40">
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-mono font-black text-red-400 uppercase block">
                      ZONA DE REINICIO TOTAL • FOJA CERO
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans">
                      Expulsa a todos los dispositivos, borra sesiones de tablets y vuelve los autos a la largada (0%).
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleHardReset}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-black text-xs uppercase transition-all shadow-lg shadow-red-600/30 active:scale-95 flex items-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  <span>RESET TOTAL (FOJA CERO)</span>
                </button>
              </div>
            </div>

            {/* Monitor de Telemetría con Nómina de Integrantes */}
            <LiveTelemetry
              connectedTeams={gameState?.teamsProfiles || adminState?.connectedTeams || {}}
              submissions={gameState?.submissions || adminState?.submissions || {}}
              teamsList={OFFICIAL_TEAMS.map(t => ({
                id: t.id,
                name: t.name,
                color: t.color,
                subname: teamsProfiles[t.id]?.subname || ''
              }))}
            />
          </div>
        )}

        {activeTab === 'crud' && (
          <CaseEditor
            cases={cases}
            onSaveCase={handleSaveCase}
            onDeleteCase={handleDeleteCase}
          />
        )}
      </div>

      {/* Modal de Debrief NetSuite */}
      {showDebrief && (
        <DebriefModal
          caseData={selectedCase}
          results={gameState?.calculatedResults}
          onClose={() => setShowDebrief(false)}
        />
      )}

      {/* Modal de Ruleta de Pilotos */}
      {showRoulette && (
        <RouletteModal
          teamsProfiles={teamsProfiles}
          rouletteState={gameState?.roulette}
          onSyncRoulette={(data) => cloudActions.setRouletteState(data)}
          onClose={() => setShowRoulette(false)}
        />
      )}

      {/* Modal de Conexión QR Tablets */}
      {showQrModal && (
        <QrConnectModal onClose={() => setShowQrModal(false)} />
      )}

      <footer className="mt-8 text-center text-xs font-mono text-slate-500">
        DIRECCIÓN DE CARRERA • CONTROL DE TELEMETRÍA
      </footer>
    </div>
  );
}
