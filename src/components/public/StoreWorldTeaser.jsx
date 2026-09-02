/**
 * StoreWorldTeaser — homepage section linking to /store-world
 * Drop this component into Home.jsx wherever you want the boutique CTA.
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ACCENT = '#D4AF37';

export default function StoreWorldTeaser() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #080808 0%, #0f0d08 50%, #080808 100%)',
        borderTop: '1px solid rgba(212,175,55,0.1)',
        borderBottom: '1px solid rgba(212,175,55,0.1)',
        padding: '64px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Eyebrow */}
        <p style={{
          color: 'rgba(212,175,55,0.55)',
          fontSize: '10px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          marginBottom: '16px',
          fontWeight: 600,
        }}>
          Official Merch Boutique
        </p>

        {/* Heading */}
        <h2 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3.4rem)',
          fontWeight: 800,
          letterSpacing: '0.06em',
          margin: '0 0 12px',
          background: `linear-gradient(135deg, #B8860B, ${ACCENT}, #FFF8DC, ${ACCENT}, #B8860B)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.15,
          fontFamily: 'inherit',
        }}>
          Enter the Gannon Waye Store
        </h2>

        {/* Sub */}
        <p style={{
          color: '#666',
          fontSize: '14px',
          lineHeight: 1.75,
          maxWidth: '440px',
          margin: '0 auto 32px',
        }}>
          Shop the current owner-approved <em>Respect Is Earned</em> hoodie<br />
          and the Thankyou journal, pen and thermos flask bundle.
        </p>

        {/* Decorative divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          justifyContent: 'center', marginBottom: '32px',
        }}>
          <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3))' }} />
          <span style={{ color: 'rgba(212,175,55,0.4)', fontSize: '14px' }}>✦</span>
          <div style={{ flex: 1, maxWidth: '80px', height: '1px', background: 'linear-gradient(270deg, transparent, rgba(212,175,55,0.3))' }} />
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/store')}
            style={{
              padding: '13px 30px',
              background: `linear-gradient(135deg, #B8860B, ${ACCENT}, #FFF8DC, ${ACCENT}, #B8860B)`,
              color: '#111',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Enter the Store ✦
          </button>

          <button
            type="button"
            onClick={() => navigate('/store')}
            style={{
              padding: '13px 26px',
              background: 'transparent',
              color: ACCENT,
              border: `1px solid rgba(212,175,55,0.35)`,
              borderRadius: '6px',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
          >
            View Current Stock →
          </button>
        </div>

        {/* Small product teaser pills */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '28px' }}>
          {[
            'Respect Is Earned Hoodie — $98',
            'Journal, Pen and Thermos Bundle — $59',
          ].map(label => (
            <button
              key={label}
              type="button"
              onClick={() => navigate('/store')}
              style={{
                background: 'rgba(212,175,55,0.05)',
                border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: '20px',
                padding: '4px 12px',
                color: 'rgba(212,175,55,0.5)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.color = ACCENT; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)'; e.currentTarget.style.color = 'rgba(212,175,55,0.5)'; }}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}