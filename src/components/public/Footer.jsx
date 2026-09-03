import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function Footer() {
  const { data: bizSettings = [] } = useQuery({
    queryKey: ['BusinessProfileSettings'],
    queryFn: () => base44.entities.BusinessProfileSettings.list('-updated_date', 1),
  });

  const contactEmail = bizSettings[0]?.public_support_email || 'gannonwayemusic@gmail.com';
  const instagramUrl = bizSettings[0]?.instagram_url || 'https://www.instagram.com/gann0nwaye';
  const tiktokUrl = bizSettings[0]?.tiktok_url || 'https://www.tiktok.com/@gann0nwaye';
  const youtubeUrl = bizSettings[0]?.youtube_url || 'https://www.youtube.com/@gannonwayeofficial';

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/637f52efd_image.png"
              alt="Gannon Waye"
              className="w-12 h-12 rounded-full border border-primary/60 object-cover object-top mb-3"
            />
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

          <p className="font-body text-sm text-muted-foreground mb-4">One clear signup form, with explicit consent, is available on the home page.</p>
          <Link
            to="/#updates"
            className="inline-flex items-center justify-center rounded-full border border-primary/50 px-6 py-2.5 font-body text-sm tracking-wider uppercase gradient-gold-text hover:bg-primary/10 transition-colors"
          >
            Join the Update List
          </Link>
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
