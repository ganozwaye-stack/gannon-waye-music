import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Shield,
  Tag, ExternalLink, Lock, Globe, Copy
} from 'lucide-react';

// ============================================================
// SECTION 1 — PROMO DISCOUNT COMPLIANCE REPORT
// ============================================================

const APPROVED_CODES = [
  {
    code: 'fnd@gwTYV!P',
    discount: '20%',
    applies_to: 'Eligible merch subtotal only',
    stripe_action: 'Create Stripe Coupon → 20% off → add applies_to with merch-only Product IDs',
    status: 'active',
  },
  {
    code: 'F@mFr!3NdsOFg@noz',
    discount: '30%',
    applies_to: 'Eligible merch subtotal only',
    stripe_action: 'Create Stripe Coupon → 30% off → add applies_to with merch-only Product IDs',
    status: 'active',
  },
];

const EXCLUDED_CATEGORIES = [
  'CDs', 'Vinyl', 'Songs / Digital Music', 'Limited Edition Music Releases',
  'Shipping / Postage / Handling', 'Support Contributions', 'Donations / Tips',
  'Processing Fees / Stripe Fees', 'Music Bundles (unless explicitly approved)',
  'Taxes',
];

const ELIGIBLE_CATEGORIES = [
  'T-Shirts', 'Hoodies / Jumpers', 'Tote Bags (when active)',
  'Coffee Mugs (after approval)', 'Approved Merch-Only Bundles',
];

const TEST_CASES = [
  { cart: 'Merch-only cart', fnd: '✅ 20% applies', fam: '✅ 30% applies' },
  { cart: 'CD-only cart', fnd: '❌ No discount (excluded)', fam: '❌ No discount (excluded)' },
  { cart: 'Vinyl-only cart', fnd: '❌ No discount (excluded)', fam: '❌ No discount (excluded)' },
  { cart: 'Digital music-only', fnd: '❌ No discount (excluded)', fam: '❌ No discount (excluded)' },
  { cart: 'Mixed merch + CD', fnd: '✅ Merch only discounted', fam: '✅ Merch only discounted' },
  { cart: 'Mixed merch + vinyl', fnd: '✅ Merch only discounted', fam: '✅ Merch only discounted' },
  { cart: 'Mixed merch + shipping', fnd: '✅ Merch only (shipping excluded)', fam: '✅ Merch only (shipping excluded)' },
  { cart: 'Mixed merch + support', fnd: '✅ Merch only (support excluded)', fam: '✅ Merch only (support excluded)' },
  { cart: 'Merch-only bundle', fnd: '✅ 20% applies', fam: '✅ 30% applies' },
  { cart: 'Bundle with music', fnd: '⚠️ Only merch items discounted', fam: '⚠️ Only merch items discounted' },
  { cart: 'Coffee mug (approved)', fnd: '✅ 20% applies when listed', fam: '✅ 30% applies when listed' },
  { cart: 'Invalid / old code', fnd: 'N/A', fam: 'N/A — Stripe rejects it' },
];

const FINAL_STATUS = [
  { label: 'allow_promotion_codes enabled', status: 'yes', note: 'Set in createCheckoutSession' },
  { label: 'Stripe coupons created/verified', status: 'action_required', note: 'Must create in Stripe Dashboard manually' },
  { label: 'Stripe applies_to product restrictions set', status: 'action_required', note: 'Must set applies_to on each coupon in Stripe Dashboard' },
  { label: 'Only two active codes', status: 'action_required', note: 'Archive all others in Stripe Dashboard' },
  { label: 'Old codes disabled', status: 'action_required', note: 'Archive old promotion codes in Stripe → Products → Coupons' },
  { label: 'Email captured from Stripe', status: 'yes', note: 'stripeWebhook now reads customer_details.email' },
  { label: 'Order email saved', status: 'yes', note: 'Saved to MerchOrder.customer_email on checkout.session.completed' },
  { label: 'Order flagged if email missing', status: 'yes', note: 'status = needs_admin_review + AdminNotification raised' },
  { label: 'Discount data saved to order', status: 'yes', note: 'Coupon ID, promo code ID, discount amount captured in notes/promo_code field' },
  { label: 'Discount breakdown limited by Stripe data', status: 'info', note: 'Item-level breakdown requires line_items expand — marked LIMITED_BY_STRIPE_DATA if unavailable' },
  { label: 'Profit/loss uses final paid amount', status: 'yes', note: 'total_amount = session.amount_total / 100 (post-discount)' },
  { label: 'All promo tests passed', status: 'pending', note: 'Must manually test in Stripe after creating coupons with applies_to' },
];

