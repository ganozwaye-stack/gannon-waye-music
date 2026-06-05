import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Music, Users } from 'lucide-react';

const IMAGE_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f35982fc5_ChatGPTImageMay28202608_32_44PM.jpg';

export default function ThankYouCampaignSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Left — Campaign Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
              <img
                src={IMAGE_URL}
                alt="Gannon Waye — Thank You, Debut Single June 5 2026"
                className="w-full h-auto block"
                style={{ objectFit: 'cover', objectPosition: 'center 20%', maxHeight: '420px' }}
              />
              {/* Bottom gradient overlay so text stays readable if any */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
              {/* Gold accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
          </motion.div>

          {/* Right — Campaign Copy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-6"
          >
            <div>
              <p className="font-body text-[10px] tracking-[0.35em] uppercase text-green-400 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                Thank You · Debut Single · Out Now
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
                More than a song.
              </h2>
              <p className="font-display text-xl md:text-2xl gradient-gold-text italic mt-1">
                A thank-you to everyone who chooses to heal.
              </p>
            </div>

            <p className="font-body text-sm text-foreground/70 leading-relaxed">
              "Thank You" is for everyone who chose healing, growth, freedom, and gratitude — even when it was hard.
              This is Gannon's debut single and it carries a message for the people who needed to hear it most.
            </p>

            <div className="space-y-2.5">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Be part of this</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/back-this">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full gradient-gold-button font-body text-xs tracking-wider uppercase">
                    <Heart className="w-3.5 h-3.5" /> Support the Project
                  </button>
                </Link>
                <a href="https://open.spotify.com/track/6xHQX9Yc2pcfRzVxdPmRHp" target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-all font-body text-xs tracking-wider uppercase">
                    <Music className="w-3.5 h-3.5" /> Stream Now
                  </button>
                </a>
                <Link to="/store">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/40 text-foreground/80 hover:border-primary/30 transition-all font-body text-xs tracking-wider uppercase">
                    <ShoppingBag className="w-3.5 h-3.5" /> Visit Store
                  </button>
                </Link>
                <Link to="/founding-supporter">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/40 text-foreground/80 hover:border-primary/30 transition-all font-body text-xs tracking-wider uppercase">
                    <Users className="w-3.5 h-3.5" /> Founding Supporters
                  </button>
                </Link>
              </div>
            </div>

            {/* Values strip */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['Healing', 'Growth', 'Freedom', 'Gratitude'].map(v => (
                <span key={v} className="font-body text-[10px] tracking-[0.2em] uppercase px-3 py-1 border border-primary/20 rounded-full text-primary/80">
                  {v}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}