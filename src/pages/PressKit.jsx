import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ExternalLink, Music, Mail } from 'lucide-react';

const BIO = `Gannon Waye is a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to him — it's the language he uses to understand people, emotion, and the parts of life that don't always have words.

His debut single "Thank You" marks the beginning of a deeply personal catalog. His upcoming single "Without You Here," releasing July 23, 2026, is a raw acoustic letter to his late mother — written on Mother's Day and produced by Will Henderson.

Gannon's work explores self-worth, boundaries, grief, and the courage to choose yourself. This is more than music. This is choosing yourself.`;

const SOCIAL_LINKS = [
  { label: 'Spotify', url: 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz' },
  { label: 'Apple Music', url: 'https://music.apple.com/artist/gannon-waye' },
  { label: 'Instagram', url: 'https://instagram.com/gannonwaye' },
  { label: 'TikTok', url: 'https://tiktok.com/@gannonwaye' },
];

export default function PressKit() {
  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
  });

  const publishedReleases = releases.filter(r => r.is_published);

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin</p>
        <h1 className="font-display text-3xl text-foreground">Press Kit</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Gannon Waye — Singer, Songwriter, Storyteller</p>
      </div>

      <section className="mb-6 bg-card/50 border border-border/40 rounded-xl p-6">
        <h2 className="font-display text-xl text-foreground mb-3">Artist Bio</h2>
        <p className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-line">{BIO}</p>
      </section>

      <section className="mb-6 bg-card/50 border border-border/40 rounded-xl p-6">
        <h2 className="font-display text-xl text-foreground mb-4">Music</h2>
        <div className="space-y-3">
          {publishedReleases.length === 0 && <p className="font-body text-xs text-muted-foreground">No published releases yet.</p>}
          {publishedReleases.map(release => (
            <div key={release.id} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
              {release.artwork_url ? (
                <img src={release.artwork_url} alt={release.title} className="w-14 h-14 rounded object-cover" />
              ) : (
                <div className="w-14 h-14 rounded bg-secondary flex items-center justify-center">
                  <Music className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-foreground">{release.title}</p>
                <p className="font-body text-xs text-muted-foreground">{release.type} · {release.release_date ? new Date(release.release_date).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBA'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 bg-card/50 border border-border/40 rounded-xl p-6">
        <h2 className="font-display text-xl text-foreground mb-4">Social & Streaming</h2>
        <div className="grid grid-cols-2 gap-3">
          {SOCIAL_LINKS.map(link => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
              <span className="font-body text-sm text-foreground">{link.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          ))}
        </div>
      </section>

      <section className="bg-card/50 border border-border/40 rounded-xl p-6">
        <h2 className="font-display text-xl text-foreground mb-4">Contact</h2>
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-primary" />
          <a href="mailto:gannonwayemusic@gmail.com" className="font-body text-sm text-foreground hover:text-primary transition-colors">gannonwayemusic@gmail.com</a>
        </div>
      </section>
    </div>
  );
}