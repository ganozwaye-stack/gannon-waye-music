import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, CheckCircle2, XCircle, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ALWAYS_EXCLUDED = [
  'Shipping / Postage / Delivery',
  'Handling / Packaging',
  'Processing Fees / Stripe Fees',
  'Merchant Fees',
  'Support Contributions',
  'Donations / Tips',
  'CDs',
  'Vinyl',
  'Songs / Tracks',
  'Digital Music Releases',
  'Limited Edition Music Releases',
  'Music Bundles (containing CDs/vinyl/songs)',
];

const ELIGIBLE_DEFAULTS = [
  'Apparel / Clothing',
  'Hoodies / Jumpers',
  'T-Shirts',
  'Merch Accessories',
  'Merch-Only Bundles (no music items)',
];

// Discount test cases
const TEST_CASES = [
  { label: 'Merch-only cart', items: [{ name: 'Hoodie', category: 'apparel', price: 60, quantity: 1 }], expectDiscount: true },
  { label: 'CD-only cart', items: [{ name: 'EP CD', category: 'cd', price: 20, quantity: 1 }], expectDiscount: false },
  { label: 'Vinyl-only cart', items: [{ name: 'Vinyl Record', category: 'vinyl', price: 35, quantity: 1 }], expectDiscount: false },
  { label: 'Digital music-only', items: [{ name: 'Digital EP', category: 'digital', price: 10, quantity: 1 }], expectDiscount: false },
  { label: 'Mixed merch + CD', items: [{ name: 'Hoodie', category: 'apparel', price: 60, quantity: 1 }, { name: 'EP CD', category: 'cd', price: 20, quantity: 1 }], expectDiscount: true },
  { label: 'Mixed merch + vinyl', items: [{ name: 'T-Shirt', category: 'apparel', price: 40, quantity: 1 }, { name: 'Vinyl', category: 'vinyl', price: 35, quantity: 1 }], expectDiscount: true },
  { label: 'Merch + support contribution', items: [{ name: 'Hoodie', category: 'apparel', price: 60, quantity: 1 }, { name: 'Support', category: 'support', price: 20, quantity: 1 }], expectDiscount: true },
  { label: 'Merch-only bundle', items: [{ name: 'Merch Bundle', category: 'bundle', price: 80, quantity: 1 }], expectDiscount: true },
  { label: 'Bundle with music', items: [{ name: 'cd + hoodie bundle', category: 'bundle', price: 100, quantity: 1 }], expectDiscount: false },
  { label: 'Empty cart', items: [], expectDiscount: false },
];

