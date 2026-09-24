import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Desktop navbar dropdown: one top-level label grouping related pages.
export default function NavDropdown({ label, links }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const active = links.some((l) => l.path === location.pathname);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-label={`Open ${label} menu`}
        className={`flex items-center gap-1 font-body text-[11px] tracking-widest uppercase transition-all duration-200 hover:scale-105 ${open || active ? 'gradient-gold-text' : 'text-foreground/80 hover:text-foreground font-medium'}`}
      >
        {label} <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-3 w-48 bg-background/98 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 font-body text-[11px] tracking-widest uppercase text-left transition-colors hover:bg-primary/10 ${location.pathname === link.path ? 'gradient-gold-text' : 'text-foreground/80 hover:text-foreground font-medium'}`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}