import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Copy, Download, ExternalLink, ArrowLeft, AlertTriangle, CheckCircle2, Terminal } from 'lucide-react';

const HANDOFF_PACKS = [
  {
    id: 'cursor',
    label: 'Cursor Handoff',
    filename: 'cursor-handoff.md',
    content: `# Cursor Task Pack — Gannon Waye Music OS
# WITH AGENT SAFETY CHECKLIST

## PROJECT CONTEXT
Base44 React app (NOT Next.js). Backend = Deno edge functions.
gannonwaye.com — Artist website + merch store + business intelligence OS.

## AGENT SAFETY CHECKLIST — READ BEFORE STARTING
[ ] Do NOT print any secret values (STRIPE_*, TIKTOK_*, METRICOOL_*)
[ ] Do NOT paste secret values into this chat
[ ] Do NOT expose .env files — reference by variable name only
[ ] Do NOT run destructive terminal commands without Gannon approval
[ ] Do NOT install unreviewed packages — run npm audit before installing
[ ] Do NOT fetch suspicious URLs from agent output
[ ] Do NOT bypass approval gates — all proposals require Gannon sign-off
[ ] Do NOT make coaching public (COACHING_PUBLIC_LAUNCH_ENABLED = false)
[ ] Do NOT modify Stripe/TikTok/Metricool secrets
[ ] Do NOT commit secrets to GitHub
[ ] ALWAYS work on a git branch — never commit to main directly
[ ] ALWAYS read the full file before editing it
[ ] ALWAYS use find_replace for edits — never full file rewrites unless new file

## SAGE / SECURITY LAYER
Sage by Gen Digital is recommended for this environment.
Current status: NOT YET INSTALLED in Cursor (no native Cursor plugin API exists as of 2026-05-27).
Mitigation: Follow manual safety checklist above. Never paste secrets into chat.

## FILES TO INSPECT FIRST
- App.jsx (route map)
- components/admin/AdminLayout.jsx (navigation)
- pages/admin/Dashboard.jsx (main admin page)
- functions/stripeWebhook.js (payment processing)
- functions/tiktokOAuth.js (TikTok integration)
- entities/*.json (data models)

## SAFETY RULES
1. DO NOT change COACHING_PUBLIC_LAUNCH_ENABLED from false
2. DO NOT modify Stripe checkout flow without testing
3. DO NOT expose any secrets in frontend
4. DO NOT break /store, /tiktok-callback, or admin auth
5. Always use find_replace for existing files
6. Only use write_file for new files or entity JSON

## REQUIRED OUTCOMES
- All admin routes open without console errors
- All cards are clickable
- All tabs switch correctly
- All modals are scrollable
- TikTok OAuth routes are functional
- Coaching is private

## REPORT FORMAT
List each file changed, what changed, and why.
Flag any breaking changes.
Confirm coaching remains private.
Confirm Stripe checkout is untouched.
Confirm no secrets appeared in output.`,
  },
  {
    id: 'replit',
    label: 'Replit Handoff',
    filename: 'replit-handoff.md',
    content: `# Replit Handoff — Gannon Waye Music OS
# WITH AGENT SAFETY CHECKLIST

## ⚠️ CRITICAL SECURITY WARNING ⚠️
Replit is for TESTING/SANDBOXING ONLY.
NEVER store production secrets (STRIPE_SECRET_KEY, TIKTOK_CLIENT_SECRET) in Replit.
NEVER deploy production code from Replit.
ALWAYS use read-only forks — never the production Base44 project.

## SAGE / SECURITY LAYER
Sage by Gen Digital is NOT supported in Replit (no plugin interface).
Mitigation: Use Replit's own secrets panel. Never hardcode secrets. Use test keys only.

## AGENT SAFETY CHECKLIST — READ BEFORE STARTING
[ ] Using test Stripe keys only (sk_test_..., pk_test_...)
[ ] NOT using production TIKTOK_CLIENT_SECRET
[ ] NOT using production STRIPE_SECRET_KEY
[ ] Replit Secrets panel used (not hardcoded)
[ ] Working on a fork — not the live project
[ ] No session cookies stored in Replit files
[ ] No ADMIN_SESSION_COOKIE in any Replit file
[ ] npm audit run before installing any packages

## SECRET RULES FOR REPLIT
- Use only test/sandbox keys in Replit
- Store keys in Replit Secrets panel, never in code
- Never include real customer data in test datasets
- If a production key accidentally enters Replit — rotate immediately

## ALLOWED USES
- Prototyping new UI components
- Testing isolated backend function logic with test data
- Running Playwright tests against test/staging environments

## FORBIDDEN USES
- Running production Stripe webhooks
- Storing real customer emails or orders
- Testing TikTok OAuth with production client secret
- Deploying any output directly to gannonwaye.com`,
  },
  {
    id: 'warp',
    label: 'Warp Handoff',
    filename: 'warp-handoff.md',
    content: `# Warp Handoff — Gannon Waye Music OS
# WITH AGENT SAFETY CHECKLIST

## SAGE / SECURITY LAYER
Warp terminal does NOT confirm native Sage support (as of 2026-05-27).
Use Sage with Cursor / Claude Code / OpenClaw where available.
In Warp: use Warp's own data controls, command review, GitHub branches, and Playwright test isolation.

## WARP SAFETY CONFIGURATION
1. Enable "Block outgoing requests to suspicious domains" in Warp settings
2. Use Warp's command history audit to review what agents have run
3. Never allow Warp AI to run commands without reviewing them first
4. Always use a dedicated git branch — never run Warp agent on main

## AGENT SAFETY CHECKLIST — READ BEFORE STARTING
[ ] Warp data controls enabled
[ ] Working on a git branch (not main)
[ ] No secret values in Warp command history visible to AI
[ ] Shell history reviewed — no accidental echo $STRIPE_SECRET_KEY
[ ] npm audit run before any package installs
[ ] No destructive commands (rm -rf, drop, delete) without Gannon approval
[ ] Playwright tests run in isolation (separate environment)

## SAFE TERMINAL COMMAND RULES
ALLOWED:
- git status, git diff, git branch, git checkout
- npm install (reviewed packages only), npm audit
- npx playwright test (in test environment only)
- cat, ls, grep (for inspection — no file deletion)
- Base44 CLI commands per official docs

REQUIRES APPROVAL:
- rm, rmdir, mv (renaming/deletion)
- npm run build (confirm target environment)
- Any command that modifies /functions/ in production
- Any command that touches .env files

FORBIDDEN:
- echo $STRIPE_SECRET_KEY or similar (prints secrets)
- curl with secret headers (logs in history)
- Any force-push to main
- Any command that deploys to production without branch review

## BASE44 SECRET HANDLING
- Secrets are set via Base44 dashboard — NEVER via terminal
- Never set Deno.env values manually via shell
- Never inspect /tmp files from functions that may contain token data`,
  },
  {
    id: 'playwright_safety',
    label: 'Playwright Safety Pack',
    filename: 'playwright-safety-pack.md',
    content: `# Playwright Safety Pack — Gannon Waye Music OS

## AGENT SAFETY CHECKLIST FOR PLAYWRIGHT

### Session Cookie Safety
[ ] ADMIN_SESSION_COOKIE stored in .env.local only
[ ] .env.local is in .gitignore — confirm before first commit
[ ] ADMIN_SESSION_COOKIE is NEVER in playwright.config.ts directly
[ ] ADMIN_SESSION_COOKIE is NEVER in test files as a hardcoded string
[ ] If session cookie appears in any log — treat as compromised and rotate

### GitHub Actions Safety
[ ] ADMIN_SESSION_COOKIE stored in GitHub Repository Secrets (not in workflow YAML)
[ ] GitHub secret scanning enabled on repository
[ ] No secret values in workflow file comments or echo statements

### Test Isolation Rules
[ ] Tests run against gannonwaye.com ONLY (not staging unless explicitly configured)
[ ] STRIPE_MODE must be set to 'test' OR 'live' — never mixed
[ ] In LIVE mode: NEVER auto-submit payment — only inspect up to Stripe redirect
[ ] Coaching lock tests MUST pass before any deployment

### Data Safety
[ ] Test does not create real orders unless explicitly approved by Gannon
[ ] Test does not send real emails unless explicitly approved
[ ] Test screenshots do not capture admin session cookie values
[ ] Test report (html/json) does not include session cookie in URL parameters

### Cookie Rotation Trigger
Rotate ADMIN_SESSION_COOKIE immediately if:
- It appears in a screenshot, report, or log file
- It appears in a GitHub Actions log
- The test machine is compromised or shared
- You are unsure if it was shared externally

## SAFE SETUP
npm install -D @playwright/test
npx playwright install chromium

## .env.local (never commit this file)
ADMIN_SESSION_COOKIE=<your_value_here>
STRIPE_MODE=test

## .gitignore additions
.env.local
playwright-report/
test-results/
*.cookie`,
  },
  {
    id: 'security_hardening',
    label: 'Security Hardening Pack',
    filename: 'security-hardening-pack.md',
    content: `# Security Hardening Pack — Gannon Waye Music OS
# For external engineering agents

## CONFIRMED SECRETS (DO NOT EXPOSE)
- STRIPE_PUBLISHABLE_KEY ⚠ public key — safe to share name, not value
- STRIPE_SECRET_KEY 🔴 NEVER share
- STRIPE_WEBHOOK_SECRET 🔴 ROTATE REQUIRED (may have been exposed 26 May 2026)
- TIKTOK_CLIENT_KEY ⚠ share name only
- TIKTOK_CLIENT_SECRET 🔴 NEVER share — ROTATE recommended
- METRICOOL_API_TOKEN 🔴 NEVER share
- METRICOOL_USER_ID ⚠ share name only
- METRICOOL_BLOG_ID ⚠ share name only
- GOOGLE_SHEET_ID ⚠ share name only

## CRITICAL RULES
1. STRIPE_WEBHOOK_SECRET — must be rotated (was potentially exposed in prior AI session output)
2. TIKTOK_CLIENT_SECRET — must be rotated
3. NEVER run sk_live_ or sk_test_ Stripe key validation in client code
4. NEVER log request bodies that contain Stripe webhook payload without signature check first

## BACKEND FUNCTION AUTH STATUS
31 backend functions identified — not all have user authentication.
Functions that should have auth but may not:
- Any function called from frontend without user session check
- Any scheduled/automation function that could be triggered publicly
Recommendation: audit functions/validatePromoCode, functions/getStripeConfig,
functions/calculateShippingRate for proper auth guards.

## COACHING LOCK
COACHING_PUBLIC_LAUNCH_ENABLED = false
Location: lib/platformConfig.js
This must NEVER be changed without:
1. Gannon's explicit written approval
2. Legal review of coaching terms and conditions
3. Completion of 9-gate coaching launch checklist

## HIGH-RISK FILE LIST (READ BEFORE TOUCHING)
- functions/stripeWebhook.js — creates orders, sends receipts
- functions/createCheckoutSession.js — initiates payment
- functions/validatePromoCode.js — discount validation (owner override code present)
- lib/platformConfig.js — coaching lock
- App.jsx — all routing (coaching must stay in admin only)
- components/admin/AdminLayout.jsx — admin nav

## ROTATION INSTRUCTIONS
Stripe Webhook Secret: dashboard.stripe.com → Developers → Webhooks → rotate signing secret
TikTok Client Secret: developers.tiktok.com → App Management → rotate client secret
Metricool API Token: app.metricool.com → Settings → API → revoke and reissue`,
  },
  {
    id: 'live_blockers',
    label: 'Live Blockers',
    filename: 'live-blockers.md',
    content: `# Live Blockers — Gannon Waye Music OS
# Current as of 2026-05-27

## CRITICAL (Must fix before any new deployment)

1. STRIPE_WEBHOOK_SECRET — rotate required
   Risk: May have been exposed in AI session output (26 May 2026)
   Action: dashboard.stripe.com → Developers → Webhooks → rotate
   Owner: Gannon

2. TIKTOK_CLIENT_SECRET — rotate recommended  
   Risk: May have been visible in prior sessions
   Action: developers.tiktok.com → App Management → rotate
   Owner: Gannon

3. TikTok live test — NOT confirmed on gannonwaye.com
   Must test OAuth in real browser (not Base44 preview)
   Status: BLOCKED until Gannon tests live

4. Playwright external test — NOT yet run
   Internal route catalogue exists but no real browser test
   Status: Download pack from /admin/playwright-test-centre and run

## AGENT SAFETY (New — 2026-05-27)

5. Sage security layer — NOT YET INSTALLED
   Recommended for: Cursor, Claude Code, OpenClaw
   Install: openclaw plugins install @gendigital/sage-openclaw
   Status: Pending installation

6. Secret redaction not formally checked
   Action: Run Secret Redaction Checklist before every external agent session
   Status: Checklist available at /admin/agent-trust-hub

## HIGH PRIORITY

7. META_APP_ID/META_APP_SECRET not set
   Instagram/Facebook integration blocked
   Status: Create Meta developer app

8. YouTube Data API not enabled
   Status: Needs Google Cloud Console action

9. Backend function authentication audit
   31 functions — auth coverage incomplete
   Status: Audit required`,
  },
];

