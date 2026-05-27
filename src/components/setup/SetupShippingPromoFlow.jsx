import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StepBlock from './StepBlock';

const REQUIRED_SHIPPING = [
  { region: 'australia', type: 'cd', label: 'Australia — CD' },
  { region: 'australia', type: 'merch', label: 'Australia — Merch' },
  { region: 'australia', type: 'vinyl', label: 'Australia — Vinyl' },
  { region: 'australia', type: 'apparel', label: 'Australia — Apparel' },
  { region: 'australia', type: 'accessories', label: 'Australia — Accessories' },
  { region: 'australia', type: 'bundle', label: 'Australia — Bundle' },
  { region: 'international', type: 'cd', label: 'International — CD' },
  { region: 'international', type: 'merch', label: 'International — Merch' },
];

const PROMO_CODES = [
  { code: 'LAUNCH15', note: '15% launch discount — check expiry and usage limits' },
  { code: 'THANKYOU10', note: '10% thank you — check if active' },
  { code: 'FRIENDS30', note: '30% friends — verify excludes shipping' },
  { code: 'FAMILYFRIENDS', note: 'Family/friends — must exclude CDs/vinyl/support' },
  { code: 'GIFTAPPROVED', note: 'Gift approval code — must require admin approval' },
];

export default function SetupShippingPromoFlow({ onComplete, onBlocked }) {
  const [shippingChecks, setShippingChecks] = useState({});
  const [promoChecks, setPromoChecks] = useState({});
  const [shippingLoading, setShippingLoading] = useState(false);

  const { data: shippingRules = [] } = useQuery({
    queryKey: ['shipping-rules'],
    queryFn: () => base44.entities.ShippingRateRule.list(),
  });

  const { data: promoCodes = [] } = useQuery({
    queryKey: ['promo-codes'],
    queryFn: () => base44.entities.PromoCode.list(),
  });

  const hasRule = (region, type) => shippingRules.some(r => r.region === region && r.product_type === type && r.is_active);

  const toggleShipping = (key) => setShippingChecks(c => ({ ...c, [key]: !c[key] }));
  const togglePromo = (code, val) => setPromoChecks(c => ({ ...c, [code]: val }));

  const shippingOk = REQUIRED_SHIPPING.every(r => hasRule(r.region, r.type) || shippingChecks[`${r.region}_${r.type}`]);
  const promoOk = PROMO_CODES.every(p => promoChecks[p.code]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">📦</span>
          <h2 className="font-semibold text-lg">Shipping Rules + Promo Code Audit</h2>
          <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30">Medium</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Verify all required shipping rules exist and promo codes are safe and correctly configured.</p>
      </div>

      <StepBlock number={1} title="Verify Shipping Rules" status={shippingOk ? 'done' : 'active'} why="Missing shipping rules mean customers can't complete checkout for certain product/region combinations.">
        <p className="text-sm text-muted-foreground mb-2">Auto-detected from database + manual confirmation:</p>
        <div className="space-y-2">
          {REQUIRED_SHIPPING.map(rule => {
            const key = `${rule.region}_${rule.type}`;
            const autoDetected = hasRule(rule.region, rule.type);
            return (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 text-sm">
                <span className="text-muted-foreground">{rule.label}</span>
                <div className="flex items-center gap-2">
                  {autoDetected ? (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">✓ exists in DB</Badge>
                  ) : (
                    <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                      <input type="checkbox" checked={!!shippingChecks[key]} onChange={() => toggleShipping(key)} className="w-3 h-3" />
                      mark as set
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={() => window.open('/admin/shipping-rates', '_blank')}>
          <ExternalLink className="w-3 h-3" /> Open Shipping Rules Manager
        </Button>
      </StepBlock>

      <StepBlock number={2} title="Promo Code Audit" status={promoOk ? 'done' : 'active'} why="Incorrectly configured promo codes can create financial loss, legal issues, or allow unintended discounts.">
        <p className="text-sm text-muted-foreground mb-2">For each code, confirm it's safe and correctly restricted:</p>
        <div className="space-y-3">
          {PROMO_CODES.map(promo => {
            const dbCode = promoCodes.find(p => p.code === promo.code);
            return (
              <div key={promo.code} className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-bold text-primary">{promo.code}</span>
                  {dbCode ? (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">{dbCode.is_active ? 'active' : 'inactive'} · {dbCode.discount_percent}% off</Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">not found in DB</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{promo.note}</p>
                <div className="flex gap-2">
                  {['safe', 'needs fix', 'inactive ok'].map(val => (
                    <button
                      key={val}
                      onClick={() => togglePromo(promo.code, val)}
                      className={`px-2 py-0.5 rounded text-xs transition-colors ${
                        promoChecks[promo.code] === val
                          ? val === 'safe' ? 'bg-green-500 text-white'
                            : val === 'needs fix' ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={() => window.open('/admin/promo-code-audit', '_blank')}>
          <ExternalLink className="w-3 h-3" /> Open Full Promo Code Audit
        </Button>
      </StepBlock>

      <div className="flex gap-2">
        <Button onClick={onComplete} className="gap-2 bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="w-4 h-4" /> Mark Shipping + Promos Complete
        </Button>
        <Button variant="outline" onClick={onBlocked}>Mark Blocked</Button>
      </div>
    </div>
  );
}