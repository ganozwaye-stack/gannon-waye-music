import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import ReleaseSearchPanel from '@/components/release-approval/ReleaseSearchPanel';
import ReviewBlock from '@/components/release-approval/ReviewBlock';
import FieldRow from '@/components/release-approval/FieldRow';
import ArtworkPreview from '@/components/release-approval/ArtworkPreview';
import NoticePanel from '@/components/release-approval/NoticePanel';
import ReleaseEditForm from '@/components/release-approval/ReleaseEditForm';
import ReleaseActionBar from '@/components/release-approval/ReleaseActionBar';
import {
  EVIDENCE_FIELDS, approveBlockers, classifyFunctionError, closestTitles, editBlockers, hasValue,
} from '@/components/release-approval/approvalFields';

const IDENTITY_FIELDS = [
  { key: 'title', label: 'title' },
  { key: 'primary_artist', label: 'primary_artist' },
  { key: 'version_label', label: 'version_label' },
  { key: 'status', label: 'status' },
  { key: 'release_date', label: 'release_date' },
];

const RIGHTS_FIELDS = [
  { key: 'isrc_code', label: 'isrc_code' },
  { key: 'upc_code', label: 'upc_code' },
  { key: 'copyright_line', label: 'copyright_line' },
  { key: 'publisher_name', label: 'publisher_name' },
  { key: 'songwriter_credits', label: 'songwriter_credits' },
  { key: 'producer_credits', label: 'producer_credits' },
];

const CHECKLIST_FIELDS = [
  { key: 'release_checklist_complete', label: 'release_checklist_complete' },
  { key: 'release_eligible', label: 'release_eligible' },
];

const DESTINATION_FIELDS = [
  { key: 'distributor', label: 'distributor' },
  { key: 'dsp_list', label: 'dsp_list' },
  { key: 'spotify_link', label: 'spotify_link' },
  { key: 'apple_music_link', label: 'apple_music_link' },
  { key: 'youtube_link', label: 'youtube_link' },
  { key: 'sync_licensing_status', label: 'sync_licensing_status' },
  { key: 'is_published', label: 'is_published' },
  { key: 'publishing_safe', label: 'publishing_safe' },
  { key: 'public_release_approval_status', label: 'public_release_approval_status' },
  { key: 'approved_by', label: 'approved_by' },
  { key: 'approved_at', label: 'approved_at' },
  { key: 'public_release_approved_by', label: 'public_release_approved_by' },
  { key: 'public_release_approved_at', label: 'public_release_approved_at' },
];

const BLANK_FORM = {
  title: '', version_label: '', status: '', release_date: '', description: '', artwork_url: '',
  lyrics: '', isrc_code: '', upc_code: '', audio_preview_url: '', review_notes: '',
};

const dateOnly = (value) => String(value ?? '').slice(0, 10);

function Warning({ children }) {
  return (
    <p className="mt-2 rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 font-body text-xs leading-relaxed text-amber-300">
      {children}
    </p>
  );
}

