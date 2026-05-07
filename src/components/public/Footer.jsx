import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function Footer() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', how_found: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
    initialData: [],
  });
  const contactEmail = settings[0]?.email_contact || 'hello@gannonwaye.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.how_found) return;
    setLoading(true);
    await base44.entities.EmailSubscriber.create(form);
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="w-12 h-12 rounded-full border border-primary/60 flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(255,224,138,0.08))' }}>
              <span className="font-display text-base gradient-gold-text font-semibold tracking-wider">GW</span>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Australian singer-songwriter crafting honest stories through melody and verse.
            </p>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Navigate</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Home</Link>
              <Link to="/about" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">About</Link>
              <Link to="/music" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Music</Link>
              <Link to="/store" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Store</Link>
              <Link to="/videos" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Videos</Link>
              <Link to="/community" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Community</Link>
              <Link to="/lyrics" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Lyrics</Link>
              <Link to="/this-is-my-life" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">This Is My Life</Link>
              <Link to="/faq" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">FAQ</Link>
              <Link to="/contact" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Contact</Link>
              <Link to="/fan-activity" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Fan Activity</Link>
              <Link to="/back-this" className="font-body text-sm text-primary hover:text-primary/80 transition-colors">Back This Project 🤍</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Contact</h4>
            <p className="font-body text-sm text-foreground/70 mb-1">For bookings and enquiries</p>
            <a href={`mailto:${contactEmail}`} className="font-body text-sm text-primary hover:underline block mb-4">{contactEmail}</a>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy-policy" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
        {/* Email Signup */}
        <div className="mt-12 pt-10 border-t border-border/40 text-center">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Stay in the loop</p>
          <h3 className="font-display text-xl text-foreground mb-4">Tour updates & new music</h3>
          {submitted ? (
            <p className="font-body text-sm text-primary">You're in. Thanks for subscribing.</p>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3">
              <input
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
              <input
                type="tel"
                required
                placeholder="Phone (incl. country code)"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
              <select
                required
                value={form.how_found}
                onChange={e => setForm({...form, how_found: e.target.value})}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              >
                <option value="">How did you find us?</option>
                <option value="google">Google</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="x_twitter">X (Twitter)</option>
                <option value="friend_word_of_mouth">Friend / Word of Mouth</option>
                <option value="i_know_gannon">I know Gannon</option>
                <option value="other">Other</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 rounded-lg bg-primary text-primary-foreground font-body text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
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