import React from 'react';
import ReleaseMediaBlock from './ReleaseMediaBlock';
import ReleaseDetailsFields from './ReleaseDetailsFields';
import ReleaseListenFields from './ReleaseListenFields';
import ReleaseEvidenceFields from './ReleaseEvidenceFields';
import ReleaseLyricsFields from './ReleaseLyricsFields';
import ReleaseChecklist from './ReleaseChecklist';
import ReleaseDecisionBar from './ReleaseDecisionBar';

/** The single screen: everything needed to review, edit, approve or decline. */
export default function ReleaseReviewPanel({ review }) {
  const {
    release, lyric, form, change, locked, dirty, busy, notice, save, approve, decline,
  } = review;

  if (!release) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Choose a song title to open its review.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ReleaseMediaBlock form={form} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <ReleaseDetailsFields form={form} change={change} locked={locked} />
          <ReleaseListenFields form={form} change={change} locked={locked} />
          <ReleaseEvidenceFields form={form} change={change} locked={locked} />
          <ReleaseLyricsFields form={form} change={change} locked={locked} lyric={lyric} />
        </div>

        <div className="space-y-4 self-start xl:sticky xl:top-4">
          <ReleaseChecklist release={release} form={form} lyric={lyric} />
          <ReleaseDecisionBar
            approvalState={release.public_release_approval_status || 'pending'}
            isPublished={release.is_published === true}
            busy={busy}
            dirty={dirty}
            locked={locked}
            notice={notice}
            onSave={save}
            onApprove={approve}
            onDecline={decline}
          />
        </div>
      </div>
    </div>
  );
}