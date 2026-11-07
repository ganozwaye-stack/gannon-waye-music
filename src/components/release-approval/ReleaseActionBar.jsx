import React from 'react';
import { Button } from '@/components/ui/button';

// The four decisions. Decline stays visible and disabled: it is not built.
export default function ReleaseActionBar({ busy, blockedApprovalText, onReview, onEdit, onApprove }) {
  const blocked = Boolean(blockedApprovalText);

  return (
    <div className="sticky bottom-0 mt-5 rounded-lg border border-border/60 bg-card/95 p-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={onReview} disabled={busy !== ''}>
          {busy === 'review' ? 'Reviewing…' : 'Review'}
        </Button>
        <Button type="button" variant="outline" onClick={onEdit} disabled={busy !== ''}>
          Edit
        </Button>
        <Button type="button" onClick={onApprove} disabled={blocked || busy !== ''}>
          {busy === 'approve' ? 'Approving…' : 'Approve'}
        </Button>
        <Button type="button" variant="outline" disabled>
          Decline
        </Button>
      </div>
      {blocked ? (
        <p className="mt-2 font-body text-xs leading-relaxed text-amber-300">{blockedApprovalText}</p>
      ) : null}
      <p className="mt-2 font-body text-xs text-muted-foreground">Decline is not built yet</p>
    </div>
  );
}