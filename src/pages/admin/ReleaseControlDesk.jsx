import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileCheck2,
  Loader2,
  LockKeyhole,
  RefreshCw,
  Save,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

const REVIEW_MAX_AGE_MS = 5 * 60 * 1000;

const EVIDENCE_FIELDS = [
  {
    key: 'rights_evidence_reference',
    label: 'Rights evidence reference',
    placeholder: 'Private agreement, clearance, or ownership reference',
  },
  {
    key: 'master_evidence_reference',
    label: 'Master evidence reference',
    placeholder: 'Private reference to the approved distribution master',
  },
  {
    key: 'delivery_evidence_reference',
    label: 'Delivery evidence reference',
    placeholder: 'Private distribution-delivery or availability reference',
  },
  {
    key: 'public_link_evidence_url',
    label: 'Verified public listening page',
    placeholder: 'https://…',
  },
];

const ACTIONS = {
  approve: {
    label: 'Record private approval',
    shortLabel: 'Approve',
    description: 'Records an immutable owner approval for the reviewed snapshot. It does not publish the release.',
    confirmMessage: 'Record this private approval? The release remains private until a separate publish action.',
  },
  publish: {
    label: 'Go live with the reviewed release',
    shortLabel: 'Go Live',
    description: 'Takes the release public on the site only if the exact immutable approval and fingerprint still match. This is the only path to publication.',
    confirmMessage: 'Go live with this exact reviewed release? This is your release-day button: it changes public visibility only if every server-side gate still matches.',
  },
  revoke: {
    label: 'Revoke public release',
    shortLabel: 'Revoke',
    description: 'Removes public release status and places later release-email activity on hold.',
    confirmMessage: 'Revoke this release? This removes its public release state and must be deliberately confirmed.',
  },
};

function exact(value) {
  return String(value ?? '').trim();
}

function responseData(value) {
  return value?.data || value || {};
}

function errorMessage(error) {
  return error?.response?.data?.error || error?.data?.error || error?.message || 'The release control request failed closed.';
}

function evidenceFromRelease(release) {
  return {
    rights_evidence_reference: exact(release?.rights_evidence_reference),
    master_evidence_reference: exact(release?.master_evidence_reference),
    delivery_evidence_reference: exact(release?.delivery_evidence_reference),
    public_link_evidence_url: exact(release?.public_link_evidence_url),
  };
}

function reviewKey(releaseId, evidence) {
  return [
    exact(releaseId),
    exact(evidence?.rights_evidence_reference),
    exact(evidence?.master_evidence_reference),
    exact(evidence?.delivery_evidence_reference),
    exact(evidence?.public_link_evidence_url),
  ].join('\u241f');
}

function phraseFor(action, title) {
  return String(action || '').toUpperCase() + ' ' + exact(title);
}

function fingerprintPreview(fingerprint) {
  const value = exact(fingerprint);
  return value ? value.slice(0, 18) + '…' + value.slice(-10) : 'No fingerprint';
}

function isHttps(value) {
  return /^https:\/\//i.test(exact(value));
}

