import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Calculator, Save, Info } from 'lucide-react';

export default function LandedCostCalculator() {
  const [form, setForm] = useState({
    product_name: '', qty_ordered: '1', product_cost_aud: '',
    shipping_cost_aud: '0', taxes_duties_aud: '0', platform_fees_aud: '0',
    payment_fee_aud: '0', currency_fee_aud: '0', other_fees_aud: '0',
    sell_price_aud: '', purchase_order_id: '',
  });
  const [saving, setSaving] = useState(false);

  const f = n => parseFloat(form[n]) || 0;
  const qty = Math.max(1, f('qty_ordered'));
  const totalCost = f('product_cost_aud') + f('shipping_cost_aud') + f('taxes_duties_aud') + f('platform_fees_aud') + f('payment_fee_aud') + f('currency_fee_aud') + f('other_fees_aud');
  const perUnit = totalCost / qty;
  const sellPrice = f('sell_price_aud');
  const grossProfit = sellPrice - perUnit;
  const grossMargin = sellPrice > 0 ? (grossProfit / sellPrice) * 100 : 0;
  const minProfitable = perUnit * 1.1;
  const recommended = perUnit * 2.5;
  const breakEven = totalCost > 0 && grossProfit > 0 ? Math.ceil(totalCost / grossProfit) : 0;

  const handleSave = async () => {
    if (!form.product_name || !form.product_cost_aud) {
      toast.error('Product name and cost required'); return;
    }
    setSaving(true);
    await base44.entities.LandedCostCalculation.create({
      ...form,
      qty_ordered: qty,
      product_cost_aud: f('product_cost_aud'),
      shipping_cost_aud: f('shipping_cost_aud'),
      taxes_duties_aud: f('taxes_duties_aud'),
      platform_fees_aud: f('platform_fees_aud'),
      payment_fee_aud: f('payment_fee_aud'),
      currency_fee_aud: f('currency_fee_aud'),
      other_fees_aud: f('other_fees_aud'),
      total_order_cost_aud: totalCost,
      landed_cost_per_unit_aud: perUnit,
      sell_price_aud: sellPrice,
      gross_margin_percent: grossMargin,
      gross_profit_per_unit_aud: grossProfit,
      minimum_profitable_price_aud: minProfitable,
      recommended_retail_price_aud: recommended,
      break_even_units: breakEven,
      cash_tied_in_stock_aud: perUnit * qty,
      allocation_method: 'proportional_cost',
      formula_notes: `Total $${totalCost.toFixed(2)} ÷ ${qty} units = $${perUnit.toFixed(2)}/unit. Margin: ${grossMargin.toFixed(1)}%`,
      calculation_type: f('shipping_cost_aud') > 0 ? 'final' : 'preliminary',
      calculated_by: 'LandedCostCalculator',
      source_chain: `LandedCostCalculator → ${new Date().toISOString()}`,
    });
    toast.success('Calculation saved');
    setSaving(false);
  };

  const row = (label, val, color = '') => (
    <div className="flex justify-between items-center py-1.5 border-b border-border/20 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>{val}</span>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Commerce</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Landed Cost Calculator</h1>
        <p className="text-muted-foreground text-sm mt-1">Calculate true cost per unit including all fees, shipping, and duties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Order Inputs</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              ['product_name', 'Product Name', 'text', 'Coffee Mug'],
              ['qty_ordered', 'Quantity Ordered', 'number', '36'],
              ['product_cost_aud', 'Product Total (AUD) *', 'number', '139.26'],
              ['shipping_cost_aud', 'Shipping Cost (AUD)', 'number', '0'],
              ['taxes_duties_aud', 'Taxes / Duties (AUD)', 'number', '0'],
              ['platform_fees_aud', 'Platform Fees / Alibaba Fees (AUD)', 'number', '0'],
              ['payment_fee_aud', 'Payment Processing Fee (AUD)', 'number', '0'],
              ['currency_fee_aud', 'Currency Conversion Fee (AUD)', 'number', '0'],
              ['other_fees_aud', 'Other Fees (AUD)', 'number', '0'],
              ['sell_price_aud', 'Your Sell Price (AUD) — for margin calc', 'number', '9.90'],
              ['purchase_order_id', 'Link to PO ID (optional)', 'text', ''],
            ].map(([key, label, type, ph]) => (
              <div key={key}>
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <Input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="mt-1 bg-secondary/50" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className="border-primary/30">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calculator className="w-4 h-4 text-primary" /> Results (Live)</CardTitle></CardHeader>
            <CardContent>
              {row('Product Cost', `$${f('product_cost_aud').toFixed(2)}`)}
              {row('+ Shipping', `$${f('shipping_cost_aud').toFixed(2)}`)}
              {row('+ Taxes/Duties', `$${f('taxes_duties_aud').toFixed(2)}`)}
              {row('+ Platform Fees', `$${f('platform_fees_aud').toFixed(2)}`)}
              {row('+ Payment Fees', `$${f('payment_fee_aud').toFixed(2)}`)}
              {row('+ Currency Fees', `$${f('currency_fee_aud').toFixed(2)}`)}
              {row('+ Other Fees', `$${f('other_fees_aud').toFixed(2)}`)}
              <div className="border-t border-border/40 mt-2 pt-2">
                {row('Total Order Cost', `$${totalCost.toFixed(2)}`, 'text-primary')}
                {row('Quantity', qty)}
                {row('Landed Cost / Unit', `$${perUnit.toFixed(2)}`, 'text-green-400 text-base')}
                {row('Cash Tied in Stock', `$${(perUnit * qty).toFixed(2)}`, 'text-amber-400')}
              </div>
            </CardContent>
          </Card>

          {sellPrice > 0 && (
            <Card className="border-green-500/20">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Profit Analysis at ${sellPrice.toFixed(2)}</CardTitle></CardHeader>
              <CardContent>
                {row('Gross Profit / Unit', `$${grossProfit.toFixed(2)}`, grossProfit > 0 ? 'text-green-400' : 'text-red-400')}
                {row('Gross Margin', `${grossMargin.toFixed(1)}%`, grossMargin > 30 ? 'text-green-400' : grossMargin > 10 ? 'text-amber-400' : 'text-red-400')}
                {row('Min Profitable Price (10% margin)', `$${minProfitable.toFixed(2)}`)}
                {row('Recommended Retail (2.5×)', `$${recommended.toFixed(2)}`, 'text-primary')}
                {breakEven > 0 && row('Break-even Units', breakEven)}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Info className="w-4 h-4" /> Formula</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground font-mono bg-secondary/50 rounded p-2">
                Landed Cost/Unit = (Product + Shipping + Taxes + All Fees) ÷ Quantity<br />
                = ${totalCost.toFixed(2)} ÷ {qty} = <strong>${perUnit.toFixed(2)}</strong>
              </p>
              {f('shipping_cost_aud') === 0 && (
                <p className="text-xs text-amber-400 mt-2">⚠️ Shipping not entered — result is PRELIMINARY</p>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
            <Save className="w-4 h-4" /> Save Calculation
          </Button>
        </div>
      </div>
    </div>
  );
}