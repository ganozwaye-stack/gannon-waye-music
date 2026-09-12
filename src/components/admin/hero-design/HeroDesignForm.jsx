import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Owner-controlled sliders for every hero design value. Values are stored in
// HeroDesignSettings and render live on the public hero once saved.

// Ranges are deliberately wide: the number box beside each slider accepts
// any value at all, so nothing here caps what the owner can do.
const GROUPS = [
  {
    title: 'Galaxy background',
    hint: 'The over-scan bleeds the plate past every screen edge, so no baked edge can ever show.',
    fields: [
      { key: 'galaxy_pos_y', label: 'Vertical framing position, 0 top to 100 bottom', min: 0, max: 100, step: 1, suffix: '' },
      { key: 'galaxy_scan_pct', label: 'Edge over-scan on every side', min: 0, max: 60, step: 1, suffix: '%' },
    ],
  },
  {
    title: 'Heart artwork',
    fields: [
      { key: 'heart_size_pct', label: 'Heart size relative to the standard width', min: 25, max: 300, step: 1, suffix: '%' },
      { key: 'heart_pos_y_pct', label: 'Vertical position, 0 is top, 100 is bottom', min: 0, max: 100, step: 1, suffix: '%' },
    ],
  },
  {
    title: 'Orbit ring',
    fields: [
      { key: 'ring_left_pct', label: 'Horizontal position', min: -100, max: 100, step: 1, suffix: '%' },
      { key: 'ring_top_pct', label: 'Vertical position', min: -80, max: 150, step: 1, suffix: '%' },
      { key: 'ring_width_pct', label: 'Width', min: 40, max: 400, step: 2, suffix: '%' },
      { key: 'ring_aspect', label: 'Flatness, higher means a flatter ring', min: 1, max: 12, step: 0.1, suffix: '' },
      { key: 'ring_rotation_deg', label: 'Tilt', min: -90, max: 90, step: 1, suffix: ' degrees' },
      { key: 'orbit_duration', label: 'Seconds for each spark to travel one lap', min: 1, max: 300, step: 1, suffix: 's' },
    ],
  },
  {
    title: 'Orbit sparks',
    fields: [
      { key: 'spark_main_size', label: 'Main spark size, 0 hides it', min: 0, max: 40, step: 1, suffix: 'px' },
      { key: 'spark_companion_size', label: 'Companion spark size, 0 hides it', min: 0, max: 30, step: 1, suffix: 'px' },
    ],
  },
];

// One artwork field: paste a URL or upload your own file.
function ArtworkField({ label, hint, value, onChange, uploading, onUpload }) {
  return (
    <div className="space-y-1.5">
      <p className="font-body text-xs text-muted-foreground">{label}</p>
      <div className="flex gap-2">
        <input
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 font-body text-sm shadow-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
          placeholder={hint}
        />
        <label className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 text-xs font-body cursor-pointer hover:bg-accent/10 whitespace-nowrap">
          {uploading ? 'Uploading...' : <><Upload className="w-3 h-3" /> Upload</>}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              if (f) onUpload(f);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
}

export default function HeroDesignForm({ values, releases = [], onChange }) {
  const [uploadingKey, setUploadingKey] = useState(null);
  const handleUpload = async (key, file) => {
    setUploadingKey(key);
    try {
      const res = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(key, res.file_url);
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <p className="font-body text-sm font-semibold text-foreground">Artwork</p>
          <p className="font-body text-xs text-muted-foreground">
            Add your own artwork here. The galaxy always fills the whole background, full-bleed with the
            over-scan, so no white sides can ever show on any screen.
          </p>
          <ArtworkField
            label="Heart artwork"
            hint="Leave blank to use the official built-in artwork"
            value={values.heart_art_url || ''}
            onChange={(v) => onChange('heart_art_url', v)}
            uploading={uploadingKey === 'heart_art_url'}
            onUpload={(f) => handleUpload('heart_art_url', f)}
          />
          <ArtworkField
            label="Galaxy background"
            hint="Leave blank for the built-in gold glow"
            value={values.galaxy_image_url || ''}
            onChange={(v) => onChange('galaxy_image_url', v)}
            uploading={uploadingKey === 'galaxy_image_url'}
            onUpload={(f) => handleUpload('galaxy_image_url', f)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <p className="font-body text-sm font-semibold text-foreground">Atmosphere</p>
          <div className="flex items-center justify-between">
            <Label className="font-body text-xs text-muted-foreground">Rising gold embers</Label>
            <Switch checked={values.embers_enabled !== false} onCheckedChange={(v) => onChange('embers_enabled', v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-body text-xs text-muted-foreground">Gold light rays behind the heart</Label>
            <Switch checked={values.rays_enabled !== false} onCheckedChange={(v) => onChange('rays_enabled', v)} />
          </div>
        </CardContent>
      </Card>

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
                <div className="flex items-center justify-between gap-2">
                  <Label className="font-body text-xs text-muted-foreground">{f.label}</Label>
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      className="w-20 h-7 rounded-md border border-input bg-transparent px-2 text-right font-body text-xs text-primary"
                      value={values[f.key] ?? ''}
                      onChange={(e) => onChange(f.key, e.target.value === '' ? 0 : Number(e.target.value))}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                      aria-label={f.label}
                    />
                    <span className="font-body text-[10px] text-muted-foreground">{f.suffix}</span>
                  </div>
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