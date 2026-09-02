import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function Footer() {
  const [form, setForm] = useState({ name: '', email: '', consent_updates: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: bizSettings = [] } = useQuery({
    queryKey: ['BusinessProfileSettings'],
    queryFn: () => base44.entities.BusinessProfileSettings.list('-updated_date', 1),
  });

  const contactEmail = bizSettings[0]?.public_support_email || 'gannonwayemusic@gmail.com';
  const instagramUrl = bizSettings[0]?.instagram_url || 'https://www.instagram.com/gann0nwaye';
  const tiktokUrl = bizSettings[0]?.tiktok_url || 'https://www.tiktok.com/@gann0nwaye';
  const youtubeUrl = bizSettings[0]?.youtube_url || 'https://www.youtube.com/@gannonwayeofficial';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.consent_updates) {
      setError('Please confirm that you would like to receive updates.');
      return;
    }

    setLoading(true);
    try {
      await base44.entities.EmailSubscriber.create({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        consent_updates: true,
        consent_at: new Date().toISOString(),
        source: 'public_footer',
        unsubscribed: false,
      });
      setSubmitted(true);
    } catch {
      setError('The signup could not be saved. Please try again.');
    } finally {
      setLoading(false);
    }
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
              Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
            </p>
          </div>

          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Navigate</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Home</Link>
              <Link to="/biography" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Biography</Link>
              <Link to="/music" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Music</Link>
              <Link to="/lyrics" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Lyrics</Link>
              <Link to="/store" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Store</Link>
              <Link to="/press" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Press</Link>
              <Link to="/remember-mum" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Mum Tribute</Link>
              <Link to="/contact" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Contact</h4>
            <p className="font-body text-sm text-foreground/70 mb-1">For music, media, collaboration, and business enquiries</p>
            <a href={`mailto:${contactEmail}`} className="font-body text-sm text-primary hover:underline block mb-4">{contactEmail}</a>

            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy-policy" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Terms of Service</Link>
            </div>

            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mt-4 mb-3">Social</h4>
            <div className="flex flex-col gap-2">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Instagram @gann0nwaye</a>
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">TikTok @gann0nwaye</a>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">YouTube @gannonwayeofficial</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-10 border-t border-border/40 text-center">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Stay connected</p>
          <h3 className="font-display text-xl text-foreground mb-4">Music and merchandise updates</h3>

          {submitted ? (
            <div className="space-y-2">
              <p className="font-body text-base text-primary">You're on the list. Thank you. 🤍</p>
              <p className="font-body text-sm text-muted-foreground">Your details have been recorded for future updates.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                autoComplete="name"
              />
              <input
                type="email"
                placeholder="Your email address"
                value={form.email}
                onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                autoComplete="email"
              />
              <label className="flex items-start gap-3 rounded-lg border border-border/30 bg-card/30 p-3 text-left cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent_updates}
                  onChange={event => setForm(current => ({ ...current, consent_updates: event.target.checked }))}
                  className="mt-0.5 accent-yellow-500"
                />
                <span className="font-body text-xs text-foreground/65 leading-relaxed">
                  I would like to receive music and merchandise updates. I can unsubscribe at any time.
                </span>
              </label>
              {error && <p className="font-body text-xs text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 rounded-lg bg-primary text-primary-foreground font-body text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Join the Update List'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border/40 flex flex-col items-center gap-2 text-center">
          <p className="font-body text-[10px] text-muted-foreground/60">
            Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
          </p>
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gannon Waye. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
