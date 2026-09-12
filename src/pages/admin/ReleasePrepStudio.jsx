import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import HeroDesignEditor from '@/components/admin/hero-design/HeroDesignEditor';
import UnearthedPack from '@/components/admin/UnearthedPack';
import { Lock, Music, Palette, FileText, Radio } from 'lucide-react';

// Private, non-public workspace: manage releases, edit the hero artwork and
// update the bio in one place. Fans never see any work in progress here. A
// release only goes public through the usual owner approval gates.

const TABS = [
  { key: 'releases', label: 'Releases', icon: Music },
  { key: 'hero', label: 'Hero Artwork', icon: Palette },
  { key: 'bio', label: 'Bio', icon: FileText },
  { key: 'unearthed', label: 'Unearthed Submission', icon: Radio },
];

const RELEASE_STATUSES = ['idea', 'writing', 'pre_production', 'recording', 'mixing', 'mastering', 'ready', 'released'];
const GENRES = ['singer_songwriter', 'folk', 'soul', 'pop', 'rnb', 'hip_hop', 'spoken_word', 'cinematic', 'rock', 'other'];
const MOODS = ['reflective', 'tender', 'raw', 'uplifting', 'melancholic', 'hopeful', 'anthemic', 'intimate', 'other'];
const STATUS_COLORS = {
  released: 'bg-green-500/10 text-green-400', ready: 'bg-blue-500/10 text-blue-400',
  mastering: 'bg-purple-500/10 text-purple-400', mixing: 'bg-purple-500/10 text-purple-400',
  recording: 'bg-orange-500/10 text-orange-400',
};

function ReleasesTab({ releases }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState(null);
  const release = releases.find((r) => r.id === selectedId) || releases[0] || null;
  const [draft, setDraft] = useState({});

  useEffect(() => {
    if (release) {
      setDraft({
        title: release.title || '',
        status: release.status || 'idea',
        release_date: release.release_date || '',
        genre: release.genre || '',
        mood: release.mood || '',
        description: release.description || '',
        current_single_hero_copy: release.current_single_hero_copy || '',
        current_single_behind_story: release.current_single_behind_story || '',
        spotify_link: release.spotify_link || '',
        apple_music_link: release.apple_music_link || '',
        youtube_link: release.youtube_link || '',
      });
    }
  }, [release?.id]);

  const save = useMutation({
    mutationFn: () => base44.entities.Release.update(release.id, draft),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['release-prep-releases'] });
      toast({ title: 'Release saved privately.' });
    },
  });

  if (!releases.length) {
    return <p className="font-body text-sm text-muted-foreground py-8 text-center">No releases yet.</p>;
  }

  const set = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      {/* Release list */}
      <div className="space-y-2">
        {releases.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedId(r.id)}
            className={`w-full text-left p-3 rounded-xl border transition-colors ${release?.id === r.id ? 'border-primary/60 bg-primary/10' : 'border-border/40 hover:border-primary/30'}`}
          >
            <p className="font-body text-sm font-semibold text-foreground truncate">{r.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`text-[9px] uppercase tracking-wider border-0 ${STATUS_COLORS[r.status] || 'bg-secondary text-muted-foreground'}`}>
                {r.status ? r.status.replace(/_/g, ' ') : 'idea'}
              </Badge>
              <span className="font-body text-[10px] text-muted-foreground">{r.release_date || 'no date'}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel next to the selected release */}
      {release && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4 mb-4">
              {release.artwork_url && (
                <img src={release.artwork_url} alt={`${release.title} artwork`} className="w-14 h-14 rounded-lg object-cover border border-border/40" />
              )}
              <div>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">Private working copy</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">Fans never see these changes. Public visibility needs your usual approval gates.</p>
              </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">Title</Label>
                  <Input value={draft.title || ''} onChange={(e) => set('title', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">Status</Label>
                  <Select value={draft.status} onValueChange={(v) => set('status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RELEASE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">Release date</Label>
                  <Input type="date" value={draft.release_date || ''} onChange={(e) => set('release_date', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">Genre</Label>
                  <Select value={draft.genre || '__none__'} onValueChange={(v) => set('genre', v === '__none__' ? '' : v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Not tagged</SelectItem>
                      {GENRES.map((g) => <SelectItem key={g} value={g}>{g.replace(/_/g, ' ')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">Mood</Label>
                  <Select value={draft.mood || '__none__'} onValueChange={(v) => set('mood', v === '__none__' ? '' : v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Not tagged</SelectItem>
                      {MOODS.map((m) => <SelectItem key={m} value={m}>{m.replace(/_/g, ' ')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">Spotify link</Label>
                  <Input value={draft.spotify_link || ''} onChange={(e) => set('spotify_link', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">Apple Music link</Label>
                  <Input value={draft.apple_music_link || ''} onChange={(e) => set('apple_music_link', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs">YouTube link</Label>
                  <Input value={draft.youtube_link || ''} onChange={(e) => set('youtube_link', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs">Description</Label>
                <Textarea rows={3} value={draft.description || ''} onChange={(e) => set('description', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs">Hero copy for the current single page</Label>
                <Textarea rows={3} value={draft.current_single_hero_copy || ''} onChange={(e) => set('current_single_hero_copy', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs">Behind the song story</Label>
                <Textarea rows={4} value={draft.current_single_behind_story || ''} onChange={(e) => set('current_single_behind_story', e.target.value)} />
              </div>
              <Button type="button" onClick={() => save.mutate()} disabled={save.isPending} className="gradient-gold-button border-0 rounded-full px-6">
                {save.isPending ? 'Saving...' : 'Save privately'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BioTab() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: siteRecords = [] } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
    initialData: [],
  });
  const siteRecord = siteRecords[0] || null;
  const [bioDraft, setBioDraft] = useState('');

  useEffect(() => {
    if (siteRecords[0]) setBioDraft(siteRecords[0].bio || '');
  }, [siteRecords[0]?.id]);

  const save = useMutation({
    mutationFn: () => siteRecord
      ? base44.entities.SiteSettings.update(siteRecord.id, { bio: bioDraft })
      : base44.entities.SiteSettings.create({ bio: bioDraft }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['siteSettings'] });
      toast({ title: 'Bio saved privately.' });
    },
  });

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">Private working biography</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Draft freely. This copy is admin-only storage, so fans never see changes in progress. Public bio claims still come only from approved releases.
          </p>
        </div>
        <Textarea rows={10} value={bioDraft} onChange={(e) => setBioDraft(e.target.value)} placeholder="Write or paste your bio here..." />
        <Button type="button" onClick={() => save.mutate()} disabled={save.isPending} className="gradient-gold-button border-0 rounded-full px-6">
          {save.isPending ? 'Saving...' : 'Save bio'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ReleasePrepStudio() {
  const [tab, setTab] = useState('releases');
  const { data: releases = [] } = useQuery({
    queryKey: ['release-prep-releases'],
    queryFn: () => base44.entities.Release.list('-release_date', 100),
    initialData: [],
  });

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1 flex items-center gap-1.5">
          <Lock className="w-3 h-3" /> Private Workspace
        </p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Release Prep Studio</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Manage releases, edit the hero artwork and update your bio. Nothing here is public until you approve it.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 font-body text-xs px-3.5 py-2 rounded-lg border transition-all ${tab === t.key ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}
            >
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'releases' && <ReleasesTab releases={releases} />}
      {tab === 'hero' && <HeroDesignEditor />}
      {tab === 'bio' && <BioTab />}
      {tab === 'unearthed' && <UnearthedPack />}
    </div>
  );
}