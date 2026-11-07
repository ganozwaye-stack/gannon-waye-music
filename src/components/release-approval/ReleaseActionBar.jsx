import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Fixed action bar. Every blocked control carries its reason right beside it.
export default function ReleaseActionBar({
  record, typed, onTypedChange, onReview, onEdit, onApprove, busy, approveReasons, editReasons,
}) {
  const canEdit = Boolean(record) && editReasons.length === 0;
  const canApprove = Boolean(record) && approveReasons.length === 0;
  const canReview = Boolean(record) && busy !== 'review';

  return (
    <div className="sticky bottom-0 z-30 mt-4 rounded-lg border border-border bg-card/95 p-4 backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <label className="flex-1">
          <span className="mb-1 block font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted-foreground">
            Type the exact song title to enable Approve
          </span>
          <Input
            value={typed}
            onChange={(event) => onTypedChange(event.target.value)}
            placeholder={record?.title || 'Load a release first'}
            disabled={!record}
            aria-label="Type the exact song title to enable Approve"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onReview} disabled={!canReview}>
            {busy === 'review' ? 'Reviewing…' : 'Review'}
          </Button>
          <Button type="button" variant="secondary" onClick={onEdit} disabled={!canEdit}>
            Edit
          </Button>
          <Button type="button" onClick={onApprove} disabled={!canApprove || busy === 'approve'}>
            {busy === 'approve' ? 'Approving…' : 'Approve'}
          </Button>
          <Button type="button" variant="destructive" disabled>
            Decline
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {record && editReasons.length > 0 ? (
          <ul className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 font-body text-xs leading-relaxed text-amber-300">
            {editReasons.map((reason) => <li key={reason}>Edit blocked: {reason}</li>)}
          </ul>
        ) : null}
        {record && approveReasons.length > 0 ? (
          <ul className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 font-body text-xs leading-relaxed text-amber-300">
            {approveReasons.map((reason) => <li key={reason}>Approve blocked: {reason}</li>)}
          </ul>
        ) : null}
        <p className="font-body text-xs text-muted-foreground">
          Decline is not built. No declined status and no reason field exist yet.
        </p>
      </div>
    </div>
  );
}