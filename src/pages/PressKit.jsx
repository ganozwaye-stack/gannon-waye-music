import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ExternalLink, Music, Mail, Download, Image as ImageIcon, FileText, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getReleaseArtwork } from '@/config/releaseAssets';
import { WITHOUT_YOU_HERE_RELEASE_DATE_TEXT } from '@/config/releaseSchedule';

const BIO = `Gannon Waye is a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to him — it's the language he uses to understand people, emotion, and the parts of life that don't always have words.

His debut single "Thank You" marks the beginning of a deeply personal catalog. His upcoming single "Without You Here," releasing ${WITHOUT_YOU_HERE_RELEASE_DATE_TEXT}, is a raw acoustic letter to his late mother — written on Mother's Day and produced by Will Henderson.

Gannon's work explores self-worth, boundaries, grief, and the courage to choose yourself. This is more than music. This is choosing yourself.`;

const SHORT_BIO = `Gannon Waye is a Melbourne-based singer-songwriter exploring self-worth, grief, and the courage to choose yourself. Debut single "Thank You" out now.`;

const SOCIAL_LINKS = [
  { label: 'Spotify', url: 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz', icon: Headphones },
  { label: 'Apple Music', url: 'https://music.apple.com/artist/gannon-waye', icon: Music },
  { label: 'Instagram', url: 'https://instagram.com/gannonwaye', icon: ExternalLink },
  { label: 'TikTok', url: 'https://tiktok.com/@gannonwaye', icon: ExternalLink },
];

export default function PressKit() {
  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
  });

  const { data: galleryImages = [] } = useQuery({
    queryKey: ['pressKitPhotos'],
    queryFn: () => base44.entities.GalleryImage.list('-image_date', 50),
  });

  const pressPhotos = galleryImages.filter(g => g.is_published && ['professional_photo', 'press', 'behind_scenes'].includes(g.category));
  const publishedReleases = releases.filter(r => r.is_published);
  const currentSingle = releases.find(r => r.is_current_single);

  const downloadImage = (url, title) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = title || 'gannon-waye-press-photo';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyBio = () => {
    navigator.clipboard.writeText(BIO);
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-1">For Media & Partners</p>
          <h1 className="font-display text-4xl text-foreground">Press Kit</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Gannon Waye — Singer, Songwriter, Storyteller</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyBio} className="gap-2">
            <FileText className="w-3.5 h-3.5" /> Copy Bio
          </Button>
          <a href="mailto:gannonwayemusic@gmail.com">
            <Button size="sm" className="gap-2">
              <Mail className="w-3.5 h-3.5" /> Book / Enquire
            </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Bio + Contact (spans 1) */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-card/50 border border-border/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl text-foreground">Artist Bio</h2>
            </div>
            <p className="font-body text-xs text-muted-foreground mb-2">Short version:</p>
            <p className="font-body text-sm text-foreground/70 leading-relaxed mb-4 italic">{SHORT_BIO}</p>
            <p className="font-body text-xs text-muted-foreground mb-2">Full bio:</p>
            <p className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-line">{BIO}</p>
          </section>

          <section className="bg-card/50 border border-border/40 rounded-xl p-6">
            <h2 className="font-display text-xl text-foreground mb-4">Social & Streaming</h2>
            <div className="space-y-2">
              {SOCIAL_LINKS.map(link => {
                const Icon = link.icon;
                return (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="font-body text-sm text-foreground">{link.label}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                );
              })}
            </div>
          </section>

          <section className="bg-card/50 border border-border/40 rounded-xl p-6">
            <h2 className="font-display text-xl text-foreground mb-4">Contact</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:gannonwayemusic@gmail.com" className="font-body text-sm text-foreground hover:text-primary transition-colors">gannonwayemusic@gmail.com</a>
              </div>
              <p className="font-body text-xs text-muted-foreground">For interviews, features, sync licensing, and press inquiries.</p>
            </div>
          </section>
        </div>

        {/* Right column — Photos + Releases (spans 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Single Feature */}
          {currentSingle && (
            <section className="bg-gradient-to-br from-primary/10 to-card border border-primary/30 rounded-xl p-6">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-2">Current Single</p>
              <div className="flex items-start gap-4">
                {getReleaseArtwork(currentSingle) && (
                  <img src={getReleaseArtwork(currentSingle)} alt={currentSingle.title} className="w-24 h-24 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1">
                  <h2 className="font-display text-2xl text-foreground mb-1">{currentSingle.title}</h2>
                  {currentSingle.current_single_hero_copy && <p className="font-body text-sm text-foreground/70 mb-3">{currentSingle.current_single_hero_copy}</p>}
                  <div className="flex gap-2 flex-wrap">
                    {currentSingle.spotify_link && <a href={currentSingle.spotify_link} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline" className="gap-1.5"><Headphones className="w-3 h-3" /> Spotify</Button></a>}
                    {currentSingle.apple_music_link && <a href={currentSingle.apple_music_link} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline" className="gap-1.5"><Music className="w-3 h-3" /> Apple Music</Button></a>}
                    {currentSingle.youtube_link && <a href={currentSingle.youtube_link} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline" className="gap-1.5"><ExternalLink className="w-3 h-3" /> YouTube</Button></a>}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* High-Res Press Photos */}
          <section className="bg-card/50 border border-border/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> High-Res Press Photos
              </h2>
              <Badge variant="secondary" className="text-[10px]">{pressPhotos.length} available</Badge>
            </div>
            {pressPhotos.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground text-center py-8">No press photos published yet. Upload photos in the Gallery admin and set category to "Professional Photo" or "Press".</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pressPhotos.map(photo => (
                  <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-border/40 bg-secondary/20">
                    <img src={photo.image_url} alt={photo.title} className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="font-body text-xs text-white font-medium mb-1 truncate">{photo.title}</p>
                      {photo.photographer_credit && <p className="font-body text-[10px] text-white/60 mb-2">© {photo.photographer_credit}</p>}
                      <Button size="sm" variant="outline" className="w-full gap-1.5 bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => downloadImage(photo.image_url, photo.title)}>
                        <Download className="w-3 h-3" /> Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="font-body text-[10px] text-muted-foreground mt-3">Right-click photos and "Save image as" for full resolution. Credit photographer where indicated.</p>
          </section>

          {/* Music / Releases */}
          <section className="bg-card/50 border border-border/40 rounded-xl p-6">
            <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2"><Music className="w-5 h-5 text-primary" /> Music & Release Links</h2>
            {publishedReleases.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No published releases yet.</p>
            ) : (
              <div className="space-y-3">
                {publishedReleases.map(release => (
                  <div key={release.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg hover:bg-secondary/40 transition-colors">
                    {getReleaseArtwork(release) ? (
                      <img src={getReleaseArtwork(release)} alt={release.title} className="w-16 h-16 rounded object-cover shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded bg-secondary flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold text-foreground">{release.title}</p>
                      <p className="font-body text-xs text-muted-foreground">{release.type} · {release.release_date ? new Date(release.release_date).toLocaleDateString('en-AU', { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBA'}</p>
                      {release.credits && <p className="font-body text-[10px] text-muted-foreground/60 mt-0.5 truncate">{release.credits}</p>}
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {release.spotify_link && <a href={release.spotify_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded hover:bg-secondary text-primary" title="Spotify"><Headphones className="w-4 h-4" /></a>}
                      {release.apple_music_link && <a href={release.apple_music_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded hover:bg-secondary text-primary" title="Apple Music"><Music className="w-4 h-4" /></a>}
                      {release.youtube_link && <a href={release.youtube_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded hover:bg-secondary text-primary" title="YouTube"><ExternalLink className="w-4 h-4" /></a>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
