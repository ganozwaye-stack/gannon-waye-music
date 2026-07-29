// @ts-nocheck
import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Shield, ChevronDown, ChevronUp, Package, Star, Zap, Crown, Building2, Sparkles, Loader2, Copy, Send, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

const PACKAGES = [
  {
    id: 'starter_ai',
    name: 'Starter AI System',
    icon: Package,
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    price_range: '$2,500 – $4,500 AUD setup',
    monthly: '$500/mo support',
    timeline: '2–3 weeks',
    tagline: 'For solopreneurs and personal brands starting their AI journey',
    dashboards: ['Command Centre', 'Approval Queue', 'Knowledge Vault', 'Risk Alerts', 'Agent Task Log'],
    agents: ['Personal Assistant', 'Research Intelligence', 'Security Monitoring'],
    integrations: ['Gmail', 'Google Sheets', 'Stripe (basic)'],
    onboarding: ['Discovery call (1hr)', 'Brand questionnaire', 'KnowledgeVault seed data', 'Agent configuration', '30min handover call'],
    upsells: ['Creator AI upgrade', 'Content automation add-on', 'Monthly strategy session'],
    risks: ['Requires active Stripe account for payment tracking', 'Gmail integration must be authorized by client'],
  },
  {
    id: 'creator_ai',
    name: 'Creator AI System',
    icon: Star,
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/5',
    price_range: '$5,500 – $9,500 AUD setup',
    monthly: '$1,200/mo support',
    timeline: '3–5 weeks',
    tagline: 'For music artists, content creators, and personal brands at scale',
    dashboards: ['Command Centre', 'Executive Feed', 'Ideas Engine', 'Creative Studio', 'Social Command', 'Content Dashboard', 'Marketing Centre', 'Trend Monitor', 'Knowledge Vault', 'Approval Queue', 'Risk Alerts'],
    agents: ['Personal Assistant', 'Creative Studio Agent', 'Social Command Agent', 'Trend Monitoring', 'Ideas Agent', 'Innovation Scout', 'Marketing Strategy'],
    integrations: ['Gmail', 'Google Sheets', 'Stripe', 'Instagram API (manual)', 'TikTok (manual)'],
    onboarding: ['2x Discovery calls', 'Brand voice document', 'Social strategy session', 'Content calendar setup', 'Agent configuration + testing', '60min handover'],
    upsells: ['Ecommerce AI upgrade', 'Fan CRM add-on', 'Weekly strategy calls'],
    risks: ['Social API connections require platform approval', 'Content publishing always requires human approval'],
  },
  {
    id: 'ecommerce_ai',
    name: 'Ecommerce AI System',
    icon: Zap,
    color: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/5',
    price_range: '$7,500 – $14,000 AUD setup',
    monthly: '$1,800/mo support',
    timeline: '4–6 weeks',
    tagline: 'For online stores, merch brands, and product-based businesses',
    dashboards: ['Command Centre', 'Ecommerce Intelligence', 'Product Insights', 'Orders', 'Financial Dashboard', 'Promo Codes', 'Approval Queue', 'Risk Alerts', 'Ideas Engine', 'Security Centre'],
    agents: ['Product Research Agent', 'Pricing Strategy Agent', 'Conversion Agent', 'Upsell Agent', 'Retention Agent', 'Fraud Detection Agent', 'Margin Protection Agent'],
    integrations: ['Stripe', 'Gmail', 'Google Sheets', 'Shipping API', 'Dropship supplier (TBC)'],
    onboarding: ['Product catalog audit', 'Margin analysis', 'Checkout flow review', 'Agent setup + testing', 'Staff training session', '90min handover'],
    upsells: ['Premium Business OS upgrade', 'Custom AI agent builds', 'Paid ads intelligence add-on'],
    risks: ['All pricing changes require human approval', 'Refund logic must be reviewed before automation', 'Supplier integrations require separate credentials'],
  },
  {
    id: 'premium_business_os',
    name: 'Premium Business OS',
    icon: Crown,
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    price_range: '$15,000 – $28,000 AUD setup',
    monthly: '$3,500/mo support',
    timeline: '6–10 weeks',
    tagline: 'Full AI operating system for established businesses and agencies',
    dashboards: ['All dashboards included', 'Custom Executive Feed', 'Legal Dashboard', 'Wealth Dashboard', 'Blueprint Builder', 'Self Healing Ops', 'Memory Graph', 'Agent Learning Engine', 'Premium UX Audit'],
    agents: ['All 50+ specialist agents', 'Custom orchestrator configuration', 'Legal Protection Agent', 'Wealth Stewardship Agent', 'Strategic Planning Agent'],
    integrations: ['All integrations', 'Custom API connections', 'CRM sync', 'Accounting software', 'Legal document storage'],
    onboarding: ['Full business audit (2 weeks)', 'Legal structure review', 'Financial protection setup', 'Custom agent builds', 'Team training (3 sessions)', 'Weekly calls for 2 months'],
    upsells: ['Enterprise upgrade', 'Custom AI model fine-tuning', 'White-label resale rights'],
    risks: ['Legal integrations require solicitor sign-off', 'Financial automation requires accountant approval', 'Custom builds require separate SOW'],
  },
  {
    id: 'enterprise_command_centre',
    name: 'Enterprise AI Command Centre',
    icon: Building2,
    color: 'text-rose-400',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/5',
    price_range: '$45,000+ AUD setup',
    monthly: '$8,000+/mo retainer',
    timeline: '12–20 weeks',
    tagline: 'White-label AI OS for agencies and enterprise clients — fully custom',
    dashboards: ['Everything in Premium Business OS', 'Multi-client management', 'White-label branding', 'Custom role permissions', 'SaaS delivery infrastructure'],
    agents: ['Fully custom agent architecture', 'Domain-specific LLM fine-tuning', 'Multi-tenant agent isolation'],
    integrations: ['Enterprise-grade API suite', 'SSO/SAML auth', 'Custom webhook infrastructure', 'Enterprise CRM', 'Custom compliance tools'],
    onboarding: ['Enterprise discovery (1 month)', 'Technical architecture review', 'Security audit', 'Compliance documentation', 'Dedicated project manager', 'SLA agreement'],
    upsells: ['SaaS white-label license', 'Ongoing model training', 'Dedicated AI engineer on retainer'],
    risks: ['Requires legal agreement and SOW', 'GDPR/Privacy compliance review mandatory', 'Enterprise auth setup requires IT team access'],
  },
];

