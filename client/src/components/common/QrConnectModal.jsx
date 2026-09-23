'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';

export default function QrConnectModal({ onClose }) {
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }
  }, []);

  const connectUrl = originUrl ? `${originUrl}/participant` : '/participant';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-4 select-none cursor-pointer animate-fadeIn"
    >
      {/* Botón de cierre en esquina */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg hover:scale-105"
        title="Cerrar QR"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Contenedor Principal: Ocupa el 70-75% del espacio visual */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center justify-center cursor-default max-w-full"
      >
        {/* Código QR Gigante */}
        <div className="bg-white p-5 md:p-8 rounded-[36px] shadow-[0_0_80px_rgba(0,240,255,0.4)] border-4 border-f1-cyan flex items-center justify-center w-[72vmin] h-[72vmin] max-w-[620px] max-h-[620px] min-w-[280px] min-h-[280px]">
          {originUrl ? (
            <QRCodeSVG
              value={connectUrl}
              size={560}
              className="w-full h-full object-contain"
              level="H"
              includeMargin={false}
            />
          ) : (
            <div className="text-slate-500 font-mono text-base font-bold animate-pulse">
              Generando QR...
            </div>
          )}
        </div>

        {/* Leyenda Única Requerida */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-widest uppercase mt-6 md:mt-8 drop-shadow-[0_0_25px_#00F0FF] italic text-center">
          Escanea el QR
        </h2>
      </div>
    </div>
  );
}