export default function ReleaseReview() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState(null);
  const [notFoundQuery, setNotFoundQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [release, setRelease] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [review, setReview] = useState(null);
  const [typed, setTyped] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState(null);

  async function loadRecord(id) {
    const record = await base44.entities.Release.get(id);
    const sheets = await base44.entities.ReleaseReviewSheet.filter({ release_id: id });
    const rows = Array.isArray(sheets) ? sheets : sheets?.items || [];
    setRelease(record);
    setSheet(rows[0] || null);
    setReview(null);
    setTyped('');
    setEditing(false);
  }

  async function invokeReview(id) {
    const response = await base44.functions.invoke('publishSingleWorkflow', { release_id: id, action: 'review' });
    return response?.data ?? response ?? {};
  }

  async function openRelease(id) {
    setBusy('load');
    setNotice(null);
    try {
      await loadRecord(id);
      setMatches(null);
    } catch (error) {
      setRelease(null);
      setNotice(classifyFunctionError(error));
    } finally {
      setBusy('');
    }
  }

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('release_id');
    if (id) openRelease(id.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setSearching(true);
    setNotice(null);
    setMatches(null);
    try {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const found = await base44.entities.Release.filter(
        { title: { $regex: escaped, $options: 'i' } },
        { sort: 'title', limit: 25 },
      );
      const items = Array.isArray(found) ? found : found?.items || [];
      if (items.length === 1) {
        await openRelease(items[0].id);
      } else if (items.length > 1) {
        setRelease(null);
        setMatches(items);
      } else {
        setRelease(null);
        setMatches([]);
        setNotFoundQuery(term);
        const all = await base44.entities.Release.list('-updated_date', 500);
        const rows = Array.isArray(all) ? all : all?.items || [];
        setSuggestions(closestTitles(rows.map((row) => row.title), term));
      }
    } catch (error) {
      setNotice(classifyFunctionError(error));
    } finally {
      setSearching(false);
    }
  }

  async function runReview() {
    if (!release) return;
    setBusy('review');
    setNotice(null);
    try {
      const data = await invokeReview(release.id);
      if (data.error || data.ok !== true || !data.release_fingerprint) {
        setNotice({
          kind: 'error',
          title: 'Review did not complete',
          body: data.error || 'No release fingerprint was returned.',
          requirements: data.missing_requirements || [],
        });
        return;
      }
      setReview({
        fingerprint: data.release_fingerprint,
        missing: data.missing_requirements || [],
        ready: data.ready_for_approval === true,
      });
    } catch (error) {
      setNotice(classifyFunctionError(error));
    } finally {
      setBusy('');
    }
  }

  function openEdit() {
    if (!release) return;
    setForm({
      ...BLANK_FORM,
      title: release.title ?? '',
      version_label: release.version_label ?? '',
      status: release.status ?? '',
      release_date: dateOnly(release.release_date),
      description: release.description ?? '',
      artwork_url: release.artwork_url ?? '',
      lyrics: release.lyrics ?? '',
      isrc_code: sheet?.isrc_code ?? '',
      upc_code: sheet?.upc_code ?? '',
      audio_preview_url: sheet?.audio_preview_url ?? '',
      review_notes: sheet?.review_notes ?? '',
    });
    setEditing(true);
    setNotice(null);
  }

  async function saveEdits() {
    if (!release) return;
    setBusy('save');
    setNotice(null);
    try {
      const response = await base44.functions.invoke('saveReleaseReview', { release_id: release.id, ...form });
      const data = response?.data ?? response ?? {};
      if (data.ok !== true) {
        setNotice({ kind: 'error', title: 'Save did not complete', body: data.error || 'Nothing was written.', requirements: [] });
        return;
      }
      await loadRecord(release.id);
      const fresh = await invokeReview(release.id);
      if (fresh.release_fingerprint) {
        setReview({
          fingerprint: fresh.release_fingerprint,
          missing: fresh.missing_requirements || [],
          ready: fresh.ready_for_approval === true,
        });
      }
      setNotice({ kind: 'success', title: 'Saved', body: 'The record was re-read and the fingerprint refreshed. Nothing was published.', requirements: [] });
    } catch (error) {
      setNotice(classifyFunctionError(error));
    } finally {
      setBusy('');
    }
  }

  async function approve() {
    if (!release) return;
    setBusy('approve');
    setNotice(null);
    try {
      let fingerprint = review?.fingerprint;
      if (!fingerprint) {
        const fresh = await invokeReview(release.id);
        if (!fresh.release_fingerprint) {
          setNotice({ kind: 'error', title: 'Review did not return a fingerprint', body: fresh.error || 'Approval was not attempted.', requirements: fresh.missing_requirements || [] });
          return;
        }
        fingerprint = fresh.release_fingerprint;
        setReview({ fingerprint, missing: fresh.missing_requirements || [], ready: fresh.ready_for_approval === true });
      }

      const response = await base44.functions.invoke('publishSingleWorkflow', {
        release_id: release.id,
        action: 'approve',
        confirm_title: release.title,
        confirm_version_label: release.version_label ?? '',
        confirm_release_fingerprint: fingerprint,
        confirm_approval_phrase: 'APPROVE ' + String(release.title ?? '').trim(),
      });
      const data = response?.data ?? response ?? {};
      if (data.ok !== true) {
        setNotice({ kind: 'error', title: 'Approval did not complete', body: data.error || 'Nothing was published.', requirements: data.missing_requirements || [] });
        return;
      }
      await loadRecord(release.id);
      setNotice({ kind: 'success', title: 'Approval recorded', body: 'The approval receipt was recorded. Nothing was published, delivered or emailed.', requirements: [] });
    } catch (error) {
      setNotice(classifyFunctionError(error));
    } finally {
      setBusy('');
    }
  }

  async function reloadAndReview() {
    if (!release) return;
    setBusy('reload');
    setNotice(null);
    try {
      await loadRecord(release.id);
      const fresh = await invokeReview(release.id);
      setReview({
        fingerprint: fresh.release_fingerprint || '',
        missing: fresh.missing_requirements || [],
        ready: fresh.ready_for_approval === true,
      });
      setNotice({ kind: 'info', title: 'Reloaded', body: 'The record was re-read and reviewed again.', requirements: [] });
    } catch (error) {
      setNotice(classifyFunctionError(error));
    } finally {
      setBusy('');
    }
  }

  // Sheet-held review values are shown as this release's own review values so an
  // Edit round-trips. Everything else reads straight off the loaded record.
  const view = release
    ? {
        ...release,
        release_date: dateOnly(release.release_date),
        isrc_code: sheet?.isrc_code,
        upc_code: sheet?.upc_code,
        audio_preview_url: sheet?.audio_preview_url,
      }
    : null;

  const approveReasons = view ? approveBlockers(view, typed) : [];
  const editReasons = view ? editBlockers(view) : [];
  const codesMissing = view ? ['isrc_code', 'upc_code'].filter((key) => !hasValue(view[key])) : [];
  const audioMissing = view ? !hasValue(view.master_audio_url) && !hasValue(view.audio_preview_url) : false;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
      <header className="mb-5">
        <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-primary">Owner review</p>
        <h1 className="mt-1 font-display text-3xl text-foreground">Release Review &amp; Approval</h1>
        <p className="mt-2 max-w-3xl font-body text-sm leading-relaxed text-muted-foreground">
          One screen per song. Review, edit, approve or decline against the loaded record. Approve records the
          approval only. Nothing on this page publishes, delivers, emails or charges anything.
        </p>
      </header>

      <ReleaseSearchPanel
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        searching={searching}
        matches={matches}
        notFoundQuery={notFoundQuery}
        suggestions={suggestions}
        onOpen={openRelease}
      />

      {notice ? (
        <div className="mt-4">
          <NoticePanel notice={notice}>
            {notice.action === 'reload' ? (
              <Button type="button" size="sm" variant="outline" onClick={reloadAndReview} disabled={busy === 'reload'}>
                {busy === 'reload' ? 'Reloading…' : 'Reload and review again'}
              </Button>
            ) : null}
            {notice.action === 'edit' ? (
              <Button type="button" size="sm" variant="outline" onClick={openEdit} disabled={editReasons.length > 0}>
                Open Edit
              </Button>
            ) : null}
          </NoticePanel>
        </div>
      ) : null}

      {busy === 'load' ? (
        <p className="mt-6 font-body text-xs uppercase tracking-[0.22em] text-muted-foreground">Loading release…</p>
      ) : null}

      {view ? (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Loaded record · {view.id}
            </p>
            <Button type="button" size="sm" variant="ghost" onClick={() => { setRelease(null); setSheet(null); setReview(null); setNotice(null); setEditing(false); }}>
              Choose another release
            </Button>
          </div>

          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <ReviewBlock letter="A" title="Identity">
              {IDENTITY_FIELDS.map((field) => (
                <FieldRow key={field.key} label={field.label} value={view[field.key]} />
              ))}
              <FieldRow label="description" value={view.description} long />
            </ReviewBlock>

            <ReviewBlock letter="B" title="Artwork">
              <ArtworkPreview url={view.artwork_url} />
            </ReviewBlock>

            <ReviewBlock letter="C" title="Audio and lyrics">
              <FieldRow label="master_audio_url" value={view.master_audio_url} />
              <FieldRow label="audio_preview_url" value={view.audio_preview_url} />
              <FieldRow label="lyrics_status" value={view.lyrics_status} />
              <FieldRow label="lyrics" value={view.lyrics} long />
              {audioMissing ? <Warning>No master audio and no preview, so there is nothing to deliver.</Warning> : null}
            </ReviewBlock>

            <ReviewBlock letter="D" title="Rights and codes">
              {RIGHTS_FIELDS.map((field) => (
                <FieldRow key={field.key} label={field.label} value={view[field.key]} />
              ))}
              {EVIDENCE_FIELDS.map((field) => (
                <FieldRow key={field.key} label={field.label} value={view[field.key]} />
              ))}
              {codesMissing.length > 0 ? (
                <Warning>{codesMissing.join(' and ')} missing: the distributor will reject this release.</Warning>
              ) : null}
            </ReviewBlock>

            <ReviewBlock
              letter="E"
              title="Checklist"
              caption="A field the record does not hold reads NOT BUILT. It is never shown as a pass."
            >
              {CHECKLIST_FIELDS.map((field) => (
                <FieldRow key={field.key} label={field.label} value={view[field.key]} />
              ))}
            </ReviewBlock>

            <ReviewBlock letter="F" title="Destination and state">
              {DESTINATION_FIELDS.map((field) => (
                <FieldRow key={field.key} label={field.label} value={view[field.key]} />
              ))}
            </ReviewBlock>
          </div>

          <section className="mt-4 rounded-lg border border-border/60 bg-card p-4">
            <h2 className="font-display text-lg text-foreground">Review result</h2>
            {review ? (
              <>
                <p className="mt-2 break-all font-mono text-xs text-foreground/85">{review.fingerprint}</p>
                <p className="mt-2 font-body text-xs text-muted-foreground">
                  ready_for_approval: {String(review.ready)}
                </p>
                <div className="mt-2">
                  <p className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted-foreground">missing_requirements</p>
                  {review.missing.length > 0 ? (
                    <ul className="mt-1 list-disc space-y-1 pl-5 font-body text-xs leading-relaxed text-foreground/85">
                      {review.missing.map((requirement) => <li key={requirement}>{requirement}</li>)}
                    </ul>
                  ) : (
                    <p className="mt-1 font-body text-xs text-foreground/85">none</p>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-2 font-body text-xs text-muted-foreground">
                Run Review to return the current fingerprint and missing requirements.
              </p>
            )}
          </section>

          {editing ? (
            <div className="mt-4">
              <ReleaseEditForm
                form={form}
                onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
                onSave={saveEdits}
                onCancel={() => setEditing(false)}
                saving={busy === 'save'}
              />
            </div>
          ) : null}

          <ReleaseActionBar
            record={view}
            typed={typed}
            onTypedChange={setTyped}
            onReview={runReview}
            onEdit={openEdit}
            onApprove={approve}
            busy={busy}
            approveReasons={approveReasons}
            editReasons={editReasons}
          />
        </>
      ) : null}
    </div>
  );
}