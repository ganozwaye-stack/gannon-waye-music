import React from 'react';

/**
 * Gannon Waye signature component.
 * Replace src with the actual uploaded signature image URL once approved.
 * The gold border lines appear on both sides, slightly diagonal, inset from edges.
 */
export default function GannonSignature({ className = '' }) {
  return (
    <div
      className={`inline-flex flex-col items-center gap-1 ${className}`}
      style={{ transform: 'rotate(-6deg)' }}
    >
      {/* Top gold line */}
      <div
        style={{
          width: '100%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, #c9a84c, #ffe08a, #c9a84c, transparent)',
          borderRadius: '2px',
        }}
      />

      {/* Signature image */}
      <img
        src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6eda965a4_image.png"
        alt="Gannon Waye signature"
        style={{
          width: '160px',
          filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.6)) drop-shadow(0 0 3px rgba(255,224,138,0.4))',
          opacity: 0.92,
        }}
      />

      {/* Bottom gold line */}
      <div
        style={{
          width: '100%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent, #c9a84c, #ffe08a, #c9a84c, transparent)',
          borderRadius: '2px',
        }}
      />
    </div>
  );
}