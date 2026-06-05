import { useState } from 'react';
import { CheckCircle2, Circle, AlertTriangle, XCircle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SetupStripeFlow from '@/components/setup/SetupStripeFlow';
import SetupTikTokFlow from '@/components/setup/SetupTikTokFlow';
import SetupMetricoolFlow from '@/components/setup/SetupMetricoolFlow';
import SetupAIKeysFlow from '@/components/setup/SetupAIKeysFlow';
import SetupPlaywrightFlow from '@/components/setup/SetupPlaywrightFlow';
import SetupShippingPromoFlow from '@/components/setup/SetupShippingPromoFlow';
import SetupApprovalProofFlow from '@/components/setup/SetupApprovalProofFlow';
import SetupFinalBoard from '@/components/setup/SetupFinalBoard';

const STEPS = [
  { id: 'stripe', label: 'Stripe', icon: '💳', desc: 'Webhook secret rotation + checkout test', priority: 'critical' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', desc: 'OAuth, client keys, video.upload test', priority: 'critical' },
  { id: 'metricool', label: 'Metricool', icon: '📅', desc: 'API token + profile connections', priority: 'high' },
  { id: 'aikeys', label: 'AI Keys', icon: '🤖', desc: 'OpenAI + Perplexity + cost controls', priority: 'high' },
  { id: 'playwright', label: 'Playwright QA', icon: '🧪', desc: 'Browser test suite + report import', priority: 'high' },
  { id: 'shipping', label: 'Shipping + Promos', icon: '📦', desc: 'Shipping rules + promo code audit', priority: 'medium' },
  { id: 'approval', label: 'ApprovalQueue Proof', icon: '✅', desc: 'Auto-publish chain verification', priority: 'medium' },
  { id: 'final', label: 'Final Dashboard', icon: '🏁', desc: 'Full system status board', priority: 'info' },
];

const priorityColor = { critical: 'bg-red-500/20 text-red-300 border-red-500/30', high: 'bg-amber-500/20 text-amber-300 border-amber-500/30', medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30', info: 'bg-green-500/20 text-green-300 border-green-500/30' };

export default function GuidedSetupConcierge() {
  const [activeStep, setActiveStep] = useState('stripe');
  const [stepStatus, setStepStatus] = useState({});

  const markStep = (id, status) => setStepStatus(s => ({ ...s, [id]: status }));

  const stepIcon = (id) => {
    const s = stepStatus[id];
    if (s === 'complete') return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    if (s === 'blocked') return <XCircle className="w-4 h-4 text-red-400" />;
    if (s === 'partial') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <Circle className="w-4 h-4 text-muted-foreground" />;
  };

  const advance = (currentId) => {
    const idx = STEPS.findIndex(s => s.id === currentId);
    if (idx < STEPS.length - 1) setActiveStep(STEPS[idx + 1].id);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">Guided Setup Concierge</h1>
          </div>
          <p className="text-muted-foreground">Your system guides you through every external setup task. No typing in chat. Just click.</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">🔒 Secrets are never displayed</Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">🔄 Live status checks built in</Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">✅ Approval required for payments</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <div className="lg:col-span-1 space-y-2">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${activeStep === step.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{step.icon}</span>
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  {stepIcon(step.id)}
                </div>
                <p className="text-xs text-muted-foreground leading-tight">{step.desc}</p>
                <Badge className={`mt-1 text-xs border ${priorityColor[step.priority]}`}>{step.priority}</Badge>
              </button>
            ))}
          </div>

          {/* Main panel */}
          <div className="lg:col-span-3">
            {activeStep === 'stripe' && <SetupStripeFlow onComplete={() => { markStep('stripe', 'complete'); advance('stripe'); }} onBlocked={() => markStep('stripe', 'blocked')} />}
            {activeStep === 'tiktok' && <SetupTikTokFlow onComplete={() => { markStep('tiktok', 'complete'); advance('tiktok'); }} onBlocked={() => markStep('tiktok', 'blocked')} />}
            {activeStep === 'metricool' && <SetupMetricoolFlow onComplete={() => { markStep('metricool', 'complete'); advance('metricool'); }} onBlocked={() => markStep('metricool', 'blocked')} />}
            {activeStep === 'aikeys' && <SetupAIKeysFlow onComplete={() => { markStep('aikeys', 'complete'); advance('aikeys'); }} onBlocked={() => markStep('aikeys', 'blocked')} />}
            {activeStep === 'playwright' && <SetupPlaywrightFlow onComplete={() => { markStep('playwright', 'complete'); advance('playwright'); }} onBlocked={() => markStep('playwright', 'blocked')} />}
            {activeStep === 'shipping' && <SetupShippingPromoFlow onComplete={() => { markStep('shipping', 'complete'); advance('shipping'); }} onBlocked={() => markStep('shipping', 'blocked')} />}
            {activeStep === 'approval' && <SetupApprovalProofFlow onComplete={() => { markStep('approval', 'complete'); advance('approval'); }} onBlocked={() => markStep('approval', 'blocked')} />}
            {activeStep === 'final' && <SetupFinalBoard stepStatus={stepStatus} />}
          </div>
        </div>
      </div>
    </div>
  );
}