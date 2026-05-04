import React from 'react';

export default function GannonSignature({ className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-3 pointer-events-none ${className}`}
      style={{ transform: 'rotate(-6deg)' }}
    >
      {/* Left gold line */}
      <div style={{
        width: '28px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #c9a84c, #ffe08a)',
        opacity: 0.8,
      }} />

      {/* Signature */}
      <img
        src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6eda965a4_image.png"
        alt="Gannon Waye"
        style={{
          width: '150px',
          filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.55))',
          opacity: 0.95,
        }}
      />

      {/* Right gold line */}
      <div style={{
        width: '28px',
        height: '1px',
        background: 'linear-gradient(90deg, #ffe08a, #c9a84c, transparent)',
        opacity: 0.8,
      }} />
    </div>
  );
}