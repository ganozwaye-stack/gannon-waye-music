import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReleaseDetail() {
  const { id } = useParams();
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Release.get(id)
      .then(setRelease)
      .catch(() => setRelease(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!release) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-body text-muted-foreground mb-4">Release not found.</p>
          <Link to="/music"><Button variant="outline">Back to Music</Button></Link>
        </div>
      </div>
    );
  }

  const platforms = [
    { name: 'Spotify', url: release.spotify_link },
    { name: 'Apple Music', url: release.apple_music_link },
    { name: 'YouTube', url: release.youtube_link },
    ...(release.other_links || []).map(l => ({ name: l.platform, url: l.url })),
  ].filter(p => p.url);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <Link to="/music" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Music
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {release.artwork_url && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <img src={release.artwork_url} alt={release.title} className="w-full rounded-2xl shadow-2xl" />
          </motion.div>
        )}

        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">{release.type || 'Single'}</span>
            {release.release_date && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" /> {new Date(release.release_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">{release.title}</h1>

          {release.description && <p className="font-body text-sm text-muted-foreground mb-6">{release.description}</p>}

          {platforms.length > 0 && (
            <div className="space-y-2 mb-6">
              {platforms.map(p => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-between">
                    Listen on {p.name} <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              ))}
            </div>
          )}

          {release.credits && (
            <div className="border-t border-border/30 pt-4">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Credits</p>
              <p className="font-body text-sm text-foreground/80 whitespace-pre-line">{release.credits}</p>
            </div>
          )}
        </div>
      </div>

      {release.youtube_video_id && (
        <div className="mt-12">
          <h2 className="font-display text-2xl text-foreground mb-4">Music Video</h2>
          <div className="aspect-video rounded-2xl overflow-hidden">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${release.youtube_video_id}`} title={release.title} frameBorder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}

      {release.current_single_behind_story && (
        <div className="mt-12 max-w-2xl">
          <h2 className="font-display text-2xl text-foreground mb-4">Behind the Song</h2>
          <p className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-line">{release.current_single_behind_story}</p>
        </div>
      )}

      {release.lyrics && (
        <div className="mt-12 max-w-2xl">
          <h2 className="font-display text-2xl text-foreground mb-4">Lyrics</h2>
          <p className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-line">{release.lyrics}</p>
        </div>
      )}
    </div>
  );
}