import { useNavigate } from 'react-router-dom';

export default function MumsGarden() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#080706',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      fontFamily: "'Inter', sans-serif",
      textAlign: 'center',
    }}>
      {/* Warm ambient glow */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,210,140,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '520px' }}>
        {/* Heart */}
        <div style={{ fontSize: '48px', marginBottom: '24px', lineHeight: 1 }}>♡</div>

        <p style={{
          color: 'rgba(255,210,160,0.4)',
          fontSize: '10px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          A quiet corner
        </p>

        <h1 style={{
          color: 'rgba(255,210,160,0.85)',
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          fontWeight: 700,
          lineHeight: 1.25,
          marginBottom: '28px',
          letterSpacing: '0.04em',
        }}>
          Mum's Garden
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: '15px',
          lineHeight: 1.85,
          marginBottom: '40px',
        }}>
          This space is dedicated to Sonia Katisa Waye.<br />
          Always in our hearts. Always in the music.<br /><br />
          <em style={{ color: 'rgba(255,210,160,0.5)', fontStyle: 'italic' }}>
            "Respect Is Earned, Not A Game You Make Me Play."
          </em>
        </p>

        {/* Divider */}
        <div style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,210,160,0.3), transparent)',
          margin: '0 auto 40px',
        }} />

        {/* Full tribute link */}
        <button
          onClick={() => navigate('/mum')}
          style={{
            padding: '13px 32px',
            borderRadius: '8px',
            background: 'transparent',
            border: '1px solid rgba(255,210,160,0.3)',
            color: 'rgba(255,210,160,0.75)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'block',
            width: '100%',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,210,160,0.6)'; e.currentTarget.style.color = 'rgba(255,210,160,1)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,210,160,0.3)'; e.currentTarget.style.color = 'rgba(255,210,160,0.75)'; }}
        >
          Visit the Full Tribute →
        </button>

        <button
          onClick={() => navigate('/store')}
          style={{
            padding: '11px 32px',
            borderRadius: '8px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          ← Return to the Store
        </button>
      </div>
    </div>
  );
}