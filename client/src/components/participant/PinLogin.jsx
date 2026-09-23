'use client';

import React, { useState } from 'react';
import { Flag, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { sounds, triggerHaptic } from '../../lib/soundEffects';

export const OFFICIAL_TEAMS = [
  { pin: '1', id: 1, label: '1', name: 'Escudería 1', color: '#3671C6', placeholder: 'Los Toros Asombrosos' },
  { pin: '2', id: 2, label: '2', name: 'Escudería 2', color: '#E80020', placeholder: 'Los Intrépidos' },
  { pin: '3', id: 3, label: '3', name: 'Escudería 3', color: '#27F4D2', placeholder: 'Flechas de Plata' },
  { pin: '4', id: 4, label: '4', name: 'Escudería 4', color: '#FF8000', placeholder: 'Los Manglaren' },
  { pin: '5', id: 5, label: '5', name: 'Escudería 5', color: '#229971', placeholder: 'Los Espías de Pits' },
  { pin: '6', id: 6, label: '6', name: 'Escudería 6', color: '#0093CC', placeholder: 'Fuerza Azul' }
];

export default function PinLogin({ onLoginSuccess, isConnecting }) {
  const [selectedTeam, setSelectedTeam] = useState(OFFICIAL_TEAMS[0]);
  const [subname, setSubname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setError('');
    sounds.playSelect();
    triggerHaptic([30]);
  };

  const handleConfirmLogin = async (e) => {
    if (e) e.preventDefault();

    if (!selectedTeam) {
      setError('Por favor selecciona tu escudería.');
      return;
    }

    const finalSubname = subname.trim() || selectedTeam.placeholder;

    setIsLoading(true);
    setError('');
    sounds.playSelect();
    triggerHaptic([50, 40, 50]);

    try {
      const teamPayload = {
        id: selectedTeam.id,
        name: selectedTeam.name,
        color: selectedTeam.color,
        subname: finalSubname,
        participants: [finalSubname]
      };

      await onLoginSuccess(teamPayload, selectedTeam.pin, finalSubname, teamPayload.participants);
    } catch (err) {
      console.error('Error en login de participante:', err);
      setError('Error al conectar con la carrera. Intenta de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-f1-card p-6 md:p-8 rounded-3xl border border-f1-border shadow-2xl relative text-left select-none">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-f1-red/10 border border-f1-red/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-f1-red shadow-lg shadow-f1-red/10">
          <Flag className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
          Terminal <span className="text-f1-red">de Pits</span>
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-red-400 text-xs font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Selector de Escudería 1 al 6 (Solo Número y Color) */}
      <div className="mb-5">
        <label className="block text-xs font-mono text-slate-300 uppercase font-bold mb-2">
          Selecciona tu Escudería:
        </label>
        
        <div className="grid grid-cols-6 gap-2">
          {OFFICIAL_TEAMS.map((team) => {
            const isSelected = selectedTeam.id === team.id;
            return (
              <button
                key={team.pin}
                type="button"
                onClick={() => handleSelectTeam(team)}
                className={`h-14 rounded-2xl font-mono text-lg font-black transition-all flex items-center justify-center border-2 cursor-pointer ${
                  isSelected
                    ? 'border-white text-white shadow-xl scale-105 z-10'
                    : 'bg-f1-dark/80 border-f1-border text-slate-400 hover:border-slate-500 hover:text-white'
                }`}
                style={{
                  backgroundColor: isSelected ? team.color : undefined,
                  boxShadow: isSelected ? `0 0 20px ${team.color}90` : undefined
                }}
              >
                {team.label}
              </button>
            );
          })}
        </div>

        {/* Indicador de Escudería Seleccionada */}
        <div className="mt-2.5 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-f1-dark/80 border border-f1-border text-xs font-mono">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedTeam.color }} />
          <span className="font-bold text-white uppercase">{selectedTeam.name}</span>
        </div>
      </div>

      {/* 2. Casilla para Nombre de la Escudería */}
      <form onSubmit={handleConfirmLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase font-bold mb-1.5">
            Nombre de tu Escudería:
          </label>
          <input
            type="text"
            maxLength={40}
            value={subname}
            onChange={(e) => setSubname(e.target.value)}
            placeholder={`Ej: ${selectedTeam.placeholder}`}
            className="w-full bg-f1-dark border border-f1-border focus:border-f1-yellow rounded-xl px-4 py-3 text-white text-sm font-sans placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-f1-yellow transition-all"
          />
        </div>

        {/* Botón de Confirmación */}
        <button
          type="submit"
          disabled={isLoading || isConnecting}
          className="w-full mt-3 bg-gradient-to-r from-f1-red via-red-600 to-rose-700 hover:from-red-600 hover:to-rose-800 disabled:opacity-40 text-white font-mono font-black py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-f1-red/30 active:scale-[0.98] uppercase tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <span className="animate-pulse flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              CONECTANDO...
            </span>
          ) : (
            <>
              <span>INGRESAR A PITS</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
