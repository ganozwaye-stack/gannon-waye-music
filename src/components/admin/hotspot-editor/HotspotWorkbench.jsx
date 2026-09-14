import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { STOREFRONT_ART_LOCK } from '@/config/storefrontArtLock';
import { useToast } from '@/components/ui/use-toast';
import HotspotCanvas from './HotspotCanvas';
import HotspotZoneList from './HotspotZoneList';
import HotspotPropertiesPanel from './HotspotPropertiesPanel';

const emptyZone = {
  zone_key: '',
  hotspot_mode: 'product',
  product_id: '',
  interest_item_key: '',
  interest_item_name: '',
  left_pct: 10,
  top_pct: 10,
  width_pct: 20,
  height_pct: 20,
  label_override: '',
  active: true,
  sort_order: 0,
};

// Single-screen Canva-style hotspot workbench: zone list down the left, the
// locked boutique photo in the middle, and the selected zone's details in a
// side panel on the right. Edit and design on one screen with no page
// scrolling, exactly like the Hero Canvas Studio.
export default function HotspotWorkbench() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [drawMode, setDrawMode] = useState(false);

  const { data: hotspots = [] } = useQuery({
    queryKey: ['storefrontHotspotsAdmin'],
    queryFn: () => base44.entities.StorefrontHotspot.filter({ lock_id: STOREFRONT_ART_LOCK.lockId }, 'sort_order'),
    initialData: [],
  });

  const { data: products = [] } = useQuery({
    queryKey: ['merchProductsForHotspots'],
    queryFn: () => base44.entities.MerchProduct.list('-created_date'),
    initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, values }) => {
      const payload = {
        ...values,
        lock_id: STOREFRONT_ART_LOCK.lockId,
        left_pct: Number(values.left_pct) || 0,
        top_pct: Number(values.top_pct) || 0,
        width_pct: Number(values.width_pct) || 0,
        height_pct: Number(values.height_pct) || 0,
        sort_order: Number(values.sort_order) || 0,
      };
      if (id === 'new') return base44.entities.StorefrontHotspot.create(payload);
      return base44.entities.StorefrontHotspot.update(id, payload);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['storefrontHotspotsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['storefrontHotspots'] });
      setDraft((d) => {
        const next = { ...d };
        delete next[id];
        return next;
      });
      toast({ title: id === 'new' ? 'Zone added' : 'Zone saved' });
    },
    onError: (err) => toast({ variant: 'destructive', title: 'Save failed', description: err?.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.StorefrontHotspot.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storefrontHotspotsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['storefrontHotspots'] });
      setSelectedId(null);
      toast({ title: 'Zone removed' });
    },
    onError: (err) => toast({ variant: 'destructive', title: 'Delete failed', description: err?.message }),
  });

  const rows = [...hotspots, ...(draft.new ? [{ id: 'new', ...emptyZone, ...draft.new }] : [])];
  const getValues = (row) => ({ ...row, ...(draft[row.id] || {}) });
  const zones = rows.map((row) => ({ id: row.id, values: getValues(row) }));
  const selected = zones.find((z) => z.id === selectedId) || null;

  const setField = (id, field, value) =>
    setDraft((d) => ({ ...d, [id]: { ...(d[id] || {}), [field]: value } }));
  const patchDraft = (id, patch) =>
    setDraft((d) => ({ ...d, [id]: { ...(d[id] || {}), ...patch } }));

  const createDraftZone = (rect) => {
    setDrawMode(false);
    setDraft((d) => ({ ...d, new: { ...emptyZone, ...rect } }));
    setSelectedId('new');
  };

  const productLabel = (id) => {
    const p = products.find((pr) => pr.id === id);
    return p ? `${p.name} — $${Number(p.sale_price || 0).toFixed(0)} AUD` : '';
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden h-[calc(100vh-13rem)] min-h-[560px]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border flex-wrap">
        <div>
          <h2 className="font-body text-sm font-semibold text-foreground">Hotspot Canvas Studio</h2>
          <p className="font-body text-[11px] text-muted-foreground">
            Click a zone to select, drag to move, drag the gold corner to resize. Nothing saves until you press Save.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] border border-primary/40 text-primary bg-primary/5 font-body">
          <Lock className="w-3 h-3" /> The photo is permanently locked
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-56 shrink-0 border-r border-border overflow-y-auto p-3">
          <HotspotZoneList
            zones={zones.map((z) => ({ ...z, productLabel: productLabel(z.values.product_id) }))}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onToggleDraw={() => setDrawMode((m) => !m)}
            drawMode={drawMode}
          />
        </div>

        <div className="flex-1 min-w-0 overflow-auto p-4 bg-black/40 flex items-center justify-center">
          <HotspotCanvas
            zones={zones}
            selectedId={selectedId}
            drawMode={drawMode}
            onSelect={setSelectedId}
            onDraft={patchDraft}
            onCreate={createDraftZone}
          />
        </div>

        <div className="w-72 shrink-0 border-l border-border overflow-y-auto p-3">
          <HotspotPropertiesPanel
            values={selected?.values || null}
            products={products}
            productLabel={productLabel}
            isNew={selectedId === 'new'}
            saving={saveMutation.isPending}
            onChange={(field, value) => selected && setField(selected.id, field, value)}
            onSave={() => selected && saveMutation.mutate({ id: selected.id, values: selected.values })}
            onDelete={() => selected && deleteMutation.mutate(selected.id)}
            onCancel={() => {
              setDraft((d) => {
                const next = { ...d };
                delete next.new;
                return next;
              });
              setSelectedId(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}