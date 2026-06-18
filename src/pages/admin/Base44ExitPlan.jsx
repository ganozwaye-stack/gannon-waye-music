import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Database, GitBranch, ShieldCheck } from 'lucide-react';

const PHASES = [
  {
    title: 'Phase 1 - Stabilise Live Base44',
    status: 'active',
    items: [
      'Keep gannonwaye.com live while the replacement is designed.',
      'Fix routing, lyrics, systems sales pages, link integrity, and admin protection first.',
      'Do not change Stripe, checkout, orders, or domain cutover without parity proof.',
    ],
  },
  {
    title: 'Phase 2 - Build Portable GitHub Stack',
    status: 'planned',
    items: [
      'React/Vite or Next.js frontend under GitHub control.',
      'Supabase or equivalent backend, Stripe payments, Playwright tests, GitHub Actions.',
      'Cloudinary/S3/R2 media storage and approved email provider when chosen.',
    ],
  },
  {
    title: 'Phase 3 - Data Export',
    status: 'planned',
    items: [
      'Export products, orders, customers, subscribers, assets, campaigns, lyrics, agents, approvals, blueprint records, and settings.',
      'Never export secrets into code.',
      'Keep financial, legal, and order audit history intact.',
    ],
  },
  {
    title: 'Phase 4 - Parity Testing',
    status: 'planned',
    items: [
      'Public pages load, admin is protected, products display, cart works, checkout works, Stripe webhooks work.',
      'Promo rules, inventory, emails, lyrics, service pages, and social links must pass.',
      'Run live test order only after Gannon approval.',
    ],
  },
  {
    title: 'Phase 5 - Domain Cutover',
    status: 'blocked_until_parity',
    items: [
      'Freeze Base44 changes, final export, deploy replacement, smoke test, switch DNS, monitor orders.',
      'Keep Base44 fallback temporarily.',
      'Retire Base44 only after replacement is stable.',
    ],
  },
];

const EXPORTS = [
  'MerchProduct',
  'MerchOrder',
  'StoreCustomer',
  'EmailSubscriber',
  'Release',
  'SocialVideo',
  'FeaturedVideo',
  'KnowledgeVault',
  'Agent Registry',
  'ApprovalQueue',
  'AdminNotification',
  'SiteSettings',
  'SystemHealthIssue',
];

export default function Base44ExitPlan() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <Badge className="bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 mb-3">No live cutover yet</Badge>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Base44 Exit Plan</h1>
        <p className="text-muted-foreground text-sm max-w-3xl mt-1">
          Stabilise the live Base44 system, build a GitHub-controlled replacement, export safely, prove parity, then cut over only when the replacement can protect revenue, orders, legal records, and customer trust.
        </p>
      </div>

      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-300 shrink-0" />
        <p className="text-sm text-yellow-100/80">
          Domain cutover, Stripe changes, payment settings, checkout replacement, webhook changes, and data deletion remain approval-gated.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {PHASES.map((phase, index) => (
          <Card key={phase.title} className="border-primary/15">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                {index === 0 ? <ShieldCheck className="w-4 h-4 text-primary" /> : <GitBranch className="w-4 h-4 text-primary" />}
                {phase.title}
              </CardTitle>
              <Badge variant="outline" className="w-fit text-[10px] uppercase">{phase.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {phase.items.map(item => (
                <div key={item} className="flex gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="w-5 h-5 text-primary" /> Export Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXPORTS.map(item => (
            <div key={item} className="rounded-lg border border-border/50 bg-secondary/20 p-3 text-sm">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
