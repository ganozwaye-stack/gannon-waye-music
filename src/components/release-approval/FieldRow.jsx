import React from 'react';
import { displayValue, hasValue } from '@/components/release-approval/approvalFields';

// One labelled value. A field the record does not hold reads NOT BUILT, never
// blank, and never as a pass.
export default function FieldRow({ label, value, long = false }) {
  const built = hasValue(value);
  return (
    <div className="flex flex-col gap-1 border-t border-border/40 py-2 first:border-t-0 first:pt-0">
      <span className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <span
        className={
          built
            ? `font-body text-sm text-foreground ${long ? 'max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed' : 'break-words'}`
            : 'font-body text-xs tracking-[0.18em] text-amber-400'
        }
      >
        {displayValue(value)}
      </span>
    </div>
  );
}