import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

// The one-press release report: everything the submit button did, in one panel.

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
      <p className="font-display text-lg text-foreground mb-1">One-press release report</p>

      <ResultRow
        ok
        label="Release saved to admin"
        detail={`Release date ${result.release_date}${result.auto_publish_on_release_date ? ' · auto-publishing on release day' : ''}`}
      />
      <ResultRow
        ok={!!result.lyric_id}
        warn={!result.lyric_id}
        label={result.lyric_id ? 'Lyrics saved for review' : 'No lyrics provided'}
        detail={result.lyric_id ? 'Held behind the usual lyric review gate.' : 'You can add lyrics later from the Lyrics Archive.'}
      />
      <ResultRow
        ok={pack.press_release}
        warn={!pack.press_release}
        label={pack.press_release ? 'Press release written' : 'Press release placeholder created'}
        detail="Waiting in the Content Studio for your review."
      />
      <ResultRow
        ok={pack.playlist_pitch}
        warn={!pack.playlist_pitch}
        label={pack.playlist_pitch ? 'Playlist pitch written' : 'Playlist pitch placeholder created'}
        detail="Waiting in the Content Studio for your review."
      />
      <ResultRow
        ok={pack.subscriber_email}
        warn={!pack.subscriber_email}
        label={pack.subscriber_email ? 'Subscriber announcement drafted' : 'Subscriber email not drafted'}
        detail={pack.subscriber_email
          ? 'Review it, then send from the Newsletter dashboard on release day.'
          : 'AI writing failed this time. You can write it in the Content Studio.'}
      />
      <ResultRow
        ok={pack.social_count > 0}
        warn={pack.social_count === 0}
        label={pack.social_count > 0 ? `${pack.social_count} reel ideas written` : 'Reel ideas not written'}
        detail="Each is a draft card in the Content Studio with hook, caption, hashtags and visual direction."
      />
      {pack.lyric_quote && (
        <ResultRow ok label="Lyric quote post drafted" detail="The strongest line from your lyric sheet, ready for a quote card." />
      )}
      {pack.manychat && (
        <ResultRow ok label="ManyChat keyword drafted" detail="Trigger word and auto-reply waiting for review." />
      )}
      <ResultRow
        ok={result.pictures === 'generating'}
        warn={result.pictures !== 'generating'}
        label={result.pictures === 'generating' ? 'Playlist pictures generating' : 'Playlist pictures skipped'}
        detail="Two abstract visuals, no faces. They land in the admin gallery as drafts for your review."
      />
      <ResultRow
        ok={result.presave_wired}
        warn={!result.presave_wired}
        label={result.presave_wired ? 'Presave link wired to the release' : 'No presave link provided'}
        detail={result.presave_wired
          ? 'It now lives on the release record and the presave page.'
          : 'Paste the too.fm link next time, or add it from the Releases page later.'}
      />
      <ResultRow
        ok={tooLost?.status === 'created'}
        warn={tooLost?.status === 'reauthorise_required' || tooLost?.status === 'not_configured'}
        label={
          tooLost?.status === 'created' ? `Synced to Too Lost${tooLost.too_lost_release_id ? ` (release #${tooLost.too_lost_release_id})` : ''}` :
          tooLost?.status === 'reauthorise_required' ? 'Too Lost needs re-authorising' :
          tooLost?.status === 'not_configured' ? 'Too Lost not connected yet' :
          'Too Lost sync skipped or failed'
        }
        detail={tooLost?.detail}
      />

      <p className="font-body text-[11px] text-muted-foreground mt-2">
        The final mastered audio still needs uploading in the Too Lost portal. Everything written above
        is a draft until you approve it. Nothing sends itself.
      </p>
    </div>
  );
}