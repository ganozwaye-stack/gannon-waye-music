import React from 'react';
import { Label } from '@/components/ui/label';

/** Labelled native select for enumerated release values. */
export default function ReviewSelect({ label, value, options, onChange, disabled = false, hint }) {
  const id = `review-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </Label>
      <select
        id={id}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
      >
        <option value="">Not set</option>
        {options.map((option) => (
          <option key={option} value={option}>{option.replace(/_/g, ' ')}</option>
        ))}
      </select>
      {hint && <p className="text-[0.68rem] text-muted-foreground">{hint}</p>}
    </div>
  );
}