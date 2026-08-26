import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function Footer() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date_of_birth: '', how_found: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.how_found) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await base44.entities.EmailSubscriber.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        date_of_birth: form.date_of_birth || null,
        how_found: form.how_found,
      });
    } catch {
      // Non-blocking — still show success if duplicate
    }
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
              <Link to="/music" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Music</Link>
              <Link to="/lyrics" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Lyrics</Link>
              <Link to="/store" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Store</Link>
              <Link to="/press" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Press</Link>
              <Link to="/back-this" className="font-body text-sm text-primary hover:text-primary/80 transition-colors">Subscribe 🤍</Link>
              <Link to="/community" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Community</Link>
              <Link to="/biography" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Biography</Link>
              <Link to="/lyric-library" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Lyric Library</Link>
              <Link to="/mixing-services" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Mixing Services</Link>
              <Link to="/gift-cards" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Gift Cards</Link>
              <Link to="/remember-mum" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Mum Tribute</Link>
              <Link to="/systems-manager" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Systems Manager</Link>
              <Link to="/contact" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Contact</h4>
            <p className="font-body text-sm text-foreground/70 mb-1">For press, management &amp; enquiries</p>
            <a href={`mailto:${contactEmail}`} className="font-body text-sm text-primary hover:underline block mb-4">{contactEmail}</a>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy-policy" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/contact" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Contact Gannon</Link>
            </div>
            <h4 className="font-body text-xs tracking-widest uppercase text-muted-foreground mt-4 mb-3">Social</h4>
            <div className="flex flex-col gap-2">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">Instagram @gann0nwaye</a>
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">TikTok @gann0nwaye</a>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-foreground/70 hover:text-primary transition-colors">YouTube @gannonwayeofficial</a>
            </div>
          </div>
        </div>
        {/* Email Signup */}
        <div className="mt-12 pt-10 border-t border-border/40 text-center">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Stay in the loop</p>
          <h3 className="font-display text-xl text-foreground mb-4">New music &amp; community updates</h3>
          {submitted ? (
            <div className="space-y-2">
              <p className="font-body text-base text-primary">You're in. Thank you for joining Gannon Waye Music. 🤍</p>
              <p className="font-body text-sm text-muted-foreground">Check your email for a welcome message from Gannon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3">
              <input
                type="text"
                placeholder="Your name *"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
              <input
                type="email"
                placeholder="your@email.com *"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
              <input
                type="tel"
                placeholder="Phone incl. country code e.g. +61 400 000 000 *"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
              <input
                type="date"
                value={form.date_of_birth}
                onChange={e => setForm({...form, date_of_birth: e.target.value})}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
                title="Birthday (optional — we'll send you something special)"
              />
              <p className="font-body text-[10px] text-muted-foreground -mt-1">Birthday optional — we'll send you something special 🎂</p>
              <select
                value={form.how_found}
                onChange={e => setForm({...form, how_found: e.target.value})}
                className="w-full bg-secondary/50 border border-border/40 rounded-lg px-4 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              >
                <option value="">How did you find me? *</option>
                <option value="google">Google</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="x_twitter">X (Twitter)</option>
                <option value="friend_word_of_mouth">Friend / Word of Mouth</option>
                <option value="i_know_gannon">I know Gannon</option>
                <option value="other">Other</option>
              </select>
              {error && <p className="font-body text-xs text-destructive">{error}</p>}
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

        {/* Legal Disclaimers */}
        <div className="mt-6 text-[10px] text-muted-foreground/60 max-w-2xl mx-auto space-y-1.5 leading-normal">
          <p>
            * Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible.
          </p>

        </div>

        <div className="mt-4 pt-4 border-t border-border/40 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/094c64c87_image.png"
              alt="GW Heart"
              className="w-10 h-10 object-contain"
            />
            <Link
              to="/back-this"
              className="font-body text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Support the project 🤍
            </Link>
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/094c64c87_image.png"
              alt="GW Heart"
              className="w-10 h-10 object-contain"
            />
          </div>
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Gannon Waye. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}