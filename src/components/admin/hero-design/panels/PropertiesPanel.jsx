import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Lock, Trash2, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FONT_OPTIONS } from '@/lib/heroElements';
import { ColourField, NumField, PanelSection, SelectField, TextAreaField, TextField, ToggleField } from './controls';

const WEIGHTS = [300, 400, 500, 600, 700, 800, 900].map((w) => ({ value: String(w), label: String(w) }));
const ALIGN = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Centre' },
  { value: 'right', label: 'Right' },
];

// Everything about the selected element: position, size, fonts, brand
// colours, glow, shadow, lock, layer order, duplicate and delete.
export default function PropertiesPanel({ el, onChange, onDelete, onDuplicate, onZ }) {
  if (!el) {
    return (
      <p className="font-body text-xs text-muted-foreground">
        Select anything on the canvas to edit it here: fonts, colours, glow, shadow, position, size and more.
      </p>
    );
  }
  const set = (patch) => onChange(el.id, patch);
  const iconBtn = 'h-8 w-8 p-0';

  return (
    <div className="space-y-5">
      <PanelSection title={`${el.type} controls`}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button type="button" variant="outline" size="icon" className={iconBtn} onClick={() => onDuplicate(el.id)} title="Duplicate"><Copy className="w-3.5 h-3.5" /></Button>
          <Button type="button" variant="outline" size="icon" className={iconBtn} onClick={() => set({ hidden: !el.hidden })} title={el.hidden ? 'Show' : 'Hide'}>
            {el.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </Button>
          <Button type="button" variant="outline" size="icon" className={iconBtn} onClick={() => set({ locked: !el.locked })} title={el.locked ? 'Unlock position' : 'Lock in place'}>
            {el.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </Button>
          <Button type="button" variant="outline" size="icon" className={iconBtn} onClick={() => onZ(el.id, 1)} title="Bring forward"><ArrowUp className="w-3.5 h-3.5" /></Button>
          <Button type="button" variant="outline" size="icon" className={iconBtn} onClick={() => onZ(el.id, -1)} title="Send backward"><ArrowDown className="w-3.5 h-3.5" /></Button>
          <Button type="button" variant="outline" size="icon" className={`${iconBtn} text-destructive hover:text-destructive`} onClick={() => onDelete(el.id)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      </PanelSection>

      {el.type !== 'background' && (
        <PanelSection title="Position and size">
          <NumField label="Horizontal, % across" value={el.x_pct} onChange={(v) => set({ x_pct: v })} />
          <NumField label="Vertical, % down" value={el.y_pct} onChange={(v) => set({ y_pct: v })} />
          {['text', 'image', 'ring'].includes(el.type) && (
            <NumField label="Width, % across" value={el.width_pct} onChange={(v) => set({ width_pct: v })} />
          )}
          {el.type !== 'atmosphere' && (
            <NumField label="Rotation, degrees" value={el.rotation_deg} onChange={(v) => set({ rotation_deg: v })} />
          )}
          <NumField label="Opacity, 0 to 1" value={el.opacity} step={0.05} onChange={(v) => set({ opacity: v })} />
        </PanelSection>
      )}

      {el.type === 'text' && (
        <PanelSection title="Text">
          <TextAreaField label="Content" value={el.content} onChange={(v) => set({ content: v })} />
          <SelectField label="Font" value={el.font} options={FONT_OPTIONS} onChange={(v) => set({ font: v })} />
          <SelectField label="Weight" value={String(el.font_weight || 400)} options={WEIGHTS} onChange={(v) => set({ font_weight: Number(v) })} />
          <NumField label="Size" value={el.font_size} onChange={(v) => set({ font_size: v })} />
          <NumField label="Letter spacing" value={el.letter_spacing_em} step={0.05} onChange={(v) => set({ letter_spacing_em: v })} />
          <SelectField label="Alignment" value={el.align || 'center'} options={ALIGN} onChange={(v) => set({ align: v })} />
          <ToggleField label="Uppercase" value={el.uppercase} onChange={(v) => set({ uppercase: v })} />
          <ToggleField label="Italic" value={el.italic} onChange={(v) => set({ italic: v })} />
          <ColourField label="Text colour" value={el.color} onChange={(v) => set({ color: v })} />
        </PanelSection>
      )}

      {el.type === 'image' && (
        <PanelSection title="Artwork">
          <SelectField
            label="Shape"
            value={el.mask || 'none'}
            options={[
              { value: 'none', label: 'Natural' },
              { value: 'circle', label: 'Circle' },
              { value: 'rounded', label: 'Rounded' },
            ]}
            onChange={(v) => set({ mask: v })}
          />
          <NumField label="Border thickness" value={el.border_width_px} onChange={(v) => set({ border_width_px: v })} />
          <ColourField label="Border colour" value={el.border_color} onChange={(v) => set({ border_color: v })} />
        </PanelSection>
      )}

      {el.type === 'ring' && (
        <PanelSection title="Orbit ring">
          <NumField label="Flatness" value={el.ring_aspect} step={0.1} onChange={(v) => set({ ring_aspect: v })} />
          <NumField label="Ring thickness" value={el.ring_thickness_px} onChange={(v) => set({ ring_thickness_px: v })} />
          <ColourField label="Ring colour" value={el.ring_color} onChange={(v) => set({ ring_color: v })} />
          <NumField label="Main spark size, 0 hides" value={el.spark_main_size} onChange={(v) => set({ spark_main_size: v })} />
          <NumField label="Companion spark size, 0 hides" value={el.spark_companion_size} onChange={(v) => set({ spark_companion_size: v })} />
          <NumField label="Seconds per lap" value={el.orbit_duration} onChange={(v) => set({ orbit_duration: v })} />
        </PanelSection>
      )}

      {el.type === 'atmosphere' && (
        <PanelSection title="Atmosphere">
          <SelectField
            label="Type"
            value={el.kind}
            options={[
              { value: 'embers', label: 'Gold embers' },
              { value: 'rays', label: 'Light rays' },
            ]}
            onChange={(v) => set({ kind: v })}
          />
          {el.kind === 'embers' && (
            <NumField label="Density" value={el.density} step={0.25} onChange={(v) => set({ density: v })} />
          )}
        </PanelSection>
      )}

      {el.type === 'button' && (
        <PanelSection title="Button">
          <TextAreaField label="Label" value={el.content} onChange={(v) => set({ content: v })} />
          <NumField label="Label size" value={el.font_size} onChange={(v) => set({ font_size: v })} />
          <SelectField
            label="Style"
            value={el.kind || 'solid'}
            options={[
              { value: 'solid', label: 'Gold' },
              { value: 'outline', label: 'Outline' },
            ]}
            onChange={(v) => set({ kind: v })}
          />
          <TextField label="Link" value={el.link} onChange={(v) => set({ link: v })} placeholder="/presave" />
          <ColourField label="Outline label colour" value={el.color} onChange={(v) => set({ color: v })} />
        </PanelSection>
      )}

      {el.type === 'background' && (
        <PanelSection title="Galaxy background">
          <TextField label="Image URL, blank uses the gold glow" value={el.image_url} onChange={(v) => set({ image_url: v })} placeholder="Or press Backdrop in Uploads" />
          <NumField label="Vertical framing, 0 to 100" value={el.bg_pos_y} onChange={(v) => set({ bg_pos_y: v })} />
          <NumField label="Edge over-scan, % every side" value={el.bg_scan_pct} onChange={(v) => set({ bg_scan_pct: v })} />
          <NumField label="Blur" value={el.bg_blur_px} onChange={(v) => set({ bg_blur_px: v })} />
          <Button type="button" variant="outline" className="w-full rounded-full border-primary/40 text-primary" onClick={() => set({ image_url: '' })}>
            Use built-in gold glow
          </Button>
        </PanelSection>
      )}

      {['text', 'image', 'ring', 'button'].includes(el.type) && (
        <PanelSection title="Glow and shadow">
          <NumField label="Glow strength" value={el.glow_strength} onChange={(v) => set({ glow_strength: v })} />
          <ColourField label="Glow colour" value={el.glow_color} onChange={(v) => set({ glow_color: v })} />
          {el.type !== 'ring' && (
            <>
              <NumField label="Shadow blur" value={el.shadow_blur} onChange={(v) => set({ shadow_blur: v })} />
              <NumField label="Shadow drop" value={el.shadow_y} onChange={(v) => set({ shadow_y: v })} />
            </>
          )}
        </PanelSection>
      )}
    </div>
  );
}