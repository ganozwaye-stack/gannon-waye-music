import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Mail, ExternalLink, Heart, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PreSave() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: releases } = useQuery({
    queryKey: ['upcomingReleasesPresave'],
    queryFn: () => base44.entities.Release.filter({ is_published: true }),
    initialData: [],
  });

  const upcomingRelease = useMemo(() => {
    const now = new Date();
    return releases
      .filter(r => r.release_date && new Date(r.release_date) > now && r.status !== 'released')
      .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))[0];
  }, [releases]);

  const countdown = useMemo(() => {
    if (!upcomingRelease?.release_date) return null;
    const diff = new Date(upcomingRelease.release_date) - new Date();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
    };
  }, [upcomingRelease]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await base44.entities.EmailSubscriber.create({ email });
    } catch (_) { /* already exists is fine */ }
    setSubmitted(true);
  };

  const platforms = [
    { name: 'Spotify', url: upcomingRelease?.spotify_link },
    { name: 'Apple Music', url: upcomingRelease?.apple_music_link },
    { name: 'YouTube', url: upcomingRelease?.youtube_link },
    ...(upcomingRelease?.other_links || []).map(l => ({ name: l.platform, url: l.url })),
  ].filter(p => p.url);

  if (!upcomingRelease) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Music className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-body text-muted-foreground">No upcoming releases to pre-save right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
      {upcomingRelease.artwork_url && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 mx-auto max-w-sm">
          <img src={upcomingRelease.artwork_url} alt={upcomingRelease.title} className="w-full rounded-2xl shadow-2xl" />
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <p className="font-body text-xs text-primary tracking-widest uppercase mb-3">Coming Soon</p>
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">{upcomingRelease.title}</h1>
        {upcomingRelease.description && <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">{upcomingRelease.description}</p>}
      </motion.div>

      {countdown && (
        <div className="flex justify-center gap-8 mb-10">
          {[
            { label: 'Days', value: countdown.days },
            { label: 'Hours', value: countdown.hours },
            { label: 'Minutes', value: countdown.minutes },
          ].map(unit => (
            <div key={unit.label} className="text-center">
              <p className="font-display text-4xl text-primary">{String(unit.value).padStart(2, '0')}</p>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">{unit.label}</p>
            </div>
          ))}
        </div>
      )}

      {platforms.length > 0 && (
        <div className="space-y-3 mb-10">
          <p className="font-body text-sm text-muted-foreground text-center mb-4">Pre-save now so it's in your library the moment it drops</p>
          {platforms.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
              <Button className="w-full gap-2" variant="outline">
                <ExternalLink className="w-4 h-4" /> Pre-save on {p.name}
              </Button>
            </a>
          ))}
        </div>
      )}

      <div className="border border-border/40 rounded-2xl p-6 bg-card/50">
        {submitted ? (
          <div className="text-center">
            <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="font-body text-sm text-foreground">You're on the list! We'll let you know the moment it drops.</p>
          </div>
        ) : (
          <form onSubmit={handleSignup}>
            <p className="font-body text-sm text-foreground mb-1">Get notified on release day</p>
            <p className="font-body text-xs text-muted-foreground mb-4">One email. No spam. Just music.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1" />
              <Button type="submit" className="gap-2">
                <Mail className="w-4 h-4" /> Notify Me
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}