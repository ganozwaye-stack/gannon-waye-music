import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

function ResultRow({ ok, warn, label, detail }) {
  const Icon = ok ? CheckCircle2 : (warn ? AlertTriangle : XCircle);
  const color = ok ? 'text-green-400' : (warn ? 'text-primary' : 'text-red-400');
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${color}`} />
      <div>
        <p className="font-body text-sm text-foreground">{label}</p>
        {detail && <p className="font-body text-xs text-muted-foreground mt-0.5">{detail}</p>}
      </div>
    </div>
  );
}

export default function ReleasePackReport({ result }) {
  if (!result) return null;
  const tooLost = result.too_lost;
  const pack = result.pack || {};

  return (
    <div className="mt-6 border border-border/40 rounded-xl p-4 bg-card/40">
      <p className="font-display text-lg text-foreground mb-1">Private release draft report</p>

      <ResultRow
        ok
        label="Release saved privately"
        detail={`Release date ${result.release_date}. Automatic publication is off.`}
      />
      <ResultRow
        ok={!!result.lyric_id}
        warn={!result.lyric_id}
        label={result.lyric_id ? 'Lyrics saved for review' : 'No lyrics provided'}
        detail={result.lyric_id ? 'Held behind the usual lyric review gate.' : 'You can add lyrics later from the Lyrics Archive.'}
      />
      <ResultRow
        ok={pack.review_shells === 3}
        warn={pack.review_shells !== 3}
        label={pack.review_shells === 3 ? 'Three private review shells created' : 'Review shells need attention'}
        detail="Press, playlist-pitch and subscriber-email drafts are blank until you choose what to write or paste."
      />
      <ResultRow
        ok={result.presave_wired}
        warn={!result.presave_wired}
        label={result.presave_wired ? 'Presave link stored privately' : 'No presave link provided'}
        detail={result.presave_wired
          ? 'The link is stored on the private release record; it has not been made public.'
          : 'You can add a verified link later.'}
      />
      <ResultRow
        ok={result.external_actions === 'held'}
        warn={result.external_actions !== 'held'}
        label={result.external_actions === 'held' ? 'All external actions are held' : 'External-action state needs review'}
        detail={tooLost?.detail || 'Publication, delivery, email, posting and scheduling remain unavailable from this draft.'}
      />

      <p className="font-body text-[11px] text-muted-foreground mt-2">
        Nothing from this screen delivers, publishes, posts, sends, schedules, or makes a public claim.
      </p>
    </div>
  );
}
