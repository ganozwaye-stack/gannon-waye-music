import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ReleaseEmailDraftCard from '@/components/admin/ReleaseEmailDraftCard';
import { Loader2, MailPlus, Inbox } from 'lucide-react';

const STATUS_OPTIONS = [
  'idea', 'writing', 'pre_production', 'recording', 'mixing', 'mastering', 'ready', 'released',
];

const APPROVAL_ORDER = { draft: 0, approved: 0, rejected: 1, sent: 2 };

// One main screen for every fan release email: drafts are staged here
// automatically whenever a release status changes, and nothing sends
// until Gannon presses Approve & Send.

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
          Every time a release status changes, a premium fan email is drafted here for your approval.
          Preview it, edit the words, then press Approve &amp; Send. Your mailing list plus every
          store customer who opted in to marketing receives it, and each status is only ever
          announced once.
        </p>
        {pendingCount > 0 && (
          <p className="font-body text-xs text-primary mt-3 tracking-wider uppercase">
            {pendingCount} draft{pendingCount === 1 ? '' : 's'} waiting for approval
          </p>
        )}
      </div>

      {/* Manual prepare: stage a draft for any release and status */}
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
            {releases.map((release) => (
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
            disabled={!releaseId || !status || preparing}
            className="rounded-full font-body text-[10px] tracking-wider uppercase gradient-gold-button border-0 px-6"
          >
            {preparing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <MailPlus className="w-4 h-4 mr-1" />}
            Prepare draft
          </Button>
        </div>
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
            No drafts yet. Change a release status in Releases and the fan email will appear here
            for approval, or prepare one manually above.
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