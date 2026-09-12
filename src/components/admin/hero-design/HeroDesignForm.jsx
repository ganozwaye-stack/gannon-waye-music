import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Owner-controlled sliders for every hero design value. Values are stored in
// HeroDesignSettings and render live on the public hero once saved.

const GROUPS = [
  {
    title: 'Galaxy background',
    hint: 'The over-scan bleeds the plate past every screen edge, so no baked edge can ever show.',
    fields: [
      { key: 'galaxy_pos_y', label: 'Vertical framing position, 0 top to 100 bottom', min: 0, max: 100, step: 1, suffix: '' },
      { key: 'galaxy_scan_pct', label: 'Edge over-scan on every side', min: 0, max: 40, step: 1, suffix: '%' },
    ],
  },
  {
    title: 'Heart artwork',
    fields: [
      { key: 'heart_size_pct', label: 'Heart size relative to the standard width', min: 50, max: 180, step: 1, suffix: '%' },
    ],
  },
  {
    title: 'Orbit ring',
    fields: [
      { key: 'ring_left_pct', label: 'Horizontal position', min: -60, max: 60, step: 1, suffix: '%' },
      { key: 'ring_top_pct', label: 'Vertical position', min: -40, max: 100, step: 1, suffix: '%' },
      { key: 'ring_width_pct', label: 'Width', min: 80, max: 260, step: 2, suffix: '%' },
      { key: 'ring_aspect', label: 'Flatness, higher means a flatter ring', min: 1, max: 8, step: 0.1, suffix: '' },
      { key: 'ring_rotation_deg', label: 'Tilt', min: -45, max: 45, step: 1, suffix: ' degrees' },
      { key: 'orbit_duration', label: 'Seconds for each spark to travel one lap', min: 3, max: 120, step: 1, suffix: 's' },
    ],
  },
  {
    title: 'Orbit sparks',
    fields: [
      { key: 'spark_main_size', label: 'Main spark size, 0 hides it', min: 0, max: 24, step: 1, suffix: 'px' },
      { key: 'spark_companion_size', label: 'Companion spark size, 0 hides it', min: 0, max: 16, step: 1, suffix: 'px' },
    ],
  },
];

export default function HeroDesignForm({ values, releases = [], onChange }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="hero-eyebrow-label" className="font-body text-xs">Small label above the title</Label>
              <Input
                id="hero-eyebrow-label"
                value={values.eyebrow_label || ''}
                onChange={(e) => onChange('eyebrow_label', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-xs">Featured release</Label>
              <Select
                value={values.hero_release_id || '__current__'}
                onValueChange={(v) => onChange('hero_release_id', v === '__current__' ? '' : v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__current__">Follow the current single automatically</SelectItem>
                  {releases.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {GROUPS.map((group) => (
        <Card key={group.title}>
          <CardContent className="p-4 space-y-4">
            <div>
              <p className="font-body text-sm font-semibold text-foreground">{group.title}</p>
              {group.hint && <p className="font-body text-xs text-muted-foreground mt-0.5">{group.hint}</p>}
            </div>
            {group.fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="font-body text-xs text-muted-foreground">{f.label}</Label>
                  <span className="font-body text-xs text-primary">{values[f.key]}{f.suffix}</span>
                </div>
                <input
                  type="range"
                  className="w-full accent-primary"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={values[f.key]}
                  onChange={(e) => onChange(f.key, Number(e.target.value))}
                  aria-label={f.label}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </form>
  );
}