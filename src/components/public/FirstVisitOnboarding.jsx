import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, ShoppingBag, Mail, X, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'gw-first-visit-seen';

const PATHS = [
  {
    icon: Music,
    title: 'Discover the Music',
    desc: 'Stream the latest singles, explore the discography, and feel every lyric.',
    cta: 'Enter the Sound',
    route: '/music',
    accent: 'from-primary/20 to-transparent',
  },
  {
    icon: ShoppingBag,
    title: 'Explore the Store',
    desc: 'See the current owner-approved merchandise and verified stock.',
    cta: 'View Current Stock',
    route: '/store',
    accent: 'from-rose-500/20 to-transparent',
  },
  {
    icon: Mail,
    title: 'Contact Gannon',
    desc: 'Send a genuine music, media, collaboration, or business enquiry.',
    cta: 'Get in Touch',
    route: '/contact',
    accent: 'from-cyan-500/20 to-transparent',
  },
];

// The welcome question is not a blocking overlay any more. It is an in-page
// prompt that appears the first time a visitor scrolls to this point of the
// homepage, then never again on this device until they clear their data.
export default function FirstVisitOnboarding() {
  const [dismissed, setDismissed] = useState(false);
  let seen = false;
  try {
    seen = Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {}

  if (seen || dismissed) return null;

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setDismissed(true);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="first-visit-title"
      className="relative py-12 md:py-16 px-4 md:px-6"
    >
      <button
        onClick={dismiss}
        className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close welcome guide"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Welcome</p>
          <h2 id="first-visit-title" className="font-display text-2xl md:text-3xl text-foreground leading-tight">
            This is more than music.<br />This is choosing yourself.
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-3">
            Where would you like to begin?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PATHS.map((path, i) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.route}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              >
                <Link
                  to={path.route}
                  onClick={dismiss}
                  className="group block p-5 rounded-2xl bg-card/60 border border-border/40 hover:border-primary/40 transition-all hover:bg-card/80"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-b ${path.accent} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-base text-foreground mb-1">{path.title}</h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">{path.desc}</p>
                  <p className="font-body text-xs text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    {path.cta} <ArrowRight className="w-3 h-3" />
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={dismiss}
          className="block mx-auto mt-6 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Just exploring — take me to the site
        </button>
      </div>
    </motion.section>
  );
}