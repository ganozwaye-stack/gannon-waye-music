import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SiteSearch from '@/components/public/SiteSearch';


const BANNER_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5de42a778_60a7df62-cfa1-4cba-9280-c5ac4dfcbfa5.png';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'My Story', path: '/this-is-my-life' },
  { label: 'Music', path: '/music' },
  { label: 'Videos', path: '/videos' },
  { label: 'Community', path: '/community' },
  { label: 'Store', path: '/store' },
  { label: 'Order Status', path: '/order-status' },
  { label: 'Contact', path: '/contact' },
  { label: 'Back This 🤍', path: '/back-this', highlight: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      {/* Banner strip */}
      <div className="relative overflow-hidden" style={{ height: 48 }}>
        <img src={BANNER_URL} alt="Thank You — Gannon Waye · 05 June 2026" className="absolute inset-0 w-full h-full object-cover object-center" style={{ objectPosition: 'center 40%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, hsl(220,15%,6%) 0%, transparent 20%, transparent 80%, hsl(220,15%,6%) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, hsl(220,15%,6%) 0%, transparent 30%, transparent 70%, hsl(220,15%,6%) 100%)' }} />
        <div className="relative z-10 h-full flex items-center justify-center">
          <p className="font-body text-[9px] tracking-[0.35em] uppercase text-foreground/60">Thank You · 05 June 2026 · All Platforms</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          aria-label="Gannon Waye — Home"
          className="flex items-center justify-center hover:opacity-80 transition-all duration-200 hover:scale-105"
        >
          {/* TODO: replace src with uploaded gold circular GW mark — set gwLogoUrl in SiteSettings or upload to /files/public/... */}
          {/* Using text fallback until asset is uploaded */}
          <div className="h-11 md:h-12 w-auto flex items-center justify-center">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-primary/60 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(255,224,138,0.08))' }}>
              <span className="font-display text-sm gradient-gold-text font-semibold tracking-wider">GW</span>
            </div>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => {
            const active = location.pathname === link.path;
            const isHighlighted = link.highlight || link.path === '/store';
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105 ${
                  isHighlighted
                    ? active
                      ? 'px-4 py-1.5 rounded-full bg-primary text-primary-foreground'
                      : 'px-4 py-1.5 rounded-full border border-primary/60 hover:bg-primary/10 gradient-gold-text'
                    : active
                      ? 'gradient-gold-text'
                      : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Search + Mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-border/40 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all"
          >
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
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`font-body text-sm tracking-widest uppercase ${
                    location.pathname === link.path ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}