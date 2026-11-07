import React from 'react';
import { Check, X } from 'lucide-react';
import ReviewSection from './ReviewSection';

const hasText = (value, minimum = 1) => String(value || '').trim().length >= minimum;
const isHttps = (value) => /^https:\/\/\S+$/i.test(String(value || '').trim());

/** Everything that must be true before Approve can record anything. */
export default function ReleaseChecklist({ release, form, lyric }) {
  const items = [
    { label: 'Song title', ok: hasText(form.title) },
    { label: 'Version label', ok: hasText(form.version_label) },
    { label: 'Status ready or released', ok: ['ready', 'released'].includes(String(form.status)), detail: form.status },
    { label: 'Artwork', ok: isHttps(form.artwork_url) },
    { label: 'Audio to review', ok: isHttps(form.audio_preview_url) },
    { label: 'Lyrics', ok: hasText(form.lyrics, 20) || hasText(lyric?.lyrics_text, 20) },
    { label: 'ISRC', ok: hasText(form.isrc_code) },
    { label: 'UPC / EAN', ok: hasText(form.upc_code) },
    { label: 'Distribution destination', ok: hasText(form.distributor) },
    { label: 'Rights evidence', ok: hasText(form.rights_evidence_reference, 8) },
    { label: 'Master evidence', ok: hasText(form.master_evidence_reference, 8) },
    { label: 'Delivery evidence', ok: hasText(form.delivery_evidence_reference, 8) },
    { label: 'Public listening link', ok: isHttps(form.public_link_evidence_url) },
  ];
  const ready = items.filter((item) => item.ok).length;
  const approved = release?.public_release_approval_status === 'approved';

  return (
    <ReviewSection title="Checklist" description={`${ready} of ${items.length} complete.`}>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-2 text-xs">
            <span className={item.ok ? 'text-primary' : 'text-destructive'}>
              {item.ok ? <Check className="mt-0.5 h-3.5 w-3.5" /> : <X className="mt-0.5 h-3.5 w-3.5" />}
            </span>
            <span className={item.ok ? 'text-foreground' : 'text-muted-foreground'}>
              {item.label}
              {item.detail && !item.ok ? ` (${String(item.detail).replace(/_/g, ' ')})` : ''}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-border pt-2 text-[0.68rem] text-muted-foreground">
        Approval state: {String(release?.public_release_approval_status || 'pending').replace(/_/g, ' ')}
        {release?.is_published ? ' · public' : ' · private'}
        {approved ? ' · approved and recorded' : ''}
      </p>
    </ReviewSection>
  );
}