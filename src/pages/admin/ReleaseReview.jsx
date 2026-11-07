import React from 'react';
import useReleaseReview from '@/hooks/useReleaseReview';
import ReleaseTitleList from '@/components/release-review/ReleaseTitleList';
import ReleaseReviewPanel from '@/components/release-review/ReleaseReviewPanel';

/**
 * One-click release review. Releases are listed by song title; opening a title
 * shows artwork, the listen, lyrics, metadata, ISRC and UPC, the distribution
 * destination, the checklist and the decision buttons on one screen.
 */
export default function ReleaseReview() {
  const review = useReleaseReview();

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5">
          <p className="text-[0.62rem] uppercase tracking-[0.3em] text-primary">Owner review</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">Release Review</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            One screen per song. Review the artwork and the audio, edit the lyrics, metadata, ISRC, UPC and
            destination, check the list, then approve or decline in one action. Approving records the decision
            only. Nothing is published, delivered or emailed from here.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <ReleaseTitleList
            releases={review.releases}
            loading={review.loadingList}
            selectedId={review.selectedId}
            onSelect={review.openRelease}
          />
          {review.loadingDetail ? (
            <div className="flex items-center justify-center rounded-lg border border-border bg-card p-10 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Loading release…
            </div>
          ) : (
            <ReleaseReviewPanel review={review} />
          )}
        </div>
      </div>
    </div>
  );
}