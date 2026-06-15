/**
 * BoutiqueScene — generated CSS boutique interior.
 * Replaces itself automatically once BOUTIQUE_HERO_IMAGE is set in storeWorldConfig.js.
 *
 * Layout mirrors the approved concept:
 *   - Back wall: illuminated GANNON WAYE sign + poster feature wall (right)
 *   - Left rail: hoodie display
 *   - Centre: pedestal with Winter Bundle highlight
 *   - Right: mug / accessories shelf
 *   - Floor: warm wood planks
 *   - Far-left corner: Mum's Garden tribute nook with greenery
 */

const G = '#D4AF37';
const DIM = 'rgba(212,175,55,0.15)';

export default function BoutiqueScene() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '560px',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #0b0b0b 0%, #131008 55%, #1a1206 100%)',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── CEILING AMBIENT LIGHT ── */}
      <div style={{
        position: 'absolute', top: 0, left: '30%', right: '30%', height: '180px',
        background: `radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* ── BACK WALL ── */}
      <div style={{
        position: 'absolute',
        top: '4%', left: '8%', right: '8%', height: '58%',
        background: 'linear-gradient(180deg, #1a1610 0%, #111008 100%)',
        border: '1px solid rgba(212,175,55,0.08)',
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
          padding: '8px 28px 10px',
          border: `1px solid ${DIM}`,
          borderRadius: '3px',
          background: 'rgba(0,0,0,0.6)',
          boxShadow: `0 0 40px rgba(212,175,55,0.2), inset 0 0 20px rgba(212,175,55,0.05)`,
        }}>
          <div style={{
            fontSize: 'clamp(1rem, 3.2vw, 2rem)',
            fontWeight: 900,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            background: `linear-gradient(90deg, #B8860B, ${G}, #FFF8DC, ${G}, #B8860B)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
          }}>
            GANNON WAYE
          </div>
          <div style={{ fontSize: '8px', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '3px' }}>
            The Boutique
          </div>
        </div>
        {/* Sign glow strip */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${G}, transparent)`, marginTop: '4px', boxShadow: `0 0 10px rgba(212,175,55,0.8)` }} />
      </div>

      {/* ── POSTER FEATURE WALL (right side) ── */}
      <div style={{ position: 'absolute', top: '8%', right: '9%', width: '13%', bottom: '38%', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 4 }}>
        {/* Three poster frames */}
        {[
          { label: 'Respect Is Earned', h: '42%' },
          { label: 'Thankyou', h: '30%' },
          { label: 'Wall Poster A1', h: '22%' },
        ].map((p, i) => (
          <div key={i} style={{
            flex: i === 0 ? 3 : i === 1 ? 2 : 1.5,
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '2px',
            background: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.6)',
          }}>
            {/* Poster inner art area */}
            <div style={{
              position: 'absolute', inset: '6px',
              background: 'linear-gradient(135deg, #1e1408, #0a0800)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(212,175,55,0.06)',
            }}>
              <div style={{ color: 'rgba(212,175,55,0.25)', fontSize: '7px', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.5 }}>
                {p.label}
              </div>
            </div>
            {/* Gold badge */}
            <div style={{
              position: 'absolute', top: '4px', right: '4px',
              background: 'rgba(212,175,55,0.8)', color: '#111',
              fontSize: '5px', fontWeight: 800, letterSpacing: '0.06em',
              padding: '1px 4px', borderRadius: '2px', textTransform: 'uppercase',
            }}>LIMITED</div>
          </div>
        ))}
      </div>

      {/* ── LEFT HOODIE RAIL ── */}
      <div style={{ position: 'absolute', top: '30%', left: '9%', width: '14%', zIndex: 4 }}>
        {/* Rail bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, rgba(180,160,100,0.4), rgba(212,175,55,0.7), rgba(180,160,100,0.4))', borderRadius: '2px', boxShadow: '0 2px 6px rgba(212,175,55,0.3)', marginBottom: '6px' }} />
        {/* Hoodies hanging */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {['#2a2a2a', '#1e1e1e', '#232323'].map((c, i) => (
            <div key={i} style={{
              width: '22%',
              paddingBottom: '70%',
              position: 'relative',
              background: `linear-gradient(180deg, ${c} 0%, #111 100%)`,
              borderRadius: '2px 2px 4px 4px',
              boxShadow: '1px 2px 8px rgba(0,0,0,0.5)',
            }}>
              {/* Hanger top */}
              <div style={{
                position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
                width: '2px', height: '8px',
                background: 'rgba(212,175,55,0.5)',
              }} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '8px', color: 'rgba(212,175,55,0.4)', fontSize: '7px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Hoodies
        </div>
      </div>

      {/* ── CENTRE HERO PEDESTAL (Winter Bundle) ── */}
      <div style={{
        position: 'absolute',
        bottom: '35%', left: '50%', transform: 'translateX(-50%)',
        width: '22%', zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Gold spotlight glow */}
        <div style={{
          position: 'absolute', top: '-40px', left: '-30px', right: '-30px', height: '80px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Bundle items stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '100%' }}>
          {/* Journal */}
          <div style={{
            width: '55%', height: '12px',
            background: 'linear-gradient(90deg, #1a1200, #2a1f00, #1a1200)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '2px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ color: 'rgba(212,175,55,0.6)', fontSize: '5px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Journal</div>
          </div>
          {/* Thermos */}
          <div style={{
            width: '20%', height: '20px',
            background: 'linear-gradient(180deg, #1e1e1e, #0d0d0d)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '2px 2px 3px 3px',
          }} />
          {/* Pen */}
          <div style={{
            width: '60%', height: '4px',
            background: 'linear-gradient(90deg, #B8860B, #D4AF37, #B8860B)',
            borderRadius: '2px',
            boxShadow: '0 1px 4px rgba(212,175,55,0.4)',
          }} />
        </div>

        {/* Pedestal base */}
        <div style={{
          width: '80%', height: '10px',
          background: 'linear-gradient(180deg, #2a2010, #1a1208)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '0 0 3px 3px',
          marginTop: '4px',
          boxShadow: '0 4px 16px rgba(212,175,55,0.12)',
        }}>
        </div>

        {/* Label below */}
        <div style={{ textAlign: 'center', marginTop: '6px' }}>
          <div style={{ color: G, fontSize: '7px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Winter Bundle</div>
          <div style={{ color: '#555', fontSize: '6px', letterSpacing: '0.08em' }}>$129 + postage</div>
        </div>
      </div>

      {/* ── RIGHT ACCESSORIES SHELF (mug, CD) ── */}
      <div style={{ position: 'absolute', top: '36%', right: '24%', width: '12%', zIndex: 4 }}>
        {/* Shelf */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, rgba(180,140,60,0.3), rgba(212,175,55,0.5), rgba(180,140,60,0.3))', borderRadius: '1px', marginBottom: '4px' }} />
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
          {/* Mug */}
          <div style={{ width: '36%', position: 'relative' }}>
            <div style={{
              paddingBottom: '100%',
              background: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)',
              border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: '2px 2px 4px 4px',
              position: 'relative',
              boxShadow: '1px 2px 6px rgba(0,0,0,0.4)',
            }}>
              {/* Handle */}
              <div style={{
                position: 'absolute', right: '-3px', top: '20%',
                width: '4px', height: '30%',
                border: '1px solid rgba(212,175,55,0.2)',
                borderLeft: 'none',
                borderRadius: '0 2px 2px 0',
              }} />
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(212,175,55,0.3)', fontSize: '5px', marginTop: '2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Mug</div>
          </div>
          {/* CD stack */}
          <div style={{ width: '36%' }}>
            <div style={{
              paddingBottom: '120%',
              background: 'linear-gradient(135deg, #111, #0a0a0a)',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: '2px',
              boxShadow: '1px 2px 6px rgba(0,0,0,0.4)',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(212,175,55,0.25)', fontSize: '4px', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Sold Out</div>
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(212,175,55,0.3)', fontSize: '5px', marginTop: '2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>CD</div>
          </div>
        </div>
      </div>

      {/* ── MUM'S GARDEN TRIBUTE CORNER (far left) ── */}
      <div style={{
        position: 'absolute',
        bottom: '36%', left: '9%', width: '10%',
        zIndex: 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
      }}>
        {/* Greenery blobs */}
        <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
          {[20, 28, 18].map((h, i) => (
            <div key={i} style={{
              width: '28%', height: `${h}px`,
              background: `radial-gradient(ellipse at 50% 70%, rgba(34,60,20,0.9) 0%, rgba(15,30,10,0.7) 100%)`,
              borderRadius: '50% 50% 20% 20%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }} />
          ))}
        </div>
        {/* Small framed photo */}
        <div style={{
          width: '60%', paddingBottom: '65%', position: 'relative',
          border: '1px solid rgba(255,210,160,0.3)',
          background: 'linear-gradient(135deg, #1a0f00, #0d0800)',
          borderRadius: '2px',
          boxShadow: '0 2px 10px rgba(255,200,150,0.1)',
        }}>
          <div style={{
            position: 'absolute', inset: '3px',
            background: 'rgba(255,210,160,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ color: 'rgba(255,210,160,0.3)', fontSize: '10px' }}>♡</div>
          </div>
        </div>
        <div style={{ color: 'rgba(255,210,160,0.35)', fontSize: '6px', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.4 }}>
          Mum's<br />Garden
        </div>
      </div>

      {/* ── FLOOR ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%',
        background: 'linear-gradient(180deg, #0e0b06 0%, #1a1308 60%, #0d0a04 100%)',
        borderTop: '1px solid rgba(212,175,55,0.06)',
      }}>
        {/* Floor plank lines */}
        {[15, 35, 55, 75].map(p => (
          <div key={p} style={{
            position: 'absolute', left: 0, right: 0,
            top: `${p}%`, height: '1px',
            background: 'rgba(212,175,55,0.04)',
          }} />
        ))}
        {/* Vertical plank lines (perspective effect) */}
        {[20, 35, 50, 65, 80].map(p => (
          <div key={p} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${p}%`, width: '1px',
            background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.03), transparent)',
          }} />
        ))}
      </div>

      {/* ── AMBIENT SIDE LIGHTS ── */}
      <div style={{
        position: 'absolute', top: '10%', left: 0, width: '120px', bottom: '38%',
        background: 'linear-gradient(90deg, rgba(212,175,55,0.04) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '10%', right: 0, width: '120px', bottom: '38%',
        background: 'linear-gradient(270deg, rgba(212,175,55,0.04) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── UPLOAD HINT OVERLAY ── */}
      <div style={{
        position: 'absolute', top: '8px', left: '8px',
        background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,175,55,0.2)',
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