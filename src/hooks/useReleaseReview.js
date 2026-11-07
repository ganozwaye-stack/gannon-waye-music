import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

/** Every value the one-click review screen can read, edit and send back. */
export const REVIEW_FIELDS = [
  'title',
  'version_label',
  'type',
  'status',
  'release_date',
  'genre',
  'mood',
  'duration',
  'language',
  'credits',
  'lyrics',
  'description',
  'artwork_url',
  'distributor',
  'distributor_link',
  'rights_evidence_reference',
  'master_evidence_reference',
  'delivery_evidence_reference',
  'public_link_evidence_url',
  'isrc_code',
  'upc_code',
  'audio_preview_url',
  'review_notes',
];

const emptyForm = () => Object.fromEntries(REVIEW_FIELDS.map((field) => [field, '']));

const fillForm = (release, sheet) => ({
  ...emptyForm(),
  ...Object.fromEntries(REVIEW_FIELDS.map((field) => [field, release?.[field] ?? sheet?.[field] ?? ''])),
});

const evidenceOf = (form) => ({
  rights_evidence_reference: form.rights_evidence_reference,
  master_evidence_reference: form.master_evidence_reference,
  delivery_evidence_reference: form.delivery_evidence_reference,
  public_link_evidence_url: form.public_link_evidence_url,
});

export const isLocked = (release) => Boolean(
  release
  && (release.is_published === true
    || release.publishing_safe === true
    || !['pending', 'revoked'].includes(release.public_release_approval_status || 'pending'))
);

/** Data and the three decisions for the release review page. Never publishes. */
export default function useReleaseReview() {
  const [releases, setReleases] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [release, setRelease] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [lyric, setLyric] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [savedForm, setSavedForm] = useState(emptyForm);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function openRelease(id) {
    setSelectedId(id);
    setLoadingDetail(true);
    setNotice(null);
    const [loadedRelease, sheets, lyrics] = await Promise.all([
      base44.entities.Release.get(id),
      base44.entities.ReleaseReviewSheet.filter({ release_id: id }),
      base44.entities.Lyric.filter({ release_id: id }),
    ]);
    const loadedSheet = Array.isArray(sheets) ? sheets[0] || null : null;
    const filled = fillForm(loadedRelease, loadedSheet);
    setRelease(loadedRelease);
    setSheet(loadedSheet);
    setLyric(Array.isArray(lyrics) ? lyrics[0] || null : null);
    setForm(filled);
    setSavedForm(filled);
    setLoadingDetail(false);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const page = await base44.entities.Release.list({ sort: 'title', limit: 200 });
      if (cancelled) return;
      const items = page?.items || page || [];
      setReleases(items);
      setLoadingList(false);
      if (items.length) openRelease(items[0].id);
    })();
    return () => { cancelled = true; };
  }, []);

  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const dirty = JSON.stringify(form) !== JSON.stringify(savedForm);
  const locked = isLocked(release);

  async function persist() {
    const response = await base44.functions.invoke('saveReleaseReview', { release_id: selectedId, ...form });
    return response.data || {};
  }

  const save = async () => {
    if (!selectedId) return false;
    setBusy('save');
    setNotice(null);
    try {
      const data = await persist();
      if (data.error) {
        setNotice({ tone: 'error', text: data.error });
        return false;
      }
      await openRelease(selectedId);
      setNotice({ tone: 'ok', text: 'Saved. Nothing was published.' });
      return true;
    } finally {
      setBusy('');
    }
  };

  const approve = async () => {
    if (!selectedId) return;
    setBusy('approve');
    setNotice(null);
    try {
      if (dirty) {
        const saved = await persist();
        if (saved.error) {
          setNotice({ tone: 'error', text: saved.error });
          return;
        }
      }
      const evidence = evidenceOf(form);
      const evidenceSave = await base44.functions.invoke('publishSingleWorkflow', {
        release_id: selectedId, action: 'save_evidence', ...evidence,
      });
      if (evidenceSave.data?.error) {
        setNotice({ tone: 'error', text: evidenceSave.data.error });
        return;
      }

      const review = await base44.functions.invoke('publishSingleWorkflow', {
        release_id: selectedId, action: 'review', ...evidence,
      });
      const state = review.data || {};
      if (state.error) {
        setNotice({ tone: 'error', text: state.error });
        return;
      }
      if (!state.ready_for_approval) {
        setNotice({
          tone: 'error',
          text: 'This release is not ready to approve yet.',
          items: state.missing_requirements || [],
        });
        return;
      }

      const approved = await base44.functions.invoke('publishSingleWorkflow', {
        release_id: selectedId,
        action: 'approve',
        ...evidence,
        confirm_title: state.title,
        confirm_version_label: state.version_label,
        confirm_release_fingerprint: state.release_fingerprint,
        confirm_approval_phrase: `APPROVE ${state.title}`,
        approval_note: form.review_notes,
      });
      if (approved.data?.error) {
        setNotice({
          tone: 'error',
          text: approved.data.error,
          items: approved.data.missing_requirements || [],
        });
        return;
      }
      await openRelease(selectedId);
      setNotice({
        tone: 'ok',
        text: 'Approved. The release is still private — making it public stays a separate, deliberate step.',
      });
    } finally {
      setBusy('');
    }
  };

  const decline = async () => {
    if (!selectedId) return;
    setBusy('decline');
    setNotice(null);
    try {
      const review = await base44.functions.invoke('publishSingleWorkflow', {
        release_id: selectedId, action: 'review',
      });
      const state = review.data || {};
      if (state.error) {
        setNotice({ tone: 'error', text: state.error });
        return;
      }
      const declined = await base44.functions.invoke('publishSingleWorkflow', {
        release_id: selectedId,
        action: 'revoke',
        confirm_title: state.title,
        confirm_version_label: state.version_label,
        confirm_release_fingerprint: state.release_fingerprint,
        confirm_revoke_phrase: `REVOKE ${state.title}`,
        approval_note: form.review_notes || 'Declined in Release Review.',
      });
      if (declined.data?.error) {
        setNotice({ tone: 'error', text: declined.data.error });
        return;
      }
      await openRelease(selectedId);
      setNotice({ tone: 'ok', text: 'Declined. The release stays private and can be edited again.' });
    } finally {
      setBusy('');
    }
  };

  return {
    releases, loadingList, loadingDetail, selectedId, openRelease,
    release, sheet, lyric, form, change, dirty, locked,
    save, approve, decline, busy, notice,
  };
}