import { Link } from 'react-router-dom';
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
  const launchPacketHeld = result.launch_packet === 'held';

  return (
    <div className="mt-6 border border-border/40 rounded-xl p-4 bg-card/40">
      <p className="font-display text-lg text-foreground mb-1">
        Private release-draft report
      </p>

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
        ok={launchPacketHeld}
        warn={!launchPacketHeld}
        label={launchPacketHeld ? 'Automatic launch-packet generation is held' : 'Launch-packet state needs review'}
        detail="Private release creation never generates campaign material. Prepare and approve individual drafts only when you choose."
      />
      <ResultRow
        ok={!!result.hero_draft_id}
        warn={!result.hero_draft_id}
        label={result.hero_draft_id ? 'Hero design draft created' : 'No hero design draft created automatically'}
        detail={result.hero_draft_id
          ? 'A private Canvas Studio draft featuring this release. The public hero is unchanged until you take it live yourself.'
          : 'Create a private hero draft later if and when you choose.'}
      />
      <ResultRow
        ok={!!pack.press_release}
        warn={!pack.press_release}
        label={pack.press_release ? 'Press release drafted' : 'Press release shell left blank'}
        detail={pack.press_release
          ? 'Waiting for your review in the Content Studio. Not approved for any use.'
          : 'Write or paste approved press copy from the Content Studio when you choose.'}
      />
      <ResultRow
        ok={!!pack.playlist_pitch}
        warn={!pack.playlist_pitch}
        label={pack.playlist_pitch ? 'Playlist pitch drafted' : 'Playlist pitch shell left blank'}
        detail={pack.playlist_pitch
          ? 'Waiting for your review in the Content Studio.'
          : 'Write or paste an approved pitch from the Content Studio.'}
      />
      <ResultRow
        ok={!!pack.subscriber_email}
        warn={!pack.subscriber_email}
        label={pack.subscriber_email ? 'Fan email staged' : 'Fan email shell left blank'}
        detail={pack.subscriber_email
          ? 'Waiting in the Release Email Studio. Nothing sends until you approve it there.'
          : 'Write or paste approved email copy.'}
      />
      <ResultRow
        ok={pack.social_count > 0}
        warn={pack.social_count === 0}
        label={pack.social_count > 0 ? `${pack.social_count} social post drafts created` : 'No social drafts created'}
        detail={pack.social_count > 0
          ? 'Hooks, captions, hashtags, visual direction and DM keywords, ready for your review in the Content Studio.'
          : 'No social drafts are created automatically. Add them manually when you choose.'}
      />
      <ResultRow
        ok={pack.merch_count > 0}
        warn={pack.merch_count === 0}
        label={pack.merch_count > 0 ? `${pack.merch_count} merch concepts drafted` : 'No merch concepts created'}
        detail={pack.merch_count > 0
          ? 'Concept drafts tied to the song story. Design work and approval stay in your hands.'
          : 'No merchandise concepts are created automatically. Add them manually when ready.'}
      />
      <ResultRow
        ok={pack.launch_plan_count > 0}
        warn={pack.launch_plan_count === 0}
        label={pack.launch_plan_count > 0 ? `${pack.launch_plan_count} launch-plan steps dated` : 'No launch plan created'}
        detail={pack.launch_plan_count > 0
          ? 'A dated run sheet from 28 days before release to 14 days after. Public-facing steps are flagged for your approval.'
          : 'No launch plan is created automatically. Build your plan from the release checklist when ready.'}
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

      <div className="mt-3 flex flex-wrap gap-2">
        <Link to="/admin/hero-design-studio" className="font-body text-xs tracking-wider uppercase border border-primary/40 text-primary rounded-full px-3 py-1.5 hover:bg-primary/10">Open Hero Design Studio</Link>
        <Link to="/admin/content-studio" className="font-body text-xs tracking-wider uppercase border border-primary/40 text-primary rounded-full px-3 py-1.5 hover:bg-primary/10">Open Content Studio</Link>
        <Link to="/admin/release-email-studio" className="font-body text-xs tracking-wider uppercase border border-primary/40 text-primary rounded-full px-3 py-1.5 hover:bg-primary/10">Open Email Studio</Link>
        <Link to="/admin/releases" className="font-body text-xs tracking-wider uppercase border border-primary/40 text-primary rounded-full px-3 py-1.5 hover:bg-primary/10">Open Releases</Link>
        <Link to="/admin/launch-packet-studio" className="font-body text-xs tracking-wider uppercase border border-primary/40 text-primary rounded-full px-3 py-1.5 hover:bg-primary/10">One Press Launch Packet</Link>
      </div>

      <p className="font-body text-[11px] text-muted-foreground mt-3">
        Everything above is a private draft. Nothing delivers, publishes, posts, sends, schedules, or makes a public claim until you approve each piece separately.
      </p>
    </div>
  );
}