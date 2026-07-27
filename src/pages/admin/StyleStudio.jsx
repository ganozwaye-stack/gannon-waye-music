import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  LayoutTemplate,
  Lock,
  Palette,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Type,
} from 'lucide-react';

const STORAGE_KEY = 'gwm-private-style-studio-drafts-v1';

const PAGE_OPTIONS = [
  { id: 'home', label: 'Home', eyebrow: 'Next single', title: 'Without You Here', copy: 'Your last breath took mine away. There is not much more I have to say.', image: '/images/home/gannon-waye-home-hero.png' },
  { id: 'music', label: 'Music', eyebrow: 'Gannon Waye Music', title: 'The releases', copy: 'Songs built from survival, family, love and the decision to keep going.', image: '/images/music/without-you-here-cover.png' },
  { id: 'story', label: 'My Story', eyebrow: 'About', title: 'The Story', copy: 'A singer-songwriter whose work turns lived experience into connection.', image: '/images/home/gannon-waye-home-hero.png' },
  { id: 'store', label: 'Store', eyebrow: 'Official merchandise', title: 'The collection', copy: 'Music, story and carefully chosen pieces made to carry the message forward.', image: '/images/store/neon-store-hero.png' },
  { id: 'mum', label: "Mum's Sky Foyer", eyebrow: 'Welcome to', title: "Sonia's Garden", copy: 'A living memorial to Sonia Katisa Waye. A place to remember her and carry her love forward.', image: '/images/mum/foyer/sonia-and-pa-16x9-poster.jpg' },
  { id: 'garden', label: "Sonia's Garden", eyebrow: "Mum's Garden", title: "Welcome to Sonia's Garden", copy: 'A soft walk through the garden light, family photographs, music and the ordinary details that made Sonia feel like home.', image: '/images/mum/mum_garden.jpg' },
];

const DEFAULT_STYLE = {
  typography: {
    display: 'Cormorant Garamond',
    body: 'Poppins',
    titleScale: 100,
    bodyScale: 100,
    lineHeight: 1.05,
  },
  colours: {
    cream: '#F8F3E8',
    softGold: '#DDB866',
    richGold: '#B88732',
    dark: '#0B1727',
    muted: '#DED8CC',
  },
  spacing: {
    density: 'balanced',
    sectionGap: 72,
    contentWidth: 1180,
  },
  buttons: {
    shape: 'pill',
    primary: 'metallic',
    height: 46,
  },
  cards: {
    radius: 8,
    opacity: 52,
    border: 46,
    shadow: 'cinematic',
  },
  sections: {
    hero: true,
    featureStrip: true,
    story: true,
    subscribe: true,
    merch: true,
    footer: true,
  },
  hero: {
    height: 86,
    treatment: 'cinematic',
    mediaPosition: 'center right',
    overlay: 64,
    motion: 'drift',
  },
};

const DEFAULT_RECORD = {
  status: 'draft',
  updatedAt: null,
  requestedAt: null,
  approvedAt: null,
  settings: DEFAULT_STYLE,
};

const clone = value => JSON.parse(JSON.stringify(value));

function loadRecords() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function statusLabel(status) {
  if (status === 'awaiting_approval') return 'Review requested';
  if (status === 'approved') return 'Approved draft';
  return 'Draft only';
}