export default function ReleaseControlDesk() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [releaseId, setReleaseId] = useState('');
  const [evidence, setEvidence] = useState(() => evidenceFromRelease(null));
  const [review, setReview] = useState(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [confirmationAction, setConfirmationAction] = useState('');
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState(null);

  const { data: releases = [], isLoading, error: releasesError } = useQuery({
    queryKey: ['releaseControlDeskReleases'],
    queryFn: () => base44.entities.Release.list('-updated_date', 100),
    initialData: [],
  });

  const isExactOwner = OWNER_EMAILS.has(exact(user?.email).toLowerCase());
  const selectedRelease = useMemo(
    () => releases.find((release) => release.id === releaseId) || null,
    [releases, releaseId],
  );

  useEffect(() => {
    if (!releaseId && releases.length) setReleaseId(releases[0].id);
  }, [releaseId, releases]);

  useEffect(() => {
    if (!selectedRelease) {
      setEvidence(evidenceFromRelease(null));
      setReview(null);
      setConfirmationAction('');
      setTypedConfirmation('');
      return;
    }
    setEvidence(evidenceFromRelease(selectedRelease));
    setReview(null);
    setApprovalNote('');
    setConfirmationAction('');
    setTypedConfirmation('');
    setMessage(null);
  }, [selectedRelease?.id, selectedRelease?.updated_date]);

  const currentReviewKey = reviewKey(selectedRelease?.id, evidence);
  const hasFreshReview = () => Boolean(
    review
      && review.release_id === selectedRelease?.id
      && review.review_key === currentReviewKey
      && exact(review.release_fingerprint)
      && Date.now() - review.reviewed_at_ms <= REVIEW_MAX_AGE_MS,
  );

  const setEvidenceField = (key, value) => {
    setEvidence((current) => ({ ...current, [key]: value }));
    setReview(null);
    setConfirmationAction('');
    setTypedConfirmation('');
    setMessage(null);
  };

  const runReview = async () => {
    if (!isExactOwner || !selectedRelease) return;
    setBusy('review');
    setMessage(null);
    setConfirmationAction('');
    setTypedConfirmation('');

    try {
      const response = await base44.functions.invoke('publishSingleWorkflow', {
        action: 'review',
        release_id: selectedRelease.id,
        ...evidence,
      });
      const result = responseData(response);
      if (result.error || result.ok !== true || !exact(result.release_fingerprint)) {
        throw new Error(result.error || 'The review did not return an exact release fingerprint.');
      }

      const missingRequirements = Array.isArray(result.missing_requirements)
        ? result.missing_requirements.filter(Boolean)
        : [];
      setReview({
        release_id: selectedRelease.id,
        release_title: exact(result.title || selectedRelease.title),
        version_label: exact(result.version_label || selectedRelease.version_label),
        release_fingerprint: exact(result.release_fingerprint),
        ready_for_approval: result.ready_for_approval === true,
        missing_requirements: missingRequirements,
        review_key: reviewKey(selectedRelease.id, evidence),
        reviewed_at_ms: Date.now(),
      });
      setMessage({
        tone: missingRequirements.length ? 'warning' : 'success',
        title: missingRequirements.length ? 'Review found incomplete gates' : 'Fresh review complete',
        detail: missingRequirements.length
          ? 'Resolve the listed requirements and review again. No release record changed.'
          : 'A current fingerprint is now available for one separately confirmed action.',
      });
      toast({
        title: missingRequirements.length ? 'Review complete with holds' : 'Review complete',
        description: missingRequirements.length
          ? 'No release record changed.'
          : 'Choose a separate owner-confirmed action when ready.',
        variant: missingRequirements.length ? 'destructive' : undefined,
      });
    } catch (error) {
      const detail = errorMessage(error);
      setReview(null);
      setMessage({ tone: 'error', title: 'Review held', detail });
      toast({ title: 'Review held', description: detail, variant: 'destructive' });
    } finally {
      setBusy('');
    }
  };

  // Save changes keeps everything private: it stores the evidence edits on
  // the private release record and never touches publication state. Going
  // live remains a completely separate, deliberately confirmed action.
  const evidenceChanged = !!selectedRelease && EVIDENCE_FIELDS.some(({ key }) => exact(evidence[key]) !== exact(selectedRelease[key]));

  const saveChanges = async () => {
    if (!isExactOwner || !selectedRelease) return;
    setBusy('save');
    setMessage(null);
    try {
      const response = await base44.functions.invoke('publishSingleWorkflow', {
        action: 'save_evidence',
        release_id: selectedRelease.id,
        ...evidence,
      });
      const result = responseData(response);
      if (result.error || result.ok !== true) {
        throw new Error(result.error || 'The private save did not complete.');
      }
      setMessage({
        tone: 'success',
        title: 'Changes saved privately',
        detail: 'Your evidence edits are stored on the private release. Nothing is published until a separate review, approval and Go Live press on release day.',
      });
      toast({ title: 'Changes saved', description: 'Private only. Nothing published.' });
      await queryClient.invalidateQueries({ queryKey: ['releaseControlDeskReleases'] });
    } catch (error) {
      const detail = errorMessage(error);
      setMessage({ tone: 'error', title: 'Save held', detail });
      toast({ title: 'Save held', description: detail, variant: 'destructive' });
    } finally {
      setBusy('');
    }
  };

  const openConfirmation = (action) => {
    if (!isExactOwner || !selectedRelease) return;
    if (!hasFreshReview()) {
      const detail = 'Run a fresh review after every release or evidence change before continuing.';
      setMessage({ tone: 'error', title: 'Fresh review required', detail });
      toast({ title: 'Fresh review required', description: detail, variant: 'destructive' });
      return;
    }
    if (action !== 'revoke' && (!review.ready_for_approval || review.missing_requirements.length)) {
      const detail = 'Resolve every review requirement and obtain a fresh fingerprint before this action.';
      setMessage({ tone: 'error', title: 'Release remains held', detail });
      toast({ title: 'Release remains held', description: detail, variant: 'destructive' });
      return;
    }
    setConfirmationAction(action);
    setTypedConfirmation('');
    setMessage(null);
  };

  const completeAction = async () => {
    const action = confirmationAction;
    if (!action || !selectedRelease || !isExactOwner) return;

    if (!hasFreshReview()) {
      const detail = 'This review is no longer current. Review the exact release and evidence again before acting.';
      setConfirmationAction('');
      setTypedConfirmation('');
      setMessage({ tone: 'error', title: 'Review expired', detail });
      toast({ title: 'Review expired', description: detail, variant: 'destructive' });
      return;
    }

    const expectedPhrase = phraseFor(action, review.release_title || selectedRelease.title);
    if (typedConfirmation !== expectedPhrase) {
      const detail = 'The typed confirmation must match exactly. No request was made.';
      setMessage({ tone: 'error', title: 'Confirmation did not match', detail });
      toast({ title: 'Nothing changed', description: detail, variant: 'destructive' });
      return;
    }

    if (!window.confirm(ACTIONS[action].confirmMessage)) return;

    setBusy(action);
    setMessage(null);
    try {
      const payload = {
        action,
        release_id: selectedRelease.id,
        ...evidence,
        confirm_title: review.release_title || exact(selectedRelease.title),
        confirm_version_label: review.version_label || exact(selectedRelease.version_label),
        confirm_release_fingerprint: review.release_fingerprint,
        approval_note: exact(approvalNote),
        confirm_action_phrase: typedConfirmation,
      };
      if (action === 'revoke') payload.confirm_revoke_phrase = typedConfirmation;
      if (action === 'approve') payload.confirm_approval_phrase = typedConfirmation;
      if (action === 'publish') payload.confirm_publish_phrase = typedConfirmation;

      const response = await base44.functions.invoke('publishSingleWorkflow', payload);
      const result = responseData(response);
      if (result.error || result.ok !== true) {
        throw new Error(result.error || 'The release control action did not complete.');
      }

      const actionLabel = ACTIONS[action].shortLabel;
      setMessage({
        tone: 'success',
        title: actionLabel + ' recorded',
        detail: action === 'approve'
          ? 'The server reports a private approval. Publication still requires a separate fresh review and exact confirmation.'
          : action === 'publish'
            ? 'The server reports publication for the exact reviewed snapshot.'
            : 'The server reports the release has been revoked and public state removed.',
      });
      toast({ title: actionLabel + ' recorded', description: 'The release register has been refreshed.' });
      setReview(null);
      setConfirmationAction('');
      setTypedConfirmation('');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['releaseControlDeskReleases'] }),
        queryClient.invalidateQueries({ queryKey: ['releases'] }),
        queryClient.invalidateQueries({ queryKey: ['studioReleases'] }),
      ]);
    } catch (error) {
      const detail = errorMessage(error);
      setMessage({ tone: 'error', title: ACTIONS[action].shortLabel + ' held', detail });
      toast({ title: ACTIONS[action].shortLabel + ' held', description: detail, variant: 'destructive' });
    } finally {
      setBusy('');
    }
  };

  const inputClass = 'bg-background font-body text-sm';
  const notePlaceholder = confirmationAction === 'revoke'
    ? 'Optional private reason for the revocation'
    : 'Optional private approval note';

  if (!isExactOwner) {
    return (
      <Card className="mx-auto max-w-3xl border-destructive/40">
        <CardContent className="flex gap-3 p-6">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <h1 className="font-display text-2xl text-foreground">Release Control Desk</h1>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              This desk is held for the two configured release owners. It does not expose a release action to this sign-in.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const reviewFresh = hasFreshReview();
  const localEvidenceGaps = EVIDENCE_FIELDS.filter(({ key }) => {
    const value = exact(evidence[key]);
    return key === 'public_link_evidence_url' ? !isHttps(value) : !value;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.28em] text-primary">Owner-only control</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">Release Control Desk</h1>
          <p className="mt-2 max-w-3xl font-body text-sm leading-relaxed text-muted-foreground">
            Review an exact private snapshot, then deliberately approve, publish, or revoke it. This screen never edits a release directly and never starts delivery, posting, promotion, or email.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-primary">
          <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
          Server-controlled
        </Badge>
      </div>

      <Card className="border-primary/25 bg-primary/5">
        <CardContent className="flex gap-3 p-4">
          <Eye className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-body text-sm font-medium text-foreground">No automatic action</p>
            <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">
              Review is read-only. Every later action needs a fresh matching fingerprint, a different typed phrase, and a final browser confirmation.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <Label htmlFor="release-control-release" className="font-body text-xs">Release</Label>
              <select
                id="release-control-release"
                value={releaseId}
                onChange={(event) => setReleaseId(event.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 font-body text-sm text-foreground"
                disabled={isLoading || busy !== ''}
              >
                <option value="">Choose a release</option>
                {releases.map((release) => (
                  <option key={release.id} value={release.id}>
                    {(release.title || 'Untitled') + (release.version_label ? ' · ' + release.version_label : '') + ' (' + (release.status || 'idea') + ')'}
                  </option>
                ))}
              </select>
              {releasesError && (
                <p className="mt-2 font-body text-xs text-destructive">Could not read the private release register: {errorMessage(releasesError)}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={saveChanges}
                disabled={!selectedRelease || busy !== '' || !evidenceChanged}
                title="Stores your evidence edits on the private release. Nothing is published."
                className="gap-2 rounded-full font-body text-xs uppercase tracking-wider border-primary/40 text-primary hover:bg-primary/10"
              >
                {busy === 'save' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save changes
              </Button>
              <Button
                type="button"
                onClick={runReview}
                disabled={!selectedRelease || busy !== ''}
                className="gap-2 rounded-full font-body text-xs uppercase tracking-wider"
              >
                {busy === 'review' ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Review exact snapshot
              </Button>
            </div>
          </div>

          {selectedRelease && (
            <div className="grid gap-3 rounded-xl border border-border/50 bg-secondary/10 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Title</p>
                <p className="mt-1 font-body text-sm text-foreground">{selectedRelease.title || 'Untitled'}</p>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Version</p>
                <p className="mt-1 font-body text-sm text-foreground">{selectedRelease.version_label || 'Not recorded'}</p>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                <p className="mt-1 font-body text-sm text-foreground">{String(selectedRelease.status || 'idea').replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Public state</p>
                <p className="mt-1 font-body text-sm text-foreground">{selectedRelease.is_published ? 'Published' : 'Private'}</p>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {EVIDENCE_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key} className={key === 'public_link_evidence_url' ? 'md:col-span-2' : ''}>
                <Label htmlFor={'release-control-' + key} className="font-body text-xs">{label}</Label>
                <Input
                  id={'release-control-' + key}
                  value={evidence[key] || ''}
                  onChange={(event) => setEvidenceField(key, event.target.value)}
                  placeholder={placeholder}
                  className={'mt-1.5 ' + inputClass}
                  inputMode={key === 'public_link_evidence_url' ? 'url' : undefined}
                />
                {key === 'public_link_evidence_url' && exact(evidence[key]) && !isHttps(evidence[key]) && (
                  <p className="mt-1.5 font-body text-xs text-destructive">Only an HTTPS listening-page URL can pass review.</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="release-control-note" className="font-body text-xs">Private note (optional)</Label>
            <Textarea
              id="release-control-note"
              value={approvalNote}
              onChange={(event) => setApprovalNote(event.target.value)}
              placeholder={notePlaceholder}
              rows={3}
              className={'mt-1.5 ' + inputClass}
            />
          </div>

          {localEvidenceGaps.length > 0 && (
            <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="font-body text-xs leading-relaxed text-muted-foreground">
                The local snapshot has {localEvidenceGaps.length} incomplete evidence field{localEvidenceGaps.length === 1 ? '' : 's'}.
                Review is still available so the server can report exact requirements; approval and publication remain held.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {review && (
        <Card className={reviewFresh ? 'border-primary/35' : 'border-destructive/45'}>
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex gap-3">
                {reviewFresh ? <FileCheck2 className="mt-0.5 h-5 w-5 text-primary" /> : <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />}
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{reviewFresh ? 'Fresh review fingerprint' : 'Review expired or changed'}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{fingerprintPreview(review.release_fingerprint)}</p>
                </div>
              </div>
              <Badge variant="outline" className={review.ready_for_approval && review.missing_requirements.length === 0 ? 'border-emerald-500/40 text-emerald-400' : 'border-amber-500/40 text-amber-400'}>
                {review.ready_for_approval && review.missing_requirements.length === 0 ? 'Ready for approval' : 'Held by review'}
              </Badge>
            </div>

            {review.missing_requirements.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 font-body text-xs text-destructive">
                {review.missing_requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
              </ul>
            )}

            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(ACTIONS).map(([action, details]) => (
                <Button
                  key={action}
                  type="button"
                  variant={action === 'revoke' ? 'outline' : action === 'publish' ? 'default' : 'secondary'}
                  onClick={() => openConfirmation(action)}
                  disabled={!reviewFresh || busy !== '' || (action !== 'revoke' && (!review.ready_for_approval || review.missing_requirements.length > 0))}
                  className={action === 'revoke'
                    ? 'border-destructive/40 text-destructive hover:bg-destructive/10'
                    : 'font-body text-xs uppercase tracking-wider'}
                >
                  {details.shortLabel}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {confirmationAction && selectedRelease && review && (
        <Card className={confirmationAction === 'revoke' ? 'border-destructive/50' : 'border-primary/45'}>
          <CardContent className="space-y-4 p-5">
            <div className="flex gap-3">
              {confirmationAction === 'revoke'
                ? <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />}
              <div>
                <h2 className="font-display text-xl text-foreground">{ACTIONS[confirmationAction].label}</h2>
                <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">{ACTIONS[confirmationAction].description}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border/50 bg-secondary/15 p-3">
              <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Type exactly</p>
              <p className="mt-1 break-words font-mono text-sm text-foreground">{phraseFor(confirmationAction, review.release_title || selectedRelease.title)}</p>
            </div>

            <div>
              <Label htmlFor="release-control-confirmation" className="font-body text-xs">Exact confirmation</Label>
              <Input
                id="release-control-confirmation"
                value={typedConfirmation}
                onChange={(event) => setTypedConfirmation(event.target.value)}
                placeholder={phraseFor(confirmationAction, review.release_title || selectedRelease.title)}
                className={'mt-1.5 ' + inputClass}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setConfirmationAction(''); setTypedConfirmation(''); }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={completeAction}
                disabled={busy !== '' || typedConfirmation !== phraseFor(confirmationAction, review.release_title || selectedRelease.title)}
                className={confirmationAction === 'revoke' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
              >
                {busy === confirmationAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm {ACTIONS[confirmationAction].shortLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {message && (
        <Card className={message.tone === 'error' ? 'border-destructive/45' : message.tone === 'warning' ? 'border-amber-500/45' : 'border-emerald-500/45'}>
          <CardContent className="flex gap-3 p-4">
            {message.tone === 'error'
              ? <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              : message.tone === 'warning'
                ? <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />}
            <div>
              <p className="font-body text-sm font-medium text-foreground">{message.title}</p>
              <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">{message.detail}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}