import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Database,
  ExternalLink,
  Gauge,
  ListChecks,
  Lock,
  Package,
  RefreshCw,
  ShieldCheck,
  Store,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

const OWNER_EMAIL = 'ganozwaye@gmail.com';
const SOURCE_APP_URL = 'https://ganozmixdirect.base44.app';
const SOURCE_APP_ID = '69eb857abaebfe9e3df48083';

const SOURCE_SNAPSHOT = [
  { label: 'Source products', value: '45', detail: 'Includes GWM merch that must be separated', icon: Package },
  { label: 'Opportunities', value: '5', detail: 'Product research candidates worth triage', icon: TrendingUp },
  { label: 'eBay listings', value: '2', detail: 'Active or unverified in the old app only', icon: Store },
  { label: 'Orders found', value: '0', detail: 'No sales state to migrate tonight', icon: CheckCircle2 },
  { label: 'Job records', value: '36', detail: 'Includes dead-lettered automation runs', icon: Database },
  { label: 'Error logs', value: '10', detail: 'OAuth/token issues need manual review', icon: AlertTriangle }
];

const SAFETY_GATES = [
  'No eBay reconnect while you are asleep',
  'No marketplace publishing or listing edits',
  'No supplier purchases or paid subscriptions',
  'No customer emails, SMS, or fulfilment actions',
  'No file deletions without your morning approval'
];

const CLEANUP_LANES = [
  { key: 'keep', label: 'Keep', detail: 'Strong enough to research properly' },
  { key: 'maybe', label: 'Maybe', detail: 'Needs margin and competition checks' },
  { key: 'test', label: 'Test', detail: 'Could become a controlled experiment' },
  { key: 'gwm_merch', label: 'GWM merch', detail: 'Move away from GanozMix inventory' },
  { key: 'delete_later', label: 'Delete later', detail: 'Only after owner approval' }
];

const QUICK_LINKS = [
  { label: 'Source home', url: SOURCE_APP_URL },
  { label: 'Command center', url: `${SOURCE_APP_URL}/admin/command-center` },
  { label: 'Product discovery', url: `${SOURCE_APP_URL}/discover` },
  { label: 'Source products', url: `${SOURCE_APP_URL}/products` },
  { label: 'Profit dashboard', url: `${SOURCE_APP_URL}/profit-dashboard` },
  { label: 'Product rankings', url: `${SOURCE_APP_URL}/admin/product-rankings` }
];

