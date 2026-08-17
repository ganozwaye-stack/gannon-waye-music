import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, AlertTriangle, Package, Trash2, Loader2 } from 'lucide-react';

// ── Margin engine (mirrors base44/shared/marginMath.ts) ──────────────────────
// 50% profit-margin floor: a product cannot be approved to the store below this.
const MARGIN_FLOOR_PERCENT = 50;

function computeMargin({ sale_price, cost_price, delivery_cost = 0, merchant_fee_percent = 3.5 }) {
  const sale = Number(sale_price) || 0;
  const cost = Number(cost_price) || 0;
  const delivery = Number(delivery_cost) || 0;
  const fee = sale * (Number(merchant_fee_percent) / 100);
  const total_cost = cost + delivery + fee;
  const profit = sale - total_cost;
  const margin_percent = sale > 0 ? (profit / sale) * 100 : 0;
  const r = (n) => Math.round(n * 100) / 100;
  return { fee: r(fee), total_cost: r(total_cost), profit: r(profit), margin_percent: r(margin_percent), meets_floor: margin_percent >= MARGIN_FLOOR_PERCENT };
}

function enforceMarginFloor({ cost_price, delivery_cost = 0, merchant_fee_percent = 3.5 }) {
  const cost = Number(cost_price) || 0;
  const delivery = Number(delivery_cost) || 0;
  const fee_rate = Number(merchant_fee_percent) / 100;
  const denom = 1 - fee_rate - MARGIN_FLOOR_PERCENT / 100;
  if (denom <= 0) return null;
  return Math.ceil(((cost + delivery) / denom) * 100) / 100;
}

