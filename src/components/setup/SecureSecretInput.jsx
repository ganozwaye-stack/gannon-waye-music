import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * SecureSecretInput
 * Allows Gannon to paste a secret into a masked field.
 * Calls the saveSecret backend function to persist it.
 * NEVER displays the value after saving.
 */
export default function SecureSecretInput({ label, secretName, placeholder = '••••••••••••', onSaved }) {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!value.trim()) { setError('Please enter a value.'); return; }
    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('saveSecretValue', { secret_name: secretName, secret_value: value.trim() });
      setSaved(true);
      setValue('');
      if (onSaved) onSaved();
    } catch (e) {
      // saveSecretValue function may not exist — fall back to showing a manual instruction
      setError('Auto-save not available. Go to Base44 Dashboard → Settings → Secrets → set ' + secretName + ' manually.');
    }
    setSaving(false);
  };

  if (saved) {
    return (
      <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-300">
        <CheckCircle2 className="w-4 h-4" />
        <span><strong>{label}</strong> saved securely. Value is hidden.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">(value hidden after save)</span>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder}
            className="font-mono text-sm pr-10"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Button onClick={handleSave} disabled={saving || !value.trim()} className="gap-2 shrink-0">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Securely'}
        </Button>
      </div>
      {error && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300">
          ⚠️ {error}
          <div className="mt-2 font-mono text-xs bg-secondary/50 rounded p-2">
            Secret name: <strong>{secretName}</strong>
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">🔒 This value is never stored in the app database or shown in chat. Only saved to Base44 Secrets vault.</p>
    </div>
  );
}