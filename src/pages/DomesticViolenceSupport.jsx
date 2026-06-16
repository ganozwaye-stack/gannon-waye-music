import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

// Inject noindex meta when this page mounts
function NoIndexMeta() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    meta.id = 'dv-noindex';
    document.head.appendChild(meta);
    return () => { document.getElementById('dv-noindex')?.remove(); };
  }, []);
  return null;
}

const COLORS = {
  bg: '#0d1a0d',
  card: '#112011',
  border: '#1e3a1e',
  text: '#f5f0e8',
  muted: '#b8c8b0',
  accent: '#5a9a5a',
  accentLight: '#7dbb7d',
  danger: '#e05555',
};

const CONTACTS = [
  { name: '000', desc: 'Emergency Services', tel: '000', always: true },
  { name: '1800RESPECT', desc: '1800 737 732 — 24/7 national counselling', tel: '1800737732', url: 'https://www.1800respect.org.au' },
  { name: 'Lifeline', desc: '13 11 14 — Crisis support', tel: '131114', url: 'https://www.lifeline.org.au' },
  { name: 'Safe Steps', desc: '1800 015 188 — Family violence response', tel: '1800015188', url: 'https://www.safesteps.org.au' },
  { name: 'MensLine', desc: '1300 789 978 — Support for men', tel: '1300789978', url: 'https://mensline.org.au' },
  { name: 'QLife', desc: '1800 184 527 — LGBTQIA+ peer support', tel: '1800184527', url: 'https://qlife.org.au' },
];

const SECTIONS = [
  {
    title: 'Understanding Domestic Violence',
    content: `Domestic and family violence takes many forms — physical, emotional, financial, sexual, and technological. It can happen to anyone, regardless of gender, age, background, or relationship type. If you feel afraid of a partner or family member, controlled, isolated, or unsafe — what you're experiencing is real and it is not your fault.`,
  },
  {
    title: 'Safety Planning',
    content: `A safety plan helps you prepare for when you need to leave quickly or stay safe at home.\n\n• Keep important documents (ID, passport, Medicare) in a safe or accessible place\n• Have a trusted person you can call at any time\n• Know your local police station address and number\n• If possible, have a bag ready with essentials (clothes, meds, money, charger)\n• Plan a safe route out of your home\n• Use a device the person you're afraid of doesn't have access to for searches and calls`,
  },
  {
    title: 'How to Leave Safely',
    content: `Leaving is often the most dangerous time, but support is available:\n\n• Call 1800RESPECT (1800 737 732) to speak to a specialist who can help you plan\n• Safe Steps (1800 015 188) can arrange emergency accommodation in Victoria\n• Police can issue Family Violence Safety Notices — you don't need a lawyer to get one\n• You can take your children with you when leaving\n• LGBTQIA+ specific support is available through QLife and 1800RESPECT`,
  },
  {
    title: 'Legal Options',
    content: `You have legal rights and protections:\n\n• Family Violence Intervention Orders (FVIOs) are available in all Australian states\n• You don't need to have been physically hurt to apply\n• Legal Aid is free — visit nationallegalaid.org or call your state's Legal Aid service\n• Police can apply for a safety notice on your behalf immediately\n• You can get advice confidentially — you don't have to make a formal statement to get information`,
  },
];

const RESOURCES = [
  { name: '1800RESPECT', url: 'https://www.1800respect.org.au', desc: 'National sexual assault, domestic and family violence counselling' },
  { name: 'Safe Steps (VIC)', url: 'https://www.safesteps.org.au', desc: '24/7 crisis response and emergency accommodation' },
  { name: 'DVVIC', url: 'https://www.dvvic.org.au', desc: 'Domestic Violence Victoria resources and support' },
  { name: 'National Legal Aid', url: 'https://www.nationallegalaid.org', desc: 'Free legal advice and services' },
  { name: 'QLife', url: 'https://qlife.org.au', desc: 'LGBTQIA+ peer support and referral' },
  { name: 'Safe and Equal', url: 'https://safeandequal.org.au', desc: 'Family violence sector resources and training' },
];