export default function DiscountGuardAdmin() {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);
  const [customCart, setCustomCart] = useState('');
  const [customDiscountPct, setCustomDiscountPct] = useState(20);
  const [customResult, setCustomResult] = useState(null);

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    const results = [];

    for (const tc of TEST_CASES) {
      try {
        const res = await base44.functions.invoke('applyCheckoutDiscountGuard', {
          cart_items: tc.items,
          discount_percent: 20,
          source_chain: 'DiscountGuardAdmin test suite',
        });
        const data = res.data;
        const discountApplied = data.discount_amount > 0;
        const passed = tc.expectDiscount ? discountApplied : !discountApplied;
        results.push({
          label: tc.label,
          passed,
          eligible: data.eligible_subtotal,
          excluded: data.excluded_subtotal,
          discount: data.discount_amount,
          final: data.final_discounted_subtotal,
          excludedItems: data.excluded_items?.map(i => i.name || i.category).join(', ') || '-',
        });
      } catch (e) {
        results.push({ label: tc.label, passed: false, error: e.message });
      }
    }

    setTestResults(results);
    setTesting(false);
    const allPassed = results.every(r => r.passed);
    if (allPassed) toast.success('All discount guard tests passed!');
    else toast.error(`${results.filter(r => !r.passed).length} test(s) failed`);
  };

  const runCustomTest = async () => {
    try {
      let items = [];
      try { items = JSON.parse(customCart); } catch { toast.error('Invalid JSON for cart items'); return; }
      const res = await base44.functions.invoke('applyCheckoutDiscountGuard', {
        cart_items: items,
        discount_percent: customDiscountPct,
        source_chain: 'DiscountGuardAdmin custom test',
      });
      setCustomResult(res.data);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Discount Guard Admin</h1>
        <p className="text-muted-foreground text-sm mt-1">Global discount rules, test suite, and enforcement documentation.</p>
      </div>

      {/* Global Guard Banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary mb-1">Global Discount Guard Active — v1.0</p>
              <p className="text-xs text-muted-foreground">
                Discounts apply ONLY to approved eligible merch product subtotal. Shipping, processing fees, support contributions, CDs, vinyl, songs, digital music releases, limited edition music releases, and music bundles are ALWAYS excluded — enforced in backend checkout logic. Cannot be bypassed by frontend.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Always Excluded */}
        <Card className="border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-red-400">
              <XCircle className="w-4 h-4" /> Always Excluded (Never Discounted)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {ALWAYS_EXCLUDED.map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-foreground/80">
                  <XCircle className="w-3 h-3 text-red-400 shrink-0" /> {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Eligible */}
        <Card className="border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-4 h-4" /> Eligible for Discount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {ELIGIBLE_DEFAULTS.map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-foreground/80">
                  <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" /> {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Source chain: applyCheckoutDiscountGuard → validatePromoCode → createCheckoutSession → Stripe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Suite */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Automated Test Suite</CardTitle>
            <Button onClick={runAllTests} disabled={testing} className="gap-2">
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run All Tests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {testResults.length > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-300">{passed} passed</Badge>
              {failed > 0 && <Badge className="bg-red-500/20 text-red-300">{failed} failed</Badge>}
            </div>
          )}
          <div className="space-y-2">
            {TEST_CASES.map((tc, i) => {
              const result = testResults[i];
              return (
                <div key={tc.label} className={`border rounded-lg p-3 ${result ? (result.passed ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5') : 'border-border'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result ? (result.passed ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />) : <div className="w-4 h-4 rounded-full border border-border" />}
                      <span className="text-sm font-medium">{tc.label}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{tc.expectDiscount ? 'expects discount' : 'expects no discount'}</Badge>
                  </div>
                  {result && !result.error && (
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <span>Eligible: ${result.eligible?.toFixed(2)}</span>
                      <span>Excluded: ${result.excluded?.toFixed(2)}</span>
                      <span>Discount: -${result.discount?.toFixed(2)}</span>
                      <span>Final: ${result.final?.toFixed(2)}</span>
                    </div>
                  )}
                  {result?.error && <p className="text-xs text-red-400 mt-1">{result.error}</p>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Test */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Custom Cart Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs uppercase tracking-wider">Cart Items (JSON array)</Label>
            <textarea
              className="w-full h-32 bg-secondary/50 border border-border rounded-lg p-2 text-xs font-mono mt-1"
              value={customCart}
              onChange={e => setCustomCart(e.target.value)}
              placeholder={`[{"name": "Hoodie", "category": "apparel", "price": 60, "quantity": 1}]`}
            />
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-xs uppercase tracking-wider">Discount %</Label>
            <Input type="number" value={customDiscountPct} onChange={e => setCustomDiscountPct(parseInt(e.target.value))} className="w-24" />
            <Button onClick={runCustomTest}>Test</Button>
          </div>
          {customResult && (
            <div className="bg-secondary/30 rounded-lg p-4 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-muted-foreground">Eligible Subtotal</span><p className="font-semibold">${customResult.eligible_subtotal?.toFixed(2)}</p></div>
                <div><span className="text-xs text-muted-foreground">Excluded Subtotal</span><p className="font-semibold">${customResult.excluded_subtotal?.toFixed(2)}</p></div>
                <div><span className="text-xs text-muted-foreground">Discount Amount</span><p className="font-semibold text-green-400">-${customResult.discount_amount?.toFixed(2)}</p></div>
                <div><span className="text-xs text-muted-foreground">Final Discounted</span><p className="font-semibold text-primary">${customResult.final_discounted_subtotal?.toFixed(2)}</p></div>
              </div>
              {customResult.excluded_items?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Excluded Items:</p>
                  {customResult.reason_each_item_excluded?.map((r, i) => (
                    <p key={i} className="text-xs text-red-400">{r.item_name}: {r.reason}</p>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground italic">{customResult.source_chain}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}