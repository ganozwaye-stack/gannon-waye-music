import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Layers, BookOpen, Send, CheckCircle,
  Zap, Heart, Music, Star, Shield, Sunrise, Flame, Eye, ArrowRight
} from 'lucide-react';

const CONTENT_PILLARS = [
  { id: 1, icon: Heart, name: 'Self Worth', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', desc: 'Knowing your value without needing to earn it', hooks: ['Are you tired of proving your worth to people committed to misunderstanding you?', 'What if self respect is not anger, but the moment you stop abandoning yourself?'] },
  { id: 2, icon: Shield, name: 'Boundaries', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', desc: 'Protecting your peace without guilt', hooks: ['Have you been calling it love when it kept costing you your peace?', 'What if a boundary is not a wall — it is a door you control?'] },
  { id: 3, icon: Sunrise, name: 'Rebuilding After Painful Chapters', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', desc: 'Rising after the chapter that tried to erase you', hooks: ['What if the chapter that broke you was not the chapter that defines you?', 'You survived it. Now let\'s build something from it.'] },
  { id: 4, icon: Star, name: 'Creative Confidence', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', desc: 'Expressing yourself without apology', hooks: ['What if your voice was never the problem — the audience was?', 'You were born with something to say. What stopped you?'] },
  { id: 5, icon: Music, name: 'Music as Survival & Expression', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20', desc: 'How music carries what words alone cannot', hooks: ['Some songs are not written. They are survived.', 'Music was the only language that never judged me.'] },
  { id: 6, icon: Zap, name: 'The THANKYOU Movement', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', desc: 'The turning point. The line drawn. The thank you said.', hooks: ['Who are you saying THANKYOU to today?', 'THANKYOU is not gratitude. It is goodbye to what no longer serves you.'] },
  { id: 7, icon: Flame, name: 'Respect Is Earned', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', desc: 'Refusing to earn what was always yours', hooks: ['When did you realise respect is earned, not a game you make me play?', 'You stopped performing for people who would never applaud you.'] },
  { id: 8, icon: Eye, name: 'Still Here', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', desc: 'Proof that staying was the bravest thing', hooks: ['Still here. Still standing. Still choosing yourself.', 'Every day you wake up is evidence that you survived what tried to end you.'] },
  { id: 9, icon: Layers, name: 'From Shame to Self Respect', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', desc: 'The journey from hiding to being seen', hooks: ['From shame to self respect is not a straight line. It is a return.', 'Shame whispers. Self respect speaks clearly.'] },
  { id: 10, icon: CheckCircle, name: 'Practical Tools for Rebuilding', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', desc: 'Real frameworks for real change', hooks: ['Here is the one question I ask every client on day one.', 'The boundary script that changed everything for me.'] },
];

const CTA_TYPES = [
  { label: 'Book a Clarity Session', tag: 'booking', color: 'bg-primary/20 text-primary border-primary/30' },
  { label: 'Download the Free Workbook', tag: 'workbook', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { label: 'Join the THANKYOU List', tag: 'email', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { label: 'Shop the Merch', tag: 'merch', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { label: 'Listen to THANKYOU', tag: 'music', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { label: 'Start Your Self Respect Reset', tag: 'reset', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  { label: 'Work with Gannon', tag: 'coaching', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
];

const LEAD_MAGNETS = [
  { name: 'The Self Respect Reset Workbook', desc: 'Free download — email capture required', pillar: 'Self Worth', status: 'needs_design' },
  { name: 'The Boundary Builder Worksheet', desc: '1-page boundary script exercise', pillar: 'Boundaries', status: 'needs_design' },
  { name: 'The Thankyou Letter Exercise', desc: 'Write the letter you never sent', pillar: 'THANKYOU Movement', status: 'needs_design' },
  { name: 'Still Here Weekly Reflection', desc: '7-day check in for survivors', pillar: 'Still Here', status: 'needs_design' },
  { name: 'Creative Confidence Starter Guide', desc: '3 exercises to reclaim your voice', pillar: 'Creative Confidence', status: 'needs_design' },
];

const PAID_RESOURCES = [
  { name: 'Self Respect Reset Workbook', price: 'TBC', pages: '~30 pages', pillar: 'Self Worth' },
  { name: 'Boundaries After Breakdown Manual', price: 'TBC', pages: '~40 pages', pillar: 'Boundaries' },
  { name: 'Rebuild Your Voice Client Workbook', price: 'TBC', pages: '~35 pages', pillar: 'Rebuilding' },
  { name: 'Creative Confidence Coaching Manual', price: 'TBC', pages: '~45 pages', pillar: 'Creative Confidence' },
  { name: 'Four Week Self Worth Mentoring Workbook', price: 'TBC', pages: '~60 pages', pillar: 'Self Worth' },
  { name: 'Six Week Rebuild and Rise Workbook', price: 'TBC', pages: '~80 pages', pillar: 'Rebuilding' },
];

const CLIENT_RESOURCES = [
  'Coaching Welcome Manual',
  'Intake Worksheet',
  'Values Worksheet',
  'Boundary Script Sheet',
  'Weekly Check In',
  'Reflection Journal',
  'Goal Tracker',
  'Session Summary Template',
  'Post Session Action Plan',
  'Testimonial Request Form',
];

const ADMIN_LINKS = [
  { label: '30-Day Social Drafts', path: '/admin/social-drafts', desc: 'Review and approve all 30 posts' },
  { label: 'Workbook Builder', path: '/admin/workbook-builder', desc: 'Manage workbooks and lead magnets' },
  { label: 'Client Resource Library', path: '/admin/client-resource-library', desc: 'Session resources and templates' },
  { label: 'Approval Queue', path: '/admin/approval-queue?tab=coaching', desc: 'All coaching content awaiting approval' },
  { label: 'Coaching Hub', path: '/admin/coaching-hub', desc: 'Leads, intakes, clients' },
];

export default function CoachingContentEngine() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { key: 'overview', label: 'Overview' },
    { key: 'pillars', label: 'Content Pillars' },
    { key: 'ctas', label: 'CTAs' },
    { key: 'leads', label: 'Lead Magnets' },
    { key: 'paid', label: 'Paid Resources' },
    { key: 'client', label: 'Client Resources' },
    { key: 'final', label: 'Final Report' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="mb-6">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin</p>
        <h1 className="font-display text-3xl text-foreground">Coaching Content Engine</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          30-day social content system — 10 pillars — all content flows to Approval Queue before publishing
        </p>
      </div>

      {/* Quick nav */}
      <div className="flex gap-2 flex-wrap mb-8">
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
              ${activeSection === s.key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Admin nav tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {ADMIN_LINKS.map(link => (
          <Link key={link.path} to={link.path}
            className="flex items-start justify-between p-4 bg-card/50 border border-border/40 hover:border-primary/40 rounded-xl transition-all group">
            <div>
              <p className="font-body text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{link.label}</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">{link.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
          </Link>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Content Pillars', value: '10', color: 'text-primary' },
              { label: 'Days of Content', value: '30', color: 'text-green-400' },
              { label: 'Lead Magnets', value: '5', color: 'text-blue-400' },
              { label: 'Paid Resources', value: '6', color: 'text-purple-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-card/50 border border-border/40 rounded-xl p-4 text-center">
                <p className={`font-display text-3xl ${stat.color}`}>{stat.value}</p>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
            <p className="font-body text-sm font-semibold text-green-400 mb-2">✓ System Status</p>
            <ul className="space-y-1.5">
              {[
                '30-day content plan created and loaded into Approval Queue',
                '10 content pillars defined with hooks, CTAs, and related offers',
                '5 lead magnets defined and ready to design',
                '6 paid resources defined and ready to design',
                '10 client session resources defined and ready to produce',
                'All social drafts require Gannon approval before scheduling',
                'Zero auto-posting — everything flows through Approval Queue',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-foreground/70">{item}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="font-body text-xs font-semibold text-yellow-400 mb-3">⚠ Needs Gannon Input</p>
            <ul className="space-y-1.5">
              {[
                'Review and approve/edit each of the 30 social post drafts in /admin/social-drafts',
                'Set pricing for all paid workbooks before publishing sales pages',
                'Record or brief a designer on lead magnet PDF designs',
                'Upload completed PDF files to workbook download links',
                'Confirm which coaching offer each reel should link to',
                'Review social hooks — adjust tone as needed to match your voice',
                'Record the 30 reels (hooks and scripts are ready — visuals need design)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-yellow-400 text-xs shrink-0 mt-0.5">{i + 1}.</span>
                  <p className="font-body text-xs text-foreground/70">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* PILLARS */}
      {activeSection === 'pillars' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTENT_PILLARS.map(pillar => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.id} className={`border rounded-xl p-5 ${pillar.bg}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${pillar.color}`} />
                  </div>
                  <div>
                    <p className={`font-body text-sm font-semibold ${pillar.color}`}>{pillar.id}. {pillar.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{pillar.desc}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {pillar.hooks.map((hook, i) => (
                    <div key={i} className="bg-black/20 rounded-lg p-2.5">
                      <p className="font-display text-xs italic text-foreground/80 leading-relaxed">"{hook}"</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTAs */}
      {activeSection === 'ctas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CTA_TYPES.map(cta => (
            <div key={cta.tag} className={`border rounded-xl p-4 flex items-center justify-between ${cta.color}`}>
              <div>
                <p className="font-body text-sm font-semibold">{cta.label}</p>
                <p className="font-body text-xs opacity-70 mt-0.5">Tag: {cta.tag}</p>
              </div>
              <Send className="w-4 h-4 opacity-60" />
            </div>
          ))}
        </div>
      )}

      {/* LEAD MAGNETS */}
      {activeSection === 'leads' && (
        <div className="space-y-3">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
            <p className="font-body text-xs text-blue-400 font-semibold">Lead Magnets — Free downloads that capture email addresses and bring people into the coaching funnel.</p>
          </div>
          {LEAD_MAGNETS.map((lm, i) => (
            <div key={i} className="flex items-start justify-between p-4 bg-card/50 border border-border/40 rounded-xl gap-3">
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{lm.name}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{lm.desc}</p>
                <Badge variant="outline" className="text-[9px] mt-2">{lm.pillar}</Badge>
              </div>
              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-[9px] shrink-0">Needs Design</Badge>
            </div>
          ))}
        </div>
      )}

      {/* PAID */}
      {activeSection === 'paid' && (
        <div className="space-y-3">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-4">
            <p className="font-body text-xs text-purple-400 font-semibold">Paid Resources — Premium workbooks and manuals sold via the coaching sales pages. Pricing to be set by Gannon.</p>
          </div>
          {PAID_RESOURCES.map((res, i) => (
            <div key={i} className="flex items-start justify-between p-4 bg-card/50 border border-border/40 rounded-xl gap-3">
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{res.name}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{res.pages} · {res.pillar}</p>
              </div>
              <div className="text-right shrink-0">
                <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-[9px]">Price: {res.price}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CLIENT RESOURCES */}
      {activeSection === 'client' && (
        <div className="space-y-3">
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4 mb-4">
            <p className="font-body text-xs text-teal-400 font-semibold">Client Session Resources — Provided to coaching clients only. Access via /coaching/client-resources with password or login.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CLIENT_RESOURCES.map((res, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-card/50 border border-border/40 rounded-lg">
                <span className="font-body text-[10px] text-muted-foreground/50 w-5 text-right shrink-0">{i + 1}.</span>
                <p className="font-body text-sm text-foreground/80">{res}</p>
                <Badge className="ml-auto bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-[9px] shrink-0">Needs Upload</Badge>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/admin/client-resource-library">
              <Button variant="outline" className="gap-2 text-sm">
                <BookOpen className="w-4 h-4" /> Manage Client Resources
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* FINAL REPORT */}
      {activeSection === 'final' && (
        <div className="space-y-4">
          <div className="bg-card/60 border border-border/60 rounded-xl p-6">
            <h2 className="font-display text-xl text-foreground mb-4">Final System Report</h2>
            <div className="space-y-4">
              {[
                { title: '1. Content Pillars Created', items: CONTENT_PILLARS.map(p => p.name) },
                { title: '2. 30-Day Content Plan', items: ['30 posts created across all 10 pillars', 'Each post includes: hook, script, on-screen text, caption, first comment, CTA, related offer, related workbook, related lyric', 'All 30 posts sent to Approval Queue as pending', 'No post will publish without Gannon approval'] },
                { title: '3. Workbooks Created', items: PAID_RESOURCES.map(r => r.name) },
                { title: '4. Client Manuals Created', items: CLIENT_RESOURCES },
                { title: '5. Lead Magnets Created', items: LEAD_MAGNETS.map(l => l.name) },
                { title: '6. Admin Pages Created', items: ['/admin/coaching-content-engine', '/admin/social-drafts', '/admin/workbook-builder', '/admin/client-resource-library', '/admin/approval-queue', '/admin/coaching-hub'] },
                { title: '7. Approval Queue Items', items: ['30 coaching social post drafts loaded into Approval Queue', 'All tagged: coaching, social, content', 'Status: pending — awaiting Gannon review'] },
                { title: '8. Ready to Design', items: ['All 5 lead magnet PDF templates', 'All 6 paid workbook PDF layouts', 'Reel graphic templates for each pillar (10 visual themes)', 'Cover images for each workbook'] },
                { title: '9. Ready to Post After Approval', items: ['All 30 social posts are scripted and ready', 'Hooks, captions, first comments, and CTAs are written', 'Once approved in queue → export to Metricool → schedule'] },
                { title: '10. Needs Gannon Input', items: ['Review + approve/edit each of 30 posts', 'Set pricing for all paid workbooks', 'Brief designer on PDF layout style', 'Upload completed PDFs to workbook pages', 'Record reels (scripts are ready)', 'Confirm which calendar booking link to use'] },
              ].map((section, i) => (
                <div key={i} className="border border-border/40 rounded-lg overflow-hidden">
                  <div className="px-4 py-2.5 bg-secondary/30">
                    <p className="font-body text-sm font-semibold text-foreground">{section.title}</p>
                  </div>
                  <div className="px-4 py-3">
                    <ul className="space-y-1">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400/60 shrink-0 mt-0.5" />
                          <p className="font-body text-xs text-foreground/70">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}