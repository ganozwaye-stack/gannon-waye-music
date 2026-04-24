import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-lg text-foreground mb-3">Gannon Waye</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Australian singer-songwriter crafting honest stories through melody and verse.
            </p>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Navigate</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Home</Link>
              <Link to="/music" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Music</Link>
              <Link to="/store" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Store</Link>
              <Link to="/community" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Community</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Contact</h4>
            <p className="font-body text-sm text-foreground/70">For bookings and enquiries</p>
            <p className="font-body text-sm text-primary mt-1">hello@gannonwaye.com</p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border/40 text-center">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gannon Waye. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}