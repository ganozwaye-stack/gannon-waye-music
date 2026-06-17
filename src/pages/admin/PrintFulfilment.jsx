import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle, Printer, Package, DollarSign, Image, Clock, Globe, FileText, Zap, ChevronRight, ChevronDown, Info } from 'lucide-react';

// ── Provider Data ────────────────────────────────────────────────────────────
const PROVIDERS = [
  {
    name: 'Printful',
    api_available: true,
    framed_posters: true,
    australia_fulfilment: true,
    global_fulfilment: true,
    white_label: true,
    branding: 'Custom packing slip, label',
    tracking: true,
    production_time: '2–5 business days',
    shipping_regions: 'AUS, US, EU, UK, CA',
    sample_status: 'Not ordered',
    quality_rating: 9,
    cost_rating: 7,
    active: false,
    api_env_var: 'PRINTFUL_API_KEY',
    notes: 'Industry standard. Large AUS fulfilment hub in Sydney. Framed posters up to A1. White-label branding. Recommended first choice.',
  },
  {
    name: 'Printify',
    api_available: true,
    framed_posters: true,
    australia_fulfilment: true,
    global_fulfilment: true,
    white_label: false,
    branding: 'Limited — no custom inserts',
    tracking: true,
    production_time: '3–7 business days',
    shipping_regions: 'AUS, US, EU, UK',
    sample_status: 'Not ordered',
    quality_rating: 7,
    cost_rating: 9,
    active: false,
    api_env_var: 'PRINTIFY_API_KEY',
    notes: 'Good pricing. Framed poster range limited vs Printful. White-label not available. Good for lower-cost runs.',
  },
  {
    name: 'Gelato',
    api_available: true,
    framed_posters: true,
    australia_fulfilment: true,
    global_fulfilment: true,
    white_label: true,
    branding: 'Full branded packaging support',
    tracking: true,
    production_time: '1–3 business days',
    shipping_regions: 'Global — 33 countries local production',
    sample_status: 'Not ordered',
    quality_rating: 9,
    cost_rating: 8,
    active: false,
    api_env_var: 'GELATO_API_KEY',
    notes: 'Fastest production. Local print in AUS. Excellent framed poster quality. Strong brand for premium product positioning.',
  },
  {
    name: 'Prodigi',
    api_available: true,
    framed_posters: true,
    australia_fulfilment: false,
    global_fulfilment: true,
    white_label: true,
    branding: 'White label packing slip',
    tracking: true,
    production_time: '1–3 business days',
    shipping_regions: 'UK, US, EU — ships to AUS but no local hub',
    sample_status: 'Not ordered',
    quality_rating: 9,
    cost_rating: 7,
    active: false,
    api_env_var: 'PRODIGI_API_KEY',
    notes: 'Premium fine-art print quality. Used by major galleries. No AUS hub so AUS shipping cost higher. Best for framed fine-art poster positioning.',
  },
  {
    name: 'The Print Space',
    api_available: true,
    framed_posters: true,
    australia_fulfilment: false,
    global_fulfilment: false,
    white_label: true,
    branding: 'Custom packing',
    tracking: true,
    production_time: '2–3 business days',
    shipping_regions: 'UK, EU — ships internationally',
    sample_status: 'Not ordered',
    quality_rating: 10,
    cost_rating: 6,
    active: false,
    api_env_var: 'PRINTSPACE_API_KEY',
    notes: 'Gallery-quality art printing. Based in London. Best quality on the market but expensive international shipping to AUS. Reserve for high-value limited edition prints.',
  },
  {
    name: 'Local AUS Print/Frame Supplier',
    api_available: false,
    framed_posters: true,
    australia_fulfilment: true,
    global_fulfilment: false,
    white_label: true,
    branding: 'Full custom control',
    tracking: false,
    production_time: 'Manual — 3–10 business days',
    shipping_regions: 'Australia only',
    sample_status: 'Not ordered',
    quality_rating: 8,
    cost_rating: 8,
    active: false,
    api_env_var: null,
    notes: 'Manual fulfilment fallback. No API — orders require human action checklist. Best for AUS-only boutique run with personal branding control. Use until API provider approved.',
  },
];

const POSTER_SIZES = [
  { size: 'A4', dimensions: '210 × 297mm', price_aud: 19, print_cost_est: '$4–7', margin_est: '$12–15' },
  { size: 'A3', dimensions: '297 × 420mm', price_aud: 29, print_cost_est: '$7–12', margin_est: '$17–22' },
  { size: 'A2', dimensions: '420 × 594mm', price_aud: 39, print_cost_est: '$12–18', margin_est: '$21–27' },
  { size: 'A1', dimensions: '594 × 841mm', price_aud: 59, print_cost_est: '$18–28', margin_est: '$31–41' },
];

