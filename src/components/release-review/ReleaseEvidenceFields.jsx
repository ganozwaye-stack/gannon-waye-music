import React from 'react';
import ReviewSection from './ReviewSection';
import ReviewField from './ReviewField';

/** The evidence an approval is recorded against. Frozen once approval begins. */
export default function ReleaseEvidenceFields({ form, change, locked }) {
  return (
    <ReviewSection
      title="Approval evidence"
      description="Each reference needs at least 8 characters and the public link must be HTTPS. These are frozen into the approval record."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <ReviewField label="Rights evidence" value={form.rights_evidence_reference} onChange={(v) => change('rights_evidence_reference', v)} disabled={locked} />
        <ReviewField label="Master evidence" value={form.master_evidence_reference} onChange={(v) => change('master_evidence_reference', v)} disabled={locked} />
        <ReviewField label="Delivery evidence" value={form.delivery_evidence_reference} onChange={(v) => change('delivery_evidence_reference', v)} disabled={locked} />
        <ReviewField label="Public listening link" value={form.public_link_evidence_url} onChange={(v) => change('public_link_evidence_url', v)} placeholder="https://…" disabled={locked} />
      </div>
    </ReviewSection>
  );
}