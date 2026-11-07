import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RELEASE_STATUSES } from '@/components/release-approval/approvalFields';

function TextField({ label, value, onChange, type = 'text' }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function LongField({ label, value, onChange, rows = 4 }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 font-body text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </label>
  );
}

export default function ReleaseEditForm({ form, onChange, onSave, onCancel, saving }) {
  const set = (field) => (value) => onChange(field, value);

  return (
    <section className="rounded-lg border border-primary/40 bg-card p-4">
      <h2 className="font-display text-lg text-foreground">Edit review content</h2>
      <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">
        Saves through saveReleaseReview, then the record is re-read and the fingerprint refreshed. Nothing is
        published, delivered or emailed.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <TextField label="title" value={form.title} onChange={set('title')} />
        <TextField label="version_label" value={form.version_label} onChange={set('version_label')} />
        <label className="flex flex-col gap-1">
          <span className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted-foreground">status</span>
          <select
            value={form.status}
            onChange={(event) => set('status')(event.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 font-body text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">NOT SET</option>
            {RELEASE_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
        <TextField label="release_date" type="date" value={form.release_date} onChange={set('release_date')} />
        <TextField label="artwork_url" value={form.artwork_url} onChange={set('artwork_url')} />
        <TextField label="isrc_code" value={form.isrc_code} onChange={set('isrc_code')} />
        <TextField label="upc_code" value={form.upc_code} onChange={set('upc_code')} />
        <TextField label="audio_preview_url" value={form.audio_preview_url} onChange={set('audio_preview_url')} />
        <LongField label="description" value={form.description} onChange={set('description')} rows={3} />
        <LongField label="lyrics" value={form.lyrics} onChange={set('lyrics')} rows={6} />
        <LongField label="review_notes" value={form.review_notes} onChange={set('review_notes')} rows={3} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save and refresh fingerprint'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
      </div>
    </section>
  );
}