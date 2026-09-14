import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import HeroDesignEditor from '@/components/admin/hero-design/HeroDesignEditor';
import UnearthedPack from '@/components/admin/UnearthedPack';
import { Lock, Music, Palette, FileText, Radio } from 'lucide-react';

// Private, non-public workspace: review release information, edit the hero
// artwork, and update the bio in one place. Release records are read-only here.

const TABS = [
  { key: 'releases', label: 'Release Review', icon: Music },
  { key: 'hero', label: 'Hero Artwork', icon: Palette },
  { key: 'bio', label: 'Bio', icon: FileText },
  { key: 'unearthed', label: 'Unearthed Submission', icon: Radio },
];

const STATUS_COLORS = {
  released: 'bg-green-500/10 text-green-400', ready: 'bg-blue-500/10 text-blue-400',
  mastering: 'bg-purple-500/10 text-purple-400', mixing: 'bg-purple-500/10 text-purple-400',
  recording: 'bg-orange-500/10 text-orange-400',
};

function ReadOnlyReleaseField({ label, value, multiline = false }) {
  const displayValue = value == null || value === '' ? 'Not provided' : String(value);

  return (
    <div className="space-y-1.5">
      <Label className="font-body text-xs">{label}</Label>
      {multiline ? (
        <Textarea
          rows={3}
          value={displayValue}
          readOnly
          aria-readonly="true"
          className="resize-none bg-secondary/20"
        />
      ) : (
        <Input value={displayValue} readOnly aria-readonly="true" className="bg-secondary/20" />
      )}
    </div>
  );
}

function ReleasesTab({ releases }) {
  const [selectedId, setSelectedId] = useState(null);
  const release = releases.find((r) => r.id === selectedId) || releases[0] || null;

  if (!releases.length) {
    return <p className="font-body text-sm text-muted-foreground py-8 text-center">No releases yet.</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="space-y-2">
        {releases.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedId(r.id)}
            className={release?.id === r.id
              ? 'w-full text-left p-3 rounded-xl border transition-colors border-primary/60 bg-primary/10'
              : 'w-full text-left p-3 rounded-xl border transition-colors border-border/40 hover:border-primary/30'}
          >
            <p className="font-body text-sm font-semibold text-foreground truncate">{r.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={'text-[9px] uppercase tracking-wider border-0 ' + (STATUS_COLORS[r.status] || 'bg-secondary text-muted-foreground')}>
                {r.status ? r.status.replace(/_/g, ' ') : 'idea'}
              </Badge>
              <span className="font-body text-[10px] text-muted-foreground">{r.release_date || 'no date'}</span>
            </div>
          </button>
        ))}
      </div>

      {release && (
        <Card>
          <CardContent className="p-5 space-y-5">
            <div className="flex items-center gap-4">
              {release.artwork_url && (
                <img src={release.artwork_url} alt={(release.title || 'Release') + ' artwork'} className="w-14 h-14 rounded-lg object-cover border border-border/40" />
              )}
              <div>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">Release review</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  Release records are read-only here. This workspace cannot create, edit, import, publish, or submit a release.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyReleaseField label="Title" value={release.title} />
              <ReadOnlyReleaseField label="Status" value={release.status ? release.status.replace(/_/g, ' ') : ''} />
              <ReadOnlyReleaseField label="Release date" value={release.release_date} />
              <ReadOnlyReleaseField label="Genre" value={release.genre} />
              <ReadOnlyReleaseField label="Mood" value={release.mood} />
              <ReadOnlyReleaseField label="Spotify link" value={release.spotify_link} />
              <ReadOnlyReleaseField label="Apple Music link" value={release.apple_music_link} />
              <ReadOnlyReleaseField label="YouTube link" value={release.youtube_link} />
            </div>

            <ReadOnlyReleaseField label="Description" value={release.description} multiline />
            <ReadOnlyReleaseField label="Hero copy for the current single page" value={release.current_single_hero_copy} multiline />
            <ReadOnlyReleaseField label="Behind the song story" value={release.current_single_behind_story} multiline />

            <p className="font-body text-xs text-muted-foreground">
              Release changes must use the owner-approved, server-side release workflow. No external action can start from this screen.
            </p>
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
          Review release information, edit the hero artwork and update your bio. Release changes require the owner-approved workflow.
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