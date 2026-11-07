import React from 'react';
import ReviewField from '@/components/release-control-review/ReviewField';

// One labelled read-only block of live record values.
export default function ReviewBlock({ title, fields, record }) {
  return (
    <section className="rounded-lg border border-border/60 bg-card p-4">
      <h2 className="font-display text-lg text-foreground">{title}</h2>
      <div className="mt-2">
        {fields.map((field) => (
          <ReviewField
            key={field.key}
            label={field.key}
            value={record ? record[field.key] : undefined}
            long={field.long === true}
          />
        ))}
      </div>
    </section>
  );
}