function ControlGroup({ icon: Icon, title, children }) {
  return (
    <section className="border-t border-[#DDB866]/14 pt-5 first:border-t-0 first:pt-0">
      <h2 className="mb-4 flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#DDB866]">
        <Icon className="h-4 w-4" /> {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children, value }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-4 font-body text-xs text-[#DED8CC]/72">
        {label}{value != null && <span className="text-[#F8F3E8]">{value}</span>}
      </span>
      {children}
    </label>
  );
}

function Select({ value, onChange, children }) {
  return (
    <span className="relative block">
      <select value={value} onChange={onChange} className="h-10 w-full appearance-none rounded-md border border-[#DDB866]/18 bg-[#07101d] px-3 pr-9 font-body text-sm text-[#F8F3E8] outline-none transition focus:border-[#DDB866]/55">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#DDB866]/60" />
    </span>
  );
}

function Range({ value, min, max, step = 1, onChange }) {
  return <input type="range" value={value} min={min} max={max} step={step} onChange={onChange} className="h-1.5 w-full cursor-pointer accent-[#B88732]" />;
}

function ColourField({ label, value, onChange }) {
  return (
    <Field label={label} value={value.toUpperCase()}>
      <span className="flex h-10 items-center gap-3 rounded-md border border-[#DDB866]/18 bg-[#07101d] px-3">
        <input type="color" value={value} onChange={onChange} className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0" />
        <span className="font-mono text-xs text-[#DED8CC]/70">{value.toUpperCase()}</span>
      </span>
    </Field>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md px-1 py-1.5 font-body text-sm text-[#DED8CC]/78">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[#B88732]" />
    </label>
  );
}

function LivePreview({ page, settings }) {
  const radius = settings.buttons.shape === 'pill' ? 999 : settings.buttons.shape === 'square' ? 2 : 8;
  const previewStyle = {
    '--studio-cream': settings.colours.cream,
    '--studio-soft-gold': settings.colours.softGold,
    '--studio-rich-gold': settings.colours.richGold,
    '--studio-dark': settings.colours.dark,
    '--studio-muted': settings.colours.muted,
    '--studio-card-radius': `${settings.cards.radius}px`,
    '--studio-button-radius': `${radius}px`,
    '--studio-title-scale': settings.typography.titleScale / 100,
    '--studio-body-scale': settings.typography.bodyScale / 100,
  };

  return (
    <div className="h-full min-h-[640px] overflow-auto rounded-lg border border-[#DDB866]/20 bg-[#050a12] shadow-[0_30px_100px_rgba(0,0,0,0.5)]" style={previewStyle}>
      <div className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-white/8 bg-[#070d16]/92 px-5 backdrop-blur-md">
        <div className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--studio-soft-gold)]">GW</div>
        <div className="flex gap-4 font-body text-[9px] uppercase tracking-[0.14em] text-[var(--studio-muted)]/70">
          <span>Home</span><span>Music</span><span>Store</span><span>Contact</span>
        </div>
      </div>

      {settings.sections.hero && (
        <section className="relative overflow-hidden" style={{ minHeight: `${settings.hero.height}vh`, backgroundColor: settings.colours.dark }}>
          <img
            src={page.image}
            alt="Selected page hero preview"
            className={`absolute inset-0 h-full w-full ${settings.hero.treatment === 'editorial' ? 'object-contain' : 'object-cover'}`}
            style={{ objectPosition: settings.hero.mediaPosition }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, rgba(7,16,29,${settings.hero.overlay / 100}) 0%, rgba(7,16,29,${Math.max(0.1, settings.hero.overlay / 170)}) 48%, rgba(7,16,29,0.08) 76%, rgba(7,16,29,0.22) 100%)` }} />
          <div className="relative z-10 flex min-h-[inherit] max-w-[64%] flex-col justify-center px-[7%] py-16">
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--studio-soft-gold)]">{page.eyebrow}</p>
            <h1
              className="mt-4 leading-[0.93] text-[var(--studio-cream)] [text-shadow:0_4px_22px_rgba(0,0,0,0.74)]"
              style={{ fontFamily: settings.typography.display, fontSize: `calc(clamp(3rem, 7vw, 6.8rem) * var(--studio-title-scale))`, lineHeight: settings.typography.lineHeight }}
            >
              {page.title}
            </h1>
            <p className="mt-5 max-w-xl text-[var(--studio-muted)]" style={{ fontFamily: settings.typography.body, fontSize: `calc(0.95rem * var(--studio-body-scale))`, lineHeight: 1.7 }}>{page.copy}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#07101d]" style={{ height: settings.buttons.height, borderRadius: 'var(--studio-button-radius)', background: `linear-gradient(100deg, ${settings.colours.richGold}, ${settings.colours.softGold})`, fontFamily: settings.typography.body }}>Primary action</button>
              <button type="button" className="border px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--studio-cream)]" style={{ height: settings.buttons.height, borderRadius: 'var(--studio-button-radius)', borderColor: `${settings.colours.softGold}73`, background: 'rgba(7,16,29,0.42)', fontFamily: settings.typography.body }}>Secondary</button>
            </div>
          </div>
        </section>
      )}

      {settings.sections.featureStrip && (
        <section className="grid grid-cols-3 border-y border-[#DDB866]/14 bg-[#070d16]">
          {['The song', 'The story', 'The collection'].map((title, index) => (
            <div key={title} className="border-r border-[#DDB866]/12 px-5 py-5 last:border-r-0">
              <p className="font-body text-[8px] uppercase tracking-[0.2em] text-[var(--studio-soft-gold)]">0{index + 1}</p>
              <h3 className="mt-2 text-xl text-[var(--studio-cream)]" style={{ fontFamily: settings.typography.display }}>{title}</h3>
            </div>
          ))}
        </section>
      )}

      {settings.sections.story && (
        <section className="px-[7%]" style={{ paddingTop: settings.spacing.sectionGap, paddingBottom: settings.spacing.sectionGap, backgroundColor: settings.colours.dark }}>
          <p className="text-center font-body text-[9px] uppercase tracking-[0.3em] text-[var(--studio-soft-gold)]">About</p>
          <h2 className="mt-3 text-center text-5xl text-[var(--studio-cream)]" style={{ fontFamily: settings.typography.display }}>The Story</h2>
          <div className="mt-10 grid grid-cols-[1fr_0.72fr_1fr] gap-7 text-sm leading-7 text-[var(--studio-muted)]/75" style={{ fontFamily: settings.typography.body }}>
            <p>Music has always been more than sound. It is the language used to understand people, emotion and the parts of life that do not always have words.</p>
            <blockquote className="border-x border-[var(--studio-rich-gold)]/35 px-5 text-center italic text-[var(--studio-soft-gold)]">I did not want to be anyone else.</blockquote>
            <p className="text-right">The work is becoming an album: a collection for anyone who needs a message of hope or an anthem that reminds them they are not alone.</p>
          </div>
        </section>
      )}

      {settings.sections.subscribe && <div className="border-y border-white/8 bg-[#0b111a] px-[7%] py-10 text-center font-body text-sm text-[var(--studio-muted)]/70">Private preview of the subscription moment</div>}
      {settings.sections.merch && <div className="bg-[#070d16] px-[7%] py-16 text-center"><p className="font-body text-[9px] uppercase tracking-[0.3em] text-[var(--studio-soft-gold)]">Official merchandise</p><h2 className="mt-3 text-4xl text-[var(--studio-cream)]" style={{ fontFamily: settings.typography.display }}>The collection</h2></div>}
      {settings.sections.footer && <footer className="border-t border-white/8 bg-[#040810] px-[7%] py-8 font-body text-xs text-[var(--studio-muted)]/52">Gannon Waye Music</footer>}
    </div>
  );
}

export default function StyleStudio() {
  const [pageId, setPageId] = useState('home');
  const [records, setRecords] = useState(loadRecords);
  const [notice, setNotice] = useState('');
  const page = PAGE_OPTIONS.find(option => option.id === pageId) || PAGE_OPTIONS[0];
  const record = records[pageId] || clone(DEFAULT_RECORD);
  const settings = record.settings;

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const update = (group, key, value) => {
    setRecords(current => {
      const currentRecord = current[pageId] || clone(DEFAULT_RECORD);
      return {
        ...current,
        [pageId]: {
          ...currentRecord,
          status: 'draft',
          requestedAt: null,
          approvedAt: null,
          settings: {
            ...currentRecord.settings,
            [group]: { ...currentRecord.settings[group], [key]: value },
          },
        },
      };
    });
  };

  const saveDraft = () => {
    const next = {
      ...records,
      [pageId]: { ...(records[pageId] || clone(DEFAULT_RECORD)), updatedAt: new Date().toISOString() },
    };
    setRecords(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setNotice(`${page.label} saved as a private draft.`);
  };

  const resetDraft = () => {
    setRecords(current => ({ ...current, [pageId]: clone(DEFAULT_RECORD) }));
    setNotice(`${page.label} reset. Nothing was published.`);
  };

  const requestApproval = () => {
    const now = new Date().toISOString();
    const next = {
      ...records,
      [pageId]: { ...(records[pageId] || clone(DEFAULT_RECORD)), status: 'awaiting_approval', updatedAt: now, requestedAt: now, approvedAt: null },
    };
    setRecords(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setNotice('Review requested. Public publishing remains locked.');
  };

  const approveDraft = () => {
    const now = new Date().toISOString();
    const next = {
      ...records,
      [pageId]: { ...(records[pageId] || clone(DEFAULT_RECORD)), status: 'approved', updatedAt: now, approvedAt: now },
    };
    setRecords(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setNotice('Draft approved for implementation. It has not been published.');
  };

  const statusTone = useMemo(() => record.status === 'approved' ? 'border-emerald-400/30 text-emerald-300' : record.status === 'awaiting_approval' ? 'border-[#DDB866]/35 text-[#DDB866]' : 'border-white/12 text-[#DED8CC]/65', [record.status]);

  return (
    <div className="min-h-screen bg-[#060b13] pb-12 text-[#F8F3E8]">
      <header className="border-b border-[#DDB866]/14 bg-[#08101b] px-5 py-5 lg:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-[#DDB866]">Private owner tool</p>
            <h1 className="mt-1 font-display text-3xl text-[#F8F3E8]">Style Studio</h1>
            <p className="mt-1 font-body text-sm text-[#DED8CC]/58">Explore visually. Save privately. Approve before implementation.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.16em] ${statusTone}`}><Lock className="mr-1.5 inline h-3 w-3" />{statusLabel(record.status)}</span>
            <button type="button" onClick={resetDraft} className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-3 font-body text-xs text-[#DED8CC]/70 hover:border-[#DDB866]/35"><RotateCcw className="h-4 w-4" /> Reset</button>
            <button type="button" onClick={saveDraft} className="inline-flex h-10 items-center gap-2 rounded-md bg-[#F8F3E8] px-4 font-body text-xs font-semibold text-[#07101d]"><Save className="h-4 w-4" /> Save draft</button>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-136px)] lg:grid-cols-[370px_minmax(0,1fr)]">
        <aside className="border-r border-[#DDB866]/14 bg-[#08101b] p-5 lg:max-h-[calc(100vh-136px)] lg:overflow-y-auto">
          <div className="space-y-6">
            <ControlGroup icon={LayoutTemplate} title="Page">
              <Field label="Page to style"><Select value={pageId} onChange={event => setPageId(event.target.value)}>{PAGE_OPTIONS.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</Select></Field>
            </ControlGroup>

            <ControlGroup icon={Type} title="Typography">
              <Field label="Display type"><Select value={settings.typography.display} onChange={event => update('typography', 'display', event.target.value)}><option>Cormorant Garamond</option><option>Playfair Display</option><option>Poppins</option></Select></Field>
              <Field label="Body type"><Select value={settings.typography.body} onChange={event => update('typography', 'body', event.target.value)}><option>Poppins</option><option>Inter</option><option>Arial</option></Select></Field>
              <Field label="Title scale" value={`${settings.typography.titleScale}%`}><Range value={settings.typography.titleScale} min={70} max={130} onChange={event => update('typography', 'titleScale', Number(event.target.value))} /></Field>
              <Field label="Body scale" value={`${settings.typography.bodyScale}%`}><Range value={settings.typography.bodyScale} min={85} max={120} onChange={event => update('typography', 'bodyScale', Number(event.target.value))} /></Field>
              <Field label="Title line height" value={settings.typography.lineHeight}><Range value={settings.typography.lineHeight} min={0.85} max={1.3} step={0.01} onChange={event => update('typography', 'lineHeight', Number(event.target.value))} /></Field>
            </ControlGroup>

            <ControlGroup icon={Palette} title="Colours">
              <div className="grid grid-cols-2 gap-3"><ColourField label="Cream" value={settings.colours.cream} onChange={event => update('colours', 'cream', event.target.value)} /><ColourField label="Soft gold" value={settings.colours.softGold} onChange={event => update('colours', 'softGold', event.target.value)} /><ColourField label="Rich gold" value={settings.colours.richGold} onChange={event => update('colours', 'richGold', event.target.value)} /><ColourField label="Dark navy" value={settings.colours.dark} onChange={event => update('colours', 'dark', event.target.value)} /></div>
            </ControlGroup>

            <ControlGroup icon={SlidersHorizontal} title="Spacing">
              <Field label="Density"><Select value={settings.spacing.density} onChange={event => update('spacing', 'density', event.target.value)}><option value="compact">Compact</option><option value="balanced">Balanced</option><option value="open">Open</option></Select></Field>
              <Field label="Section space" value={`${settings.spacing.sectionGap}px`}><Range value={settings.spacing.sectionGap} min={32} max={140} onChange={event => update('spacing', 'sectionGap', Number(event.target.value))} /></Field>
              <Field label="Content width" value={`${settings.spacing.contentWidth}px`}><Range value={settings.spacing.contentWidth} min={900} max={1440} step={10} onChange={event => update('spacing', 'contentWidth', Number(event.target.value))} /></Field>
            </ControlGroup>

            <ControlGroup icon={Sparkles} title="Buttons and cards">
              <Field label="Button shape"><Select value={settings.buttons.shape} onChange={event => update('buttons', 'shape', event.target.value)}><option value="pill">Pill</option><option value="soft">Soft square</option><option value="square">Square</option></Select></Field>
              <Field label="Button height" value={`${settings.buttons.height}px`}><Range value={settings.buttons.height} min={38} max={58} onChange={event => update('buttons', 'height', Number(event.target.value))} /></Field>
              <Field label="Card radius" value={`${settings.cards.radius}px`}><Range value={settings.cards.radius} min={0} max={16} onChange={event => update('cards', 'radius', Number(event.target.value))} /></Field>
              <Field label="Glass opacity" value={`${settings.cards.opacity}%`}><Range value={settings.cards.opacity} min={15} max={85} onChange={event => update('cards', 'opacity', Number(event.target.value))} /></Field>
            </ControlGroup>

            <ControlGroup icon={ImageIcon} title="Hero and media">
              <Field label="Treatment"><Select value={settings.hero.treatment} onChange={event => update('hero', 'treatment', event.target.value)}><option value="cinematic">Cinematic full bleed</option><option value="editorial">Editorial contained</option><option value="minimal">Minimal portrait</option></Select></Field>
              <Field label="Media position"><Select value={settings.hero.mediaPosition} onChange={event => update('hero', 'mediaPosition', event.target.value)}><option value="center right">Right</option><option value="center center">Centre</option><option value="center left">Left</option><option value="50% 25%">Higher</option></Select></Field>
              <Field label="Hero height" value={`${settings.hero.height}vh`}><Range value={settings.hero.height} min={58} max={100} onChange={event => update('hero', 'height', Number(event.target.value))} /></Field>
              <Field label="Text overlay" value={`${settings.hero.overlay}%`}><Range value={settings.hero.overlay} min={20} max={90} onChange={event => update('hero', 'overlay', Number(event.target.value))} /></Field>
              <Field label="Motion"><Select value={settings.hero.motion} onChange={event => update('hero', 'motion', event.target.value)}><option value="none">None</option><option value="drift">Slow cinematic drift</option><option value="cinemagraph">Cinemagraph preview</option></Select></Field>
            </ControlGroup>

            <ControlGroup icon={Eye} title="Section visibility">
              {Object.entries(settings.sections).map(([key, visible]) => <Toggle key={key} checked={visible} onChange={event => update('sections', key, event.target.checked)} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, letter => letter.toUpperCase())} />)}
            </ControlGroup>

            <ControlGroup icon={ShieldCheck} title="Approval gate">
              <p className="font-body text-xs leading-5 text-[#DED8CC]/55">Saving never changes the public website. Request review when the visual direction is ready. Approval records the decision, but implementation remains separate.</p>
              <button type="button" onClick={requestApproval} disabled={record.status === 'awaiting_approval' || record.status === 'approved'} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#DDB866]/30 font-body text-xs font-semibold uppercase tracking-[0.12em] text-[#DDB866] disabled:cursor-not-allowed disabled:opacity-35"><Send className="h-4 w-4" /> Request approval</button>
              {record.status === 'awaiting_approval' && <button type="button" onClick={approveDraft} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#B88732] font-body text-xs font-semibold uppercase tracking-[0.12em] text-[#07101d]"><Check className="h-4 w-4" /> Approve this draft</button>}
              <button type="button" disabled className="inline-flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-white/5 font-body text-xs uppercase tracking-[0.12em] text-white/28"><Lock className="h-4 w-4" /> Public publishing locked</button>
            </ControlGroup>
          </div>
        </aside>

        <main className="min-w-0 bg-[#050910] p-4 md:p-6 lg:max-h-[calc(100vh-136px)] lg:overflow-y-auto">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-body text-xs text-[#DED8CC]/58"><Eye className="h-4 w-4 text-[#DDB866]" /> Live private preview</div>
            <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.14em] text-[#DED8CC]/42"><EyeOff className="h-3.5 w-3.5" /> Not public</div>
          </div>
          <LivePreview page={page} settings={settings} />
        </main>
      </div>

      {notice && <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-md border border-[#DDB866]/30 bg-[#07101d]/96 px-4 py-3 font-body text-sm text-[#F8F3E8] shadow-2xl backdrop-blur">{notice}</div>}
    </div>
  );
}
