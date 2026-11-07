import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import ReviewBlock from '@/components/release-control-review/ReviewBlock';
import ArtworkBlock from '@/components/release-control-review/ArtworkBlock';
import ReleaseTitleSearch from '@/components/release-control-review/ReleaseTitleSearch';
import { approveBlocker, errorNotice, isSet } from '@/components/release-control-review/reviewValues';

const IDENTITY = [
  { key: 'title' },
  { key: 'primary_artist' },
  { key: 'version_label' },
  { key: 'status' },
  { key: 'release_date' },
  { key: 'description', long: true },
];

const AUDIO = [
  { key: 'master_audio_url' },
  { key: 'audio_preview_url' },
  { key: 'lyrics_status' },
];

const RIGHTS = [
  { key: 'isrc_code' },
  { key: 'upc_code' },
  { key: 'copyright_line' },
  { key: 'publisher_name' },
  { key: 'songwriter_credits' },
  { key: 'producer_credits' },
  { key: 'rights_evidence_reference' },
  { key: 'master_evidence_reference' },
  { key: 'delivery_evidence_reference' },
  { key: 'public_link_evidence_url' },
];

const CHECKLIST = [
  { key: 'release_checklist_complete' },
  { key: 'release_eligible' },
];

const DESTINATION = [
  { key: 'distributor' },
  { key: 'dsp_list' },
  { key: 'spotify_link' },
  { key: 'apple_music_link' },
  { key: 'youtube_link' },
  { key: 'sync_licensing_status' },
  { key: 'is_published' },
  { key: 'publishing_safe' },
  { key: 'public_release_approval_status' },
  { key: 'approved_by' },
  { key: 'approved_at' },
];

const dataOf = (response) => response?.data ?? response ?? {};

export default function ReleaseReviewApprovalPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState(null);
  const [release, setRelease] = useState(null);
  const [phrase, setPhrase] = useState('');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState(null);

  if (user?.role !== 'admin') return null;

  const loadRelease = async (id) => {
    const record = await base44.entities.Release.get(id);
    setRelease(record);
    setMatches(null);
    setPhrase('');
    return record;
  };

  const chooseRelease = async (id) => {
    setBusy('load');
    setNotice(null);
    try {
      await loadRelease(id);
    } catch (error) {
      setRelease(null);
      setNotice(errorNotice(error));
    } finally {
      setBusy('');
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setSearching(true);
    setSearchedTerm(term);
    setNotice(null);
    setMatches(null);
    setRelease(null);
    setPhrase('');
    try {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const found = await base44.entities.Release.filter(
        { title: { $regex: escaped, $options: 'i' } },
        { sort: 'title', limit: 25 },
      );
      const rows = Array.isArray(found) ? found : found?.items || [];
      if (rows.length === 1) {
        await loadRelease(rows[0].id);
      } else {
        setMatches(rows);
      }
    } catch (error) {
      setNotice(errorNotice(error));
    } finally {
      setSearching(false);
    }
  };

  const runReview = async () => {
    if (!release) return null;
    const response = await base44.functions.invoke('publishSingleWorkflow', {
      release_id: release.id,
      action: 'review',
    });
    const data = dataOf(response);
    if (!isSet(data.release_fingerprint)) {
      throw Object.assign(new Error(data.error || 'No release fingerprint returned.'), {
        response: { status: 409, data },
      });
    }
    return data;
  };

  const handleReview = async () => {
    if (!release || busy) return;
    setBusy('review');
    setNotice(null);
    try {
      const data = await runReview();
      const missing = data.missing_requirements || [];
      setNotice({
        tone: missing.length ? 'warning' : 'success',
        title: missing.length ? 'Review found incomplete gates' : 'Review complete',
        detail: `ready_for_approval: ${String(data.ready_for_approval === true)}`,
        requirements: missing,
      });
    } catch (error) {
      setNotice(errorNotice(error));
    } finally {
      setBusy('');
    }
  };

  const handleEdit = () => {
    toast({ title: 'Editing opens in the release editor' });
  };

  const handleApprove = async () => {
    if (!release || busy) return;
    if (phrase !== `APPROVE ${String(release.title ?? '').trim()}`) return;
    setBusy('approve');
    setNotice(null);
    try {
      const reviewed = await runReview();
      const response = await base44.functions.invoke('publishSingleWorkflow', {
        release_id: release.id,
        action: 'approve',
        confirm_title: release.title,
        confirm_version_label: release.version_label ?? '',
        confirm_release_fingerprint: reviewed.release_fingerprint,
        confirm_approval_phrase: phrase,
      });
      const data = dataOf(response);
      if (data.ok !== true) {
        setNotice({ tone: 'error', title: data.error || 'Approval did not complete', detail: '', requirements: data.missing_requirements || [] });
        return;
      }
      await loadRelease(release.id);
      setNotice({ tone: 'success', title: 'Approval recorded', detail: 'Nothing was published, sent or charged.', requirements: [] });
    } catch (error) {
      setNotice(errorNotice(error));
    } finally {
      setBusy('');
    }
  };

  const blocker = release ? approveBlocker(release) : '';
  const expectedPhrase = `APPROVE ${String(release?.title ?? '').trim()}`;
  const canEdit = Boolean(release) && release.is_published !== true && release.publishing_safe !== true;
  const canApprove = Boolean(release) && !blocker && phrase === expectedPhrase && busy === '';

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-foreground">Release Review &amp; Approval</h2>
        <p className="mt-1 max-w-3xl font-body text-sm leading-relaxed text-muted-foreground">
          Read-only view of one release, searched by song title. Nothing on this panel publishes, edits or delivers anything.
        </p>
      </div>

      <ReleaseTitleSearch
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        searching={searching}
        matches={matches}
        searchedTerm={searchedTerm}
        onChoose={chooseRelease}
      />

      {notice ? (
        <div
          className={`rounded-lg border p-4 ${
            notice.tone === 'error'
              ? 'border-destructive/50 bg-destructive/10'
              : notice.tone === 'warning'
                ? 'border-amber-500/50 bg-amber-500/10'
                : 'border-emerald-500/50 bg-emerald-500/10'
          }`}
          role="status"
        >
          <p className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.16em] text-foreground">
            {notice.tone === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {notice.title}
          </p>
          {notice.detail ? <p className="mt-2 font-body text-sm text-foreground/85">{notice.detail}</p> : null}
          {notice.requirements?.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 font-body text-xs leading-relaxed text-foreground/85">
              {notice.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
            </ul>
          ) : null}
        </div>
      ) : null}

      {busy === 'load' ? (
        <p className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading release…
        </p>
      ) : null}

      {release ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <ReviewBlock title="Identity" fields={IDENTITY} record={release} />
            <ArtworkBlock url={release.artwork_url} />
            <ReviewBlock title="Audio" fields={AUDIO} record={release} />
            <ReviewBlock title="Rights" fields={RIGHTS} record={release} />
            <ReviewBlock title="Checklist" fields={CHECKLIST} record={release} />
            <ReviewBlock title="Destination & state" fields={DESTINATION} record={release} />
          </div>

          <div className="sticky bottom-0 space-y-3 rounded-lg border border-border/60 bg-card/95 p-3 backdrop-blur">
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={handleReview} disabled={busy !== ''}>
                {busy === 'review' ? 'Reviewing…' : 'Review'}
              </Button>
              <Button type="button" variant="outline" onClick={handleEdit} disabled={!canEdit}>
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled
                title="Not built yet: no decline function exists"
              >
                Decline
              </Button>
              <Button type="button" onClick={handleApprove} disabled={!canApprove}>
                {busy === 'approve' ? 'Approving…' : 'Approve'}
              </Button>
            </div>

            {blocker ? (
              <p className="font-body text-xs text-amber-300">{blocker}</p>
            ) : (
              <div className="max-w-md">
                <Label htmlFor="review-approve-phrase" className="font-body text-xs">
                  Type {expectedPhrase} to enable Approve
                </Label>
                <Input
                  id="review-approve-phrase"
                  value={phrase}
                  onChange={(event) => setPhrase(event.target.value)}
                  placeholder={expectedPhrase}
                  autoComplete="off"
                  className="mt-1.5 bg-background font-mono text-sm"
                />
              </div>
            )}

            <p className="font-body text-xs text-muted-foreground">
              Decline: Not built yet: no decline function exists.
            </p>
            <Link
              to="/admin/release-control"
              className="font-body text-xs text-primary underline underline-offset-4"
            >
              Open the release editor
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}