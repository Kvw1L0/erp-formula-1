'use client';

import React from 'react';

export default function TireSmoke() {
  const puffs = [
    { id: 1, delay: 0, size: 14, top: -4 },
    { id: 2, delay: 0.15, size: 18, top: 2 },
    { id: 3, delay: 0.3, size: 22, top: -2 }
  ];

  return (
    <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 pointer-events-none z-0">
      {puffs.map(p => (
        <span
          key={p.id}
          className="absolute rounded-full bg-white/35 blur-sm"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            top: `${p.top}px`,
            animation: 'f1-smoke 0.8s ease-out infinite',
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
}
