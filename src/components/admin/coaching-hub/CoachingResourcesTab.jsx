import { FileText, Target, Shield, BarChart2, Heart, Mic, RefreshCw, MessageSquare } from 'lucide-react';

// Lifted from src/pages/CoachingWorkbooks.jsx (WORKBOOKS) and
// src/pages/CoachingClientResources.jsx (RESOURCES) — reference copies of the
// public catalogue so the owner can see exactly what is promised and what is
// still missing. Read-only: no entity reads or writes here.
const WORKBOOKS = [
  {
    id: 'self-respect-reset',
    title: 'The Self Respect Reset Workbook',
    hook: 'Stop apologising for existing. Start building from your actual worth.',
    for: 'People who question whether they are allowed to have needs, feelings, or opinions.',
    inside: ['Where your self worth narrative came from', 'The "enough" lie audit', 'Daily self respect practice', 'One decision to make differently this week'],
    is_free: false,
    price: 'Coming Soon',
    emoji: '🌱',
  },
  {
    id: 'boundaries-after-breakdown',
    title: 'The Boundaries After Breakdown Workbook',
    hook: 'You are allowed to decide what you will and will not accept.',
    for: 'People rebuilding after a relationship, workplace, or family situation that did not respect them.',
    inside: ['Values mapping exercise', 'Red flag pattern tracker', 'Boundary scripts for 8 common situations', 'The over-explaining audit', 'Your personal boundary statement'],
    is_free: false,
    price: '⚠ Price pending',
    emoji: '🛡️',
  },
  {
    id: 'still-here',
    title: 'The Still Here Reflection Journal',
    hook: 'For anyone who has survived something they were not sure they would.',
    for: 'People who need space to process, reflect, and acknowledge how far they have actually come.',
    inside: ['30 days of prompted reflection', 'The grief and growth mapping page', '"Still here because…" writing prompts', 'A letter to the version of you that did not think you would make it'],
    is_free: true,
    emoji: '✍️',
  },
  {
    id: 'thankyou-letter',
    title: 'The Thankyou Letter Workbook',
    hook: 'Thank you for teaching me who I am not anymore.',
    for: 'People ready to turn pain into power — and find meaning in what the hard chapter taught them.',
    inside: ['The "what it cost me" honest inventory', 'What I learned that I could not have learned any other way', 'Writing your Thankyou letter (you do not have to send it)', 'What I am choosing instead'],
    is_free: false,
    price: 'Coming Soon',
    emoji: '💌',
  },
  {
    id: 'creative-confidence-starter',
    title: 'The Creative Confidence Starter Manual',
    hook: 'The thing you have been hiding is the thing someone else needs to hear.',
    for: 'Creatives, artists, singers, and writers who have gone quiet and want to find their voice again.',
    inside: ['The inner critic origin story', 'Your creative identity statement', '5 low-stakes ways to start creating again', 'The fear-vs-intuition check', 'Commitment page'],
    is_free: false,
    price: '⚠ Price pending',
    emoji: '🎤',
  },
  {
    id: 'rebuild-your-voice',
    title: 'The Rebuild Your Voice Client Workbook',
    hook: 'A structured companion for ongoing coaching clients.',
    for: 'Coaching clients working with Gannon across multiple sessions.',
    inside: ['Session prep framework', 'Between-session action tracker', 'Weekly self worth check-in', 'Progress and pattern recognition', 'Milestone reflection pages'],
    is_free: false,
    price: 'Client access — provided by Gannon',
    emoji: '📋',
    client_only: true,
  },
];

const RESOURCES = [
  { icon: FileText, title: 'Welcome Manual', description: 'Everything you need to know before your first session — what to expect, how to prepare, and how to get the most from this work.', available: false },
  { icon: Target, title: 'Session Preparation Sheet', description: 'A short reflection to complete before each session so you arrive clear on what you most want to focus on.', available: false },
  { icon: Heart, title: 'Values Worksheet', description: 'A guided exercise to help you name what you actually value — not what you think you should value.', available: false },
  { icon: Shield, title: 'Boundary Scripts', description: 'Real language for real situations — 8 common boundary scenarios with scripts you can adapt and use.', available: false },
  { icon: RefreshCw, title: 'Weekly Reflection Page', description: 'A one-page weekly check-in to track how you are doing between sessions.', available: false },
  { icon: BarChart2, title: 'Goal Tracker', description: 'A simple, honest tracker to help you see how far you have come and what is still ahead.', available: false },
  { icon: Heart, title: 'Self Worth Check-In', description: 'A structured self-assessment to run any time you feel like you are losing ground.', available: false },
  { icon: Mic, title: 'Creative Confidence Plan', description: 'For creative clients — a practical monthly plan to rebuild your relationship with your voice and your work.', available: false },
  { icon: FileText, title: 'Post Session Reflection', description: 'A short structured reflection to complete within 24 hours of each session to lock in what landed.', available: false },
  { icon: MessageSquare, title: 'Testimonial Request Form', description: 'When you are ready — a simple way to share your experience if you would like to.', available: false },
];

export default function CoachingResourcesTab() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="font-display text-xl text-foreground">Workbooks &amp; Resources</h2>
        <p className="font-body text-xs text-muted-foreground mt-1">
          What the public workbook library and client resource hub currently promise.
        </p>
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
        <p className="font-body text-xs text-primary">⚠ Resources are being prepared. Gannon to upload files before this page goes live.</p>
      </div>

      <div>
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Workbook Library ({WORKBOOKS.length})</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {WORKBOOKS.map(wb => (
            <div key={wb.id} className="bg-card/50 border border-border/40 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="text-2xl">{wb.emoji}</div>
                <div className="flex gap-2">
                  {wb.is_free && (
                    <span className="font-body text-[9px] tracking-[0.2em] uppercase bg-primary/20 text-primary border border-primary/30 rounded-full px-2.5 py-1">Free</span>
                  )}
                  {wb.client_only && (
                    <span className="font-body text-[9px] tracking-[0.2em] uppercase bg-secondary text-muted-foreground border border-border/40 rounded-full px-2.5 py-1">Client Only</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground italic leading-snug">{wb.title}</h3>
                <p className="font-body text-xs text-muted-foreground italic mt-1.5">{wb.hook}</p>
              </div>
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground/60 mb-1">Who it's for</p>
                <p className="font-body text-xs text-foreground/70">{wb.for}</p>
              </div>
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground/60 mb-1.5">Inside</p>
                <ul className="space-y-1">
                  {wb.inside.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary text-xs mt-0.5 shrink-0">✦</span>
                      <span className="font-body text-xs text-foreground/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-body text-xs text-primary mt-auto pt-1">
                {wb.is_free ? 'Free — email capture on the public page' : wb.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Client Resource Hub ({RESOURCES.length})</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RESOURCES.map(resource => {
            const Icon = resource.icon;
            return (
              <div key={resource.title} className="flex gap-4 p-4 bg-card/40 border border-border/30 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary/70" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-body text-sm font-semibold text-foreground">{resource.title}</p>
                    <span className="font-body text-[9px] tracking-widest uppercase text-muted-foreground/40 border border-border/30 rounded-full px-2 py-0.5 shrink-0">
                      {resource.available ? 'Available' : 'Coming Soon'}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{resource.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}