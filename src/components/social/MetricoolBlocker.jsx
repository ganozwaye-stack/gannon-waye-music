import { AlertTriangle, Lock, ExternalLink } from 'lucide-react';

/**
 * MetricoolBlocker — renders a hard blocker whenever METRICOOL_API_TOKEN is not set.
 * 
 * Usage: wrap any Metricool-API-dependent action.
 * Pass `isBlocked={true}` when the token secret is absent.
 * Optionally wrap children who should only render when unblocked.
 */
export default function MetricoolBlocker({ isBlocked, children }) {
  if (!isBlocked) return children || null;

  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-6 flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
        <Lock className="w-6 h-6 text-red-400" />
      </div>
      <div>
        <p className="font-body text-sm font-semibold text-red-400 mb-1">Metricool API Blocked</p>
        <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-sm">
          <strong className="text-foreground">METRICOOL_API_TOKEN</strong> is not configured.
          Automated Metricool scheduling is disabled until this secret is added.
          All content is still generated and copyable — schedule manually in Metricool.
        </p>
      </div>
      <div className="bg-secondary/40 border border-border/50 rounded-lg p-3 text-left w-full max-w-sm">
        <p className="font-body text-[10px] tracking-wider uppercase text-muted-foreground mb-1.5">To unblock:</p>
        <ol className="font-body text-xs text-foreground/70 space-y-1">
          <li>1. Get your Metricool API token from <span className="text-primary">app.metricool.com → Settings → API</span></li>
          <li>2. Go to Base44 dashboard → Settings → Secrets</li>
          <li>3. Add secret: <code className="text-primary bg-secondary/60 px-1 rounded">METRICOOL_API_TOKEN</code></li>
          <li>4. Reload this page</li>
        </ol>
      </div>
      <a
        href="https://app.metricool.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 font-body text-xs text-primary hover:underline"
      >
        <ExternalLink className="w-3 h-3" /> Open Metricool
      </a>
      <div className="flex items-center gap-2 text-xs font-body text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 w-full max-w-sm">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        <span>Manual copy-paste workflow is fully operational. Nothing is blocked in production.</span>
      </div>
    </div>
  );
}