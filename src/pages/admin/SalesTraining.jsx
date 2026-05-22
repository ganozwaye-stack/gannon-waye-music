import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DollarSign, Users, CheckCircle2, Package, Zap, BookOpen, ArrowRight, Star, Shield, Clock } from 'lucide-react';

const PACKAGES = [
  {
    name: 'Starter AI OS',
    price: '$2,500 setup + $500/mo',
    ideal: 'Solo artists, indie creators',
    includes: ['Agent Registry (10 agents)', 'Knowledge Vault', 'Basic automations', 'Monthly health report', 'Email support'],
    automations: ['Weekly research loop', 'New subscriber welcome', 'Order notifications'],
    manual: ['Approval queue review (weekly)', 'Content posting', 'Promo code management'],
  },
  {
    name: 'Professional AI OS',
    price: '$6,000 setup + $1,200/mo',
    ideal: 'Independent labels, growing artists',
    includes: ['Full agent suite (30+ agents)', 'Ecommerce command', 'Trend engine', 'Social intelligence', 'Weekly monitoring call'],
    automations: ['Daily research', 'Trend alerts', 'Order + shipping automation', 'Birthday discounts', 'Promo distribution'],
    manual: ['Approval queue review (daily)', 'Agent activation decisions', 'Crisis escalation'],
  },
  {
    name: 'Enterprise AI OS',
    price: '$15,000 setup + $3,000/mo',
    ideal: 'Labels, agencies, management companies',
    includes: ['Full white-label system', 'Client onboarding kit', 'All 50+ agents', 'Dedicated monitoring', 'Quarterly strategy session'],
    automations: ['Full autonomous ops', 'Multi-client dashboards', 'Revenue command', 'Self-healing system'],
    manual: ['Final approval on financial actions', 'New client briefings'],
  },
];

const SALES_SCRIPT = [
  { step: '1. Open', script: 'This system replaces an entire operations team. It researches your market every 4 hours, finds opportunities, flags risks, runs your store, and learns from every outcome.' },
  { step: '2. Pain', script: 'Right now you\'re doing manually what this system does automatically — researching trends, managing orders, replying to fans, tracking finances, monitoring competitors.' },
  { step: '3. Demo', script: 'Show them: Research Grid live scan, Agent Registry showing what each agent does, one click from notification to order detail, Knowledge Vault auto-filling.' },
  { step: '4. Objection: Cost', script: 'One VA costs $3,000+/mo and only works 8 hours/day. This works 24/7, never makes emotional decisions, and improves every week automatically.' },
  { step: '5. Close', script: 'I take 4 weeks to set it up specifically for your business. You approve what goes live. Nothing runs without your say on anything financial or public.' },
];

const WHAT_YOU_MANAGE_MONTHLY = [
  'Review ApprovalQueue items (daily, 5 mins)',
  'Check Notifications dashboard (daily, 2 mins)',
  'Review Executive Feed for opportunities',
  'Approve or reject agent-suggested content',
  'Monitor Research Grid for new intelligence',
  'Check System Health dashboard',
  'Review Agent Learning records',
  'Respond to community posts if flagged',
  'Review monthly revenue report',
  'Update release dates / campaign targets',
];

export default function SalesTraining() {
  const [activePackage, setActivePackage] = useState(0);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Sales Training</h1>
        <p className="text-muted-foreground text-sm mt-1">How to sell the GanozMix AI Operating System to clients</p>
      </div>

      <Tabs defaultValue="packages">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="packages">Packages & Pricing</TabsTrigger>
          <TabsTrigger value="script">Sales Script</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Management</TabsTrigger>
          <TabsTrigger value="support">Support Process</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PACKAGES.map((pkg, i) => (
              <Card key={pkg.name} className={`cursor-pointer hover:border-primary/40 transition-all ${activePackage === i ? 'border-primary' : ''}`} onClick={() => setActivePackage(i)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{pkg.name}</CardTitle>
                    {i === 1 && <Badge className="bg-primary/10 text-primary text-xs">Most Popular</Badge>}
                  </div>
                  <p className="text-xl font-bold text-primary">{pkg.price}</p>
                  <p className="text-xs text-muted-foreground">{pkg.ideal}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Includes</p>
                    {pkg.includes.map(item => (
                      <div key={item} className="flex items-start gap-1.5 text-xs text-foreground/80 mb-0.5">
                        <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />{item}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Auto-runs</p>
                    {pkg.automations.map(item => (
                      <div key={item} className="flex items-start gap-1.5 text-xs text-foreground/80 mb-0.5">
                        <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />{item}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Manual Required</p>
                    {pkg.manual.map(item => (
                      <div key={item} className="flex items-start gap-1.5 text-xs text-foreground/80 mb-0.5">
                        <Shield className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />{item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="script" className="mt-4 space-y-3">
          {SALES_SCRIPT.map(s => (
            <Card key={s.step}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Badge className="bg-primary/10 text-primary text-xs shrink-0">{s.step}</Badge>
                  <p className="text-sm text-foreground/80 leading-relaxed">{s.script}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4 text-primary" />What You Do Monthly (Per Client)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {WHAT_YOU_MANAGE_MONTHLY.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 border border-border rounded-lg text-sm">
                  <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                  <span className="text-foreground/80">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="mt-4 space-y-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Support Process</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { tier: 'Tier 1 — Auto', desc: 'System self-heals most issues via SelfHealing page. Alerts sent automatically.', badge: 'automated' },
                { tier: 'Tier 2 — Review', desc: 'Check Notifications + ApprovalQueue daily. Most issues surface here with recommended fix.', badge: 'daily' },
                { tier: 'Tier 3 — Manual', desc: 'Complex agent failures, API credential issues, new integration setup — handled in weekly session.', badge: 'weekly' },
                { tier: 'Tier 4 — Emergency', desc: 'Payment failure, checkout freeze, data issue — escalated via Slack #gannon-alerts within 1 hour.', badge: 'immediate' },
              ].map(t => (
                <div key={t.tier} className="border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{t.tier}</p>
                    <Badge variant="outline" className="text-xs ml-auto">{t.badge}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}