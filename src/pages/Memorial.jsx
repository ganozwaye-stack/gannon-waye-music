import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Lock } from 'lucide-react';
import SingleCoverPlaque from '@/components/mum/SingleCoverPlaque';

export default function Memorial() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

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
      {/* noindex via meta — handled in index.html ideally; this is a runtime note */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,210,140,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: '520px' }}>
        <div style={{ fontSize: '44px', marginBottom: '20px' }}>🌸</div>

        <p style={{ color: 'rgba(255,210,160,0.4)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '16px' }}>
          A Private Space
        </p>

        <h1 style={{ color: 'rgba(255,210,160,0.9)', fontSize: 'clamp(1.8rem,5vw,2.6rem)', fontWeight: 700, lineHeight: 1.25, marginBottom: '24px', letterSpacing: '0.04em' }}>
          Mum's Garden
        </h1>

        {!isAdmin ? (
          <>
            <div style={{ margin: '0 auto 24px', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,210,160,0.06)', border: '1px solid rgba(255,210,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock style={{ width: '20px', height: '20px', color: 'rgba(255,210,160,0.5)' }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
              This is a private space.<br />Enter with love.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>
              This page is only accessible to those who know the way.
            </p>
          </>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.85, marginBottom: '32px' }}>
              This space is dedicated to Sonia Katisa Waye.<br />
              Always in our hearts. Always in the music.<br /><br />
              <em style={{ color: 'rgba(255,210,160,0.6)', fontStyle: 'italic' }}>
                "Respect Is Earned, Not A Game You Make Me Play."
              </em>
            </p>

            <div style={{ width: '100px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,210,160,0.3), transparent)', margin: '0 auto 32px' }} />

            <p style={{ color: 'rgba(255,210,160,0.5)', fontSize: '12px', marginBottom: '28px', letterSpacing: '0.05em' }}>
              This tribute space is ready for your memories, photos and words.
            </p>

            <div style={{ marginBottom: '28px' }}>
              <SingleCoverPlaque size="md" />
            </div>

            <button
              onClick={() => navigate('/mum')}
              style={{ padding: '13px 32px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,210,160,0.3)', color: 'rgba(255,210,160,0.8)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '12px', display: 'block', width: '100%', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,210,160,0.6)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,210,160,0.3)'}
            >
              Open Full Tribute →
            </button>
          </>
        )}

        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 24px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', marginTop: '12px', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}