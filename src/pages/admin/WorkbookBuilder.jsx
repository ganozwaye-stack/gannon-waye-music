import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const LEAD_MAGNETS = [
  {
    name: 'The Self Respect Reset Workbook',
    slug: 'self-respect-reset',
    pillar: 'Self Worth',
    type: 'free',
    desc: 'A guided reset for anyone who has been measuring their worth through someone else\'s validation.',
    pages: '~12 pages',
    sections: ['What self worth actually is (not what you were taught)', 'The 5 moments you abandoned yourself', 'The return — 3 daily practices', 'Your self worth statement'],
    cta: 'Download free at /coaching/workbooks',
    status: 'needs_design',
  },
  {
    name: 'The Boundary Builder Worksheet',
    slug: 'boundary-builder',
    pillar: 'Boundaries',
    type: 'free',
    desc: 'A single worksheet that helps you identify where your limits are and script what to say.',
    pages: '~4 pages',
    sections: ['Where am I giving without receiving?', 'The boundary I keep crossing for others', 'My 3 boundary scripts', 'The conversation I need to have'],
    cta: 'Download free at /coaching/workbooks',
    status: 'needs_design',
  },
  {
    name: 'The Thankyou Letter Exercise',
    slug: 'thankyou-letter',
    pillar: 'THANKYOU Movement',
    type: 'free',
    desc: 'Write the THANKYOU letter to someone or something that no longer belongs in your story.',
    pages: '~3 pages',
    sections: ['Why THANKYOU is not gratitude — it\'s release', 'The prompted letter template', 'What to do after you write it', 'Your new chapter opening line'],
    cta: 'Download free at /coaching/workbooks',
    status: 'needs_design',
  },
  {
    name: 'Still Here Weekly Reflection',
    slug: 'still-here-reflection',
    pillar: 'Still Here',
    type: 'free',
    desc: 'A 7-day check in for people rebuilding after something that tried to break them.',
    pages: '~8 pages',
    sections: ['Day 1–7 guided prompts', 'What am I still carrying?', 'What proof do I have that I survived?', 'This week I choose...'],
    cta: 'Download free at /coaching/workbooks',
    status: 'needs_design',
  },
  {
    name: 'Creative Confidence Starter Guide',
    slug: 'creative-confidence',
    pillar: 'Creative Confidence',
    type: 'free',
    desc: '3 exercises to help you reclaim your creative voice and stop performing for the wrong audience.',
    pages: '~6 pages',
    sections: ['The moment your creativity went quiet', 'Exercise 1: The unpublished page', 'Exercise 2: The voice memo you don\'t share', 'Exercise 3: Create for no one'],
    cta: 'Download free at /coaching/workbooks',
    status: 'needs_design',
  },
];

const PAID_RESOURCES = [
  {
    name: 'Self Respect Reset Workbook',
    pillar: 'Self Worth',
    type: 'paid',
    price: 'TBC',
    pages: '~30 pages',
    desc: 'A deep 4-week journey into understanding, reclaiming, and living from self respect rather than performance.',
    sections: ['Week 1: Where did your self worth go?', 'Week 2: The patterns that kept you small', 'Week 3: The turning point', 'Week 4: Building a self worth practice'],
    status: 'needs_design',
  },
  {
    name: 'Boundaries After Breakdown Manual',
    pillar: 'Boundaries',
    type: 'paid',
    price: 'TBC',
    pages: '~40 pages',
    desc: 'A comprehensive guide to rebuilding healthy boundaries after a breakdown, betrayal, or unhealthy relationship.',
    sections: ['Why your boundaries collapsed', 'The anatomy of a healthy limit', 'Boundary scripts for every situation', '30-day boundary practice'],
    status: 'needs_design',
  },
  {
    name: 'Rebuild Your Voice Client Workbook',
    pillar: 'Rebuilding',
    type: 'paid',
    price: 'TBC',
    pages: '~35 pages',
    desc: 'For coaching clients working through painful chapters and learning to speak their truth again.',
    sections: ['The chapter that silenced you', 'Finding your voice again', 'Expressing without apology', 'Your voice agreement'],
    status: 'needs_design',
  },
  {
    name: 'Creative Confidence Coaching Manual',
    pillar: 'Creative Confidence',
    type: 'paid',
    price: 'TBC',
    pages: '~45 pages',
    desc: 'A full mentoring companion for people who have lost confidence in their creative expression.',
    sections: ['The creative wound', 'Reclaiming your medium', 'Creating without permission', 'Sharing your work on your terms'],
    status: 'needs_design',
  },
  {
    name: 'Four Week Self Worth Mentoring Workbook',
    pillar: 'Self Worth',
    type: 'paid',
    price: 'TBC',
    pages: '~60 pages',
    desc: 'A 28-day structured mentoring workbook for clients in the Self Worth Reset coaching offer.',
    sections: ['Daily practices', 'Weekly reflections', 'Key exercises per week', 'Session prep and post-session actions'],
    status: 'needs_design',
  },
  {
    name: 'Six Week Rebuild and Rise Workbook',
    pillar: 'Rebuilding',
    type: 'paid',
    price: 'TBC',
    pages: '~80 pages',
    desc: 'The flagship 6-week workbook for clients in the full coaching programme. Comprehensive, deep, transformational.',
    sections: ['Week 1: Acknowledging what happened', 'Week 2: What I was before', 'Week 3: What I kept', 'Week 4: What I chose to release', 'Week 5: Building the new', 'Week 6: Rising and staying risen'],
    status: 'needs_design',
  },
];

