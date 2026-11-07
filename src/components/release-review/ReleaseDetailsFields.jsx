import React from 'react';
import ReviewSection from './ReviewSection';
import ReviewField from './ReviewField';
import ReviewSelect from './ReviewSelect';

const TYPES = ['single', 'ep', 'album'];
const STATUSES = ['idea', 'writing', 'pre_production', 'recording', 'mixing', 'mastering', 'ready', 'released'];
const GENRES = ['singer_songwriter', 'folk', 'soul', 'pop', 'rnb', 'hip_hop', 'spoken_word', 'cinematic', 'rock', 'other'];
const MOODS = ['reflective', 'tender', 'raw', 'uplifting', 'melancholic', 'hopeful', 'anthemic', 'intimate', 'other'];

/** Core release metadata, edited on the review screen itself. */
export default function ReleaseDetailsFields({ form, change, locked }) {
  return (
    <ReviewSection title="Release details">
      <div className="grid gap-3 sm:grid-cols-2">
        <ReviewField label="Song title" value={form.title} onChange={(v) => change('title', v)} disabled={locked} />
        <ReviewField label="Version" value={form.version_label} onChange={(v) => change('version_label', v)} placeholder="Original" disabled={locked} />
        <ReviewSelect label="Type" value={form.type} options={TYPES} onChange={(v) => change('type', v)} disabled={locked} />
        <ReviewSelect label="Status" value={form.status} options={STATUSES} onChange={(v) => change('status', v)} disabled={locked} hint="Approval needs ready or released." />
        <ReviewField label="Release date" type="date" value={form.release_date} onChange={(v) => change('release_date', v)} disabled={locked} />
        <ReviewField label="Duration" value={form.duration} onChange={(v) => change('duration', v)} placeholder="3:42" disabled={locked} />
        <ReviewSelect label="Genre" value={form.genre} options={GENRES} onChange={(v) => change('genre', v)} disabled={locked} />
        <ReviewSelect label="Mood" value={form.mood} options={MOODS} onChange={(v) => change('mood', v)} disabled={locked} />
        <ReviewField label="Language" value={form.language} onChange={(v) => change('language', v)} disabled={locked} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <ReviewField label="Artwork URL" value={form.artwork_url} onChange={(v) => change('artwork_url', v)} disabled={locked} />
        <ReviewField label="Credits" value={form.credits} onChange={(v) => change('credits', v)} textarea rows={3} disabled={locked} />
      </div>
    </ReviewSection>
  );
}