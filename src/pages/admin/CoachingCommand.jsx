import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, AlertTriangle, BookOpen, Users, Calendar, FileText, Heart, Music, Star, ChevronRight, Shield, Eye, EyeOff } from 'lucide-react';

// GLOBAL LOCK — Coaching is NEVER public until Gannon explicitly enables this
const COACHING_PUBLIC_LAUNCH_ENABLED = false;

const PROGRAMS = [
  { name: 'Clarity Reset Session', type: 'Single Session', price: null, status: 'Draft', desc: '1:1 session to cut through noise and get clear on the next move.' },
  { name: '4-Week Mindset Rebuild', type: 'Short Program', price: null, status: 'Draft', desc: 'Four structured weeks of emotional resilience and self-leadership.' },
  { name: '8-Week Emotional Rebuilding Mentorship', type: 'Core Program', price: null, status: 'Draft', desc: 'Deep-dive mentorship through identity, confidence, and creative reawakening.' },
  { name: 'Artist / Creator Mindset Mentorship', type: 'Specialty', price: null, status: 'Draft', desc: 'Built for artists navigating visibility, rejection, and creative blocks.' },
  { name: 'VIP Intensive', type: 'Premium', price: null, status: 'Draft', desc: 'Immersive half-day or full-day intensive for rapid clarity and direction.' },
];

const DOCUMENTS = [
  { name: 'Coaching Service Agreement', status: 'Draft', review: 'Professional Review Recommended' },
  { name: 'Client Consent Form', status: 'Draft', review: 'Professional Review Recommended' },
  { name: 'Client Waiver', status: 'Draft', review: 'Professional Review Recommended' },
  { name: 'Privacy Notice', status: 'Draft', review: 'Needs Review' },
  { name: 'Cancellation Policy', status: 'Draft', review: 'Needs Review' },
  { name: 'Payment Policy', status: 'Draft', review: 'Needs Review' },
  { name: 'Scope of Practice', status: 'Draft', review: 'Professional Review Recommended' },
  { name: 'Emergency / Crisis Disclaimer', status: 'Draft', review: 'Professional Review Recommended' },
  { name: 'Meditation Disclaimer', status: 'Draft', review: 'Needs Review' },
  { name: 'Subscription Terms', status: 'Draft', review: 'Needs Review' },
  { name: 'Testimonial Consent', status: 'Draft', review: 'Needs Review' },
  { name: 'Client Data Handling Notice', status: 'Draft', review: 'Professional Review Recommended' },
];

const LAUNCH_GATES = [
  { label: 'Design approved by Gannon', done: false },
  { label: 'Legal wording reviewed by professional', done: false },
  { label: 'All documents approved', done: false },
  { label: 'Client dashboard tested', done: false },
  { label: 'Payment flow tested (no live charges yet)', done: false },
  { label: 'Resources reviewed by Gannon', done: false },
  { label: 'Meditations reviewed by Gannon', done: false },
  { label: 'Music site still working after integration', done: false },
  { label: 'Gannon clicks final launch approval', done: false },
];

const MODES = [
  { key: 'music', label: 'Music Public Mode', desc: 'Only music site is public. Coaching hidden.', active: true },
  { key: 'staging', label: 'Coaching Staging Mode', desc: 'Coaching is internal only. Nothing public.', active: false },
  { key: 'preview', label: 'Integrated Preview Mode', desc: 'Admin-only preview of combined experience.', active: false },
  { key: 'live', label: 'Coaching Live Mode', desc: 'LOCKED — requires all launch gates passed.', active: false, locked: true },
];

function StatusBadge({ status }) {
  const c = status === 'Professional Review Recommended' ? 'bg-red-500/20 text-red-300' :
    status === 'Needs Review' ? 'bg-yellow-500/20 text-yellow-300' :
    status === 'Approved Internally' ? 'bg-green-500/20 text-green-300' : 'bg-secondary text-muted-foreground';
  return <Badge className={`text-xs ${c}`}>{status}</Badge>;
}

