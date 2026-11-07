import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

/** Labelled text field for the release review screen. */
export default function ReviewField({
  label, value, onChange, placeholder, textarea = false, rows = 4, disabled = false, hint, type = 'text',
}) {
  const id = `review-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </Label>
      {textarea ? (
        <Textarea
          id={id}
          rows={rows}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-sm"
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-sm"
        />
      )}
      {hint && <p className="text-[0.68rem] text-muted-foreground">{hint}</p>}
    </div>
  );
}