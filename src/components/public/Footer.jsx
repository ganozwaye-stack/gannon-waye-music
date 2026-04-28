import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await base44.entities.EmailSubscriber.create({ email });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png"
              alt="Gannon Waye"
              className="h-14 w-auto object-contain mb-3"
            />
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
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Email Preferences</h4>
            <a href="/email-preferences" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors block mb-4">Choose what you hear from us</a>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Contact</h4>
            <p className="font-body text-sm text-foreground/70">For bookings and enquiries</p>
            <p className="font-body text-sm text-primary mt-1">hello@gannonwaye.com</p>
          </div>
        </div>
        {/* Email Signup */}
        <div className="mt-12 pt-10 border-t border-border/40 text-center">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Stay in the loop</p>
          <h3 className="font-display text-xl text-foreground mb-4">Tour updates & new music</h3>
          {submitted ? (
            <p className="font-body text-sm text-primary">You're in. Thanks for subscribing.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-secondary/50 border border-border/40 rounded-full px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-body text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 text-center">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gannon Waye. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}