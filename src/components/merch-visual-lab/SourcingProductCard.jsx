import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, ExternalLink, Loader2 } from 'lucide-react';

// One live product on the Sourcing Board: its design, its numbers, and the
// owner-recorded colour swatches available at the micro-brand dropshipper.
// Adding or removing a colour saves straight to the product record.
export default function SourcingProductCard({ product, supplierProduct }) {
  const [colors, setColors] = useState(product.colors_available || []);
  const [newName, setNewName] = useState('');
  const [newHex, setNewHex] = useState('#d4af37');
  const [saving, setSaving] = useState(false);

  const persistColors = async (next) => {
    setColors(next);
    setSaving(true);
    try {
      await base44.entities.MerchProduct.update(product.id, { colors_available: next });
    } catch (err) {
      // error bubbles up
    }
    setSaving(false);
  };

  const addColor = () => {
    const name = newName.trim();
    if (!name) return;
    persistColors([...colors, { name, hex: newHex }]);
    setNewName('');
  };

  const removeColor = (idx) => {
    persistColors(colors.filter((_, i) => i !== idx));
  };

  const stock = product.stock_by_variant && Object.keys(product.stock_by_variant).length > 0
    ? Object.entries(product.stock_by_variant).map(([v, q]) => `${v} ${q}`).join(' · ')
    : `${product.stock_quantity ?? 0} on hand`;
  const image = product.image_url || (product.images_array && product.images_array[0]);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
      {image && (
        <div className="relative aspect-square bg-background">
          <img src={image} alt={product.name} className="w-full h-full object-cover" />
          <span className="absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-body uppercase tracking-wider bg-background/80 border border-primary/30 text-primary/90">
            {product.inventory_source === 'owned_stock' ? 'Owned stock' : product.inventory_source === 'dropship' ? 'Dropship' : product.inventory_source}
          </span>
        </div>
      )}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-display text-lg leading-tight text-foreground">{product.name}</h3>
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{product.category}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[11px] font-body">
          <span className="px-2 py-1 rounded-full border border-primary/30 text-primary/90">${product.sale_price} sale</span>
          {product.cost_price != null && <span className="px-2 py-1 rounded-full border border-border text-muted-foreground">${product.cost_price} cost</span>}
          {product.delivery_cost != null && <span className="px-2 py-1 rounded-full border border-border text-muted-foreground">${product.delivery_cost} delivery</span>}
        </div>
        <p className="font-body text-xs text-muted-foreground">{stock}{product.sizes_available && product.sizes_available.length > 0 ? ` · sizes ${product.sizes_available.join(', ')}` : ''}</p>

        {supplierProduct && (
          <a href={supplierProduct.supplier_url || product.supplier_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-body text-[11px] text-primary/80 hover:underline">
            <ExternalLink className="w-3 h-3" />
            {supplierProduct.supplier_name || 'Supplier page'}
            {supplierProduct.unit_cost_aud != null ? ` · $${supplierProduct.unit_cost_aud}/unit` : ''}
            {supplierProduct.moq ? ` · MOQ ${supplierProduct.moq}` : ''}
            {supplierProduct.lead_time_days ? ` · ${supplierProduct.lead_time_days}d lead` : ''}
          </a>
        )}
        {!supplierProduct && product.supplier_url && (
          <a href={product.supplier_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-body text-[11px] text-primary/80 hover:underline">
            <ExternalLink className="w-3 h-3" /> Supplier page
          </a>
        )}

        <div className="mt-auto pt-2 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-primary/70">Dropship colours</p>
            {saving && <Loader2 className="w-3 h-3 animate-spin text-primary/60" />}
          </div>
          {colors.length === 0 && (
            <p className="font-body text-[11px] text-muted-foreground mb-2">No colours recorded yet. Add the options your supplier offers below.</p>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {colors.map((c, i) => (
              <span key={`${c.name}-${i}`} title={c.name}
                className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full border border-border font-body text-[11px] text-foreground/85">
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: c.hex || '#888' }} />
                {c.name}
                <button type="button" onClick={() => removeColor(i)} aria-label={`Remove ${c.name}`} className="text-muted-foreground hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="color" value={newHex} onChange={e => setNewHex(e.target.value)}
              aria-label="Pick colour" className="w-8 h-8 rounded cursor-pointer bg-transparent border border-border" />
            <Input value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }}
              placeholder="Colour name, e.g. Sand"
              className="h-8 bg-transparent font-body text-xs" />
            <Button type="button" size="sm" onClick={addColor} disabled={!newName.trim() || saving}
              className="h-8 px-3 text-[11px] shrink-0">
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}