const FALLBACK_CANDIDATES = [
  {
    id: 'gmx-candidate-magnetic-cable-organiser',
    title: 'Magnetic Cable Organiser (Bamboo)',
    category: 'desk organisation',
    supplier_name: 'CJ Dropshipping',
    supplier_url: 'https://cjdropshipping.com/',
    cost_price_aud: 8.5,
    shipping_cost_aud: 6,
    landed_cost_aud: 14.5,
    target_price_aud: 39.95,
    estimated_margin_percent: 42.1,
    delivery_time_days: '8-15 days',
    supplier_rating: 4.3,
    problem_solved: 'Tangled cables and a messy desk every morning',
    target_audience: 'Work from home professionals, students, creator desks',
    marketplace: 'EBAY_AU',
    cleanup_status: 'keep',
    approval_status: 'needs_review',
    publish_locked: true,
    return_risk: 'low',
    competition_level: 'medium',
    social_content_potential: 'high',
    hero_potential: 'high',
    notes: 'First proof product. Source estimate only: verify exact supplier SKU, image rights, live stock, eBay fees, postage, returns, and live competition before any listing draft.'
  },
  {
    id: 'gmx-candidate-fridge-bins',
    title: 'Fridge Organisation Bins Set (6-piece)',
    category: 'home organisation',
    supplier_name: 'CJ Dropshipping',
    supplier_url: 'https://cjdropshipping.com/',
    cost_price_aud: 9,
    shipping_cost_aud: 6.5,
    landed_cost_aud: 15.5,
    target_price_aud: 44.95,
    estimated_margin_percent: 41,
    delivery_time_days: '8-15 days',
    supplier_rating: 4.2,
    problem_solved: 'Fridge chaos and food waste',
    target_audience: 'Home organisers, busy families, minimalists',
    marketplace: 'EBAY_AU',
    cleanup_status: 'maybe',
    approval_status: 'needs_review',
    publish_locked: true,
    return_risk: 'low',
    competition_level: 'medium',
    social_content_potential: 'viral',
    hero_potential: 'low',
    notes: 'Crowded category. Keep only if landed cost, shipping speed, and image rights are clean.'
  },
  {
    id: 'gmx-candidate-travel-bottles',
    title: 'Silicone Travel Bottle Set (3-pack)',
    category: 'travel',
    supplier_name: 'CJ Dropshipping',
    supplier_url: 'https://cjdropshipping.com/',
    cost_price_aud: 6,
    shipping_cost_aud: 5.5,
    landed_cost_aud: 11.5,
    target_price_aud: 34.95,
    estimated_margin_percent: 43.7,
    delivery_time_days: '8-15 days',
    supplier_rating: 4.1,
    problem_solved: 'Airport security confiscates full-size toiletries',
    target_audience: 'Frequent travellers, backpackers, business travellers',
    marketplace: 'EBAY_AU',
    cleanup_status: 'maybe',
    approval_status: 'needs_review',
    publish_locked: true,
    return_risk: 'low',
    competition_level: 'medium',
    social_content_potential: 'high',
    hero_potential: 'low',
    notes: 'Potentially generic. Needs proof that price, differentiation, and supplier reliability are better than eBay competition.'
  },
  {
    id: 'gmx-candidate-laptop-stand',
    title: 'Adjustable Laptop Stand (Aluminium)',
    category: 'creator desk setup',
    supplier_name: 'CJ Dropshipping',
    supplier_url: 'https://cjdropshipping.com/',
    cost_price_aud: 14,
    shipping_cost_aud: 8,
    landed_cost_aud: 22,
    target_price_aud: 59.95,
    estimated_margin_percent: 40.2,
    delivery_time_days: '10-18 days',
    supplier_rating: 4.5,
    problem_solved: 'Neck pain and poor posture from staring down at a laptop all day',
    target_audience: 'Remote workers, students, content creators',
    marketplace: 'EBAY_AU',
    cleanup_status: 'keep',
    approval_status: 'needs_review',
    publish_locked: true,
    return_risk: 'low',
    competition_level: 'medium',
    social_content_potential: 'high',
    hero_potential: 'high',
    notes: 'Strong next review candidate. Needs live eBay sold-listing check, material verification, weight/shipping confirmation, and image rights.'
  },
  {
    id: 'gmx-candidate-pet-water-fountain',
    title: 'Pet Water Fountain (Auto-circulating)',
    category: 'pet convenience',
    supplier_name: 'CJ Dropshipping',
    supplier_url: 'https://cjdropshipping.com/',
    cost_price_aud: 12,
    shipping_cost_aud: 9,
    landed_cost_aud: 21,
    target_price_aud: 54.95,
    estimated_margin_percent: 38.4,
    delivery_time_days: '10-20 days',
    supplier_rating: 4,
    problem_solved: 'Pets do not drink enough water from stagnant bowls',
    target_audience: 'Cat and dog owners, pet lovers',
    marketplace: 'EBAY_AU',
    cleanup_status: 'maybe',
    approval_status: 'blocked',
    publish_locked: true,
    return_risk: 'medium',
    competition_level: 'low',
    social_content_potential: 'viral',
    hero_potential: 'high',
    notes: 'Potentially strong content product, but blocked until pump failure, return policy, replacement parts, and pet rejection risk are reviewed.'
  }
];

const STATUS_STYLE = {
  keep: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  maybe: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  test: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
  gwm_merch: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  delete_later: 'border-neutral-500/30 bg-neutral-500/10 text-neutral-200',
  needs_review: 'border-primary/35 bg-primary/10 text-primary',
  draft_only: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200'
};

const formatStatus = (value = '') => value.replace(/_/g, ' ');
const hasValue = value => value !== undefined && value !== null && value !== '';
const formatMoney = value => hasValue(value) ? `$${Number(value).toFixed(2)}` : 'unverified';
const formatPercent = value => hasValue(value) ? `${Number(value).toFixed(1)}%` : 'unverified';