export default function ExternalEngineeringCommand() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(HANDOFF_PACKS[0]);

  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied' }); };
  const download = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Downloaded ${filename}` });
  };
  const downloadAll = () => {
    HANDOFF_PACKS.forEach(p => download(p.filename, p.content));
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/agent-trust-hub"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">External Engineering Command</h1>
            <p className="text-sm text-muted-foreground mt-1">Handoff packs for Cursor, Replit, Warp, Playwright — all with Agent Safety Checklists and secret redaction rules.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/agent-trust-hub"><Button variant="outline" size="sm"><Shield className="w-3 h-3 mr-1" />Trust Hub</Button></Link>
          <Button size="sm" onClick={downloadAll}><Download className="w-3 h-3 mr-1" />Download All Packs</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {HANDOFF_PACKS.map(pack => (
            <Card
              key={pack.id}
              className={`cursor-pointer hover:border-primary/40 transition-colors ${selected?.id === pack.id ? 'border-primary/60' : ''}`}
              onClick={() => setSelected(pack)}
            >
              <CardContent className="p-3 flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{pack.label}</span>
                <Terminal className="w-3 h-3 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
          <div className="pt-2 space-y-1">
            <Link to="/admin/agent-trust-hub"><Button variant="ghost" size="sm" className="w-full justify-start text-xs"><Shield className="w-3 h-3 mr-1" />Agent Trust Hub</Button></Link>
            <Link to="/admin/developer-handoff"><Button variant="ghost" size="sm" className="w-full justify-start text-xs"><ExternalLink className="w-3 h-3 mr-1" />Developer Handoff</Button></Link>
            <Link to="/admin/playwright-test-centre"><Button variant="ghost" size="sm" className="w-full justify-start text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Playwright Tests</Button></Link>
          </div>
        </div>

        {selected && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base">{selected.label}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copy(selected.content)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                  <Button variant="outline" size="sm" onClick={() => download(selected.filename, selected.content)}><Download className="w-3 h-3 mr-1" />Download</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-[60vh] whitespace-pre-wrap font-mono leading-relaxed">
                {selected.content}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}