export default function CoachingCommand() {
  const [showPrograms, setShowPrograms] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const gatesPassed = LAUNCH_GATES.filter(g => g.done).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Coaching Command</h1>
          <p className="text-sm text-muted-foreground mt-1">Private staging only — not public</p>
        </div>
      </div>

      {/* GLOBAL LOCK BANNER */}
      <Card className="border-red-500/40 bg-red-500/5">
        <CardContent className="p-5 flex items-start gap-3">
          <Lock className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-300 text-base">COACHING_PUBLIC_LAUNCH_ENABLED = {String(COACHING_PUBLIC_LAUNCH_ENABLED)}</p>
            <p className="text-sm text-red-200/80 mt-1">
              All coaching pages are private. Nothing is visible in public navigation. No coaching payments are accepted. No client registrations are open. No resources or meditations are published. This lock cannot be removed without Gannon's explicit final approval.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mode selector */}
      <Card>
        <CardHeader><CardTitle className="text-base">Publication Mode</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {MODES.map(m => (
            <div key={m.key} className={`rounded-xl border p-4 ${m.active ? 'border-primary/50 bg-primary/5' : 'border-border'} ${m.locked ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                {m.locked ? <Lock className="w-3 h-3 text-red-400" /> : m.active ? <Eye className="w-3 h-3 text-green-400" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                <p className={`text-xs font-bold ${m.active ? 'text-primary' : 'text-foreground'}`}>{m.label}</p>
              </div>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
              {m.active && <Badge className="mt-2 text-xs bg-green-500/20 text-green-400">ACTIVE</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Launch Readiness Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Coaching Launch Readiness Score
            <span className="text-sm font-normal text-muted-foreground">{gatesPassed}/{LAUNCH_GATES.length} gates passed</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="w-full bg-secondary rounded-full h-2 mb-4">
            <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${(gatesPassed / LAUNCH_GATES.length) * 100}%` }} />
          </div>
          {LAUNCH_GATES.map((g, i) => (
            <div key={i} className="flex items-center gap-3 text-sm py-1">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${g.done ? 'bg-green-500/20 border-green-500/40' : 'border-border'}`}>
                {g.done && <span className="text-green-400 text-xs">✓</span>}
              </div>
              <span className={g.done ? 'text-green-400' : 'text-muted-foreground'}>{g.label}</span>
            </div>
          ))}
          <div className="mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/5">
            <p className="text-xs text-red-300 font-semibold">🔒 Coaching Live Mode is locked until ALL {LAUNCH_GATES.length} gates are passed.</p>
          </div>
        </CardContent>
      </Card>

      {/* Admin-only navigation to staging sub-pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { to: '/admin/coaching-programs', icon: BookOpen, label: 'Programs (Staging)', desc: 'View/edit draft coaching programs' },
          { to: '/admin/coaching-legal', icon: Shield, label: 'Legal Documents', desc: 'Draft contracts, waivers, disclaimers' },
          { to: '/admin/coaching-launch-control', icon: Lock, label: 'Launch Control', desc: 'Final gate checklist and launch approval' },
          { to: '/admin/coaching-content-library', icon: FileText, label: 'Content Library', desc: 'Private resources and reflection tools' },
          { to: '/admin/meditation-library', icon: Heart, label: 'Meditation Library', desc: 'Private meditations — not published' },
          { to: '/admin/client-management', icon: Users, label: 'Client Management', desc: 'Draft client dashboard and CRM' },
          { to: '/admin/appointment-scheduler', icon: Calendar, label: 'Session Scheduler', desc: 'Draft booking/appointment system' },
          { to: '/admin/coaching-roi', icon: Star, label: 'Coaching ROI', desc: 'Revenue potential and program pricing' },
          { to: '/admin/coaching-sales-funnel', icon: Music, label: 'Sales Funnel (Draft)', desc: 'Funnel stages — not live' },
        ].map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to}>
            <Card className="hover:border-primary/40 cursor-pointer transition-colors h-full">
              <CardContent className="p-4 flex items-start gap-3">
                <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 mt-0.5" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Coaching Programs (Draft — {PROGRAMS.length} total)</span>
            <Button variant="ghost" size="sm" onClick={() => setShowPrograms(!showPrograms)}>{showPrograms ? 'Hide' : 'Show'}</Button>
          </CardTitle>
        </CardHeader>
        {showPrograms && (
          <CardContent className="space-y-3">
            {PROGRAMS.map(p => (
              <div key={p.name} className="border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.type} · Price: TBD</p>
                  </div>
                  <Badge className="text-xs bg-secondary text-muted-foreground shrink-0">{p.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Legal Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Legal Documents ({DOCUMENTS.length} draft)</span>
            <Button variant="ghost" size="sm" onClick={() => setShowDocs(!showDocs)}>{showDocs ? 'Hide' : 'Show'}</Button>
          </CardTitle>
        </CardHeader>
        {showDocs && (
          <CardContent className="space-y-2">
            {DOCUMENTS.map(d => (
              <div key={d.name} className="flex items-center justify-between gap-3 border border-border rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <Badge className="text-xs bg-secondary text-muted-foreground mt-1">{d.status}</Badge>
                </div>
                <StatusBadge status={d.review} />
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Public routes staged but locked */}
      <Card className="border-yellow-500/20 bg-yellow-500/3">
        <CardHeader><CardTitle className="text-base text-yellow-400">Staged Public Routes (All Locked)</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {['/coaching', '/mindset-mentorship', '/emotional-rebuilding', '/coaching-programs', '/book-coaching', '/client-login', '/client-dashboard', '/resources', '/meditations', '/reflection-library', '/client-consent', '/client-waiver'].map(r => (
              <div key={r} className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/20 rounded-lg px-3 py-2">
                <Lock className="w-3 h-3 text-yellow-400 shrink-0" />
                <span className="font-mono">{r}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-yellow-300/80 mt-3">These routes are NOT accessible to the public. They will only be activated after all launch gates are passed and Gannon clicks final approval.</p>
        </CardContent>
      </Card>

      {/* Positioning guide */}
      <Card>
        <CardHeader><CardTitle className="text-base">Positioning Language Guide</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-green-400 mb-2">✅ Use these terms</p>
              <ul className="space-y-1 text-xs text-foreground/80">
                {['coaching', 'mentoring', 'education', 'reflection', 'emotional rebuilding', 'confidence', 'creative confidence', 'self-leadership', 'life direction', 'habits', 'goals', 'mindset'].map(t => <li key={t} className="flex items-center gap-2"><span className="text-green-400">•</span>{t}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-red-400 mb-2">❌ Never claim these</p>
              <ul className="space-y-1 text-xs text-foreground/80">
                {['therapy', 'counselling', 'psychology', 'medical treatment', 'diagnosis', 'trauma treatment', 'cure', 'crisis support'].map(t => <li key={t} className="flex items-center gap-2"><span className="text-red-400">•</span>{t}</li>)}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-secondary/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Professional review is recommended</strong> for all legal documents, scope of practice statements, and public-facing disclaimers before any coaching offering goes live. This system does not provide legal or medical advice — it is an internal operational tool only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}