function WorkbookCard({ wb }) {
  const isPaid = wb.type === 'paid';
  return (
    <div className={`border rounded-xl overflow-hidden ${isPaid ? 'border-purple-500/20 bg-purple-500/5' : 'border-blue-500/20 bg-blue-500/5'}`}>
      <div className="p-4 border-b border-white/5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {isPaid ? <Lock className="w-4 h-4 text-purple-400 shrink-0" /> : <Unlock className="w-4 h-4 text-blue-400 shrink-0" />}
            <p className={`font-body text-sm font-semibold ${isPaid ? 'text-purple-300' : 'text-blue-300'}`}>{wb.name}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <Badge className={`text-[9px] ${isPaid ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
              {isPaid ? 'Paid' : 'Free'}
            </Badge>
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-[9px]">Needs Design</Badge>
          </div>
        </div>
        <p className="font-body text-xs text-muted-foreground leading-relaxed">{wb.desc}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-[9px]">{wb.pillar}</Badge>
          <Badge variant="outline" className="text-[9px]">{wb.pages}</Badge>
          {isPaid && <Badge variant="outline" className="text-[9px]">Price: {wb.price}</Badge>}
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="font-body text-[9px] uppercase tracking-wider text-muted-foreground mb-2">Sections</p>
        <ul className="space-y-1">
          {wb.sections.map((s, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-muted-foreground/40 text-[9px] mt-0.5 shrink-0">{i + 1}.</span>
              <p className="font-body text-xs text-foreground/60">{s}</p>
            </li>
          ))}
        </ul>
        {wb.cta && <p className="font-body text-[9px] text-primary/60 mt-2 italic">{wb.cta}</p>}
      </div>
    </div>
  );
}

export default function WorkbookBuilder() {
  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="mb-6">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Content Engine</p>
        <h1 className="font-display text-3xl text-foreground">Workbook Builder</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Free lead magnets and paid resources — all linked to coaching offers and content pillars</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
          <p className="font-display text-2xl text-blue-400">{LEAD_MAGNETS.length}</p>
          <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Free Lead Magnets</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
          <p className="font-display text-2xl text-purple-400">{PAID_RESOURCES.length}</p>
          <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Paid Resources</p>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-xs font-semibold text-yellow-400 mb-1">Action Required — Gannon</p>
            <ul className="space-y-1">
              {['All workbooks are defined and structured — PDFs need to be designed and uploaded', 'Set pricing for all 6 paid resources before sales pages can go live', 'Free lead magnets need email capture form connected (Mailchimp / ConvertKit / etc.)', 'Upload completed PDFs to /coaching/workbooks page for download'].map((a, i) => (
                <li key={i} className="font-body text-xs text-foreground/70 flex items-start gap-1.5">
                  <span className="text-yellow-400/60 shrink-0">{i + 1}.</span>{a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Free */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Unlock className="w-4 h-4 text-blue-400" />
          <h2 className="font-display text-xl text-foreground">Free Lead Magnets</h2>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[9px]">{LEAD_MAGNETS.length} total</Badge>
        </div>
        <div className="space-y-3">
          {LEAD_MAGNETS.map((wb, i) => <WorkbookCard key={i} wb={wb} />)}
        </div>
      </div>

      {/* Paid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-purple-400" />
          <h2 className="font-display text-xl text-foreground">Paid Resources</h2>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[9px]">{PAID_RESOURCES.length} total</Badge>
        </div>
        <div className="space-y-3">
          {PAID_RESOURCES.map((wb, i) => <WorkbookCard key={i} wb={wb} />)}
        </div>
      </div>

      <div className="mt-8">
        <Link to="/coaching/workbooks">
          <Button variant="outline" className="gap-2 text-sm">
            <ExternalLink className="w-4 h-4" /> View Public Workbooks Page
          </Button>
        </Link>
      </div>
    </div>
  );
}