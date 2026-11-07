import React from 'react';
import ReviewSection from './ReviewSection';
import ReviewField from './ReviewField';

/** Lyrics, the public description and the owner's private notes. */
export default function ReleaseLyricsFields({ form, change, locked, lyric }) {
  return (
    <ReviewSection
      title="Lyrics and notes"
      description={lyric?.id
        ? `A separate lyric record is linked (${lyric.publishing_status || 'not approved'}). The text below is what this release carries.`
        : 'No separate lyric record is linked to this release yet.'}
    >
      <div className="space-y-3">
        <ReviewField label="Lyrics" value={form.lyrics} onChange={(v) => change('lyrics', v)} textarea rows={12} disabled={locked} />
        <ReviewField label="Public description" value={form.description} onChange={(v) => change('description', v)} textarea rows={3} disabled={locked} />
        <ReviewField
          label="Review notes"
          value={form.review_notes}
          onChange={(v) => change('review_notes', v)}
          textarea
          rows={3}
          disabled={locked}
          hint="Private. Recorded with an approval or a decline."
        />
      </div>
    </ReviewSection>
  );
}