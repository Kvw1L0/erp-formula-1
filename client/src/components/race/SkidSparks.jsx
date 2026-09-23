'use client';

import React from 'react';

export default function SkidSparks({ count = 8 }) {
  const sparks = [
    { id: 0, delay: 0, duration: 0.35, topOffset: -4, size: 3, color: '#FFE066' },
    { id: 1, delay: 0.08, duration: 0.45, topOffset: 3, size: 3.5, color: '#FF7A00' },
    { id: 2, delay: 0.16, duration: 0.32, topOffset: -2, size: 2.5, color: '#FFE066' },
    { id: 3, delay: 0.24, duration: 0.42, topOffset: 4, size: 3.2, color: '#FF7A00' },
    { id: 4, delay: 0.32, duration: 0.5, topOffset: -5, size: 3.8, color: '#FFE066' },
    { id: 5, delay: 0.4, duration: 0.36, topOffset: 1, size: 2.8, color: '#FF7A00' },
    { id: 6, delay: 0.48, duration: 0.44, topOffset: -3, size: 3.2, color: '#FFE066' },
    { id: 7, delay: 0.56, duration: 0.38, topOffset: 2, size: 3.6, color: '#FF7A00' },
  ];

  return (
    <div className="absolute left-[-20px] bottom-1 pointer-events-none z-0 overflow-visible">
      {sparks.slice(0, Math.min(count, sparks.length)).map(s => (
        <span
          key={s.id}
          className="absolute rounded-full filter drop-shadow-[0_0_6px_#FFA500]"
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            top: `${s.topOffset}px`,
            left: 0,
            animation: `f1-spark ${s.duration}s infinite linear`,
            animationDelay: `${s.delay}s`,
            opacity: 0.9
          }}
        />
      ))}
    </div>
  );
}
