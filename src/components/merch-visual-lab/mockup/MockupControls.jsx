import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

function Row({ label, value, min, max, step = 1, onChange }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground mb-1"><span>{label}</span><span>{Math.round(value)}</span></div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

export default function MockupControls({ placement, onChange, onReset }) {
  const set = (k) => (v) => onChange({ ...placement, [k]: v });
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">3. Position the design (drag it on the preview, or fine-tune here)</p>
      <Row label="Size" value={placement.w} min={5} max={90} onChange={set('w')} />
      <Row label="Left / right" value={placement.x} min={0} max={100} onChange={set('x')} />
      <Row label="Up / down" value={placement.y} min={0} max={100} onChange={set('y')} />
      <Row label="Rotate" value={placement.rot || 0} min={-45} max={45} onChange={set('rot')} />
      <Row label="Opacity" value={(placement.opacity ?? 0.96) * 100} min={40} max={100} onChange={(v) => onChange({ ...placement, opacity: v / 100 })} />
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">Sink into fabric (multiply blend)</span>
        <Switch checked={Boolean(placement.blend)} onCheckedChange={set('blend')} />
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={onReset} className="text-xs">Reset to template default</Button>
    </div>
  );
}