import { Label } from '@/components/ui/label';
import { BRAND_COLOURS } from '@/lib/heroElements';

// Small shared controls for the Canvas Studio panels. Every number box
// accepts any value, and every colour picker offers the brand palette first.

export function PanelSection({ title, children }) {
  return (
    <div className="space-y-2">
      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

export function NumField({ label, value, onChange, step = 1 }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="font-body text-xs text-muted-foreground shrink-0">{label}</Label>
      <input
        type="number"
        step={step}
        value={value ?? 0}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        className="w-20 h-7 rounded-md border border-input bg-transparent px-2 text-right font-body text-xs text-primary"
      />
    </div>
  );
}

export function ColourField({ label, value = '#d4af37', onChange }) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#d4af37';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="font-body text-xs text-muted-foreground">{label}</Label>
        <input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-7 rounded border border-input bg-transparent cursor-pointer"
          aria-label={label}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {BRAND_COLOURS.map((c) => (
          <button
            key={c.hex}
            type="button"
            title={c.name}
            onClick={() => onChange(c.hex)}
            className={`w-5 h-5 rounded-full border ${value === c.hex ? 'border-white' : 'border-white/20'}`}
            style={{ background: c.hex }}
            aria-label={`${c.name} brand colour`}
          />
        ))}
      </div>
    </div>
  );
}

export function SelectField({ label, value, options, onChange }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="font-body text-xs text-muted-foreground shrink-0">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 h-7 rounded-md border border-input bg-transparent px-1 font-body text-xs text-foreground"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-card">{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function ToggleField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="font-body text-xs text-muted-foreground">{label}</Label>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full transition-colors relative ${value ? 'bg-primary' : 'bg-secondary'}`}
        aria-pressed={value}
        aria-label={label}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-4' : ''}`} />
      </button>
    </div>
  );
}

export function TextAreaField({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <Label className="font-body text-xs text-muted-foreground">{label}</Label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-md border border-input bg-transparent px-2 py-1 font-body text-xs text-foreground resize-y"
      />
    </div>
  );
}

export function TextField({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1">
      <Label className="font-body text-xs text-muted-foreground">{label}</Label>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        placeholder={placeholder}
        className="w-full h-8 rounded-md border border-input bg-transparent px-2 font-body text-xs text-foreground"
      />
    </div>
  );
}