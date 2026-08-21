import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Story slide data based on current store status
const SLIDES = [
  {
    id: 'launch',
    label: '🔥 Store is OPEN',
    emoji: '🔥',
    bg: 'linear-gradient(145deg, #0a0a0a 0%, #1a0a00 40%, #2a1200 100%)',
    accent: '#f5d06e',
    content: {
      eyebrow: 'OFFICIAL MERCH',
      headline: 'THE STORE IS OPEN',
      sub: 'Gannon Waye · Official Merch',
      body: 'Limited stock. Shipping Australia-wide.\nLink in bio 👇',
      cta: 'SHOP NOW → gannonwaye.com/store',
    }
  },
  {
    id: 'hoodie',
    label: '⚡ Hoodie — Get In Fast',
    emoji: '⚡',
    bg: 'linear-gradient(145deg, #060606 0%, #141414 50%, #1c1208 100%)',
    accent: '#f5d06e',
    content: {
      eyebrow: '⚡ STOCK RUNNING OUT',
      headline: '"Respect Is Earned"\nHoodie — $89',
      sub: 'Dark Grey · Premium Heavyweight',
      body: 'New shipment on its way.\nBut get in fast before this one sells out.\nSizes going QUICK.',
      cta: 'GRAB YOURS → gannonwaye.com/store',
      badge: '⚡ LOW STOCK',
    }
  },
  {
    id: 'mug',
    label: '☕ Coffee Mug',
    emoji: '☕',
    bg: 'linear-gradient(145deg, #080608 0%, #100a0a 50%, #1a1008 100%)',
    accent: '#f5d06e',
    content: {
      eyebrow: 'IN STOCK',
      headline: '"Respect Is Earned"\nCoffee Mug',
      sub: 'Official Gannon Waye · Signature Edition',
      body: 'Every morning deserves a reminder.\nYour coffee just got an upgrade. ☕',
      cta: 'ADD TO CART → gannonwaye.com/store',
    }
  },
  {
    id: 'bundle',
    label: '🎨 Journal Bundle — Coming Soon',
    emoji: '🎨',
    bg: 'linear-gradient(145deg, #050508 0%, #0a0a14 50%, #141020 100%)',
    accent: '#c9a0dc',
    content: {
      eyebrow: '🎨 COMING SOON',
      headline: 'New Design\nJournal Bundle',
      sub: 'Journal · Pen · Thermos Flask · $49',
      body: 'New design underway.\nComing to you soon.\nThe ultimate creative kit.',
      cta: 'STAY TUNED → gannonwaye.com/store',
      badge: '🎨 NEW DESIGN',
    }
  },
  {
    id: 'sold_out_cds',
    label: '💿 CDs Sold Out',
    emoji: '💿',
    bg: 'linear-gradient(145deg, #060606 0%, #0a0808 50%, #141010 100%)',
    accent: '#ef4444',
    content: {
      eyebrow: '💿 SOLD OUT',
      headline: '"Thank You" CDs\nAre GONE 🤍',
      sub: 'Both editions sold out — thank you.',
      body: 'The love has been INSANE.\nThank you to everyone who grabbed one.\nMore music coming — stay close.',
      cta: 'FOLLOW THE JOURNEY → @gann0nwaye',
    }
  },
  {
    id: 'sold_out_tshirt',
    label: '👕 T-Shirt Sold Out',
    emoji: '👕',
    bg: 'linear-gradient(145deg, #060606 0%, #100808 50%, #160a0a 100%)',
    accent: '#ef4444',
    content: {
      eyebrow: '👕 SOLD OUT',
      headline: '"Respect Is Earned"\nTee — SOLD OUT',
      sub: 'Oversized Premium Tee · $49',
      body: 'It went fast — and we love that.\nThank you for the support.\nMore drops coming soon.',
      cta: 'STAY TUNED → gannonwaye.com/store',
    }
  },
  {
    id: 'winter_bundle',
    label: '❄️ Winter Bundle — $129',
    emoji: '❄️',
    bg: 'linear-gradient(145deg, #050810 0%, #0a0f1a 50%, #141824 100%)',
    accent: '#f5d06e',
    content: {
      eyebrow: '❄️ LIMITED TIME · WINTER 2026',
      headline: 'Winter Writing\n& Comfort Bundle',
      sub: 'Hoodie + Journal + Thermo + Pen · $129',
      body: 'Stay warm, write what matters.\nThis bundle was made for the quiet moments.\nLimited. Once it\'s gone, it\'s gone.',
      cta: 'GET THE BUNDLE → gannonwaye.com/store',
      badge: '❄️ LIMITED',
    }
  },
  {
    id: 'poster',
    label: '🖼️ Respect Is Earned Poster',
    emoji: '🖼️',
    bg: 'linear-gradient(145deg, #080604 0%, #120c04 50%, #1a1204 100%)',
    accent: '#f5d06e',
    content: {
      eyebrow: '🖼️ MADE TO ORDER',
      headline: '"Respect Is Earned"\nLyric Wall Poster',
      sub: 'A3 · A2 · 18×24 inch · From $39',
      body: 'A premium collector piece.\nFor your wall. For your reminder.\nYour self-worth in print.',
      cta: 'ORDER YOURS → gannonwaye.com/store',
      badge: '🎨 COLLECTOR',
    }
  },
  {
    id: 'announcement',
    label: '🤍 THANKYOU Announcement',
    emoji: '🤍',
    bg: 'linear-gradient(145deg, #060608 0%, #0c0a0c 50%, #140e10 100%)',
    accent: '#f5d06e',
    content: {
      eyebrow: '🤍 A MESSAGE FROM GANNON',
      headline: 'THANKYOU\nFor Everything',
      sub: '',
      body: 'The stories you\'ve trusted me with.\nThe warmth you\'ve shown.\nIt\'s surreal. It\'s everything.\n\nThe safe space is open — come in.',
      cta: 'JOIN US → gannonwaye.com/community',
    }
  },
  {
    id: 'full_lineup',
    label: '🛍️ Full Lineup',
    emoji: '🛍️',
    bg: 'linear-gradient(145deg, #080608 0%, #0f0a08 50%, #181004 100%)',
    accent: '#f5d06e',
    content: {
      eyebrow: 'GANNON WAYE MERCH',
      headline: 'What\'s Available\nRight Now 👇',
      sub: '',
      items: [
        { label: '⚡ Hoodie "Respect Is Earned"', price: '$89', status: 'LOW STOCK' },
        { label: '❄️ Winter Bundle', price: '$129', status: 'LIMITED' },
        { label: '🖼️ Poster — Lyric Wall Art', price: 'From $39', status: 'ORDER NOW' },
        { label: '☕ Coffee Mug', price: '$9.90', status: 'IN STOCK' },
        { label: '💿 CDs', price: '$10–$20', status: 'SOLD OUT' },
        { label: '👕 Tee / Tote', price: '', status: 'SOLD OUT' },
      ],
      cta: 'SHOP NOW → gannonwaye.com/store',
    }
  },
];