const FRAME_OPTIONS = [
  { style: 'No Frame (Print Only)', material: 'N/A', colours: 'N/A', premium: '+$0', recommended: true },
  { style: 'Classic Black Frame', material: 'Wood', colours: 'Matte Black', premium: '+$25–45', recommended: true },
  { style: 'Natural Oak Frame', material: 'Wood', colours: 'Natural Oak', premium: '+$30–50', recommended: false },
  { style: 'White Frame', material: 'Wood', colours: 'Gloss/Matte White', premium: '+$25–45', recommended: false },
  { style: 'Floating Frame', material: 'Aluminium', colours: 'Black, Silver, Gold', premium: '+$35–60', recommended: false },
];

const TABS = [
  'Providers', 'Poster Products', 'Size Variants', 'Frame Options',
  'Pricing Rules', 'Mockups', 'Sample Orders', 'Order Routing',
  'Tracking', 'Fulfilment Logs', 'Human Action Required',
];

function YN({ val }) {
  return val
    ? <CheckCircle2 className="w-4 h-4 text-green-400 inline" />
    : <XCircle className="w-4 h-4 text-red-400 inline" />;
}

function Stars({ n, max = 10 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`w-1.5 h-3 rounded-sm ${i < n ? 'bg-primary' : 'bg-border/40'}`} />
      ))}
    </div>
  );
}