const BLOCKERS = [
  {
    blocker: 'Stripe Coupon for fnd@gwTYV!P not yet created',
    action: 'Go to Stripe Dashboard → Products → Coupons → Create coupon → 20% → set applies_to to merch Product IDs → create Promotion Code = fnd@gwTYV!P',
  },
  {
    blocker: 'Stripe Coupon for F@mFr!3NdsOFg@noz not yet created',
    action: 'Same as above, 30% off, applies_to merch only → create Promotion Code = F@mFr!3NdsOFg@noz',
  },
  {
    blocker: 'Merch products may not have Stripe Product IDs linked',
    action: 'In Stripe Dashboard → Products → create a Product for each merch item → copy the prod_xxx ID → use in coupon applies_to',
  },
  {
    blocker: 'Old/test codes may still be active in Stripe',
    action: 'Stripe → Products → Coupons → archive any coupon not matching the two approved codes above',
  },
  {
    blocker: 'Item-level discount breakdown LIMITED when single line_item used',
    action: 'Current checkout uses one merged line_item. To get item-level data, refactor to pass each product/shipping/support as separate line_items. Low priority — aggregate discount amount IS captured.',
  },
];

// ============================================================
// SECTION 2 — NORTON SECURITY TRUST GUIDE
// ============================================================

const TRUSTED_DOMAINS = [
  { domain: 'gannonwaye.com', type: 'Production', safe: true },
  { domain: 'base44.com', type: 'Platform', safe: true },
  { domain: 'app.base44.com', type: 'Platform', safe: true },
  { domain: 'chatgpt.com', type: 'Dev Tool', safe: true },
  { domain: 'openai.com', type: 'Dev Tool', safe: true },
  { domain: 'github.com', type: 'Dev Tool', safe: true },
  { domain: 'githubusercontent.com', type: 'Dev Tool', safe: true },
  { domain: 'cursor.sh', type: 'Dev Tool', safe: true },
  { domain: 'warp.dev', type: 'Dev Tool', safe: true },
  { domain: 'replit.com', type: 'Dev Tool', safe: true },
];

const NORTON_CHECKLIST = [
  { item: 'HTTPS confirmed on gannonwaye.com', done: true },
  { item: 'No secrets/API keys exposed in public code', done: true },
  { item: 'STRIPE_SECRET_KEY never returned to frontend', done: true },
  { item: 'Stripe webhook validates signature before processing', done: true },
  { item: 'No unauthenticated admin functions callable by public', done: false, note: 'Review backend functions — confirm admin-only functions check user.role === "admin"' },
  { item: 'No unsafe redirects to untrusted external domains', done: true },
  { item: 'No mixed HTTP/HTTPS content on HTTPS pages', done: true },
  { item: 'No client-side secret exposure in React code', done: true },
  { item: 'TikTok OAuth handled via secure backend function', done: true },
  { item: 'No malware / suspicious downloads hosted', done: true },
  { item: 'Production domain used for real transactions (not preview URL)', done: true, note: 'Always use gannonwaye.com for real orders. Never give preview URLs to customers.' },
  { item: 'Preview/staging URLs never whitelisted permanently', done: true, note: 'Base44 preview URLs are temporary. Do not permanently trust random *.base44.app URLs.' },
  { item: 'gannonwaye.com submitted to Norton Safe Web for re-evaluation', done: false, note: 'Action required — see link below' },
];

const NORTON_LIKELY_CAUSES = [
  { cause: 'Base44 preview URLs flagged as suspicious', type: 'False Positive', fix: 'Use gannonwaye.com for testing and sharing. Ignore preview URL blocks — they are temporary generated domains.' },
  { cause: 'chatgpt.com / openai.com blocked', type: 'False Positive', fix: 'These are legitimate domains. Add to Norton exclusions in the browser extension settings.' },
  { cause: 'github.com / githubusercontent.com blocked', type: 'False Positive', fix: 'Legitimate code hosting. Add to Norton exclusions if blocked during development.' },
  { cause: 'Warp / Cursor / Replit blocked', type: 'False Positive', fix: 'Developer tools with legitimate domains. Add to Norton browser exclusions.' },
  { cause: 'New domain (gannonwaye.com) with low reputation score', type: 'Reputation', fix: 'Submit gannonwaye.com to Norton Safe Web for re-evaluation. Add HTTPS + real content = reputation improvement over time.' },
  { cause: 'Backend function URLs flagged', type: 'Possible False Positive', fix: 'api.base44.app/... URLs are platform infrastructure. Do not permanently whitelist. Use only from backend.' },
];

