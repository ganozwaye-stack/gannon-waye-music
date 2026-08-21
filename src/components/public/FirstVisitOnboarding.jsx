import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Users, Calendar, X, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'gw-first-visit-seen';

const PATHS = [
  {
    icon: Music,
    title: 'Discover the Music',
    desc: 'Stream the latest singles, explore the discography, and feel every lyric.',
    cta: 'Enter the Sound',
    route: '/music',
    accent: 'from-amber-500/20 to-transparent',
  },
  {
    icon: Users,
    title: 'Join the Inner Circle',
    desc: 'Be part of a community that chooses authenticity over appearance.',
    cta: 'Step In',
    route: '/back-this',
    accent: 'from-rose-500/20 to-transparent',
  },
  {
    icon: Calendar,
    title: 'Book Gannon',
    desc: 'Secure your session — performances, collaborations, and creative partnerships.',
    cta: 'Reserve Your Session',
    route: '/contact',
    accent: 'from-cyan-500/20 to-transparent',
  },
];

export default function FirstVisitOnboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        const timer = setTimeout(() => setShow(true), 2500);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-md"
        >
          <button
            onClick={dismiss}
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-8">
              <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Welcome</p>
              <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
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
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}