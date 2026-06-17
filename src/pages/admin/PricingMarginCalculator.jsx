import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Package, AlertTriangle, CheckCircle2, Calculator } from 'lucide-react';

// ── Product reference data ────────────────────────────────────────────────────
const PRESET_PRODUCTS = [
  { name: 'Hoodie (Front)', cost: 38, price: 89, shipping_est: 12, fee_pct: 2.9, fee_fixed: 0.30, category: 'apparel' },
  { name: 'Hoodie (Back)', cost: 38, price: 89, shipping_est: 12, fee_pct: 2.9, fee_fixed: 0.30, category: 'apparel' },
  { name: 'Coffee Mug', cost: 3.50, price: 9.90, shipping_est: 6, fee_pct: 2.9, fee_fixed: 0.30, category: 'accessories' },
  { name: 'Tote Bag (Sold Out)', cost: 5.50, price: 15, shipping_est: 6, fee_pct: 2.9, fee_fixed: 0.30, category: 'accessories' },
  { name: 'Thankyou CD', cost: 3.20, price: 18, shipping_est: 5, fee_pct: 2.9, fee_fixed: 0.30, category: 'music' },
  { name: 'Journal Bundle', cost: 18, price: 59, shipping_est: 10, fee_pct: 2.9, fee_fixed: 0.30, category: 'bundles', excludeFromDiscounts: true },
  { name: 'Winter Bundle', cost: 58, price: 129, shipping_est: 14, fee_pct: 2.9, fee_fixed: 0.30, category: 'bundles', excludeFromDiscounts: true },
  { name: 'Poster A4', cost: 4, price: 19, shipping_est: 6, fee_pct: 2.9, fee_fixed: 0.30, category: 'posters' },
  { name: 'Poster A3', cost: 7, price: 29, shipping_est: 7, fee_pct: 2.9, fee_fixed: 0.30, category: 'posters' },
  { name: 'Poster A2', cost: 12, price: 39, shipping_est: 9, fee_pct: 2.9, fee_fixed: 0.30, category: 'posters' },
  { name: 'Poster A1', cost: 20, price: 59, shipping_est: 12, fee_pct: 2.9, fee_fixed: 0.30, category: 'posters' },
];

function calcMargin({ cost, price, shipping_est, fee_pct, fee_fixed, include_shipping }) {
  const stripeFee = (price * fee_pct / 100) + fee_fixed;
  const shippingCost = include_shipping ? shipping_est : 0;
  const totalCost = cost + stripeFee + shippingCost;
  const profit = price - totalCost;
  const marginPct = price > 0 ? (profit / price) * 100 : 0;
  return { stripeFee, totalCost, profit, marginPct };
}

function MarginBar({ pct }) {
  const color = pct >= 50 ? 'bg-green-500' : pct >= 30 ? 'bg-primary' : pct >= 10 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="w-full bg-secondary/40 rounded-full h-2 mt-1">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}

