import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

const TONES = {
  error: { box: 'border-destructive/50 bg-destructive/10', text: 'text-destructive', Icon: XCircle },
  warning: { box: 'border-amber-500/50 bg-amber-500/10', text: 'text-amber-300', Icon: AlertTriangle },
  success: { box: 'border-emerald-500/50 bg-emerald-500/10', text: 'text-emerald-300', Icon: CheckCircle2 },
  info: { box: 'border-border bg-secondary', text: 'text-foreground', Icon: Info },
};

export default function NoticePanel({ notice, children }) {
  if (!notice) return null;
  const tone = TONES[notice.kind] || TONES.info;
  const { Icon } = tone;
  return (
    <div className={`rounded-lg border p-4 ${tone.box}`} role="status">
      <p className={`flex items-center gap-2 font-body text-xs uppercase tracking-[0.16em] ${tone.text}`}>
        <Icon className="h-4 w-4 shrink-0" />
        {notice.title}
      </p>
      <p className="mt-2 whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground/85">{notice.body}</p>
      {Array.isArray(notice.requirements) && notice.requirements.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 font-body text-xs leading-relaxed text-foreground/85">
          {notice.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      ) : null}
      {children ? <div className="mt-3 flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}