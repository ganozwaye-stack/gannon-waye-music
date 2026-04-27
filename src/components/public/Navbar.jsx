import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Music', path: '/music' },
  { label: 'Store', path: '/store' },
  { label: 'Videos', path: '/videos' },
  { label: 'Community', path: '/community' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 80 36" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldNav" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c9a84c" />
                <stop offset="40%" stopColor="#f5d06e" />
                <stop offset="70%" stopColor="#c9a84c" />
                <stop offset="100%" stopColor="#8b6914" />
              </linearGradient>
            </defs>
            <text
              x="40"
              y="28"
              textAnchor="middle"
              fill="url(#goldNav)"
              fontFamily="'Playfair Display', serif"
              fontSize="28"
              fontStyle="italic"
              fontWeight="700"
              letterSpacing="2"
            >
              GW
            </text>
          </svg>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => {
            const active = location.pathname === link.path;
            const isHighlighted = link.path === '/store' || link.path === '/community';
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm tracking-widest uppercase transition-colors ${
                  isHighlighted
                    ? active
                      ? 'px-4 py-1.5 rounded-full bg-primary text-primary-foreground'
                      : 'px-4 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10'
                    : active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

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