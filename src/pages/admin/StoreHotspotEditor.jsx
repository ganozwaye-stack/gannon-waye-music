import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { STOREFRONT_ART_LOCK } from '@/config/storefrontArtLock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Save, Lock } from 'lucide-react';

const emptyZone = { zone_key: '', product_id: '', left_pct: 40, top_pct: 40, width_pct: 20, height_pct: 20, label_override: '', active: true, sort_order: 0 };

export default function StoreHotspotEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState({}); // id -> uncommitted field edits, keyed by hotspot id or 'new'

  const { data: hotspots } = useQuery({
    queryKey: ['storefrontHotspotsAdmin'],
    queryFn: () => base44.entities.StorefrontHotspot.filter({ lock_id: STOREFRONT_ART_LOCK.lockId }, 'sort_order'),
    initialData: [],
  });

  const { data: products } = useQuery({
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
      if (id === 'new') {
        return base44.entities.StorefrontHotspot.create(payload);
      }
      return base44.entities.StorefrontHotspot.update(id, payload);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['storefrontHotspotsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['storefrontHotspots'] });
      setDraft((d) => { const next = { ...d }; delete next[id]; return next; });
      toast({ title: id === 'new' ? 'Zone added' : 'Zone saved' });
    },
    onError: (err) => toast({ variant: 'destructive', title: 'Save failed', description: err?.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.StorefrontHotspot.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storefrontHotspotsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['storefrontHotspots'] });
      toast({ title: 'Zone removed' });
    },
    onError: (err) => toast({ variant: 'destructive', title: 'Delete failed', description: err?.message }),
  });

  const rows = [...hotspots, ...(draft.new ? [{ id: 'new', ...emptyZone, ...draft.new }] : [])];

  const getValues = (row) => ({ ...row, ...(draft[row.id] || {}) });
  const setField = (id, field, value) => setDraft((d) => ({ ...d, [id]: { ...(d[id] || {}), [field]: value } }));

  const startNewZone = () => setDraft((d) => ({ ...d, new: { ...emptyZone } }));
  const cancelNewZone = () => setDraft((d) => { const next = { ...d }; delete next.new; return next; });

  const productLabel = (id) => {
    const p = products.find((pr) => pr.id === id);
    return p ? `${p.name} — $${Number(p.sale_price || 0).toFixed(0)} AUD` : '';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-foreground mb-1">Store Hotspot Editor</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Place clickable zones over the boutique photo so a fan can tap something they see in the picture and land straight on that product. Add a zone whenever a new item you're selling is visible in the shot.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-primary/40 text-primary bg-primary/5">
          <Lock className="w-3.5 h-3.5" /> The photo itself is permanently locked — this page only places zones on top of it, it can never replace, crop or hide it.
        </div>
      </div>

      {/* Live preview */}
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-0">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: '#0a0a0a' }}>
            <img
              src={STOREFRONT_ART_LOCK.imageUrl}
              alt="Locked boutique artwork — preview"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', userSelect: 'none' }}
            />
            {rows.map((row) => {
              const v = getValues(row);
              return (
                <div
                  key={row.id}
                  title={v.zone_key || 'Untitled zone'}
                  style={{
                    position: 'absolute',
                    left: `${v.left_pct}%`,
                    top: `${v.top_pct}%`,
                    width: `${v.width_pct}%`,
                    height: `${v.height_pct}%`,
                    border: `2px solid ${v.active === false ? 'rgba(255,255,255,0.35)' : '#D4AF37'}`,
                    background: v.active === false ? 'rgba(255,255,255,0.04)' : 'rgba(212,175,55,0.12)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <span style={{ fontSize: '9px', color: '#D4AF37', background: 'rgba(10,10,10,0.85)', padding: '2px 5px', borderRadius: '4px', marginBottom: '4px', whiteSpace: 'nowrap' }}>
                    {v.zone_key || 'untitled'}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Zone list */}
      <div className="space-y-4">
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">No zones yet. Add one below.</p>
        )}
        {rows.map((row) => {
          const v = getValues(row);
          const isNew = row.id === 'new';
          const hasEdits = !!draft[row.id];
          return (
            <Card key={row.id}>
              <CardContent className="p-4">
                <div className="grid gap-3 md:grid-cols-6">
                  <div className="md:col-span-2">
                    <Label className="text-xs">Zone name</Label>
                    <Input
                      value={v.zone_key}
                      placeholder="e.g. hoodie-left-rack"
                      onChange={(e) => setField(row.id, 'zone_key', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs">Product</Label>
                    <Select value={v.product_id} onValueChange={(val) => setField(row.id, 'product_id', val)}>
                      <SelectTrigger><SelectValue placeholder="Choose a product">{v.product_id ? productLabel(v.product_id) : undefined}</SelectValue></SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name} — ${Number(p.sale_price || 0).toFixed(0)} AUD</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Label override</Label>
                    <Input
                      value={v.label_override || ''}
                      placeholder="Optional"
                      onChange={(e) => setField(row.id, 'label_override', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end md:justify-start">
                    <Switch checked={v.active !== false} onCheckedChange={(val) => setField(row.id, 'active', val)} />
                    <Label className="text-xs">Active</Label>
                  </div>
                </div>

                <div className="grid gap-3 grid-cols-4 mt-3">
                  {['left_pct', 'top_pct', 'width_pct', 'height_pct'].map((field) => (
                    <div key={field}>
                      <Label className="text-xs capitalize">{field.replace('_pct', ' %')}</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={v[field]}
                        onChange={(e) => setField(row.id, field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 mt-3">
                  {isNew && (
                    <Button variant="ghost" size="sm" onClick={cancelNewZone}>Cancel</Button>
                  )}
                  {!isNew && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(row.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={!v.zone_key || !v.product_id || (!hasEdits && !isNew)}
                    onClick={() => saveMutation.mutate({ id: row.id, values: v })}
                  >
                    <Save className="w-3.5 h-3.5 mr-1" /> {isNew ? 'Add zone' : 'Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!draft.new && (
        <Button variant="outline" className="mt-4" onClick={startNewZone}>
          <Plus className="w-4 h-4 mr-1.5" /> Add zone
        </Button>
      )}
    </div>
  );
}
