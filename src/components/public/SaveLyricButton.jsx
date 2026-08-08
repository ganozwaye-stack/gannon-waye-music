import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Heart, Loader2 } from 'lucide-react';

export default function SaveLyricButton({ lyric }) {
  const qc = useQueryClient();
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: saved = [] } = useQuery({
    queryKey: ['savedLyric', lyric.id],
    queryFn: () => base44.entities.SavedLyric.filter({ lyric_id: lyric.id }),
    enabled: !!user,
  });

  const isSaved = saved.length > 0;
  const savedId = saved[0]?.id;

  const toggle = async () => {
    if (!user) {
      base44.auth.redirectToLogin('/lyrics');
      return;
    }
    setBusy(true);
    try {
      if (isSaved) {
        await base44.entities.SavedLyric.delete(savedId);
      } else {
        await base44.entities.SavedLyric.create({
          lyric_id: lyric.id,
          lyric_title: lyric.title,
          release_title: lyric.release_title || null,
        });
      }
      qc.invalidateQueries({ queryKey: ['savedLyric', lyric.id] });
      qc.invalidateQueries({ queryKey: ['savedLyrics'] });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-xs tracking-wider uppercase transition-all border ${
        isSaved
          ? 'border-primary/60 text-primary bg-primary/10'
          : 'border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary'
      }`}
    >
      {busy ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-primary' : ''}`} />
      )}
      {isSaved ? 'Saved' : 'Save to Favourites'}
    </button>
  );
}