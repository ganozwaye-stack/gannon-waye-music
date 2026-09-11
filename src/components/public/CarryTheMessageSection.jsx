import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, PhoneCall, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Carry the Message: the Thank You Project's successor on the homepage.
// Written from Gannon's own story and the real donation mechanism:
// 10% of support contributions, tallied monthly, goes to 1800RESPECT.
// No em dashes. Gold essence palette only.
export default function CarryTheMessageSection() {
  return (
    <section
      aria-label="Carry the Message"
      className="relative overflow-hidden py-16 md:py-24 px-4 md:px-6"
      style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, #0a0906 50%, hsl(var(--background)) 100%)' }}
    >
      {/* Ambient gold light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(90% 70% at 18% 30%, rgba(212,175,55,0.10), rgba(10,9,6,0) 60%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(70% 60% at 88% 75%, rgba(212,175,55,0.06), rgba(10,9,6,0) 65%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-5 items-stretch">
        {/* WHY IT EXISTS */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-primary/20 p-7 md:p-10 flex flex-col"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(8,8,14,0.55) 60%)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <HeartHandshake className="w-4 h-4 text-primary" />
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/70">Carry the Message</p>
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight mb-6 text-left">
            This is bigger than a hoodie.
          </h2>
          <p className="font-body text-sm md:text-base text-foreground/85 leading-relaxed text-left mb-5">
            Carry the Message was born from a life that survived it. Family violence, abusive relationships,
            coercive control: the words <span className="gradient-gold-text">Respect Is Earned, Not a Game You Make Me Play</span> are
            not a slogan. They are the standard I learned the hard way, and they are worn so anyone else who needs them
            can see they are not alone.
          </p>
          <p className="font-body text-sm text-muted-foreground leading-relaxed text-left mb-8">
            Every piece is a visible statement of dignity and solidarity. It can hold personal meaning for the person
            wearing it, and let someone else encounter the message without ever asking anyone to disclose their story.
            No backstory required.
          </p>
          <div className="mt-auto flex flex-wrap gap-3">
            <Link to="/carry-the-message">
              <Button className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase gap-2 px-6">
                Read the full story <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link to="/store">
              <Button variant="outline" className="rounded-full font-body text-xs tracking-wider uppercase gap-2 border-primary/30 text-primary">
                Explore the collection
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* WHERE SUPPORT GOES */}
        <div className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-primary/30 p-6 md:p-8 flex-1"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(8,8,14,0.6) 70%)',
              boxShadow: '0 0 34px rgba(212,175,55,0.10)',
            }}
          >
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-display text-5xl gradient-gold-glow">10%</span>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 pt-2">goes to the front line</p>
            </div>
            <p className="font-body text-sm text-foreground/85 leading-relaxed text-left mb-4">
              Ten percent of every support contribution received through this store is set aside for
              1800RESPECT, Australia's national 24/7 domestic, family and sexual violence counselling service.
              The amount is tallied every month and tracked in the shop's charity ledger, so the giving stays
              visible and honest, not a promise on a page.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed text-left">
              That is what this is on a greater scale than me: not a donation to my story, but to the counsellors
              who pick up for anyone in Australia who needs them, tonight and every night after it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-border/40 p-6 flex items-center gap-4"
            style={{ background: 'rgba(8,8,14,0.45)' }}
          >
            <ShieldCheck className="w-8 h-8 text-primary/70 shrink-0" />
            <div className="flex-1">
              <h3 className="font-display text-base text-foreground">If you or someone you know needs help now</h3>
              <p className="font-body text-xs text-muted-foreground mt-1">Discreet support resources, one tap away.</p>
            </div>
            <Link to="/support/domestic-violence" className="shrink-0">
              <Button size="sm" variant="outline" className="rounded-full font-body text-[10px] tracking-wider uppercase gap-1.5 border-primary/40 text-primary">
                <PhoneCall className="w-3 h-3" /> Find support
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}