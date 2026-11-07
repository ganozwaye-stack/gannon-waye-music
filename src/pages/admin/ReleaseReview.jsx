import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import ReleaseSearchPanel from '@/components/release-approval/ReleaseSearchPanel';
import ReviewBlock from '@/components/release-approval/ReviewBlock';
import FieldRow from '@/components/release-approval/FieldRow';
import ArtworkPreview from '@/components/release-approval/ArtworkPreview';
import AudioField from '@/components/release-approval/AudioField';
import NoticePanel from '@/components/release-approval/NoticePanel';
import ReleaseEditForm from '@/components/release-approval/ReleaseEditForm';
import ReleaseActionBar from '@/components/release-approval/ReleaseActionBar';
import { blockedApprovalText, errorNotice, statusBlocksApproval } from '@/components/release-approval/approvalFields';

const dateOnly = (value) => String(value ?? '').slice(0, 10);

const RIGHTS_FIELDS = [
  { key: 'isrc_code', label: 'isrc_code' },
  { key: 'upc_code', label: 'upc_code' },
  { key: 'copyright_line', label: 'copyright_line' },
  { key: 'publisher_name', label: 'publisher_name' },
];

const CHECKLIST_FIELDS = [
  { key: 'release_checklist_complete', label: 'release_checklist_complete' },
  { key: 'release_eligible', label: 'release_eligible' },
];

const DESTINATION_FIELDS = [
  { key: 'distributor_name', label: 'distributor_name' },
  { key: 'dsp_list', label: 'dsp_list' },
  { key: 'spotify_link', label: 'spotify_link' },
  { key: 'is_published', label: 'is_published' },
  { key: 'publishing_safe', label: 'publishing_safe' },
  { key: 'public_release_approval_status', label: 'public_release_approval_status' },
];

const BLANK_FORM = { title: '', release_date: '', lyrics: '', version_label: '' };

const dataOf = (response) => response?.data ?? response ?? {};

