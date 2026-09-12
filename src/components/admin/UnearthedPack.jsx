import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, ListChecks, Music } from 'lucide-react';

// Organises every release detail into copy-ready blocks tailored to the
// Triple J Unearthed upload form. Private admin tool: nothing here publishes
// anything, it just gets the details onto the clipboard in the right shape.

const GENRE_LABELS = {
  singer_songwriter: 'Singer-songwriter',
  folk: 'Folk',
  soul: 'Soul',
  pop: 'Pop',
  rnb: 'R&B / Soul',
  hip_hop: 'Hip Hop',
  spoken_word: 'Spoken Word',
  cinematic: 'Cinematic / Soundtrack',
  rock: 'Rock',
  other: '',
};

const MOOD_LABELS = {
  reflective: 'Reflective',
  tender: 'Tender',
  raw: 'Raw',
  uplifting: 'Uplifting',
  melancholic: 'Melancholic',
  hopeful: 'Hopeful',
  anthemic: 'Anthemic',
  intimate: 'Intimate',
  other: '',
};

function CopyBlock({ label, text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Card className="bg-card/60">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">{label}</p>
          <button type="button" onClick={copy} className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground">
            {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="font-body text-sm text-foreground/80 whitespace-pre-wrap max-h-44 overflow-y-auto">
          {text || 'Not filled in on this release yet.'}
        </div>
      </CardContent>
    </Card>
  );
}

const CHECKLIST = [
  'Final audio file ready: Unearthed needs the track as an MP3 upload.',
  'You must own or control 100% of the recording and the song.',
  'Artwork: square image, at least 1400 x 1400 px. Download it from the Artwork block below.',
  'Lyrics must match the recording exactly.',
  'Location is set so triple j can place you: Melbourne, VIC.',
  'Fill in credits: who produced, mixed, mastered and played on the track.',
];

export default function UnearthedPack() {
  const { data: releases = [] } = useQuery({
    queryKey: ['unearthed-releases'],
    queryFn: () => base44.entities.Release.list('-release_date', 100),
    initialData: [],
  });

  const [selectedId, setSelectedId] = useState('');
  const release = releases.find((r) => r.id === selectedId) || releases[0] || null;

  const blocks = release ? [
    ['Artist name', 'Gannon Waye'],
    ['Location', 'Melbourne, VIC, Australia'],
    ['Track title', release.title || ''],
    ['Genre', GENRE_LABELS[release.genre] || ''],
    ['Mood and tags', [MOOD_LABELS[release.mood], GENRE_LABELS[release.genre]].filter(Boolean).join(', ')],
    ['Release date', release.release_date || ''],
    ['Track description', release.current_single_behind_story || release.description || ''],
    ['Lyrics', release.lyrics || ''],
    ['Credits', release.credits || ''],
    ['Artwork', release.artwork_url || ''],
    ['Streaming links', [
      release.spotify_link ? `Spotify: ${release.spotify_link}` : '',
      release.apple_music_link ? `Apple Music: ${release.apple_music_link}` : '',
      release.youtube_link ? `YouTube: ${release.youtube_link}` : '',
    ].filter(Boolean).join('\n')],
  ] : [];

  const fullText = blocks.map(([label, text]) => `${label.toUpperCase()}\n${text}`).join('\n\n');
  const [allCopied, setAllCopied] = useState(false);
  const copyAll = () => {
    navigator.clipboard.writeText(fullText);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="space-y-1.5 min-w-60">
          <p className="font-body text-xs text-muted-foreground">Release to submit</p>
          <Select value={release?.id || ''} onValueChange={setSelectedId}>
            <SelectTrigger className="w-72"><SelectValue placeholder="Choose a release" /></SelectTrigger>
            <SelectContent>
              {releases.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          onClick={copyAll}
          disabled={!release}
          className="gradient-gold-button border-0 rounded-full px-6"
        >
          {allCopied ? <><Check className="w-4 h-4" /> Copied everything</> : <><Copy className="w-4 h-4" /> Copy everything</>}
        </Button>
      </div>

      {releases.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
          <Music className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No releases yet. Create one first, then come back to build the submission pack.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {blocks.map(([label, text]) => (
              <CopyBlock key={label} label={label} text={text} />
            ))}
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-2">
              <p className="font-body text-sm font-semibold text-primary flex items-center gap-2">
                <ListChecks className="w-4 h-4" /> Before you upload to Unearthed
              </p>
              {CHECKLIST.map((item) => (
                <p key={item} className="font-body text-xs text-foreground/80 flex items-start gap-2">
                  <Check className="w-3 h-3 text-primary shrink-0 mt-0.5" /> {item}
                </p>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}