export default function PrintFulfilment() {
  const [tab, setTab] = useState('Providers');

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Merch Operations</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Print Fulfilment</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Print-on-demand provider research, poster products, order routing, and manual fallback system.</p>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/40 bg-amber-500/5">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm font-semibold text-amber-400">No provider activated — manual fulfilment only</p>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Live fulfilment is locked until Gannon approves a provider and confirms sample quality.
            All poster orders currently route to <strong className="text-foreground">manual_fulfilment_required</strong> state.
            API keys are environment variables only — never exposed in frontend code.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg font-body text-xs transition-all ${tab === t ? 'bg-primary text-primary-foreground' : 'border border-border/40 text-muted-foreground hover:border-primary/40'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── TAB: Providers ── */}
      {tab === 'Providers' && (
        <div className="space-y-4">
          {PROVIDERS.map(p => (
            <Card key={p.name} className={`border-border/40 ${p.active ? 'border-green-500/40' : ''}`}>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm flex items-center gap-3 flex-wrap">
                  <Printer className="w-4 h-4 text-primary" />
                  {p.name}
                  {p.active
                    ? <Badge className="bg-green-500/10 text-green-400 border-green-500/30 border text-[9px]">Active</Badge>
                    : <Badge className="bg-secondary text-muted-foreground text-[9px]">Not Active</Badge>
                  }
                  {!p.active && <Badge className="bg-red-500/10 text-red-400 border-red-500/30 border text-[9px]">Sample Pending</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">API Available</p>
                    <YN val={p.api_available} />
                    {p.api_env_var && <p className="font-mono text-[10px] text-muted-foreground mt-1">{p.api_env_var}</p>}
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Framed Posters</p>
                    <YN val={p.framed_posters} />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">AUS Fulfilment</p>
                    <YN val={p.australia_fulfilment} />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">White Label</p>
                    <YN val={p.white_label} />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Tracking</p>
                    <YN val={p.tracking} />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Production Time</p>
                    <p className="text-foreground">{p.production_time}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Quality</p>
                    <Stars n={p.quality_rating} />
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Cost (lower = cheaper)</p>
                    <Stars n={p.cost_rating} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/70">{p.notes}</p>
                <p className="text-xs text-muted-foreground mt-1">Shipping: {p.shipping_regions}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── TAB: Poster Products ── */}
      {tab === 'Poster Products' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/5">
            <p className="font-body text-sm font-semibold text-amber-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Human Action Required</p>
            <p className="font-body text-xs text-muted-foreground mt-1">
              The Respect Is Earned Lyric Wall Poster needs real poster-specific artwork images uploaded before it can be presented as fully sale-ready.
              Currently the fallback is the hoodie image which is not correct for a poster listing.
            </p>
            <p className="font-body text-xs text-amber-400 mt-2 font-semibold">Action: Upload poster artwork mockup at /admin/merch → Poster product → Change Images.</p>
          </div>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg bg-secondary/60 border border-border/40 flex items-center justify-center shrink-0">
                  <Image className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">Respect Is Earned — Lyric Wall Poster</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">Sizes: A4, A3, A2, A1 · Price: $19–$59 AUD · Print-on-demand (manual until provider approved)</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px]">Images Required</Badge>
                    <Badge className="bg-green-500/10 text-green-400 border border-green-500/30 text-[9px]">Pricing Set</Badge>
                    <Badge className="bg-secondary text-muted-foreground text-[9px]">Provider Not Assigned</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB: Size Variants ── */}
      {tab === 'Size Variants' && (
        <Card>
          <CardContent className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-2 pr-4 text-muted-foreground font-body">Size</th>
                    <th className="text-left py-2 pr-4 text-muted-foreground font-body">Dimensions</th>
                    <th className="text-left py-2 pr-4 text-muted-foreground font-body">Sale Price (AUD)</th>
                    <th className="text-left py-2 pr-4 text-muted-foreground font-body">Est. Print Cost</th>
                    <th className="text-left py-2 text-muted-foreground font-body">Est. Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {POSTER_SIZES.map(s => (
                    <tr key={s.size} className="border-b border-border/20 last:border-0">
                      <td className="py-2.5 pr-4 font-semibold text-foreground">{s.size}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{s.dimensions}</td>
                      <td className="py-2.5 pr-4 text-primary font-bold">${s.price_aud}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{s.print_cost_est}</td>
                      <td className="py-2.5 text-green-400">{s.margin_est}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB: Frame Options ── */}
      {tab === 'Frame Options' && (
        <div className="space-y-3">
          {FRAME_OPTIONS.map(f => (
            <Card key={f.style} className={f.recommended ? 'border-primary/30' : 'border-border/40'}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{f.style}</p>
                    <p className="font-body text-xs text-muted-foreground">{f.material} · {f.colours}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-primary font-bold">{f.premium}</span>
                    {f.recommended && <Badge className="bg-primary/10 text-primary border border-primary/30 text-[9px]">Recommended</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── TAB: Pricing Rules ── */}
      {tab === 'Pricing Rules' && (
        <Card>
          <CardContent className="p-5 space-y-3 text-sm">
            <p className="text-foreground font-semibold">Active Pricing Rules</p>
            {[
              'A4 poster: $19 AUD — no discount eligible',
              'A3 poster: $29 AUD — no discount eligible',
              'A2 poster: $39 AUD — no discount eligible',
              'A1 poster: $59 AUD — no discount eligible',
              'Framed variants: poster price + frame premium',
              'Poster category excluded from promo codes (same rule as CD/music)',
              'Bundle discount does NOT apply to print-on-demand posters',
              'Size selector at checkout must correctly update price sent to Stripe',
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground border-b border-border/20 pb-2 last:border-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                {r}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── TAB: Mockups ── */}
      {tab === 'Mockups' && (
        <div className="p-8 rounded-xl border border-dashed border-border/40 text-center text-muted-foreground">
          <Image className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-body text-sm">No mockup images uploaded yet.</p>
          <p className="font-body text-xs mt-1">Upload poster mockups via /admin/quick-upload then link here.</p>
        </div>
      )}

      {/* ── TAB: Sample Orders ── */}
      {tab === 'Sample Orders' && (
        <Card>
          <CardContent className="p-5">
            <p className="font-body text-sm font-semibold text-foreground mb-3">Sample Order Status</p>
            <div className="space-y-2">
              {PROVIDERS.map(p => (
                <div key={p.name} className="flex items-center justify-between gap-3 py-2 border-b border-border/20 last:border-0 text-xs">
                  <span className="text-foreground">{p.name}</span>
                  <Badge className="bg-secondary text-muted-foreground text-[9px]">{p.sample_status}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/30">
              <p className="font-body text-xs text-amber-400 font-semibold">Action Required (Gannon)</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Order sample prints from Printful and Gelato before activating live fulfilment. Approve quality before connecting API.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB: Order Routing ── */}
      {tab === 'Order Routing' && (
        <div className="space-y-4">
          <Card className="border-primary/30">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Current Routing Logic</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 text-xs space-y-2">
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/30">
                <p className="text-red-400 font-semibold">If provider API not connected (current state):</p>
                <p className="text-muted-foreground mt-1">→ Order status set to <code className="bg-secondary px-1 rounded">manual_fulfilment_required</code></p>
                <p className="text-muted-foreground">→ Admin sees human checklist in /admin/orders</p>
                <p className="text-muted-foreground">→ Admin enters tracking manually</p>
                <p className="text-muted-foreground">→ Customer notified via existing fulfilOrderAndNotify function</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/30">
                <p className="text-green-400 font-semibold">If provider API connected (future state):</p>
                <p className="text-muted-foreground mt-1">→ PrintFulfilmentOrder created after successful Stripe payment</p>
                <p className="text-muted-foreground">→ Provider order ID stored on MerchOrder</p>
                <p className="text-muted-foreground">→ Fulfilment status tracked automatically</p>
                <p className="text-muted-foreground">→ Tracking number pushed to customer email</p>
              </div>
              <p className="text-muted-foreground/60 pt-1">Live fulfilment locked until Gannon approves provider after sample review.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB: Tracking ── */}
      {tab === 'Tracking' && (
        <Card>
          <CardContent className="p-5 text-xs text-muted-foreground">
            <p className="text-foreground font-semibold mb-2">Tracking System</p>
            <p>Manual tracking entry via /admin/orders → Order → Fulfilment Panel.</p>
            <p className="mt-2">When API provider is connected, tracking will be auto-pushed from provider webhook → MerchOrder.tracking_number → customer notification email.</p>
            <p className="mt-2">Supported carriers for manual entry: Australia Post, Sendle, DHL, FedEx, UPS.</p>
          </CardContent>
        </Card>
      )}

      {/* ── TAB: Fulfilment Logs ── */}
      {tab === 'Fulfilment Logs' && (
        <div className="p-8 rounded-xl border border-dashed border-border/40 text-center text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-body text-sm">No fulfilment logs yet.</p>
          <p className="font-body text-xs mt-1">Logs will appear here once poster orders are placed and fulfilled.</p>
        </div>
      )}

      {/* ── TAB: Human Action Required ── */}
      {tab === 'Human Action Required' && (
        <div className="space-y-3">
          {[
            {
              priority: 'critical',
              action: 'Upload poster-specific artwork/mockup images for Respect Is Earned Lyric Wall Poster',
              detail: 'Current product listing falls back to emoji. Cannot sell publicly without proper poster artwork. Go to /admin/merch → Poster → Change Images.',
              link: '/admin/merch',
            },
            {
              priority: 'high',
              action: 'Order sample prints from Printful and Gelato',
              detail: 'Order A3 framed and unframed samples before activating live fulfilment. Check colour accuracy, paper quality, and frame fit on real prints.',
              link: null,
            },
            {
              priority: 'high',
              action: 'Approve print provider after sample review',
              detail: 'Once samples arrive, decide on primary provider (Gelato recommended for AUS speed, Printful recommended for branding control). Return here and mark provider active.',
              link: null,
            },
            {
              priority: 'medium',
              action: 'Set API key for chosen provider once approved',
              detail: 'API key must be added as environment variable only (e.g. PRINTFUL_API_KEY). Never enter in frontend code or chat. Add via Base44 dashboard → Secrets.',
              link: null,
            },
            {
              priority: 'medium',
              action: 'Confirm framed vs unframed poster offering',
              detail: 'Decide whether to offer framed posters at launch or unframed only. Framed adds premium but increases fulfilment complexity.',
              link: null,
            },
            {
              priority: 'low',
              action: 'Create DV awareness poster variant',
              detail: 'Consider a special edition poster supporting 1800RESPECT with 100% proceeds donated. This would require separate SKU and checkout routing.',
              link: null,
            },
          ].map((a, i) => (
            <div key={i} className={`p-4 rounded-xl border ${a.priority === 'critical' ? 'border-red-500/40 bg-red-500/5' : a.priority === 'high' ? 'border-primary/40 bg-primary/5' : a.priority === 'medium' ? 'border-blue-500/30 bg-blue-500/5' : 'border-border/40'}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className={`text-[9px] border-0 ${a.priority === 'critical' ? 'bg-red-500/20 text-red-400' : a.priority === 'high' ? 'bg-primary/20 text-primary' : a.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' : 'bg-secondary text-muted-foreground'}`}>
                      {a.priority}
                    </Badge>
                    <p className="font-body text-sm font-semibold text-foreground">{a.action}</p>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{a.detail}</p>
                </div>
                {a.link && (
                  <a href={a.link}>
                    <Button size="sm" variant="outline" className="h-7 text-xs shrink-0">Go →</Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}