import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CoachingSignatureLine from '@/components/coaching/CoachingSignatureLine';
import CoachingDisclaimer from '@/components/coaching/CoachingDisclaimer';
import { CheckCircle, Download, BookOpen } from 'lucide-react';

const WORKBOOKS = [
  {
    id: 'self-respect-reset',
    title: 'The Self Respect Reset Workbook',
    hook: 'Stop apologising for existing. Start building from your actual worth.',
    for: 'People who question whether they are allowed to have needs, feelings, or opinions.',
    inside: ['Where your self worth narrative came from', 'The "enough" lie audit', 'Daily self respect practice', 'One decision to make differently this week'],
    is_free: true,
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
    is_free: true,
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

function WorkbookCard({ workbook }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFreeDownload = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await base44.entities.CoachingLead.create({
      full_name: 'Workbook Request',
      email,
      workbook_requested: workbook.title,
      source_page: '/coaching/workbooks',
      source_offer: 'workbook_download',
      understands_coaching_not_therapy: true,
      consent_to_contact: true,
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card/50 border border-border/40 hover:border-primary/30 rounded-2xl p-6 flex flex-col gap-4 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-3xl">{workbook.emoji}</div>
        <div className="flex gap-2">
          {workbook.is_free && (
            <span className="font-body text-[9px] tracking-[0.2em] uppercase bg-primary/20 text-primary border border-primary/30 rounded-full px-2.5 py-1">Free</span>
          )}
          {workbook.client_only && (
            <span className="font-body text-[9px] tracking-[0.2em] uppercase bg-secondary text-muted-foreground border border-border/40 rounded-full px-2.5 py-1">Client Only</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl text-foreground italic leading-snug">{workbook.title}</h3>
        <p className="font-body text-sm text-muted-foreground italic mt-2">{workbook.hook}</p>
      </div>

      <div>
        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground/60 mb-1.5">Who it's for</p>
        <p className="font-body text-xs text-foreground/70">{workbook.for}</p>
      </div>

      <div>
        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground/60 mb-2">Inside</p>
        <ul className="space-y-1">
          {workbook.inside.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary text-xs mt-0.5 shrink-0">✦</span>
              <span className="font-body text-xs text-foreground/70">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-2">
        {workbook.client_only ? (
          <p className="font-body text-xs text-muted-foreground/50 italic text-center">Provided by Gannon to active coaching clients.</p>
        ) : workbook.is_free ? (
          submitted ? (
            <div className="flex items-center gap-2 justify-center py-3 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <p className="font-body text-sm">Check your inbox — sending shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleFreeDownload} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email to receive this"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-card/50 border-border/60 text-xs h-9"
              />
              <Button type="submit" disabled={loading} size="sm" className="gradient-gold-button border-0 shrink-0 gap-1">
                <Download className="w-3 h-3" />
                {loading ? '…' : 'Get it'}
              </Button>
            </form>
          )
        ) : (
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-yellow-400">{workbook.price}</span>
            <Button size="sm" variant="outline" className="rounded-full text-xs border-border/50 gap-1">
              <BookOpen className="w-3 h-3" /> Coming Soon
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CoachingWorkbooks() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block border border-primary/30 text-primary font-body text-[9px] tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-6">
            Gannon Waye Coaching
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-foreground italic leading-tight mb-4">Workbook Library</h1>
          <p className="font-body text-base text-foreground/70">Reflection workbooks, action guides, and journals built around the same core work Gannon does in sessions. Some are free. All are honest.</p>
        </div>
      </section>

      <section className="py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKBOOKS.map(wb => <WorkbookCard key={wb.id} workbook={wb} />)}
        </div>
      </section>

      <section className="py-12 px-4">
        <CoachingSignatureLine line="The chapter hurt. But it did not get the final say." />
      </section>

      <section className="py-10 px-4 bg-card/20">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h3 className="font-display text-2xl text-foreground italic">Ready to work directly with Gannon?</h3>
          <p className="font-body text-sm text-muted-foreground">Workbooks are the beginning. Sessions go deeper.</p>
          <a href="/coaching/intake">
            <Button className="gradient-gold-button border-0 rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase">
              Book a Clarity Session
            </Button>
          </a>
        </div>
      </section>

      <section className="py-10 px-4">
        <CoachingDisclaimer />
      </section>
    </div>
  );
}