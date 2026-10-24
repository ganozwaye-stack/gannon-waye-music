import { useState, useRef, useEffect } from 'react';
import { ChevronDown, AtSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandIcon from '@/components/public/BrandIcon';
import { OFFICIAL_LINKS } from '@/config/officialLinks';

// Desktop header "Follow" dropdown: every official Gannon Waye destination
// from the verified Linktree hub, one click away from any page.
export default function NavbarFollow() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        aria-label="Open Gannon Waye's official social links"
        aria-expanded={open}
        aria-controls="navbar-follow-menu"
        className={`flex items-center gap-1 h-8 px-3 rounded-full border border-border/40 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all font-body text-[10px] tracking-widest uppercase whitespace-nowrap ${open ? 'border-primary/50 text-primary' : ''}`}
      >
        <AtSign className="w-3.5 h-3.5" />
        Follow
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            id="navbar-follow-menu"
            className="absolute right-0 top-full mt-3 w-72 max-h-[70vh] overflow-y-auto bg-background/98 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-50"
          >
            <p className="px-4 pt-3 pb-2 font-body text-[9px] tracking-[0.25em] uppercase text-muted-foreground/60">Follow Gannon Waye</p>
            <div className="grid grid-cols-2 px-2 pb-2">
              {OFFICIAL_LINKS.map(link => (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Gannon Waye on ${link.label}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg font-body text-xs text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <BrandIcon brand={link.key} className="w-3.5 h-3.5 shrink-0" />
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}