const safeList = async (entityName, sort = '-created_date', limit = 50) => {
  try {
    return await base44.entities[entityName].list(sort, limit);
  } catch (error) {
    console.warn(`[GanozMix] ${entityName} unavailable`, error);
    return [];
  }
};

function StatusBadge({ value }) {
  return (
    <Badge variant="outline" className={`capitalize ${STATUS_STYLE[value] || STATUS_STYLE.draft_only}`}>
      {formatStatus(value)}
    </Badge>
  );
}

function MetricCard({ item }) {
  const Icon = item.icon;
  return (
    <div className="rounded-xl border border-border/50 bg-card/75 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{item.value}</p>
        </div>
        <div className="rounded-full border border-primary/25 bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
    </div>
  );
}

export default function GanozMixBridge() {
  const [iframeKey, setIframeKey] = useState(0);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(user => {
        setAllowed(user?.email === OWNER_EMAIL || user?.role === 'admin');
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: ['ganozmix-product-candidates'],
    queryFn: () => safeList('GanozMixProductCandidate'),
    enabled: allowed
  });

  const { data: stores = [] } = useQuery({
    queryKey: ['ganozmix-marketplace-stores'],
    queryFn: () => safeList('GanozMixMarketplaceStore'),
    enabled: allowed
  });

  const { data: jobRuns = [] } = useQuery({
    queryKey: ['ganozmix-job-runs'],
    queryFn: () => safeList('GanozMixJobRun'),
    enabled: allowed
  });

  const { data: errors = [] } = useQuery({
    queryKey: ['ganozmix-error-logs'],
    queryFn: () => safeList('GanozMixErrorLog'),
    enabled: allowed
  });

  const candidateRows = candidates.length ? candidates : FALLBACK_CANDIDATES;
  const store = stores[0];
  const openRisks = useMemo(() => {
    const risks = [];
    if (store?.connection_status) risks.push(`Store connection: ${formatStatus(store.connection_status)}`);
    if (jobRuns.some(job => job.status === 'dead_letter')) risks.push('Dead-lettered jobs need review');
    if (errors.length) risks.push(`${errors.length} source error log item${errors.length === 1 ? '' : 's'} to inspect`);
    if (!risks.length) risks.push('No live marketplace actions are enabled');
    return risks;
  }, [store, jobRuns, errors]);

  if (checking) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-muted-foreground">
        Checking GanozMix access...
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
        <Lock className="h-10 w-10 text-muted-foreground" />
        <h2 className="font-display text-xl text-foreground">Access Restricted</h2>
        <p className="max-w-sm text-sm text-muted-foreground">This section is only available to the site owner or admin account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-primary/25 bg-card/80 p-5 shadow-[0_0_40px_rgba(218,181,90,0.08)] md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 border-primary/35 bg-primary/10 text-primary">
              Review mode active
            </Badge>
            <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">GanozMix Direct</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The old Base44 app is now treated as a source archive. Tonight's work is to sort product intelligence,
              isolate Gannon Waye Music merch pollution, and prepare clean approval packs. Nothing publishes, charges,
              orders, deletes, or messages anyone from here.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => window.open(SOURCE_APP_URL, '_blank', 'noopener,noreferrer')}
              className="gradient-gold-button gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Source App
            </Button>
            <Button
              variant="outline"
              onClick={() => setIframeKey(key => key + 1)}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh View
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {SOURCE_SNAPSHOT.map(item => (
          <MetricCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-border/50 bg-card/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-display text-xl text-foreground">Product Review Queue</h2>
              <p className="text-xs text-muted-foreground">First candidates to clean up before anything becomes a listing draft.</p>
            </div>
          </div>
          {candidatesLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading product candidates...</div>
          ) : (
            <div className="space-y-3">
              {candidateRows.map(candidate => (
                <article key={candidate.id} className="rounded-xl border border-border/45 bg-background/35 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{candidate.title}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {candidate.category || 'uncategorised'} / {candidate.marketplace || 'marketplace pending'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge value={candidate.cleanup_status || 'draft_only'} />
                      <StatusBadge value={candidate.approval_status || 'needs_review'} />
                      {candidate.publish_locked && (
                        <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-200">
                          publish locked
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{candidate.notes}</p>
                  {(hasValue(candidate.landed_cost_aud) || hasValue(candidate.target_price_aud) || hasValue(candidate.estimated_margin_percent) || hasValue(candidate.delivery_time_days)) && (
                    <div className="mt-4 grid gap-2 rounded-lg border border-primary/15 bg-primary/5 p-3 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                      <span>Landed: <strong className="text-foreground">{formatMoney(candidate.landed_cost_aud)}</strong></span>
                      <span>Target: <strong className="text-foreground">{formatMoney(candidate.target_price_aud)}</strong></span>
                      <span>Margin: <strong className="text-foreground">{formatPercent(candidate.estimated_margin_percent)}</strong></span>
                      <span>Delivery: <strong className="text-foreground">{candidate.delivery_time_days || 'unverified'}</strong></span>
                    </div>
                  )}
                  {(candidate.supplier_name || candidate.supplier_rating || candidate.problem_solved) && (
                    <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                      <span>Supplier: <strong className="text-foreground">{candidate.supplier_name || 'unverified'}</strong></span>
                      <span>Rating: <strong className="text-foreground">{candidate.supplier_rating || 'unverified'}</strong></span>
                      <span>Solves: <strong className="text-foreground">{candidate.problem_solved || 'needs angle'}</strong></span>
                    </div>
                  )}
                  <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                    <span>Return risk: <strong className="text-foreground">{candidate.return_risk || 'unknown'}</strong></span>
                    <span>Competition: <strong className="text-foreground">{candidate.competition_level || 'unknown'}</strong></span>
                    <span>Social: <strong className="text-foreground">{candidate.social_content_potential || 'unknown'}</strong></span>
                    <span>Hero: <strong className="text-foreground">{candidate.hero_potential || 'unknown'}</strong></span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card/70 p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-display text-xl text-foreground">Overnight Safety Gates</h2>
                <p className="text-xs text-muted-foreground">The work I can keep doing without waking you.</p>
              </div>
            </div>
            <div className="space-y-2">
              {SAFETY_GATES.map(item => (
                <div key={item} className="flex items-start gap-2 rounded-lg border border-border/40 bg-background/30 p-3">
                  <Ban className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/70 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-display text-xl text-foreground">Cleanup Lanes</h2>
                <p className="text-xs text-muted-foreground">How source products get sorted before review.</p>
              </div>
            </div>
            <div className="space-y-2">
              {CLEANUP_LANES.map(lane => (
                <div key={lane.key} className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/30 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{lane.label}</p>
                    <p className="text-xs text-muted-foreground">{lane.detail}</p>
                  </div>
                  <StatusBadge value={lane.key} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl border border-border/50 bg-card/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-300" />
            <div>
              <h2 className="font-display text-xl text-foreground">Risks To Review</h2>
              <p className="text-xs text-muted-foreground">These are notes only. They do not trigger actions.</p>
            </div>
          </div>
          <div className="space-y-2">
            {openRisks.map(risk => (
              <div key={risk} className="rounded-lg border border-border/40 bg-background/30 px-3 py-2 text-sm text-muted-foreground">
                {risk}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-primary/25 bg-primary/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Source archive</p>
            <p className="mt-2 text-sm text-muted-foreground">
              App id {SOURCE_APP_ID}. Keep useful product intelligence, but do not carry over OAuth state, job runs,
              broken automation, or GWM merch contamination.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/70 p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-xl text-foreground">Source Archive Shortcuts</h2>
              <p className="text-xs text-muted-foreground">Use for reference only until we manually reconnect accounts.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIframeKey(key => key + 1)} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Reload Frame
            </Button>
          </div>
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-border/40 bg-background/30 px-3 py-2.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span>{link.label}</span>
                <ExternalLink className="h-3.5 w-3.5 text-primary" />
              </a>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-border/40 bg-background/40" style={{ height: 520 }}>
            <iframe
              key={iframeKey}
              src={SOURCE_APP_URL}
              className="h-full w-full"
              title="GanozMix Direct source archive"
              allow="fullscreen"
            />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            This frame is the old source app. Treat it as reference until reconnect and publishing are explicitly approved.
          </p>
        </div>
      </section>
    </div>
  );
}
