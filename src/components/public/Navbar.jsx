import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SiteSearch from '@/components/public/SiteSearch';
import MagneticButton from '@/components/public/MagneticButton';


const BANNER_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5de42a778_60a7df62-cfa1-4cba-9280-c5ac4dfcbfa5.png';

const NAV_LINKS = [
{ label: 'Home', path: '/' },
{ label: 'Music', path: '/music' },
{ label: 'Lyrics', path: '/lyrics' },
{ label: 'Store', path: '/store' },
{ label: 'Press', path: '/press' },
{ label: 'Subscribe', path: '/back-this' },
{ label: 'Contact', path: '/contact' }];


const MORE_LINKS = [
{ label: 'My Story', path: '/this-is-my-life' },
{ label: 'Biography', path: '/biography' },
{ label: 'Videos', path: '/videos' },
{ label: 'Lyric Library', path: '/lyric-library' },
{ label: 'Discover Music', path: '/discover' },
{ label: 'Community', path: '/community' },
{ label: 'Mum Tribute', path: '/remember-mum' },
{ label: 'Live & Tour', path: '/tour' },
{ label: 'Mixing Services', path: '/mixing-services' },
{ label: 'Gift Cards', path: '/gift-cards' },
{ label: 'Fan Reminders', path: '/fan-reminders' },
{ label: 'FAQ', path: '/faq' },
{ label: 'Orders', path: '/orders' },
{ label: 'My Profile', path: '/fan-profile' },
{ label: 'Systems Manager', path: '/systems-manager' }];


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handler = (e) => {if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);};
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1rem)] max-w-6xl rounded-2xl bg-background/75 backdrop-blur-xl border border-border/60 shadow-[0_2px_24px_rgba(0,0,0,0.4)]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          aria-label="Gannon Waye · Home"
          className="flex items-center gap-2.5 hover:opacity-90 transition-all duration-200">
          
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-primary/60 flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(255,224,138,0.08))' }}>
            <span className="font-display text-sm gradient-gold-text font-semibold tracking-wider">GW</span>
          </div>
          <span className="hidden lg:inline font-body text-xl uppercase font-bold tracking-[0.24em] gradient-gold-glow leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">Gannon Waye</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;
            const isHighlighted = link.highlight || link.path === '/store';
            const isBoutique = link.boutique;
            return (
              <MagneticButton key={link.path} strength={0.2} className="inline-block">
                <Link
                  to={link.path}
                  className={`font-body text-[11px] tracking-widest uppercase transition-all duration-200 hover:scale-105 ${
                  isBoutique ?
                  active ?
                  'px-3 py-1 rounded-full gradient-gold-text border border-primary/80 bg-primary/10' :
                  'px-3 py-1 rounded-full gradient-gold-text border border-primary/40 hover:border-primary/70 hover:bg-primary/10' :
                  isHighlighted ?
                  active ?
                  'px-4 py-1.5 rounded-full bg-primary text-primary-foreground' :
                  'px-4 py-1.5 rounded-full border border-primary/60 hover:bg-primary/10 gradient-gold-text' :
                  active ?
                  'gradient-gold-text' :
                  'text-foreground/80 hover:text-foreground font-medium'}`
                  }>
                  
                  {link.label}
                </Link>
              </MagneticButton>);

          })}

          {/* More dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen((p) => !p)}
              className={`flex items-center gap-1 font-body text-[11px] tracking-widest uppercase transition-all duration-200 hover:scale-105 ${moreOpen ? 'gradient-gold-text' : 'text-foreground/80 hover:text-foreground font-medium'}`}>
              
              More <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {moreOpen &&
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-3 w-44 bg-background/98 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden z-50">
                
                  {MORE_LINKS.map((link) =>
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMoreOpen(false)}
                  className={`block px-4 py-2.5 font-body text-[11px] tracking-widest uppercase transition-colors hover:bg-primary/8 ${
                  location.pathname === link.path ? 'gradient-gold-text' : 'text-foreground/80 hover:text-foreground font-medium'}`
                  }>
                  
                      {link.label}
                    </Link>
                )}
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </div>

        {/* Search + Mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-border/40 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all">
            
            <Search className="w-4 h-4" />
          </button>
          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && <SiteSearch onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border/60 bg-background/97 backdrop-blur-xl">
          
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`font-body text-sm tracking-widest uppercase py-2.5 border-b border-border/20 ${
              location.pathname === link.path ? 'text-primary' : 'text-foreground/80 font-medium'}`
              }>
              
                  {link.label}
                </Link>
            )}
              <p className="font-body text-[9px] tracking-[0.25em] uppercase text-muted-foreground/40 mt-3 mb-1">More</p>
              {MORE_LINKS.map((link) =>
            <Link
              key={link.path + '-more'}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`font-body text-xs tracking-widest uppercase py-2 border-b border-border/10 ${
              location.pathname === link.path ? 'text-primary' : 'text-foreground/65 hover:text-foreground font-medium'}`
              }>
              
                  {link.label}
                </Link>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

}