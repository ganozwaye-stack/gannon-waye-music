import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music2 } from 'lucide-react';

const THANK_YOU = {
  id: 'thankyou',
  slug: 'thankyou',
  title: 'THANKYOU',
  artist: 'Gannon Waye',
  artwork_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6dde7d697_2.jpg',
  lyrics: '',
  note: 'Official lyrics have not been added to the site yet. Stream THANKYOU now and return here once the lyric sheet is published.',
};

function slugify(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function LyricsDetail() {
  const { songId } = useParams();
  const { data: releases = [] } = useQuery({
    queryKey: ['lyrics-detail-releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    initialData: [],
  });

  const release = songId === 'thankyou'
    ? THANK_YOU
    : releases.find(r => r.id === songId || slugify(r.title) === songId);

  if (!release) {
    return (
      <div className="min-h-screen py-24 px-4 max-w-3xl mx-auto">
        <Link to="/lyrics" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Lyrics
        </Link>
        <div className="text-center py-20">
          <Music2 className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
          <h1 className="font-display text-4xl text-foreground">Lyrics not found</h1>
          <p className="font-body text-muted-foreground mt-3">This song does not have a lyric page yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/lyrics" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> All Lyrics
        </Link>

        <div className="grid md:grid-cols-[280px_1fr] gap-8 mt-10 items-start">
          <div className="rounded-2xl overflow-hidden border border-primary/25 bg-card">
            {release.artwork_url ? (
              <img src={release.artwork_url} alt={release.title} className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square bg-secondary/40 flex items-center justify-center">
                <Music2 className="w-14 h-14 text-muted-foreground/20" />
              </div>
            )}
          </div>

          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Lyrics</p>
            <h1 className="font-display text-5xl text-foreground">{release.title}</h1>
            <p className="font-body text-sm text-muted-foreground mt-2">{release.artist || 'Gannon Waye'}</p>

            {release.lyrics ? (
              <pre className="mt-8 whitespace-pre-wrap font-display text-lg leading-loose text-foreground/82 bg-card/45 border border-border/40 rounded-2xl p-6">
                {release.lyrics}
              </pre>
            ) : (
              <div className="mt-8 bg-card/45 border border-border/40 rounded-2xl p-6">
                <p className="font-body text-muted-foreground leading-relaxed">{release.note || 'Official lyrics are being prepared.'}</p>
                <Link to="/current-single">
                  <Button className="gradient-gold-button border-0 rounded-full mt-5">Open THANKYOU</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