const CATEGORIES = ['apparel', 'accessories', 'vinyl', 'cd', 'poster', 'bundle', 'other'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

export default function MerchApprovalGate() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState('pending'); // pending | approved

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['merch-approval', tab],
    queryFn: async () => {
      const all = await base44.entities.MerchProduct.list('-created_date', 200);
      return all.filter((p) => (tab === 'pending' ? !p.is_active : p.is_active));
    },
  });

  const approveMut = useMutation({
    mutationFn: async ({ id, payload }) => base44.entities.MerchProduct.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries(['merch-approval']);
      toast({ title: 'Approved — listing is live in the store' });
    },
    onError: (e) => toast({ title: 'Approval failed', description: e.message, variant: 'destructive' }),
  });

  const saveMut = useMutation({
    mutationFn: async ({ id, payload }) => base44.entities.MerchProduct.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries(['merch-approval']);
      toast({ title: 'Saved' });
    },
    onError: (e) => toast({ title: 'Save failed', description: e.message, variant: 'destructive' }),
  });

  const discardMut = useMutation({
    mutationFn: async (id) => base44.entities.MerchProduct.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(['merch-approval']);
      toast({ title: 'Draft discarded' });
    },
    onError: (e) => toast({ title: 'Discard failed', description: e.message, variant: 'destructive' }),
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-foreground flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" /> Merch Approval Gate
          </h1>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Review generated designs, set pricing &amp; margins, then approve listings to the store. Floor: {MARGIN_FLOOR_PERCENT}% profit margin.
          </p>
        </div>
        <div className="flex gap-2">
          {['pending', 'approved'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full font-body text-xs uppercase tracking-wider transition-colors ${
                tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'pending' ? `Pending (${products.length})` : `Approved (${products.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/40 rounded-2xl">
          <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">
            {tab === 'pending' ? 'No merch drafts awaiting approval.' : 'No approved listings yet.'}
          </p>
          <p className="font-body text-xs text-muted-foreground/60 mt-1">
            Drafts generated by the one-click publish workflow land here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <ApprovalCard
              key={p.id}
              product={p}
              onSave={(payload) => saveMut.mutate({ id: p.id, payload })}
              onApprove={(payload) => approveMut.mutate({ id: p.id, payload })}
              onDiscard={() => discardMut.mutate(p.id)}
              saving={saveMut.isPending}
              approving={approveMut.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApprovalCard({ product, onSave, onApprove, onDiscard, saving, approving }) {
  const [draft, setDraft] = useState({
    name: product.name || '',
    description: product.description || '',
    category: product.category || 'apparel',
    image_url: product.image_url || '',
    sale_price: product.sale_price ?? '',
    cost_price: product.cost_price ?? '',
    delivery_cost: product.delivery_cost ?? 0,
    merchant_fee_percent: product.merchant_fee_percent ?? 3.5,
    sizes_available: product.sizes_available || [],
  });

  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const margin = computeMargin({
    sale_price: draft.sale_price,
    cost_price: draft.cost_price,
    delivery_cost: draft.delivery_cost,
    merchant_fee_percent: draft.merchant_fee_percent,
  });

  const minPrice = enforceMarginFloor({
    cost_price: draft.cost_price,
    delivery_cost: draft.delivery_cost,
    merchant_fee_percent: draft.merchant_fee_percent,
  });

  const toggleSize = (s) => {
    setDraft((d) => ({
      ...d,
      sizes_available: d.sizes_available.includes(s)
        ? d.sizes_available.filter((x) => x !== s)
        : [...d.sizes_available, s],
    }));
  };

  const buildPayload = (publish) => ({
    name: draft.name,
    description: draft.description,
    category: draft.category,
    image_url: draft.image_url,
    sale_price: Number(draft.sale_price) || 0,
    cost_price: Number(draft.cost_price) || 0,
    delivery_cost: Number(draft.delivery_cost) || 0,
    merchant_fee_percent: Number(draft.merchant_fee_percent) || 3.5,
    sizes_available: draft.sizes_available,
    profit_margin_percent: margin.margin_percent,
    total_profit_per_unit: margin.profit,
    is_active: publish ? true : product.is_active,
  });

  const canApprove = margin.meets_floor && Number(draft.sale_price) > 0 && !!draft.name;

  return (
    <div className="border border-border/40 rounded-2xl bg-card overflow-hidden">
      <div className="grid md:grid-cols-[200px_1fr] gap-0">
        {/* Image preview */}
        <div className="bg-secondary/30 flex items-center justify-center p-4 min-h-[200px]">
          {draft.image_url ? (
            <img src={draft.image_url} alt={draft.name} className="max-h-44 rounded-lg object-contain" />
          ) : (
            <div className="text-center text-muted-foreground/50">
              <Package className="w-8 h-8 mx-auto mb-2" />
              <p className="font-body text-[10px] uppercase tracking-wider">No image</p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <Input
                value={draft.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Product name"
                className="font-display text-base border-border/40"
              />
            </div>
            <Badge variant={margin.meets_floor ? 'default' : 'destructive'} className="gap-1">
              {margin.meets_floor ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {margin.margin_percent.toFixed(1)}% margin
            </Badge>
          </div>

          <div>
            <Label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Description</Label>
            <Textarea
              value={draft.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short product description"
              rows={2}
              className="bg-secondary/30 border-border/40 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <Label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Sale Price (AUD)</Label>
              <Input type="number" min="0" step="0.01" value={draft.sale_price} onChange={(e) => set('sale_price', e.target.value)} className="bg-secondary/30 border-border/40" />
            </div>
            <div>
              <Label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Cost Price</Label>
              <Input type="number" min="0" step="0.01" value={draft.cost_price} onChange={(e) => set('cost_price', e.target.value)} className="bg-secondary/30 border-border/40" />
            </div>
            <div>
              <Label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Delivery Cost</Label>
              <Input type="number" min="0" step="0.01" value={draft.delivery_cost} onChange={(e) => set('delivery_cost', e.target.value)} className="bg-secondary/30 border-border/40" />
            </div>
            <div>
              <Label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Merchant Fee %</Label>
              <Input type="number" min="0" step="0.1" value={draft.merchant_fee_percent} onChange={(e) => set('merchant_fee_percent', e.target.value)} className="bg-secondary/30 border-border/40" />
            </div>
            <div>
              <Label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Category</Label>
              <select
                value={draft.category}
                onChange={(e) => set('category', e.target.value)}
                className="flex h-9 w-full rounded-md border border-border/40 bg-secondary/30 px-3 py-1 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Image URL</Label>
              <Input value={draft.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://…" className="bg-secondary/30 border-border/40" />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <Label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Sizes Available</Label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`px-2.5 py-1 rounded-full font-body text-xs transition-colors ${
                    draft.sizes_available.includes(s)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Margin breakdown */}
          <div className="bg-secondary/30 rounded-xl p-3 space-y-1 text-xs font-body">
            <div className="flex justify-between text-foreground/60"><span>Fee</span><span>${margin.fee.toFixed(2)}</span></div>
            <div className="flex justify-between text-foreground/60"><span>Total cost</span><span>${margin.total_cost.toFixed(2)}</span></div>
            <div className="flex justify-between text-foreground/80"><span>Profit / unit</span><span>${margin.profit.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold border-t border-border/40 pt-1">
              <span>Margin</span>
              <span className={margin.meets_floor ? 'text-primary' : 'text-destructive'}>{margin.margin_percent.toFixed(1)}%</span>
            </div>
            {!margin.meets_floor && minPrice && (
              <p className="text-[11px] text-amber-500 pt-1">
                ⚠️ Below {MARGIN_FLOOR_PERCENT}% floor. Minimum sale price to clear it: <strong>${minPrice.toFixed(2)}</strong>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              onClick={() => onSave(buildPayload(false))}
              disabled={saving}
              variant="outline"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Draft'}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onApprove(buildPayload(true))}
              disabled={!canApprove || approving}
              className="gradient-gold-button border-0"
            >
              {approving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Approve &amp; Publish to Store
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onDiscard}
              className="text-destructive hover:text-destructive ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" /> Discard
            </Button>
          </div>
          {!canApprove && Number(draft.sale_price) > 0 && (
            <p className="font-body text-[11px] text-muted-foreground">Approval locked until margin ≥ {MARGIN_FLOOR_PERCENT}%.</p>
          )}
        </div>
      </div>
    </div>
  );
}