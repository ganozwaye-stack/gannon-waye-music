import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SiteSearch from '@/components/public/SiteSearch';


const BANNER_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5de42a778_60a7df62-cfa1-4cba-9280-c5ac4dfcbfa5.png';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Music', path: '/music' },
  { label: 'Lyrics', path: '/lyrics' },
  { label: 'Store', path: '/store' },
  { label: 'About', path: '/about' },
  { label: 'Press', path: '/videos' },
  { label: 'Subscribe', path: '/community' },
  { label: 'Contact', path: '/contact' },
  { label: 'More', path: '/this-is-my-life' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="mx-auto flex max-w-[1210px] items-center justify-between px-5 py-2.5 md:px-6">
        <Link
          to="/"
          aria-label="Gannon Waye — Home"
          className="flex items-center justify-center hover:opacity-80 transition-all duration-200 hover:scale-105"
        >
          {/* TODO: replace src with uploaded gold circular GW mark — set gwLogoUrl in SiteSettings or upload to /files/public/... */}
          {/* Using text fallback until asset is uploaded */}
          <div className="flex h-10 w-auto items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9f792d]/72 bg-[#10110f]/72">
              <span className="font-display text-xs font-semibold text-[#c9aa63]">GW</span>
            </div>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map(link => {
            const active = location.pathname === link.path;
            const isHighlighted = link.highlight || link.path === '/store';
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-[10px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 hover:text-[#d0b06c] ${
                  isHighlighted
                    ? active
                      ? 'rounded-full border border-[#9f792d] bg-[#9f792d]/10 px-4 py-1.5 text-[#d0b06c]'
                      : 'rounded-full border border-[#9f792d]/75 px-4 py-1.5 text-[#c9aa63] hover:bg-[#9f792d]/10'
                    : active
                      ? 'text-[#d0b06c]'
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
