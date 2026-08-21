import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function EmbedTimer() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-background">
      <main className="w-full max-w-xl rounded-3xl border border-primary/20 bg-card/55 p-9 md:p-12 text-center">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">
          Verified announcements only
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
          Release updates
        </h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          No release countdown is active. A timer will appear only after Gannon approves the exact title, date, and public announcement.
        </p>
        <Link to="/music" className="inline-block mt-7">
          <Button className="rounded-full gradient-gold-button border-0">Visit Music</Button>
        </Link>
      </main>
    </div>
  );
}
