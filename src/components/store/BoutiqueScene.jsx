/**
 * BoutiqueScene — CSS luxury boutique interior.
 * Auto-replaced once BOUTIQUE_HERO_IMAGE is set in storeWorldConfig.js.
 *
 * Layout:
 *   - Back wall: illuminated GANNON WAYE sign
 *   - Right: poster feature wall (multiple framed posters)
 *   - Left-back: hoodie rail
 *   - Centre: pedestal — Winter Writing & Comfort Bundle hero display
 *   - Centre floor: rolled-up posters & classy register/checkout device
 *   - Right shelf: mug + CD collectables
 *   - Far-left corner: Mum's Garden tribute nook with warm spotlight
 *   - Warm wood floor with perspective planks
 *   NO microphone, NO speaker, NO sound corner, NO live corner.
 */

const G = '#D4AF37';
const DIM = 'rgba(212,175,55,0.15)';

export default function BoutiqueScene() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '580px',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #080705 0%, #111009 45%, #1a1408 100%)',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── CEILING AMBIENT DOWNLIGHTS ── */}
      {[25, 50, 75].map(x => (
        <div key={x} style={{
          position: 'absolute', top: 0,
          left: `${x}%`, transform: 'translateX(-50%)',
          width: '200px', height: '160px',
          background: `radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.1) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── BACK WALL ── */}
      <div style={{
        position: 'absolute',
        top: '4%', left: '8%', right: '8%', height: '58%',
        background: 'linear-gradient(180deg, #1a1610 0%, #0e0c08 100%)',
        border: '1px solid rgba(212,175,55,0.07)',
        borderRadius: '4px 4px 0 0',
      }} />

      {/* ── ILLUMINATED STORE SIGN ── */}
      <div style={{
        position: 'absolute',
        top: '7%', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 5,
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 32px 10px',
          border: `1px solid ${DIM}`,
          borderRadius: '3px',
          background: 'rgba(0,0,0,0.65)',
          boxShadow: `0 0 50px rgba(212,175,55,0.22), inset 0 0 24px rgba(212,175,55,0.06)`,
        }}>
          <div style={{
            fontSize: 'clamp(1rem, 3.2vw, 2rem)',
            fontWeight: 900,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            background: `linear-gradient(90deg, #B8860B, ${G}, #FFF8DC, ${G}, #B8860B)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            GANNON WAYE
          </div>
          <div style={{ fontSize: '8px', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.35em', textTransform: 'uppercase', marginTop: '3px' }}>
            The Boutique
          </div>
        </div>
        {/* Neon underline */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${G}, transparent)`, marginTop: '4px', boxShadow: `0 0 12px rgba(212,175,55,0.9)` }} />
      </div>

      {/* ── POSTER FEATURE WALL (right back) ── */}
      <div style={{ position: 'absolute', top: '8%', right: '9%', width: '14%', bottom: '40%', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 4 }}>
        {[
          { label: 'Respect Is Earned', flex: 3 },
          { label: 'Thankyou', flex: 2 },
          { label: 'Wall Poster A1', flex: 1.5 },
        ].map((p, i) => (
          <div key={i} style={{
            flex: p.flex,
            border: '1px solid rgba(212,175,55,0.22)',
            borderRadius: '2px',
            background: 'linear-gradient(135deg, #1c1a14, #0e0c09)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            boxShadow: '2px 2px 10px rgba(0,0,0,0.7)',
          }}>
            <div style={{
              position: 'absolute', inset: '5px',
              background: 'linear-gradient(135deg, #1e1408, #0a0800)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(212,175,55,0.07)',
            }}>
              <div style={{ color: 'rgba(212,175,55,0.28)', fontSize: '6px', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.5 }}>
                {p.label}
              </div>
            </div>
            <div style={{
              position: 'absolute', top: '4px', right: '4px',
              background: 'rgba(212,175,55,0.85)', color: '#111',
              fontSize: '5px', fontWeight: 800, letterSpacing: '0.06em',
              padding: '1px 4px', borderRadius: '2px', textTransform: 'uppercase',
            }}>LIMITED</div>
          </div>
        ))}
      </div>

      {/* ── LEFT HOODIE RAIL ── */}
      <div style={{ position: 'absolute', top: '28%', left: '9%', width: '15%', zIndex: 4 }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, rgba(180,160,100,0.3), rgba(212,175,55,0.65), rgba(180,160,100,0.3))', borderRadius: '2px', boxShadow: '0 2px 8px rgba(212,175,55,0.25)', marginBottom: '7px' }} />
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
          {['#2a2a2a', '#1e1e1e', '#252523', '#1b1b1b'].map((c, i) => (
            <div key={i} style={{
              width: '20%',
              paddingBottom: '68%',
              position: 'relative',
              background: `linear-gradient(180deg, ${c} 0%, #111 100%)`,
              borderRadius: '2px 2px 4px 4px',
              boxShadow: '1px 3px 10px rgba(0,0,0,0.6)',
            }}>
              <div style={{
                position: 'absolute', top: '-7px', left: '50%', transform: 'translateX(-50%)',
                width: '2px', height: '7px',
                background: 'rgba(212,175,55,0.4)',
              }} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '8px', color: 'rgba(212,175,55,0.4)', fontSize: '7px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Hoodies · $89
        </div>
      </div>

      {/* ── CENTRE PEDESTAL — WINTER BUNDLE HERO ── */}
      <div style={{
        position: 'absolute',
        bottom: '33%', left: '50%', transform: 'translateX(-50%)',
        width: '24%', zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Spotlight cone */}
        <div style={{
          position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '160%', height: '90px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Bundle display items */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', width: '100%' }}>
          {/* Journal */}
          <div style={{
            width: '60%', height: '14px',
            background: 'linear-gradient(90deg, #1a1200, #2e2200, #1a1200)',
            border: '1px solid rgba(212,175,55,0.35)',
            borderRadius: '2px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ color: 'rgba(212,175,55,0.65)', fontSize: '5px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Thankyou Journal</div>
          </div>
          {/* Thermos */}
          <div style={{
            width: '18%', height: '22px',
            background: 'linear-gradient(180deg, #222, #0d0d0d)',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '2px 2px 4px 4px',
          }} />
          {/* Pen */}
          <div style={{
            width: '62%', height: '4px',
            background: 'linear-gradient(90deg, #B8860B, #D4AF37, #FFF8DC, #D4AF37, #B8860B)',
            borderRadius: '2px',
            boxShadow: '0 1px 6px rgba(212,175,55,0.5)',
          }} />
        </div>

        {/* Pedestal base */}
        <div style={{
          width: '85%', height: '11px',
          background: 'linear-gradient(180deg, #2e2412, #1a1208)',
          border: '1px solid rgba(212,175,55,0.28)',
          borderRadius: '0 0 4px 4px',
          marginTop: '5px',
          boxShadow: '0 4px 20px rgba(212,175,55,0.14)',
        }} />

        {/* Label */}
        <div style={{ textAlign: 'center', marginTop: '6px' }}>
          <div style={{ color: G, fontSize: '7px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Winter Bundle</div>
          <div style={{ color: '#666', fontSize: '6px', letterSpacing: '0.08em' }}>$129 + postage</div>
        </div>
      </div>

      {/* ── ROLLED POSTERS & REGISTER (centre floor, beside pedestal) ── */}
      {/* Rolled posters */}
      <div style={{
        position: 'absolute',
        bottom: '33%', left: 'calc(50% + 13%)',
        width: '7%', zIndex: 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
      }}>
        {[38, 44, 32].map((h, i) => (
          <div key={i} style={{
            width: '100%', height: `${h}px`,
            background: `linear-gradient(90deg, #1a1208, #${i === 1 ? '2a1e0a' : '1a1208'}, #0d0a05)`,
            border: `1px solid rgba(212,175,55,${i === 1 ? '0.3' : '0.15'})`,
            borderRadius: '50%/40%',
            transform: `rotate(${i * 8 - 8}deg)`,
            boxShadow: '1px 2px 6px rgba(0,0,0,0.5)',
          }} />
        ))}
        <div style={{ color: 'rgba(212,175,55,0.3)', fontSize: '5px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '3px' }}>Posters</div>
      </div>

      {/* Register / checkout device */}
      <div style={{
        position: 'absolute',
        bottom: '33%', left: 'calc(50% - 20%)',
        width: '8%', zIndex: 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Screen */}
        <div style={{
          width: '100%', height: '22px',
          background: 'linear-gradient(135deg, #111, #0a0a0a)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '3px 3px 0 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 0 8px rgba(212,175,55,0.05), 0 0 10px rgba(212,175,55,0.1)',
        }}>
          <div style={{ width: '80%', height: '10px', background: 'rgba(212,175,55,0.08)', borderRadius: '2px', border: '1px solid rgba(212,175,55,0.12)' }} />
        </div>
        {/* Base */}
        <div style={{
          width: '80%', height: '6px',
          background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
          border: '1px solid rgba(212,175,55,0.15)',
          borderTop: 'none', borderRadius: '0 0 2px 2px',
        }} />
        <div style={{ color: 'rgba(212,175,55,0.25)', fontSize: '5px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Checkout</div>
      </div>

      {/* ── RIGHT SHELF — MUG + CD ── */}
      <div style={{ position: 'absolute', top: '34%', right: '23%', width: '13%', zIndex: 4 }}>
        <div style={{ height: '2px', background: 'linear-gradient(90deg, rgba(180,140,60,0.25), rgba(212,175,55,0.5), rgba(180,140,60,0.25))', borderRadius: '1px', marginBottom: '5px' }} />
        <div style={{ display: 'flex', gap: '7px', alignItems: 'flex-end' }}>
          {/* Mug */}
          <div style={{ width: '38%', position: 'relative' }}>
            <div style={{
              paddingBottom: '100%',
              background: 'linear-gradient(135deg, #1e1e1e, #0d0d0d)',
              border: '1px solid rgba(212,175,55,0.22)',
              borderRadius: '2px 2px 5px 5px',
              position: 'relative',
              boxShadow: '1px 2px 8px rgba(0,0,0,0.5)',
            }}>
              <div style={{
                position: 'absolute', right: '-4px', top: '18%',
                width: '5px', height: '32%',
                border: '1px solid rgba(212,175,55,0.2)',
                borderLeft: 'none',
                borderRadius: '0 3px 3px 0',
              }} />
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(212,175,55,0.3)', fontSize: '5px', marginTop: '3px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Mug · $9.90</div>
          </div>
          {/* CD stack */}
          <div style={{ width: '38%' }}>
            <div style={{
              paddingBottom: '125%',
              background: 'linear-gradient(135deg, #111, #0a0a0a)',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: '2px',
              boxShadow: '1px 2px 8px rgba(0,0,0,0.5)',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(212,175,55,0.25)', fontSize: '4px', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Sold Out</div>
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(212,175,55,0.3)', fontSize: '5px', marginTop: '3px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>CD</div>
          </div>
        </div>
      </div>

      {/* ── MUM'S GARDEN TRIBUTE CORNER (far left) with warm spotlight ── */}
      <div style={{
        position: 'absolute',
        bottom: '34%', left: '9%', width: '11%',
        zIndex: 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
      }}>
        {/* Warm spotlight */}
        <div style={{
          position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)',
          width: '180%', height: '80px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,210,140,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Greenery */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
          {[22, 30, 20, 26].map((h, i) => (
            <div key={i} style={{
              width: '22%', height: `${h}px`,
              background: `radial-gradient(ellipse at 50% 70%, rgba(34,64,20,0.88) 0%, rgba(15,32,10,0.7) 100%)`,
              borderRadius: '50% 50% 20% 20%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }} />
          ))}
        </div>

        {/* Framed photo */}
        <div style={{
          width: '62%', paddingBottom: '68%', position: 'relative',
          border: '1px solid rgba(255,210,160,0.35)',
          background: 'linear-gradient(135deg, #1f1000, #0d0800)',
          borderRadius: '2px',
          boxShadow: '0 2px 14px rgba(255,200,140,0.14)',
        }}>
          <div style={{
            position: 'absolute', inset: '4px',
            background: 'rgba(255,210,160,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ color: 'rgba(255,210,160,0.4)', fontSize: '12px' }}>♡</div>
          </div>
        </div>

        <div style={{ color: 'rgba(255,210,160,0.4)', fontSize: '6px', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.5 }}>
          Mum's<br />Garden
        </div>
      </div>

      {/* ── FLOOR ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '36%',
        background: 'linear-gradient(180deg, #0e0b06 0%, #1c1408 55%, #0d0a04 100%)',
        borderTop: '1px solid rgba(212,175,55,0.05)',
      }}>
        {[15, 35, 55, 75].map(p => (
          <div key={p} style={{
            position: 'absolute', left: 0, right: 0,
            top: `${p}%`, height: '1px',
            background: 'rgba(212,175,55,0.04)',
          }} />
        ))}
        {[15, 28, 42, 57, 71, 85].map(p => (
          <div key={p} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${p}%`, width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.025), transparent)',
          }} />
        ))}
      </div>

      {/* ── AMBIENT WALL SCONCES ── */}
      <div style={{ position: 'absolute', top: '10%', left: 0, width: '100px', bottom: '36%', background: 'linear-gradient(90deg, rgba(212,175,55,0.03), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '10%', right: 0, width: '100px', bottom: '36%', background: 'linear-gradient(270deg, rgba(212,175,55,0.03), transparent)', pointerEvents: 'none' }} />

      {/* ── UPLOAD HINT ── */}
      <div style={{
        position: 'absolute', top: '8px', left: '8px',
        background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.18)',
        borderRadius: '4px', padding: '4px 10px',
        color: 'rgba(212,175,55,0.4)', fontSize: '9px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        pointerEvents: 'none', zIndex: 20,
      }}>
        Preview — upload boutique image to replace
      </div>
    </div>
  );
}