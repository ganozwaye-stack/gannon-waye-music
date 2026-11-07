import React from 'react';
import ReviewSection from './ReviewSection';
import ReviewField from './ReviewField';

/** The listen, the identifiers and where the release is delivered. */
export default function ReleaseListenFields({ form, change, locked }) {
  return (
    <ReviewSection title="Listen and identifiers" description="The audio used for this review, plus the codes the distributor needs.">
      <div className="grid gap-3 sm:grid-cols-2">
        <ReviewField label="Audio preview URL" value={form.audio_preview_url} onChange={(v) => change('audio_preview_url', v)} placeholder="https://…" disabled={locked} />
        <ReviewField label="ISRC" value={form.isrc_code} onChange={(v) => change('isrc_code', v)} placeholder="AUXXX2600001" disabled={locked} />
        <ReviewField label="UPC / EAN" value={form.upc_code} onChange={(v) => change('upc_code', v)} disabled={locked} />
        <ReviewField label="Distribution destination" value={form.distributor} onChange={(v) => change('distributor', v)} placeholder="TooLost" disabled={locked} />
        <ReviewField label="Distributor link" value={form.distributor_link} onChange={(v) => change('distributor_link', v)} placeholder="https://…" disabled={locked} />
      </div>
    </ReviewSection>
  );
}