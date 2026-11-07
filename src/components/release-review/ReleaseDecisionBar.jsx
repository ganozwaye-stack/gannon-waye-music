import React from 'react';
import { CheckCircle2, Save, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Save, approve or decline, all on this one screen. */
export default function ReleaseDecisionBar({
  approvalState, isPublished, busy, dirty, locked, notice, onSave, onApprove, onDecline,
}) {
  const working = Boolean(busy);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">Decision</h2>

      {locked && (
        <p className="mt-2 rounded-md border border-border bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
          {isPublished
            ? 'This release is public. It cannot be edited or approved again here.'
            : 'An approval is recorded, so the content is locked. Decline first to edit, then approve again.'}
        </p>
      )}

      <div className="mt-3 space-y-2">
        <Button type="button" variant="secondary" className="w-full" onClick={onSave} disabled={working || locked || !dirty}>
          {busy === 'save' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {dirty ? 'Save changes' : 'Saved'}
        </Button>
        <Button type="button" className="w-full" onClick={onApprove} disabled={working || locked || isPublished}>
          {busy === 'approve' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Approve release
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onDecline}
          disabled={working || isPublished || approvalState === 'revoked'}
        >
          {busy === 'decline' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
          Decline release
        </Button>
      </div>

      <p className="mt-3 text-[0.68rem] leading-relaxed text-muted-foreground">
        Approving records the decision and freezes this exact version. It does not make the release public,
        email anyone or deliver anything to a distributor.
      </p>

      {notice && (
        <div
          className={`mt-3 rounded-md border px-3 py-2 text-xs ${notice.tone === 'ok' ? 'border-primary/40 text-foreground' : 'border-destructive/50 text-destructive'}`}
          role="status"
        >
          <p>{notice.text}</p>
          {notice.items?.length > 0 && (
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {notice.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}