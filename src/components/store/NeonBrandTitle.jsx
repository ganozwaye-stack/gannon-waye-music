// Reusable neon "GANNON WAYE" brand titleplate.
// Glowing warm-white name + thin gold underline + subtitle.
// The glow lives in src/index.css (.gw-neon-name + @keyframes gwNeonPulse)
// so it renders identically anywhere it's dropped without duplicate <style> tags.
export default function NeonBrandTitle({ subtitle = 'Merch Store' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1
        className="gw-neon-name"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
          fontWeight: 800,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          margin: 0,
          lineHeight: 1,
        }}
      >
        Gannon Waye
      </h1>

      <div
        aria-hidden="true"
        style={{
          width: 'clamp(120px, 22vw, 280px)',
          height: '1px',
          margin: '18px 0 14px',
          background:
            'linear-gradient(90deg, transparent, #C5A059 25%, #C5A059 75%, transparent)',
          boxShadow: '0 0 10px rgba(197,160,89,0.6)',
        }}
      />

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: '#EAEAEA',
          margin: 0,
          fontWeight: 500,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}