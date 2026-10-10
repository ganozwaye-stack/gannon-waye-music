import { motion } from 'framer-motion';
import { Compass, Wrench, Heart, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUOTE = 'Respect is earned. Not a game you make me play.';

const PARAS = [
  'Gannon Waye is an Adelaide-born, Melbourne-based singer songwriter who grew up without access to formal music lessons and built his voice through school choirs, church, worship ministry, drag performance and every stage he could find. Coaching is growing from the same determination: practical, grounded support for people ready to stop surviving and start rebuilding.',
  'After childhood family violence, abusive adult relationships, addiction, PTSD and losing his mum Sonia, Gannon learned that resilience is not never falling. It is finding a reason to stand again, then turning hard earned learning into something useful for someone else. That purpose is already present in the music and now extends into his business and coaching work.',
  'This is coaching, not therapy or crisis support. It offers direction, real tools and encouragement while respecting the limits of coaching. The mission is the same as the album: to help people feel less alone, recognise their own strength and believe that being knocked down does not have to end the story.'
];

const PILLARS = [
  { icon: Compass, label: 'Direction' },
  { icon: Wrench, label: 'Tools' },
  { icon: Heart, label: 'Encouragement' }
];

// Compact "Coaching — Coming Soon" section for the home page. Combines the
// condensed hero quote with the why/tools/direction detail and a register
// interest form that saves leads to the CoachingLead entity.
export default function CoachingComingSoonSection() {

  return (
    <section className="px-4 md:px-6 pt-10 pb-12 md:pt-12 md:pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-primary/30 backdrop-blur-md"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.07), rgba(8,8,14,0.6), rgba(212,175,55,0.07))' }}>
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)' }} />

          {/* Top strip: label + info icon */}
          <div className="flex items-center justify-between px-6 md:px-10 pt-5">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text">Coaching — Opening Soon</p>
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-primary/40 text-primary/70" title="Info pack coming">
              <FileText className="w-4 h-4" />
            </span>
          </div>

          {/* Condensed quote */}
          <div className="px-6 md:px-10 pt-3 pb-5">
            <p className="font-display italic gradient-gold-glow text-lg md:text-2xl leading-snug max-w-2xl">
              &ldquo;{QUOTE}&rdquo;
            </p>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-2">Gannon Waye</p>
          </div>

          <div className="h-px bg-border/40 mx-6 md:mx-10" />

          {/* Two-column: why heading + body */}
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6 md:p-10">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text mb-3">Why this is opening</p>
              <h3 className="font-display text-xl md:text-3xl text-foreground italic leading-tight">
                Built from the same life the music comes from.
              </h3>
            </div>
            <div className="p-6 md:p-10 border-t md:border-t-0 md:border-l border-border/30 space-y-3">
              {PARAS.map((p, i) => (
                <p key={i} className="font-body text-xs md:text-sm text-foreground/70 leading-relaxed">{p}</p>
              ))}
            </div>
          </div>

          <div className="h-px bg-border/40 mx-6 md:mx-10" />

          {/* Pillars: Direction / Tools / Encouragement */}
          <div className="grid grid-cols-3 px-6 md:px-10 py-5">
            {PILLARS.map((p, i) => (
              <div key={p.label} className={`flex flex-col items-center gap-2 text-center ${i < 2 ? 'border-r border-border/30' : ''}`}>
                <p.icon className="w-5 h-5 text-primary/80" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase gradient-gold-text">{p.label}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-border/40 mx-6 md:mx-10" />

          {/* Register interest */}
          <div className="p-6 md:p-10">
            <Link to="/coaching?view=coaching" className="inline-flex rounded-full bg-[#F5D06E] text-primary-foreground px-6 py-3 font-body font-semibold">Register your interest</Link>
            <p className="font-body text-xs text-muted-foreground mt-3">Explore coaching and the private registration form. Journal purchases are separate.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}