export default function PricingMarginCalculator() {
  const [cost, setCost] = useState('38');
  const [price, setPrice] = useState('89');
  const [shippingEst, setShippingEst] = useState('12');
  const [feePct, setFeePct] = useState('2.9');
  const [feeFixed, setFeeFixed] = useState('0.30');
  const [includeShipping, setIncludeShipping] = useState(false);
  const [discountPct, setDiscountPct] = useState('0');

  const raw = {
    cost: parseFloat(cost) || 0,
    price: parseFloat(price) || 0,
    shipping_est: parseFloat(shippingEst) || 0,
    fee_pct: parseFloat(feePct) || 2.9,
    fee_fixed: parseFloat(feeFixed) || 0.30,
    include_shipping: includeShipping,
  };

  const discounted = { ...raw, price: raw.price * (1 - (parseFloat(discountPct) || 0) / 100) };
  const result = calcMargin(raw);
  const discountResult = calcMargin(discounted);

  const loadPreset = (p) => {
    setCost(String(p.cost));
    setPrice(String(p.price));
    setShippingEst(String(p.shipping_est));
    setFeePct(String(p.fee_pct));
    setFeeFixed(String(p.fee_fixed));
  };

  const fmt = (n) => `$${n.toFixed(2)}`;
  const fmtPct = (n) => `${n.toFixed(1)}%`;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Admin OS</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Pricing & Margin Calculator</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Calculate real cost, Stripe fees, shipping, margin, and profit per product. Respects bundle exclusion rules.</p>
      </div>

      {/* Bundle rules reminder */}
      <div className="flex items-start gap-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="font-body text-xs text-muted-foreground">
          <strong className="text-amber-400">Bundle discount rules:</strong> Journal Bundle ($59) and Winter Bundle ($129) are excluded from all promo codes. Discount calculator will flag this.
        </p>
      </div>

      {/* Product presets */}
      <Card>
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Load Product Preset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {PRESET_PRODUCTS.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => loadPreset(p)}
                className="px-3 py-1.5 rounded-lg border border-border/40 text-xs font-body text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
              >
                {p.name}
                {p.excludeFromDiscounts && <span className="ml-1 text-amber-400">⚠</span>}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm flex items-center gap-2"><Calculator className="w-4 h-4 text-primary" /> Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Product Cost (AUD)', value: cost, set: setCost, hint: 'Manufacturing / print-on-demand cost' },
              { label: 'Sale Price (AUD)', value: price, set: setPrice, hint: 'Customer-facing price' },
              { label: 'Est. Shipping Cost', value: shippingEst, set: setShippingEst, hint: 'Your cost to ship (not charged to customer)' },
              { label: 'Stripe Fee %', value: feePct, set: setFeePct, hint: 'Default 2.9% for Australian cards' },
              { label: 'Stripe Fixed Fee (AUD)', value: feeFixed, set: setFeeFixed, hint: 'Default $0.30 per transaction' },
              { label: 'Promo Discount %', value: discountPct, set: setDiscountPct, hint: 'To simulate a promo code discount' },
            ].map(field => (
              <div key={field.label}>
                <label className="font-body text-xs text-muted-foreground block mb-1">{field.label}</label>
                <input
                  type="number"
                  value={field.value}
                  onChange={e => { e.preventDefault(); field.set(e.target.value); }}
                  onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border/40 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                />
                <p className="font-body text-[10px] text-muted-foreground/60 mt-0.5">{field.hint}</p>
              </div>
            ))}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeShipping}
                onChange={e => setIncludeShipping(e.target.checked)}
                className="accent-primary"
              />
              <span className="font-body text-xs text-muted-foreground">Include shipping cost in margin calculation</span>
            </label>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {/* Full price result */}
          <Card className={result.marginPct >= 40 ? 'border-green-500/30' : result.marginPct >= 20 ? 'border-primary/30' : 'border-red-500/30'}>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Full Price Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Sale Price', value: fmt(raw.price), highlight: true },
                { label: 'Product Cost', value: fmt(raw.cost) },
                { label: 'Stripe Fee', value: fmt(result.stripeFee) },
                { label: 'Shipping (est.)', value: fmt(raw.shipping_est), dim: !includeShipping },
                { label: 'Total Cost', value: fmt(result.totalCost), bold: true },
                { label: 'Profit', value: fmt(result.profit), color: result.profit >= 0 ? 'text-green-400' : 'text-red-400' },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center text-xs border-b border-border/15 pb-1.5 last:border-0">
                  <span className={`font-body ${r.dim ? 'text-muted-foreground/40 line-through' : 'text-muted-foreground'}`}>{r.label}</span>
                  <span className={`font-body font-semibold ${r.color || (r.highlight ? 'text-primary' : r.bold ? 'text-foreground' : 'text-foreground/80')}`}>{r.value}</span>
                </div>
              ))}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-body text-muted-foreground">Margin</span>
                  <span className={`font-display text-lg font-bold ${result.marginPct >= 40 ? 'text-green-400' : result.marginPct >= 20 ? 'text-primary' : 'text-red-400'}`}>
                    {fmtPct(result.marginPct)}
                  </span>
                </div>
                <MarginBar pct={result.marginPct} />
              </div>
            </CardContent>
          </Card>

          {/* Discounted result */}
          {parseFloat(discountPct) > 0 && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
                  <DollarSign className="w-4 h-4" /> After {discountPct}% Discount
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-body text-muted-foreground">Discounted Price</span>
                  <span className="font-body font-semibold text-amber-400">{fmt(discounted.price)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-body text-muted-foreground">Profit after discount</span>
                  <span className={`font-body font-semibold ${discountResult.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(discountResult.profit)}</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-body text-muted-foreground">Margin after discount</span>
                  <span className={`font-display text-lg font-bold ${discountResult.marginPct >= 30 ? 'text-green-400' : discountResult.marginPct >= 10 ? 'text-amber-400' : 'text-red-400'}`}>
                    {fmtPct(discountResult.marginPct)}
                  </span>
                </div>
                <MarginBar pct={discountResult.marginPct} />
                {discountResult.marginPct < 15 && (
                  <div className="flex items-center gap-2 mt-2 p-2 rounded-lg border border-red-500/30 bg-red-500/5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <p className="font-body text-[10px] text-red-400">Warning: margin below 15% — discount may not be viable for this product.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* All products summary */}
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm">All Products Margin Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PRESET_PRODUCTS.map(p => {
                  const r = calcMargin({ ...p, include_shipping: false });
                  return (
                    <div key={p.name} className="flex items-center justify-between gap-2 text-xs border-b border-border/15 pb-1.5 last:border-0">
                      <div className="flex-1 min-w-0">
                        <span className="font-body text-foreground/80 truncate block">{p.name}</span>
                        {p.excludeFromDiscounts && (
                          <span className="font-body text-[9px] text-amber-400">No discounts</span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`font-body font-semibold ${r.marginPct >= 50 ? 'text-green-400' : r.marginPct >= 30 ? 'text-primary' : r.marginPct >= 10 ? 'text-amber-400' : 'text-red-400'}`}>
                          {fmtPct(r.marginPct)}
                        </span>
                        <span className="font-body text-muted-foreground ml-2">{fmt(r.profit)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}