export default function PromoDiscountCompliance() {
  const [tab, setTab] = useState('promo');
  const [copied, setCopied] = useState('');

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const statusBadge = (status) => {
    if (status === 'yes') return <Badge className="bg-green-500/20 text-green-300">✅ Done</Badge>;
    if (status === 'action_required') return <Badge className="bg-red-500/20 text-red-300">⚠️ Action Required</Badge>;
    if (status === 'pending') return <Badge className="bg-yellow-500/20 text-yellow-300">⏳ Pending Test</Badge>;
    if (status === 'info') return <Badge className="bg-blue-500/20 text-blue-300">ℹ️ Info</Badge>;
    return <Badge className="bg-gray-500/20 text-gray-300">{status}</Badge>;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Promo &amp; Security Compliance</h1>
          <p className="text-muted-foreground text-sm mt-1">Discount guard report · Norton trust guide · Action items</p>
        </div>
      </div>

      {/* CRITICAL BANNER */}
      <div className="border border-red-500/40 bg-red-500/10 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-300">Action Required: Stripe Coupon Setup Incomplete</p>
          <p className="text-sm text-foreground/70 mt-1">
            Promo codes now go through Stripe natively — but the Stripe Coupons must be created manually with <code className="font-mono text-xs bg-secondary/50 px-1 rounded">applies_to</code> product restrictions. Until this is done, promo codes are NOT restricted to merch only.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'promo', label: '🏷️ Promo Compliance' },
          { id: 'tests', label: '🧪 Test Cases' },
          { id: 'final', label: '📋 Final Status Report' },
          { id: 'norton', label: '🛡️ Norton Trust Guide' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all border ${tab === t.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== PROMO COMPLIANCE TAB ===== */}
      {tab === 'promo' && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Tag className="w-4 h-4 text-primary" />Approved Active Codes (2 only)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {APPROVED_CODES.map(c => (
                <div key={c.code} className="border border-border rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm text-primary bg-primary/10 px-2 py-1 rounded">{c.code}</code>
                      <Badge className="bg-green-500/20 text-green-300">{c.discount}</Badge>
                    </div>
                    <button onClick={() => copyText(c.code, c.code)}>
                      <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.applies_to}</p>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                    <p className="text-xs text-yellow-300 font-semibold">Stripe Action Required</p>
                    <p className="text-xs text-foreground/70 mt-1">{c.stripe_action}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" />Eligible for Discount</CardTitle></CardHeader>
              <CardContent className="space-y-1.5">
                {ELIGIBLE_CATEGORIES.map(c => (
                  <div key={c} className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />{c}</div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" />NEVER Discountable</CardTitle></CardHeader>
              <CardContent className="space-y-1.5">
                {EXCLUDED_CATEGORIES.map(c => (
                  <div key={c} className="flex items-center gap-2 text-sm"><XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />{c}</div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-yellow-500/30">
            <CardHeader><CardTitle className="text-sm text-yellow-300">How to Set Stripe Coupon applies_to Restrictions</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-foreground/80">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">Stripe Dashboard → Products <ExternalLink className="w-3 h-3" /></a></li>
                <li>Create a Stripe Product for each merch item (t-shirt, hoodie, tote, mug, etc.)</li>
                <li>Copy the <code className="font-mono text-xs bg-secondary/50 px-1 rounded">prod_xxx</code> ID for each</li>
                <li>Go to <a href="https://dashboard.stripe.com/coupons" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">Stripe → Coupons <ExternalLink className="w-3 h-3" /></a> → Create coupon</li>
                <li>Set discount (20% or 30%), then under <strong>Applies to</strong> → select your merch Product IDs only</li>
                <li>Save, then go to <a href="https://dashboard.stripe.com/promotion_codes" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">Promotion Codes <ExternalLink className="w-3 h-3" /></a> → Create a promotion code → link to this coupon → enter the exact code string</li>
                <li>Archive all other active coupons/promotion codes not matching the two approved codes</li>
              </ol>
              <div className="bg-secondary/40 rounded p-3 text-xs text-muted-foreground">
                <strong>Note:</strong> Stripe's <code className="font-mono">applies_to</code> uses Product IDs (not price IDs or category strings). The product restrictions are enforced server-side by Stripe — they cannot be bypassed by the customer.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Remaining Blockers</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {BLOCKERS.map((b, i) => (
                <div key={i} className="border border-border rounded-xl p-3 space-y-1">
                  <p className="text-sm font-medium text-red-300">{b.blocker}</p>
                  <p className="text-xs text-foreground/70">👉 {b.action}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== TEST CASES TAB ===== */}
      {tab === 'tests' && (
        <div className="space-y-4">
          <div className="border border-blue-500/30 bg-blue-500/10 rounded-xl p-4 text-sm text-blue-200">
            <p className="font-semibold mb-1">Before testing: complete Stripe Coupon setup with applies_to</p>
            <p className="text-xs text-foreground/70">These expected results assume Stripe Coupons are correctly restricted to merch Product IDs. Test in Stripe test mode first, then repeat in live mode.</p>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Cart Test Matrix</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Cart Type</th>
                      <th className="text-left py-2 pr-4 text-muted-foreground font-medium">fnd@gwTYV!P (20%)</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">F@mFr!3NdsOFg@noz (30%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEST_CASES.map((t, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td className="py-2 pr-4 font-medium">{t.cart}</td>
                        <td className="py-2 pr-4 text-xs">{t.fnd}</td>
                        <td className="py-2 text-xs">{t.fam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== FINAL STATUS REPORT TAB ===== */}
      {tab === 'final' && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Final Status Report</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {FINAL_STATUS.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm">{item.label}</p>
                    {item.note && <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>}
                  </div>
                  <div className="shrink-0">{statusBadge(item.status)}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/30">
            <CardHeader><CardTitle className="text-sm text-primary">Exact Next Action for Gannon</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                '1. Open Stripe Dashboard → Products → create a Product for each merch item (t-shirt, hoodie, mug, etc). Copy prod_xxx IDs.',
                '2. Stripe → Coupons → Create coupon: 20% off, name it "fnd20" → Applies To → add all merch prod_xxx IDs → Save.',
                '3. Stripe → Promotion Codes → Create → select "fnd20" coupon → set code = fnd@gwTYV!P → Active.',
                '4. Repeat for 30% coupon "fam30" → Promotion Code = F@mFr!3NdsOFg@noz.',
                '5. Archive all other coupons and promotion codes in Stripe.',
                '6. Test: add a t-shirt to cart → apply fnd@gwTYV!P on Stripe page → verify 20% applied to merch subtotal only.',
                '7. Test: add a CD → apply code → verify 0% discount (Stripe rejects it for that product).',
                '8. Submit gannonwaye.com to Norton Safe Web: https://safeweb.norton.com → "Submit a site".',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  <p className="text-foreground/80">{step.replace(/^\d+\. /, '')}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== NORTON TRUST GUIDE TAB ===== */}
      {tab === 'norton' && (
        <div className="space-y-4">
          <Card className="border-green-500/30">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Globe className="w-4 h-4 text-green-400" />Trusted Development Domains</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {TRUSTED_DOMAINS.map(d => (
                  <div key={d.domain} className="flex items-center justify-between border border-border/50 rounded-lg px-3 py-2">
                    <div>
                      <p className="font-mono text-sm">{d.domain}</p>
                      <p className="text-xs text-muted-foreground">{d.type}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded p-3 text-xs text-yellow-200">
                ⚠️ <strong>Do NOT permanently whitelist random generated preview URLs</strong> (e.g. *.base44.app random subdomains). Use <strong>gannonwaye.com</strong> for production testing and sharing with customers.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400" />Likely Causes of Norton Blocks</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {NORTON_LIKELY_CAUSES.map((c, i) => (
                <div key={i} className="border border-border rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{c.cause}</p>
                    <Badge className={c.type === 'False Positive' ? 'bg-blue-500/20 text-blue-300' : 'bg-yellow-500/20 text-yellow-300'}>{c.type}</Badge>
                  </div>
                  <p className="text-xs text-foreground/70">👉 {c.fix}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-primary" />Norton Safe Web Re-Evaluation Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {NORTON_CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5 border-b border-border/30 last:border-0">
                  {item.done
                    ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    : <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-sm">{item.item}</p>
                    {item.note && <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>}
                  </div>
                </div>
              ))}
              <div className="mt-4 border border-primary/30 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-primary flex items-center gap-2"><Lock className="w-4 h-4" />Submit gannonwaye.com to Norton Safe Web</p>
                <p className="text-xs text-foreground/70">If gannonwaye.com is still flagged after verifying the checklist above, submit it directly:</p>
                <a href="https://safeweb.norton.com" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="gap-2 mt-1">
                    <ExternalLink className="w-3 h-3" /> Open Norton Safe Web
                  </Button>
                </a>
                <ol className="text-xs text-foreground/70 list-decimal list-inside space-y-1 mt-2">
                  <li>Go to safeweb.norton.com</li>
                  <li>Enter "gannonwaye.com" in the search box</li>
                  <li>If flagged, click "Submit a dispute" or "Request a review"</li>
                  <li>Provide site description: "Independent Australian musician's official website with store and community"</li>
                  <li>Norton typically reviews within 3–7 business days</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">How to Add Norton Browser Exclusions</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-foreground/80">
              <p className="text-xs text-muted-foreground">For development tools that are false positives (chatgpt.com, github.com, etc.):</p>
              <ol className="text-xs list-decimal list-inside space-y-1.5">
                <li>Open Norton 360 → Settings → Firewall or Web Protection</li>
                <li>Find "Intrusion Prevention" or "Web Browser Protection"</li>
                <li>Add site exclusions for the domains you trust (chatgpt.com, github.com, base44.com, etc.)</li>
                <li>Alternatively: Norton browser extension → click extension icon → "Exclude this site" when on a blocked page</li>
                <li>Do NOT add random preview URLs as permanent exclusions</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}