function StoryPreview({ slide }) {
  const c = slide.content;

  return (
    <div
      className="relative overflow-hidden flex flex-col justify-between"
      style={{
        width: 320,
        height: 568,
        background: slide.bg,
        borderRadius: 24,
        padding: '32px 28px 36px',
        boxShadow: `0 0 60px ${slide.accent}22, 0 24px 80px rgba(0,0,0,0.8)`,
        border: `1px solid ${slide.accent}22`,
        flexShrink: 0,
      }}
    >
      {/* Decorative glow */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
        background: `radial-gradient(circle, ${slide.accent}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Top */}
      <div>
        {/* Profile row */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full border-2 overflow-hidden" style={{ borderColor: slide.accent }}>
            <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dc8919b4b_IMG_5624.png" alt="Gannon" className="w-full h-full object-cover" />
          </div>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 600, letterSpacing: '0.02em' }}>gann0nwaye</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>Official · gannonwaye.com</p>
          </div>
          {slide.content.badge && (
            <div className="ml-auto" style={{
              background: `${slide.accent}22`, border: `1px solid ${slide.accent}55`,
              borderRadius: 20, padding: '3px 8px',
              fontFamily: 'Inter, sans-serif', fontSize: 8, color: slide.accent, fontWeight: 700,
              letterSpacing: '0.1em',
            }}>
              {slide.content.badge}
            </div>
          )}
        </div>

        {/* Eyebrow */}
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 9, letterSpacing: '0.35em',
          color: `${slide.accent}88`, fontWeight: 700, textTransform: 'uppercase',
          marginBottom: 8,
        }}>{c.eyebrow}</p>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 28, lineHeight: 1.15, fontWeight: 700,
          color: slide.accent === '#ef4444' ? '#ef4444' : 'rgba(255,255,255,0.92)',
          whiteSpace: 'pre-line', marginBottom: 12,
        }}>{c.headline}</h2>

        {/* Sub */}
        {c.sub && (
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 11, color: `${slide.accent}70`,
            letterSpacing: '0.08em', marginBottom: 16,
          }}>{c.sub}</p>
        )}

        {/* Line */}
        <div style={{ width: 40, height: 2, background: slide.accent, borderRadius: 2, marginBottom: 16, opacity: 0.5 }} />

        {/* Body */}
        {c.body && (
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.60)',
            lineHeight: 1.6, whiteSpace: 'pre-line',
          }}>{c.body}</p>
        )}

        {/* Items list */}
        {c.items && (
          <div className="space-y-2 mt-2">
            {c.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.70)' }}>{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.price && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: slide.accent, fontWeight: 600 }}>{item.price}</span>}
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 8, fontWeight: 700,
                    color: item.status === 'SOLD OUT' ? '#ef4444' : item.status === 'IN STOCK' ? '#4ade80' : item.status === 'LOW STOCK' ? '#f5d06e' : '#c9a0dc',
                    letterSpacing: '0.1em',
                  }}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA bottom */}
      <div>
        <div style={{
          background: `linear-gradient(135deg, ${slide.accent}22 0%, ${slide.accent}08 100%)`,
          border: `1px solid ${slide.accent}44`,
          borderRadius: 12, padding: '12px 16px', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 11, color: slide.accent,
            fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>{c.cta}</p>
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.20)',
          textAlign: 'center', marginTop: 8, letterSpacing: '0.15em',
        }}>GANNONWAYE.COM</p>
      </div>
    </div>
  );
}

function CopyBox({ slide }) {
  const { toast } = useToast();
  const c = slide.content;

  const caption = [
    c.eyebrow,
    '',
    c.headline?.replace(/\n/g, ' '),
    c.sub,
    '',
    c.body,
    '',
    c.cta,
    '',
    '#GannonWaye #RespectIsEarned #ThankYou #IndieMusic #AustralianMusic #MerchDrop #MusicMerch #NewMusic',
  ].filter(l => l !== undefined).join('\n');

  return (
    <div className="bg-card/40 border border-border/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-body text-xs text-muted-foreground/60 uppercase tracking-wider">Caption Copy</p>
        <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(caption); toast({ title: 'Caption copied!' }); }}>
          <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
        </Button>
      </div>
      <pre className="font-body text-xs text-foreground/70 whitespace-pre-wrap leading-relaxed bg-secondary/30 rounded-lg p-3 max-h-48 overflow-y-auto">
        {caption}
      </pre>
    </div>
  );
}

export default function InstagramStoryStudio() {
  const [activeSlide, setActiveSlide] = useState(SLIDES[0]);
  const { toast } = useToast();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">Instagram Story Studio</h1>
        <p className="font-body text-sm text-muted-foreground/60">Ready-to-post story slides to ignite excitement for the merch store</p>
      </div>

      {/* Alert bar */}
      <div className="flex items-start gap-3 bg-primary/10 border border-primary/30 rounded-xl p-4">
        <Flame className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <div className="font-body text-sm text-foreground/80">
          <strong className="text-primary">How to use:</strong> Pick a slide, screenshot the preview on the right (or use the copy button for the caption), then post directly to your Instagram stories. Each slide is sized at 9:16 story format.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slide selector */}
        <div className="space-y-2">
          <p className="font-body text-xs text-muted-foreground/60 uppercase tracking-wider mb-3">Choose a Slide</p>
          {SLIDES.map(slide => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(slide)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all font-body text-sm ${activeSlide.id === slide.id ? 'border-primary bg-primary/10 text-primary' : 'border-border/30 text-foreground/70 hover:border-primary/30 hover:bg-card/60'}`}
            >
              {slide.label}
            </button>
          ))}

          <div className="mt-6">
            <CopyBox slide={activeSlide} />
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 flex flex-col items-center gap-6">
          <p className="font-body text-xs text-muted-foreground/40 uppercase tracking-wider">Story Preview (9:16)</p>
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <StoryPreview slide={activeSlide} />
          </motion.div>
          <p className="font-body text-[10px] text-muted-foreground/30 text-center max-w-xs">
            Screenshot this preview on mobile to use as your Instagram Story, or copy the caption text to paste into Instagram.
          </p>
        </div>
      </div>

      {/* All slides preview strip */}
      <div>
        <p className="font-body text-xs text-muted-foreground/60 uppercase tracking-wider mb-4">All Slides — Quick View</p>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {SLIDES.map(slide => (
            <div
              key={slide.id}
              onClick={() => setActiveSlide(slide)}
              className={`cursor-pointer transition-all flex-shrink-0 ${activeSlide.id === slide.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-2xl' : 'opacity-60 hover:opacity-80'}`}
              style={{ transform: 'scale(0.35)', transformOrigin: 'top left', width: 112, height: 199, marginRight: -96, marginBottom: -160 }}
            >
              <StoryPreview slide={slide} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}