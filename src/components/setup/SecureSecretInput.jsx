import { Shield } from 'lucide-react';

/**
 * In-app secret entry is intentionally disabled. A browser form must never
 * claim to store a credential unless there is a verified server-side secret
 * vault flow with an explicit owner action.
 */
export default function SecureSecretInput({ label, secretName }) {
  return (
    <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        In-app secret entry is disabled. Enter this credential directly in the provider dashboard only after you have reviewed the exact connection and scope.
      </p>
      <p className="font-mono text-xs text-muted-foreground">Secret name: {secretName}</p>
    </div>
  );
}