export default function BlueprintBuilder() {
  const [expanded, setExpanded] = useState(null);
  const [generating, setGenerating] = useState(null);
  const [proposals, setProposals] = useState({});
  const [showIntake, setShowIntake] = useState(false);
  const [intake, setIntake] = useState({ name: '', business: '', goals: '', budget: '', timeline: '' });
  const [intakeResult, setIntakeResult] = useState('');
  const [intakeLoading, setIntakeLoading] = useState(false);
  const { toast } = useToast();

  const generateProposal = async (pkg) => {
    setGenerating(pkg.id);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a premium AI systems consultant writing a client proposal for the "${pkg.name}" package.

Package details:
- Price: ${pkg.price_range}
- Monthly support: ${pkg.monthly}
- Timeline: ${pkg.timeline}
- Tagline: ${pkg.tagline}
- Dashboards: ${pkg.dashboards.join(', ')}
- Agents: ${pkg.agents.join(', ')}
- Integrations: ${pkg.integrations.join(', ')}

Write a polished, persuasive 1-page client proposal that includes:
1. Executive Summary (2 sentences — outcome-focused)
2. What's Included (clear, benefit-framed bullet points)
3. How It Works (3 phases: Discovery → Build → Launch)
4. Investment Summary (pricing, timeline, support)
5. Why Now (urgency framing)
6. Next Step (single clear CTA)

Tone: Confident, premium, consultative. This is for a sophisticated client. No fluff.`,
        model: 'claude_sonnet_4_6',
      });
      setProposals(prev => ({ ...prev, [pkg.id]: result }));
      toast({ title: `Proposal generated for ${pkg.name}` });
    } catch {
      toast({ title: 'Generation failed', variant: 'destructive' });
    }
    setGenerating(null);
  };

  const runIntake = async () => {
    if (!intake.name || !intake.business) return;
    setIntakeLoading(true);
    setIntakeResult('');
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a premium AI systems consultant at Gannon Core. A prospective client has submitted an intake form. Based on their answers, recommend the best package and write a short personalized proposal intro.

Client Name: ${intake.name}
Business: ${intake.business}
Goals: ${intake.goals}
Budget: ${intake.budget}
Timeline: ${intake.timeline}

Available packages (by price):
1. Starter AI System — $2,500–$4,500 setup, $500/mo
2. Creator AI System — $5,500–$9,500 setup, $1,200/mo
3. Ecommerce AI System — $7,500–$14,000 setup, $1,800/mo
4. Premium Business OS — $15,000–$28,000 setup, $3,500/mo
5. Enterprise AI Command Centre — $45,000+ setup, $8,000+/mo

Output:
1. Recommended package with justification (2–3 sentences)
2. Key reasons this package fits their situation
3. 3 immediate wins they'll get in the first 30 days
4. Personalized proposal opening paragraph (warm, consultative, premium)
5. Suggested next step

Be specific, warm, and confident.`,
        model: 'claude_sonnet_4_6',
      });
      setIntakeResult(result);
      // Save to KnowledgeVault
      await base44.entities.KnowledgeVault.create({
        title: `Client Intake: ${intake.name} — ${intake.business}`,
        category: 'business_profile',
        content: `INTAKE:\nName: ${intake.name}\nBusiness: ${intake.business}\nGoals: ${intake.goals}\nBudget: ${intake.budget}\nTimeline: ${intake.timeline}\n\nAI RECOMMENDATION:\n${result}`,
        summary: `Intake for ${intake.name} (${intake.business})`,
        tags: ['client-intake', 'blueprint'],
        access_level: 'admin_only',
      });
      toast({ title: `Intake saved for ${intake.name}` });
    } catch {
      toast({ title: 'Intake failed', variant: 'destructive' });
    }
    setIntakeLoading(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Blueprint Builder</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">Sellable AI operating system packages — private admin only</p>
        </div>
        <Link to="/admin/client-installs">
          <Button variant="outline">View Client Installs →</Button>
        </Link>
      </div>

      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Private Only:</strong> No public pricing page or checkout exists. All packages are proposal-based. Requires manual approval before quoting any client.</p>
      </div>

      {/* Client Intake Form */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3 cursor-pointer" onClick={() => setShowIntake(v => !v)}>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Client Intake → Package Recommender
            <Badge variant="outline" className="ml-auto text-xs">AI Powered</Badge>
          </CardTitle>
        </CardHeader>
        {showIntake && (
          <CardContent className="pt-0 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Client name" value={intake.name} onChange={e => setIntake(v => ({ ...v, name: e.target.value }))} />
              <Input placeholder="Business / industry" value={intake.business} onChange={e => setIntake(v => ({ ...v, business: e.target.value }))} />
              <Input placeholder="Budget range (e.g. $5k–$10k)" value={intake.budget} onChange={e => setIntake(v => ({ ...v, budget: e.target.value }))} />
              <Input placeholder="Ideal timeline (e.g. 4 weeks)" value={intake.timeline} onChange={e => setIntake(v => ({ ...v, timeline: e.target.value }))} />
            </div>
            <Textarea placeholder="Main goals and pain points..." value={intake.goals} onChange={e => setIntake(v => ({ ...v, goals: e.target.value }))} rows={2} />
            <Button onClick={runIntake} disabled={intakeLoading || !intake.name || !intake.business} className="gradient-gold-button border-0 gap-2">
              {intakeLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating Recommendation...</> : <><Send className="w-4 h-4" />Recommend Package</>}
            </Button>
            {intakeResult && (
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-4 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-primary uppercase tracking-widest">Package Recommendation</p>
                  <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => { navigator.clipboard.writeText(intakeResult); toast({ title: 'Copied' }); }}>
                    <Copy className="w-3 h-3 mr-1" />Copy
                  </Button>
                </div>
                <div className="prose prose-sm prose-invert max-w-none text-xs max-h-72 overflow-y-auto">
                  <ReactMarkdown>{intakeResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <div className="space-y-3">
        {PACKAGES.map(pkg => {
          const Icon = pkg.icon;
          const isOpen = expanded === pkg.id;
          return (
            <Card key={pkg.id} className={`border ${isOpen ? pkg.border : 'border-border'} transition-all`}>
              <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(isOpen ? null : pkg.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${pkg.bg} p-2 rounded-lg border ${pkg.border}`}>
                      <Icon className={`w-5 h-5 ${pkg.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{pkg.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{pkg.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <p className={`text-sm font-medium ${pkg.color}`}>{pkg.price_range}</p>
                      <p className="text-xs text-muted-foreground">{pkg.monthly}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </CardHeader>

              {isOpen && (
                <CardContent className="pt-0 space-y-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Section title="Included Dashboards" items={pkg.dashboards} />
                    <Section title="Included Agents" items={pkg.agents} />
                    <Section title="Required Integrations" items={pkg.integrations} />
                    <Section title="Client Onboarding" items={pkg.onboarding} />
                    <Section title="Upsell Opportunities" items={pkg.upsells} color="text-green-400" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Risk Warnings</p>
                      <div className="space-y-1">
                        {pkg.risks.map((r, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-0.5 shrink-0">⚠</span>
                            <p className="text-xs text-muted-foreground">{r}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2 border-t border-border flex-wrap items-center">
                    <Badge variant="outline">Timeline: {pkg.timeline}</Badge>
                    <Badge className={`${pkg.bg} ${pkg.color} border ${pkg.border}`}>{pkg.price_range}</Badge>
                    <Badge variant="outline">{pkg.monthly}</Badge>
                    <Button size="sm" variant="outline" className="ml-auto text-xs" onClick={() => generateProposal(pkg)} disabled={generating === pkg.id}>
                      {generating === pkg.id ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Generating...</> : <><Sparkles className="w-3 h-3 mr-1" />Generate Proposal</>}
                    </Button>
                  </div>
                  {proposals[pkg.id] && (
                    <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-primary uppercase tracking-widest">AI-Generated Proposal</p>
                        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => { navigator.clipboard.writeText(proposals[pkg.id]); toast({ title: 'Copied' }); }}>
                          <Copy className="w-3 h-3 mr-1" />Copy
                        </Button>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none text-xs max-h-80 overflow-y-auto">
                        <ReactMarkdown>{proposals[pkg.id]}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, items, color = 'text-foreground' }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className={`text-xs ${color} flex items-start gap-1.5`}>
            <span className="text-primary mt-0.5 shrink-0">·</span>{item}
          </li>
        ))}
      </ul>
    </div>
  );
}