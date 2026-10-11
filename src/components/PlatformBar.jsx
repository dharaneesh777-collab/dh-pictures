import React, { useState } from 'react';

const PLATFORMS = [
  { id: 'netflix', name: 'NETFLIX', color: '#e50914', bg: 'rgba(229, 9, 20, 0.12)', border: '#e50914' },
  { id: 'prime', name: 'prime video', color: '#00a8e1', bg: 'rgba(0, 168, 225, 0.12)', border: '#00a8e1' },
  { id: 'disney', name: 'Disney+', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: '#3b82f6' },
  { id: 'apple', name: 'Apple TV+', color: '#e2e8f0', bg: 'rgba(226, 232, 240, 0.12)', border: '#94a3b8' },
  { id: 'hbo', name: 'HBO MAX', color: '#9333ea', bg: 'rgba(147, 51, 234, 0.12)', border: '#9333ea' },
  { id: 'hulu', name: 'hulu', color: '#1ce783', bg: 'rgba(28, 231, 131, 0.12)', border: '#1ce783' },
  { id: 'paramount', name: 'Paramount+', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: '#38bdf8' }
];

export default function PlatformBar({ activePlatform, onSelectPlatform }) {
  const [selected, setSelected] = useState(activePlatform || null);

  const handleClick = (id) => {
    const next = selected === id ? null : id;
    setSelected(next);
    if (onSelectPlatform) onSelectPlatform(next);
  };

  return (
    <div className="flixeo-platforms-bar">
      {PLATFORMS.map((p) => {
        const isActive = selected === p.id;
        return (
          <button
            key={p.id}
            type="button"
            className={`platform-chip ${isActive ? 'active' : ''}`}
            style={{
              '--chip-color': p.color,
              '--chip-bg': p.bg,
              '--chip-border': p.border
            }}
            onClick={() => handleClick(p.id)}
          >
            <span className="platform-name" style={{ color: p.color }}>
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