export default function ReleaseReview() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState(null);
  const [release, setRelease] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [review, setReview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState(null);

  async function loadRelease(id) {
    const record = await base44.entities.Release.get(id);
    const sheets = await base44.entities.ReleaseReviewSheet.filter({ release_id: id });
    const rows = Array.isArray(sheets) ? sheets : sheets?.items || [];
    setRelease(record);
    setSheet(rows[0] || null);
    setReview(null);
    setEditing(false);
    setMatches(null);
  }

  async function chooseRelease(id) {
    setBusy('load');
    setNotice(null);
    try {
      await loadRelease(id);
    } catch (error) {
      setRelease(null);
      setNotice(errorNotice(error, 'Load'));
    } finally {
      setBusy('');
    }
  }

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('release_id');
    if (id) chooseRelease(id.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setSearching(true);
    setNotice(null);
    setMatches(null);
    setRelease(null);
    try {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const found = await base44.entities.Release.filter(
        { title: { $regex: escaped, $options: 'i' } },
        { sort: 'title', limit: 25 },
      );
      const items = Array.isArray(found) ? found : found?.items || [];
      if (items.length === 1) {
        await loadRelease(items[0].id);
      } else {
        setMatches(items);
      }
    } catch (error) {
      setNotice(errorNotice(error, 'Search'));
    } finally {
      setSearching(false);
    }
  }

  async function invokeReview(id) {
    const response = await base44.functions.invoke('publishSingleWorkflow', { release_id: id, action: 'review' });
    return dataOf(response);
  }

  async function runReview() {
    if (!release) return;
    setBusy('review');
    setNotice(null);
    try {
      const data = await invokeReview(release.id);
      if (!data.release_fingerprint) {
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
        ready: data.ready_for_approval === true,
        missing: data.missing_requirements || [],
      });
    } catch (error) {
      setNotice(errorNotice(error, 'Review'));
    } finally {
      setBusy('');
    }
  }

  async function approve() {
    if (!release) return;
    setBusy('approve');
    setNotice(null);
    try {
      const reviewed = await invokeReview(release.id);
      if (!reviewed.release_fingerprint) {
        setNotice({
          kind: 'error',
          title: 'Approve needs a current review',
          body: reviewed.error || 'No release fingerprint was returned, so approval was not attempted.',
          requirements: reviewed.missing_requirements || [],
        });
        return;
      }

      const response = await base44.functions.invoke('publishSingleWorkflow', {
        release_id: release.id,
        action: 'approve',
        confirm_title: release.title,
        confirm_version_label: release.version_label ?? '',
        confirm_release_fingerprint: reviewed.release_fingerprint,
        confirm_approval_phrase: 'APPROVE ' + String(release.title ?? '').trim(),
      });
      const data = dataOf(response);
      if (data.ok !== true) {
        setNotice({
          kind: 'error',
          title: 'Approval did not complete',
          body: data.error || 'Nothing was published.',
          requirements: data.missing_requirements || [],
        });
        return;
      }
      await loadRelease(release.id);
      setNotice({
        kind: 'success',
        title: 'Approval recorded',
        body: 'The approval was recorded. Nothing was published, delivered or emailed.',
        requirements: [],
      });
    } catch (error) {
      setNotice(errorNotice(error, 'Approval'));
    } finally {
      setBusy('');
    }
  }

  function openEdit() {
    if (!release) return;
    setForm({
      title: release.title ?? '',
      release_date: dateOnly(release.release_date),
      lyrics: release.lyrics ?? '',
      version_label: release.version_label ?? '',
    });
    setEditing(true);
    setNotice(null);
  }

  async function saveEdits() {
    if (!release) return;
    setBusy('save');
    setNotice(null);
    try {
      const response = await base44.functions.invoke('saveReleaseReview', {
        release_id: release.id,
        ...form,
      });
      const data = dataOf(response);
      if (data.ok !== true) {
        setNotice({ kind: 'error', title: 'Save did not complete', body: data.error || 'Nothing was written.', requirements: [] });
        return;
      }
      await loadRelease(release.id);
      setNotice({ kind: 'success', title: 'Saved', body: 'The record was re-read. Nothing was published.', requirements: [] });
    } catch (error) {
      setNotice(errorNotice(error, 'Save'));
    } finally {
      setBusy('');
    }
  }

  const view = release
    ? {
        ...release,
        release_date: dateOnly(release.release_date),
        isrc_code: release.isrc_code ?? sheet?.isrc_code,
        upc_code: release.upc_code ?? sheet?.upc_code,
      }
    : null;

  const approveBlocked = view && statusBlocksApproval(view.status) ? blockedApprovalText(view.status) : '';

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6">
      <header className="mb-5">
        <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-primary">Owner review</p>
        <h1 className="mt-1 font-display text-3xl text-foreground">Release Review &amp; Approval</h1>
        <p className="mt-2 max-w-3xl font-body text-sm leading-relaxed text-muted-foreground">
          Find a song by its title, read the live record, and record a review or approval. Nothing on this page
          delivers, emails or charges anything.
        </p>
      </header>

      <ReleaseSearchPanel
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        searching={searching}
        matches={matches}
        onChoose={chooseRelease}
      />

      {notice ? (
        <div className="mt-4">
          <NoticePanel notice={notice} />
        </div>
      ) : null}

      {busy === 'load' ? (
        <p className="mt-6 font-body text-xs uppercase tracking-[0.22em] text-muted-foreground">Loading release…</p>
      ) : null}

      {view ? (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Loaded record</p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => { setRelease(null); setSheet(null); setReview(null); setNotice(null); setEditing(false); }}
            >
              Choose another release
            </Button>
          </div>

          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <ReviewBlock letter="A" title="Identity">
              <FieldRow label="title" value={view.title} />
              <FieldRow label="status" value={view.status} />
              <FieldRow label="release_date" value={view.release_date} />
              <FieldRow label="version" value={view.version_label} />
            </ReviewBlock>

            <ReviewBlock letter="B" title="Artwork">
              <ArtworkPreview url={view.artwork_url} />
            </ReviewBlock>

            <ReviewBlock letter="C" title="Audio">
              <AudioField url={view.master_audio_url} />
            </ReviewBlock>

            <ReviewBlock letter="D" title="Rights and codes">
              {RIGHTS_FIELDS.map((field) => (
                <FieldRow key={field.key} label={field.label} value={view[field.key]} />
              ))}
            </ReviewBlock>

            <ReviewBlock letter="E" title="Checklist">
              {CHECKLIST_FIELDS.map((field) => (
                <FieldRow key={field.key} label={field.label} value={view[field.key]} />
              ))}
            </ReviewBlock>

            <ReviewBlock letter="F" title="Destination">
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
                <p className="mt-2 font-body text-xs text-muted-foreground">ready_for_approval: {String(review.ready)}</p>
                <p className="mt-2 font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted-foreground">
                  missing_requirements
                </p>
                {review.missing.length > 0 ? (
                  <ul className="mt-1 list-disc space-y-1 pl-5 font-body text-xs leading-relaxed text-foreground/85">
                    {review.missing.map((requirement) => <li key={requirement}>{requirement}</li>)}
                  </ul>
                ) : (
                  <p className="mt-1 font-body text-xs text-foreground/85">none</p>
                )}
              </>
            ) : (
              <p className="mt-2 font-body text-xs text-muted-foreground">
                Run Review to return the current fingerprint and any missing requirements.
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
            busy={busy}
            blockedApprovalText={approveBlocked}
            onReview={runReview}
            onEdit={openEdit}
            onApprove={approve}
          />
        </>
      ) : null}
    </div>
  );
}