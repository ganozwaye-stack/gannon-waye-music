import { PLATFORMS } from './platforms';

export default function ConnectionsTab() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-foreground">Channel connections</h2>
      <p className="text-xs text-muted-foreground">
        Only channels with real, confirmed authorization can publish. Everything else stays as plan-only cards so no post is ever claimed as sent when it was not.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PLATFORMS.map((p) => (
          <div key={p.key} className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p.Icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground font-medium">{p.label}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] border ${
                p.canPublish ? 'border-primary text-primary' : p.connected ? 'border-border text-muted-foreground' : 'bg-secondary text-secondary-foreground'
              }`}>
                {p.state}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{p.note}</p>
            <div className="text-[11px] text-muted-foreground">
              {p.canPublish ? 'Publishing: enabled' : 'Publishing: not available'}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        To connect a new channel, the corresponding authorization is added first, and only then does its card switch to publishing enabled.
      </p>
    </div>
  );
}