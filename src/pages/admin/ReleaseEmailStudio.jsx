import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ReleaseEmailDraftCard from '@/components/admin/ReleaseEmailDraftCard';
import { Loader2, MailPlus, Inbox } from 'lucide-react';

const STATUS_OPTIONS = ['released'];
const OWNER_EMAILS = new Set(['ganozwaye@gmail.com', 'gannonwayemusic@gmail.com']);

const APPROVAL_ORDER = { draft: 0, approved: 0, rejected: 1, sent: 2 };

// One owner-only screen for fan release email drafts. The global workflow
// safety hold prevents automatic creation; only fully approved public releases
// can be selected, and sending needs a final owner confirmation.

export default function ReleaseEmailStudio() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [releaseId, setReleaseId] = useState('');
  const [status, setStatus] = useState('');
  const [preparing, setPreparing] = useState(false);

  const { data: drafts = [], isLoading } = useQuery({
    queryKey: ['releaseEmailDrafts'],
    queryFn: () => base44.entities.ReleaseEmailDraft.list('-created_date', 100),
  });

  const { data: releases = [] } = useQuery({
    queryKey: ['studioReleases'],
    queryFn: () => base44.entities.Release.list('-updated_date', 50),
  });

  const sorted = [...drafts].sort(
    (a, b) => (APPROVAL_ORDER[a.approval_status] ?? 1) - (APPROVAL_ORDER[b.approval_status] ?? 1)
  );
  const pendingCount = drafts.filter((d) => ['draft', 'approved'].includes(d.approval_status)).length;
  const eligibleReleases = releases.filter((release) =>
    release.is_published === true
    && release.publishing_safe === true
    && release.status === 'released'
    && release.public_release_approval_status === 'approved'
    && OWNER_EMAILS.has(String(release.public_release_approved_by || '').trim().toLowerCase())
    && Boolean(release.public_release_approved_at)
    && Boolean(release.public_release_approval_id)
    && Boolean(release.public_release_approval_fingerprint)
    && String(release.release_email_dispatch_state || '') === 'idle'
    && String(release.rights_evidence_reference || '').trim().length >= 8
    && String(release.master_evidence_reference || '').trim().length >= 8
    && String(release.delivery_evidence_reference || '').trim().length >= 8
    && /^https:\/\//.test(String(release.public_link_evidence_url || '').trim())
  );

  const handlePrepare = async (e) => {
    e.preventDefault();
    if (!releaseId || !status) return;
    setPreparing(true);
    try {
      const res = await base44.functions.invoke('prepareReleaseEmailDraft', {
        release_id: releaseId,
        status,
        source: 'manual',
      });
      const result = res?.data || res || {};
      if (result.skipped) {
        toast({ title: 'No new draft needed', description: result.reason });
      } else {
        toast({ title: 'Draft prepared', description: `${result.recipient_count} fans will receive it once you approve.` });
      }
      qc.invalidateQueries({ queryKey: ['releaseEmailDrafts'] });
    } catch (error) {
      toast({
        title: 'Could not prepare the draft',
        description: error?.response?.data?.error || error.message,
        variant: 'destructive',
      });
    } finally {
      setPreparing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">Release Email Studio</p>
        <h1 className="font-body text-3xl gradient-gold-text mb-2">Fan Emails, One Screen</h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Choose a fully approved public release with current evidence and an immutable approval receipt
          to prepare one private draft. Preview or edit it, then use the exact final confirmation before
          any email is sent. Claimed or interrupted sends are held for manual reconciliation and are never retried automatically.
        </p>
        {pendingCount > 0 && (
          <p className="font-body text-xs text-primary mt-3 tracking-wider uppercase">
            {pendingCount} draft{pendingCount === 1 ? '' : 's'} waiting for approval
          </p>
        )}
      </div>

      {/* Manual prepare: stage a private draft for an eligible public release only */}
      <form onSubmit={handlePrepare}
        className="rounded-2xl border border-border/50 p-5 mb-8"
        style={{ background: 'linear-gradient(135deg, rgba(8,8,14,0.55), rgba(8,8,14,0.3))' }}>
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Prepare a draft manually</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={releaseId}
            onChange={(e) => setReleaseId(e.target.value)}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 font-body text-sm text-foreground"
            aria-label="Release"
          >
            <option value="">Choose a release</option>
            {eligibleReleases.map((release) => (
              <option key={release.id} value={release.id}>
                {release.title} ({String(release.status || '').replace(/_/g, ' ')})
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 font-body text-sm text-foreground"
            aria-label="Status to announce"
          >
            <option value="">Status to announce</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <Button
            type="submit"
            disabled={!releaseId || !status || preparing || eligibleReleases.length === 0}
            className="rounded-full font-body text-[10px] tracking-wider uppercase gradient-gold-button border-0 px-6"
          >
            {preparing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <MailPlus className="w-4 h-4 mr-1" />}
            Prepare draft
          </Button>
        </div>
        {eligibleReleases.length === 0 && (
          <p className="font-body text-xs text-muted-foreground mt-3">
            No release currently meets the full public-release approval gate, so no fan email can be prepared.
          </p>
        )}
      </form>

      {/* All drafts, pending first */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/40 p-14 text-center">
          <Inbox className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            No drafts yet. A fully approved public release can be prepared manually above; nothing is drafted or sent automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((draft) => (
            <ReleaseEmailDraftCard key={draft.id} draft={draft} />
          ))}
        </div>
      )}
    </div>
  );
}