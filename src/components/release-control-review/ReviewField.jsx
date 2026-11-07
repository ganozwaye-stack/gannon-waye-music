import React from 'react';
import { formatValue, isSet } from '@/components/release-control-review/reviewValues';

// One labelled value. A field the record does not hold reads NOT SET, never
// blank and never "undefined".
export default function ReviewField({ label, value, long = false }) {
  return (
    <div className="flex flex-col gap-1 border-t border-border/40 py-2 first:border-t-0 first:pt-0">
      <span className="font-body text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {isSet(value) ? (
        <span
          className={
            long
              ? 'max-h-40 overflow-y-auto whitespace-pre-wrap break-words font-body text-sm leading-relaxed text-foreground'
              : 'break-words font-body text-sm text-foreground'
          }
        >
          {formatValue(value)}
        </span>
      ) : (
        <span className="inline-flex w-fit rounded border border-border/70 bg-secondary/60 px-2 py-0.5 font-body text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
          NOT SET
        </span>
      )}
    </div>
  );
}