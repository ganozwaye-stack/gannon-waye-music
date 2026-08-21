import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Disc3, Check, Circle } from 'lucide-react';

const STEP_LABELS = {
  song_record: 'Song Record',
  artwork: 'Artwork',
  lyrics_storage: 'Lyrics (Private Storage)',
  lyrics_approval: 'Lyrics Approval',
  story: 'Story Behind the Song',
  release_page: 'Release Page',
  spotify_link: 'Spotify Link',
  apple_music_link: 'Apple Music Link',
  youtube_link: 'YouTube Link',
  press_pitch: 'Press Pitch',
  playlist_pitch: 'Playlist Pitch',
  reel_hooks: 'Reel Hooks',
  merch_tie_in: 'Merch Tie-in',
  newsletter_draft: 'Newsletter Draft',
  manychat_keyword: 'ManyChat Keyword',
  metricool_draft: 'Metricool Draft',
  approval_status: 'Approval Status',
  publish_status: 'Publish Status',
};

const STEP_ORDER = Object.keys(STEP_LABELS);

export default function ReleasePrep() {
  const { data: plans = [] } = useQuery({
    queryKey: ['releaseActionPlans'],
    queryFn: () => base44.entities.ReleaseActionPlan.list('sort_order'),
  });

  const byRelease = plans.reduce((acc, p) => {
    const r = p.release_name || 'Unassigned';
    if (!acc[r]) acc[r] = [];
    acc[r].push(p);
    return acc;
  }, {});

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Disc3 className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Release Preparation Plan</h2>
      </div>

      {Object.keys(byRelease).length === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-4 text-center">No release plans yet.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(byRelease).map(([release, steps]) => {
            const stepMap = {};
            steps.forEach(s => { stepMap[s.step_type] = s; });
            const done = steps.filter(s => s.status === 'complete').length;
            return (
              <div key={release} className="rounded-xl border border-border/30 bg-secondary/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-sm text-foreground">{release}</h3>
                  <span className="font-body text-[10px] text-muted-foreground">{done}/{STEP_ORDER.length} steps</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                  {STEP_ORDER.map((stepType) => {
                    const step = stepMap[stepType];
                    const isDone = step?.status === 'complete';
                    const isBlocked = step?.status === 'blocked';
                    return (
                      <div key={stepType} className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs ${
                        isDone ? 'bg-green-500/10 text-green-400' : isBlocked ? 'bg-red-500/10 text-red-400' : 'bg-secondary/40 text-muted-foreground'
                      }`}>
                        {isDone ? <Check className="w-3 h-3 shrink-0" /> : <Circle className="w-3 h-3 shrink-0" />}
                        <span className="truncate">{STEP_LABELS[stepType]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}