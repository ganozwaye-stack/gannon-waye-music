import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ExternalLink, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StepBlock from './StepBlock';
import SecureSecretInput from './SecureSecretInput';

const WEBHOOK_URL = 'https://base44.app/api/functions/stripeWebhook';

export default function SetupStripeFlow({ onComplete, onBlocked }) {
  const [phase, setPhase] = useState('intro'); // intro | rotate | test | checkout | done
  const [healthResult, setHealthResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [secretSaved, setSecretSaved] = useState(false);
  const [checkoutApproved, setCheckoutApproved] = useState(false);

  const runHealthCheck = async () => {
    setTesting(true);
    try {
      const res = await base44.functions.invoke('integrationHealthCheck', {});
      setHealthResult(res.data);
    } catch (e) {
      setHealthResult({ error: e.message });
    }
    setTesting(false);
  };

  const stripeHealth = healthResult?.integrations?.stripe;
  const stripeMode = healthResult?.integrations?.stripeMode;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>💳</span> Stripe Setup
            <Badge className="ml-auto bg-red-500/20 text-red-300 border-red-500/30">Critical</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Webhook secret rotation + live checkout validation. Payments cannot be trusted until webhook secret is rotated.</p>
        </CardHeader>
      </Card>

      {/* Step 1 */}
      <StepBlock
        number={1}
        title="Open Stripe Webhook Dashboard"
        status={phase === 'intro' ? 'active' : 'done'}
        why="You must rotate the webhook signing secret so the app can verify real Stripe events."
      >
        <p className="text-sm text-muted-foreground mb-3">Click below to open Stripe. Navigate to: <strong>Developers → Webhooks → your webhook endpoint</strong></p>
        <div className="bg-secondary/50 rounded-lg p-3 mb-3 text-xs font-mono text-muted-foreground">
          Your webhook endpoint URL: <span className="text-primary">{WEBHOOK_URL}</span>
        </div>
        <Button className="gap-2" onClick={() => { window.open('https://dashboard.stripe.com/webhooks', '_blank'); setPhase('rotate'); }}>
          <ExternalLink className="w-4 h-4" /> Open Stripe Webhooks
        </Button>
      </StepBlock>

      {/* Step 2 */}
      {phase !== 'intro' && (
        <StepBlock number={2} title="Roll the Signing Secret" status={secretSaved ? 'done' : 'active'} why="The old secret may be compromised. Rolling it generates a new one only you will know.">
          <ol className="text-sm text-muted-foreground space-y-1 mb-4 list-decimal list-inside">
            <li>In Stripe, find your webhook endpoint (url above)</li>
            <li>Click <strong>"Roll secret"</strong> or <strong>"Reveal / Roll signing secret"</strong></li>
            <li>Copy the new <code className="text-primary bg-secondary px-1 rounded">whsec_...</code> value</li>
            <li>Paste it into the secure field below — it will never be shown again</li>
          </ol>
          <SecureSecretInput
            label="New STRIPE_WEBHOOK_SECRET"
            secretName="STRIPE_WEBHOOK_SECRET"
            placeholder="whsec_..."
            onSaved={() => setSecretSaved(true)}
          />
        </StepBlock>
      )}

      {/* Step 3 */}
      {secretSaved && (
        <StepBlock number={3} title="Test Stripe Connection" status={healthResult ? (stripeHealth === 'ok' ? 'done' : 'error') : 'active'} why="Confirms the new webhook secret is valid and Stripe keys are live mode.">
          <Button onClick={runHealthCheck} disabled={testing} className="gap-2 mb-3">
            <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing...' : 'Run Integration Health Check'}
          </Button>
          {healthResult && (
            <div className="space-y-2">
              <HealthRow label="Webhook secret" value={healthResult?.secrets?.STRIPE_WEBHOOK_SECRET} />
              <HealthRow label="Stripe publishable key" value={healthResult?.secrets?.STRIPE_PUBLISHABLE_KEY} />
              <HealthRow label="Stripe secret key" value={healthResult?.secrets?.STRIPE_SECRET_KEY} />
              <HealthRow label="Key mode" value={stripeMode} />
              {stripeMode === 'mismatch' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
                  ⚠️ Key mode mismatch — your publishable and secret keys are from different Stripe environments. Checkout is blocked until both are from the same environment (both test or both live).
                </div>
              )}
              {stripeMode === 'live' && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-300">
                  🔴 LIVE MODE — any checkout test will charge a real card. Only proceed when you're ready to approve a small controlled live purchase.
                </div>
              )}
            </div>
          )}
          {healthResult && stripeMode !== 'mismatch' && (
            <Button className="mt-3 gap-2" onClick={() => setPhase('checkout')}>
              <ChevronRight className="w-4 h-4" /> Proceed to Checkout Test
            </Button>
          )}
        </StepBlock>
      )}

      {/* Step 4 */}
      {phase === 'checkout' && (
        <StepBlock number={4} title="Approve Checkout Test" status={checkoutApproved ? 'active' : 'waiting'} why="A controlled purchase proves: checkout opens, payment succeeds, webhook fires, order is created, receipt sends.">
          {stripeMode === 'live' && !checkoutApproved && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4">
              <p className="text-amber-300 font-semibold text-sm mb-1">⚠️ Approval Required — LIVE payment will be made</p>
              <p className="text-xs text-muted-foreground">A small real charge will be made to verify the full end-to-end checkout flow. Do you approve?</p>
            </div>
          )}
          {!checkoutApproved && (
            <div className="flex gap-2">
              <Button onClick={() => setCheckoutApproved(true)} className="gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4" /> I Approve — Run Checkout Test
              </Button>
              <Button variant="outline" onClick={onBlocked}>Mark Blocked / Skip</Button>
            </div>
          )}
          {checkoutApproved && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Go to your store and complete a checkout now:</p>
              <Button className="gap-2" onClick={() => window.open('https://gannonwaye.com/store', '_blank')}>
                <ExternalLink className="w-4 h-4" /> Open Store
              </Button>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Verify all of these after checkout:</p>
                {['Checkout modal opens without freeze', 'Payment succeeds (no misleading save-card message)', 'Webhook event received in Stripe', 'Order created in /admin/orders', 'Receipt email sent to buyer', 'Inventory/profit updates in /admin/order-profit-intelligence', 'Order status shows correctly'].map(item => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                    <input type="checkbox" className="w-3 h-3" /> {item}
                  </label>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={onComplete} className="gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4" /> All Verified — Mark Stripe Complete
                </Button>
                <Button variant="outline" onClick={onBlocked}>Mark Blocked</Button>
              </div>
            </div>
          )}
        </StepBlock>
      )}
    </div>
  );
}

function HealthRow({ label, value }) {
  const isOk = value === 'present' || value === 'ok' || value === 'live' || value === 'test';
  const isWarn = value === 'mismatch';
  const isBad = !value || value === 'missing' || value === 'error';
  return (
    <div className="flex items-center justify-between text-sm py-1 border-b border-border">
      <span className="text-muted-foreground">{label}</span>
      <Badge className={`text-xs border ${isOk ? 'bg-green-500/20 text-green-300 border-green-500/30' : isWarn ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
        {value || 'missing'}
      </Badge>
    </div>
  );
}