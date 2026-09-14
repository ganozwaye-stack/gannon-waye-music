import { Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select';

const inputClass = 'bg-background font-body text-sm';
const labelClass = 'font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground';

// Side panel for the selected zone: everything about it edits right here, so
// the screen never scrolls while you work. Nothing saves until Save is
// pressed, so dragging on the canvas is always safe to experiment with.
export default function HotspotPropertiesPanel({
  values, products, productLabel, isNew, saving, onChange, onSave, onDelete, onCancel,
}) {
  if (!values) {
    return (
      <p className="font-body text-xs text-muted-foreground leading-relaxed">
        Select a zone on the picture to edit it here: name, product or interest item, position, size and more.
        Or press Draw zone in the left rail and drag a new box straight onto the photo.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          {isNew ? 'New zone' : 'Zone details'}
        </p>
        <span className={`w-2 h-2 rounded-full ${values.active === false ? 'bg-muted-foreground/40' : 'bg-primary'}`} aria-hidden />
      </div>

      <div>
        <Label className={labelClass} htmlFor="hs-name">Zone name</Label>
        <Input
          id="hs-name"
          className={`mt-1 ${inputClass}`}
          value={values.zone_key || ''}
          placeholder="e.g. hoodie-left-rack"
          onChange={(e) => onChange('zone_key', e.target.value)}
        />
      </div>

      <div>
        <Label className={labelClass} htmlFor="hs-mode">Zone type</Label>
        <Select value={values.hotspot_mode || 'product'} onValueChange={(v) => onChange('hotspot_mode', v)}>
          <SelectTrigger id="hs-mode" className={`mt-1 ${inputClass}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="product">Product, links to something you sell</SelectItem>
            <SelectItem value="interest">Express Interest, a pre-design item</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {values.hotspot_mode === 'interest' ? (
        <>
          <div>
            <Label className={labelClass} htmlFor="hs-ikey">Interest item key</Label>
            <Input
              id="hs-ikey"
              className={`mt-1 ${inputClass}`}
              value={values.interest_item_key || ''}
              placeholder="e.g. thank-you-mug"
              onChange={(e) => onChange('interest_item_key', e.target.value)}
            />
          </div>
          <div>
            <Label className={labelClass} htmlFor="hs-iname">Item name fans see</Label>
            <Input
              id="hs-iname"
              className={`mt-1 ${inputClass}`}
              value={values.interest_item_name || ''}
              placeholder="e.g. Thank You Mug"
              onChange={(e) => onChange('interest_item_name', e.target.value)}
            />
          </div>
        </>
      ) : (
        <div>
          <Label className={labelClass} htmlFor="hs-product">Product</Label>
          <Select value={values.product_id || ''} onValueChange={(v) => onChange('product_id', v)}>
            <SelectTrigger id="hs-product" className={`mt-1 ${inputClass}`}>
              <SelectValue placeholder="Choose a product">
                {values.product_id ? productLabel(values.product_id) : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} — ${Number(p.sale_price || 0).toFixed(0)} AUD
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label className={labelClass} htmlFor="hs-label">Hover label override (optional)</Label>
        <Input
          id="hs-label"
          className={`mt-1 ${inputClass}`}
          value={values.label_override || ''}
          placeholder="Falls back to product or item name"
          onChange={(e) => onChange('label_override', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          ['left_pct', 'Left, %'],
          ['top_pct', 'Top, %'],
          ['width_pct', 'Width, %'],
          ['height_pct', 'Height, %'],
        ].map(([field, label]) => (
          <div key={field}>
            <Label className={labelClass} htmlFor={`hs-${field}`}>{label}</Label>
            <Input
              id={`hs-${field}`}
              type="number"
              className={`mt-1 ${inputClass}`}
              value={values[field] ?? ''}
              onChange={(e) => onChange(field, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Label className={labelClass} htmlFor="hs-active">Active on the store</Label>
        <Switch
          id="hs-active"
          checked={values.active !== false}
          onCheckedChange={(v) => onChange('active', v)}
        />
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        {isNew ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-3.5 h-3.5 mr-1" /> Cancel
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          className="gradient-gold-button border-0 rounded-full"
          disabled={saving || !values.zone_key
            || (values.hotspot_mode !== 'interest' && !values.product_id)}
          onClick={onSave}
        >
          <Save className="w-3.5 h-3.5 mr-1" /> {isNew ? 'Add zone' : 'Save zone'}
        </Button>
      </div>
    </div>
  );
}