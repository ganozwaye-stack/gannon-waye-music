import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Inline review edits: title, release_date, lyrics and version only. Saving
// refreshes the record; it never publishes or delivers anything.
export default function ReleaseEditForm({ form, onChange, onSave, onCancel, saving }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      className="rounded-lg border border-border/60 bg-card p-4"
    >
      <h2 className="font-display text-lg text-foreground">Edit review content</h2>
      <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">
        Saving writes these fields to the record and refreshes the review. Nothing is published or delivered.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="review-title">title</Label>
          <Input
            id="review-title"
            value={form.title}
            onChange={(event) => onChange('title', event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="review-release-date">release_date</Label>
          <Input
            id="review-release-date"
            type="date"
            value={form.release_date}
            onChange={(event) => onChange('release_date', event.target.value)}
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="review-version">version</Label>
          <Input
            id="review-version"
            value={form.version_label}
            onChange={(event) => onChange('version_label', event.target.value)}
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="review-lyrics">lyrics</Label>
          <Textarea
            id="review-lyrics"
            rows={12}
            value={form.lyrics}
            onChange={(event) => onChange('lyrics', event.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}