export default function DomesticViolenceSupport() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subDone, setSubDone] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  // Quick Exit — replaces history so back button doesn't return here
  const quickExit = () => {
    window.history.replaceState(null, '', 'https://www.gannonwaye.com');
    window.location.href = 'https://www.google.com';
  };

  // Keyboard shortcut: Escape = quick exit
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') quickExit(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubLoading(true);
    try {
      const existing = await base44.entities.EmailSubscriber.filter({ email });
      if (existing.length === 0) {
        await base44.entities.EmailSubscriber.create({
          email,
          source: 'dv-support',
          tags: ['dv-support'],
          is_active: true,
        });
      }
      setSubDone(true);
      setEmail('');
    } catch (err) {
      toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' });
    }
    setSubLoading(false);
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', color: COLORS.text, fontFamily: "'Georgia', serif" }}>
      <NoIndexMeta />

      {/* QUICK EXIT — always visible top-right */}
      <button
        onClick={quickExit}
        style={{
          position: 'fixed', top: '16px', right: '16px', zIndex: 9999,
          background: '#c0392b', color: '#fff',
          padding: '10px 18px', borderRadius: '8px',
          fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(192,57,43,0.5)',
          fontFamily: "'Georgia', serif",
        }}
        title="Quickly leave this page (also press Escape)"
      >
        ✕ Quick Exit
      </button>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: COLORS.accent, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Safe Resources
          </p>
          <h1 style={{ color: COLORS.text, fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.3 }}>
            You're Not Alone
          </h1>
          <p style={{ color: COLORS.muted, fontSize: '16px', lineHeight: 1.8, maxWidth: '540px', margin: '0 auto' }}>
            This is a discreet resource page. If you're in danger, call <strong style={{ color: COLORS.text }}>000</strong> immediately.
            Press <strong style={{ color: COLORS.text }}>Escape</strong> at any time to leave this page quickly.
          </p>
        </div>

        {/* Emergency contacts */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <p style={{ color: COLORS.accent, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>Emergency Contacts</p>
          <div style={{ display: 'grid', gap: '12px' }}>
            {CONTACTS.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${COLORS.border}` }}>
                <div>
                  <p style={{ color: COLORS.text, fontWeight: 700, margin: '0 0 3px', fontSize: '15px' }}>{c.name}</p>
                  <p style={{ color: COLORS.muted, fontSize: '13px', margin: 0 }}>{c.desc}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={`tel:${c.tel}`} style={{ background: COLORS.accent, color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 700 }}>
                    Call
                  </a>
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.muted, padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px' }}>
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info sections */}
        {SECTIONS.map((s, i) => (
          <div key={s.title} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '12px', marginBottom: '12px', overflow: 'hidden' }}>
            <button
              onClick={() => setOpenSection(openSection === i ? null : i)}
              style={{ width: '100%', textAlign: 'left', padding: '18px 20px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: COLORS.text, fontFamily: "'Georgia', serif' " }}
            >
              <span style={{ fontSize: '16px', fontWeight: 600 }}>{s.title}</span>
              <span style={{ color: COLORS.accent, fontSize: '20px', transition: 'transform 0.2s', transform: openSection === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
            </button>
            {openSection === i && (
              <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${COLORS.border}` }}>
                {s.content.split('\n').map((line, j) => (
                  <p key={j} style={{ color: COLORS.muted, fontSize: '15px', lineHeight: 1.85, margin: '12px 0 0' }}>{line}</p>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* External resources */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '24px', marginBottom: '32px', marginTop: '24px' }}>
          <p style={{ color: COLORS.accent, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>Further Support Resources</p>
          <div style={{ display: 'grid', gap: '10px' }}>
            {RESOURCES.map(r => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.border}`, borderRadius: '10px', textDecoration: 'none', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
              >
                <p style={{ color: COLORS.accentLight, fontWeight: 600, margin: '0 0 4px', fontSize: '14px' }}>{r.name} →</p>
                <p style={{ color: COLORS.muted, fontSize: '13px', margin: 0 }}>{r.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Discreet email signup */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <p style={{ color: COLORS.accent, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Stay Connected</p>
          <p style={{ color: COLORS.muted, fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
            Receive occasional resources and updates. <strong style={{ color: COLORS.text }}>Email communications are discreet</strong> — the sender name will appear as "Music Updates". You can unsubscribe at any time.
          </p>
          {!subDone ? (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ flex: 1, minWidth: '200px', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.border}`, borderRadius: '8px', color: COLORS.text, fontSize: '14px', outline: 'none', fontFamily: "'Georgia', serif" }}
              />
              <button
                type="submit"
                disabled={subLoading}
                style={{ padding: '12px 24px', background: COLORS.accent, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Georgia', serif" }}
              >
                {subLoading ? '...' : 'Subscribe'}
              </button>
            </form>
          ) : (
            <p style={{ color: COLORS.accentLight, fontSize: '14px' }}>✓ You're subscribed. Take good care of yourself.</p>
          )}
          <p style={{ color: '#555', fontSize: '11px', marginTop: '10px' }}>Your email is kept private and will never be shared.</p>
        </div>

        {/* Bottom note */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#444', fontSize: '12px', lineHeight: 1.7 }}>
            If you're in immediate danger, call <strong style={{ color: COLORS.text }}>000</strong>.<br />
            Press <strong style={{ color: COLORS.text }}>Escape</strong> or click "Quick Exit" to leave this page immediately.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{ marginTop: '16px', background: 'transparent', border: 'none', color: '#444', fontSize: '12px', cursor: 'pointer', fontFamily: "'Georgia', serif" }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}