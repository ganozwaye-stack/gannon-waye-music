import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Copy, Download, AlertTriangle, FileText } from 'lucide-react';

// What to paste directly into ChatGPT — no secrets, no credentials
const CHATGPT_PROMPT_INTRO = `# CODE REVIEW REQUEST — Gannon Waye Music Business OS
# gannonwaye.com — React 18 + Base44 BaaS

## WHAT THIS IS
A full-stack artist website and business operating system built on:
- React 18 + Vite + Tailwind CSS + shadcn/ui (frontend)
- Base44 BaaS (backend-as-a-service — do NOT suggest replacing with Node.js/Next.js/Postgres)
- Deno edge functions in /functions/*.js (backend logic)
- Base44 entity store (NoSQL — no SQL, no Postgres)
- Base44 auth (email/magic link — do NOT suggest custom auth)

## WHAT I NEED YOU TO DO
1. Review the code I paste for: bugs, broken logic, placeholders, missing source chains, duplicate functions, unsafe patterns, broken imports, dead routes
2. Flag anything that looks incomplete or placeholder-only
3. Identify any security issues (secrets in frontend, unprotected routes)
4. Check that coaching routes are NEVER public (COACHING_PUBLIC_LAUNCH_ENABLED = false)
5. Check that Stripe checkout is not broken
6. Check that TikTok OAuth callback (/tiktok-callback) is complete
7. Do NOT suggest Next.js, Node.js, Postgres, or custom auth replacements

## SAFETY RULES (READ BEFORE REVIEWING)
- COACHING_PUBLIC_LAUNCH_ENABLED = false — coaching must NEVER be public without legal review
- /store Stripe checkout must not be changed
- Secrets are stored in Base44 environment variables — they will NOT appear in code
- TikTok client secret must never appear in frontend
- Admin routes are all protected by AdminLayout (user.role === 'admin')

## HOW TO GIVE ME RESULTS
For each file reviewed, output:
1. File path
2. Status: ✅ Complete | ⚠️ Needs work | ❌ Broken | 🔲 Placeholder only
3. Issues found (list)
4. Suggested fix (specific, not generic)
5. Do-not-break warnings

START REVIEW:
---`;

const UPLOAD_STEPS = [
  {
    step: 1,
    title: 'Copy the intro prompt above',
    desc: 'This gives ChatGPT the full context about the project architecture, safety rules, and what you want reviewed.',
    action: 'copy_intro',
  },
  {
    step: 2,
    title: 'Paste the intro into ChatGPT',
    desc: 'Start a new ChatGPT conversation and paste the intro prompt. Wait for acknowledgement.',
    action: null,
  },
  {
    step: 3,
    title: 'Copy App.jsx (routing)',
    desc: 'In Base44 builder → src/App.jsx → Copy All. Paste into ChatGPT. This is the most critical file — all routes are here.',
    action: 'open_base44',
  },
  {
    step: 4,
    title: 'Copy AdminLayout',
    desc: 'In Base44 builder → src/components/admin/AdminLayout.jsx → Copy All. This defines all admin navigation.',
    action: null,
  },
  {
    step: 5,
    title: 'Copy the codebase-manifest.json',
    desc: 'Download from Code Audit Export page → paste into ChatGPT. This gives the full file/entity/function map without secrets.',
    action: 'go_manifest',
  },
  {
    step: 6,
    title: 'Copy backend functions (one by one)',
    desc: 'Priority order: stripeWebhook.js → createCheckoutSession.js → tiktokOAuth.js → shippingOptimisationAudit.js → publishApprovedProposal.js',
    action: null,
  },
  {
    step: 7,
    title: 'Copy specific pages for deep review',
    desc: 'Use the Code Audit Export page to identify which pack you want reviewed. Copy files from Base44 builder.',
    action: 'go_audit',
  },
  {
    step: 8,
    title: 'Download and paste the QA Final Report',
    desc: 'From QA Command Centre → Final QA Report tab → Download .md → paste into ChatGPT for issue triage.',
    action: 'go_qa',
  },
];

const QUICK_COPY_PACKS = [
  {
    id: 'critical_files',
    label: 'Critical Files Pack (paste this list to ChatGPT)',
    content: `CRITICAL FILES TO REVIEW (copy each from Base44 builder):

1. src/App.jsx — ALL routes (source of truth for routing)
2. src/components/admin/AdminLayout.jsx — ALL admin navigation
3. src/functions/stripeWebhook.js — Order creation, receipts (DO NOT BREAK)
4. src/functions/createCheckoutSession.js — Stripe checkout
5. src/functions/tiktokOAuth.js — TikTok OAuth token exchange
6. src/functions/shippingOptimisationAudit.js — Shipping audit (recently fixed)
7. src/functions/publishApprovedProposal.js — Agent proposal publishing
8. src/pages/TikTokCallback.jsx — OAuth callback route
9. src/pages/admin/CoachingCommand.jsx — COACHING (verify it's admin-only, never public)
10. src/lib/eventAutomation.js — Event automation system

KNOWN ISSUES TO CHECK:
- Are all imports in App.jsx valid (does each imported component file exist)?
- Are all AdminLayout nav items pointing to routes in App.jsx?
- Does /tiktok-callback have full error handling?
- Is coaching ONLY accessible behind AdminLayout?
- Do all admin pages have a working back button?
- Are any pages placeholder-only (no real data or static text only)?`,
  },
  {
    id: 'automation_status',
    label: 'Automation & Agent Status Pack',
    content: `AUTOMATION STATUS FOR CHATGPT REVIEW:

APPROVED AUTOMATIONS (should be running):
- executiveMorningBrief — daily brief (scheduled)
- agentIntelligenceLoop — agent analysis (scheduled)
- agentProposalScanner — revenue proposals (scheduled)
- growthOpportunityScanner — growth ideas (scheduled)
- autonomousAlertSystem — automated alerts (scheduled)
- runSiteHealthCheck — health check (scheduled)

APPROVAL-GATED (must NOT run without Gannon approval):
- autonomousSocialPoster — social posting
- tiktokUploadDraft — TikTok upload
- publishApprovedProposal — proposal publishing (only runs after ApprovalQueue status = 'approved')
- sendPromoCodeEmails — email campaigns
- sendRevealNewsletter — newsletters

AGENTS WITH ENTITY PERMISSIONS:
- qa_systems_auditor — SystemHealthIssue, AdminNotification, ApprovalQueue, AgentTaskLog, AgentRegistry, KnowledgeVault, MerchOrder, PaymentDiagnostic, StripeEventLog, RevenueOpportunity
- orchestrator — all entities (read)
- merch_sales_agent — MerchProduct, MerchOrder, AgentActionProposal
- revenue_orchestrator — RevenueOpportunity, AgentActionProposal, AdminNotification

CHECK: Are automations actually running? Check /admin/operational-status and /admin/agent-task-log for last run timestamps.`,
  },
  {
    id: 'security_pack',
    label: 'Security Audit Pack (no values)',
    content: `SECURITY STATUS FOR REVIEW:

SECRETS SET (values NOT shown — never export values):
- STRIPE_PUBLISHABLE_KEY: Saved Securely (frontend-safe)
- STRIPE_SECRET_KEY: Saved Securely (backend only)
- STRIPE_WEBHOOK_SECRET: Saved Securely (backend only)
- TIKTOK_CLIENT_KEY: Saved Securely (backend only)
- TIKTOK_CLIENT_SECRET: NEEDS ROTATION (may have been exposed)
- GOOGLE_SHEET_ID: Saved Securely

MISSING SECRETS (integrations blocked):
- META_APP_ID / META_APP_SECRET (Instagram/Facebook)
- YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET (YouTube)
- X_CLIENT_ID / X_CLIENT_SECRET (Twitter/X)
- SOUNDCLOUD_CLIENT_ID / SOUNDCLOUD_CLIENT_SECRET
- POSTHOG_API_KEY (optional server-side)
- OPENAI_API_KEY (optional — Base44 InvokeLLM used as alternative)

SECURITY CHECKS:
1. Is TIKTOK_CLIENT_SECRET used only in backend functions? ✅
2. Is STRIPE_SECRET_KEY used only in backend functions? ✅
3. Does any frontend file import secrets? (should be NO)
4. Does /tiktok-callback expose any token in the URL or page content?
5. Does /admin/* redirect to login for non-admin users?
6. Are coaching routes absent from the public router in App.jsx?`,
  },
];

export default function ChatGPTCodeReviewExport() {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: 'Copied to clipboard' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadIntro = () => {
    const blob = new Blob([CHATGPT_PROMPT_INTRO], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatgpt-intro-prompt.md';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Intro prompt downloaded' });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">ChatGPT Code Review Export</h1>
            <p className="text-sm text-muted-foreground mt-1">Step-by-step guide for uploading codebase to ChatGPT, Cursor, Codex, or Claude Code for review.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/code-audit-export"><Button variant="outline" size="sm"><FileText className="w-3 h-3 mr-1" />Code Audit Export</Button></Link>
          <Link to="/admin/developer-handoff"><Button variant="outline" size="sm">Dev Handoff</Button></Link>
        </div>
      </div>

      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-4 text-sm flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-200">Base44 does not support ZIP export of source code.</p>
            <p className="text-yellow-100/80 mt-1">Use this guide to manually copy files from the Base44 builder and paste into your review tool. The manifest JSON provides the full file structure. Secret values are NEVER included.</p>
          </div>
        </CardContent>
      </Card>

      {/* Intro Prompt */}
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-sm">Step 1 — Intro Prompt (paste this first into ChatGPT)</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => copy(CHATGPT_PROMPT_INTRO, 'intro')} className="gradient-gold-button">
                <Copy className="w-3 h-3 mr-1" />{copiedId === 'intro' ? 'Copied!' : 'Copy Intro Prompt'}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadIntro}><Download className="w-3 h-3 mr-1" />Download</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-48 whitespace-pre-wrap font-mono">
            {CHATGPT_PROMPT_INTRO}
          </pre>
        </CardContent>
      </Card>

      {/* Upload Steps */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Step-by-Step Upload Process</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {UPLOAD_STEPS.map(step => (
            <div key={step.step} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">{step.step}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
              {step.action === 'copy_intro' && (
                <Button size="sm" variant="outline" onClick={() => copy(CHATGPT_PROMPT_INTRO, 'intro2')}>
                  <Copy className="w-3 h-3 mr-1" />Copy
                </Button>
              )}
              {step.action === 'open_base44' && (
                <Badge className="bg-secondary text-muted-foreground border-border text-xs shrink-0">In Base44 Builder</Badge>
              )}
              {step.action === 'go_manifest' && (
                <Link to="/admin/code-audit-export"><Button size="sm" variant="outline">Open →</Button></Link>
              )}
              {step.action === 'go_audit' && (
                <Link to="/admin/code-audit-export"><Button size="sm" variant="outline">Open →</Button></Link>
              )}
              {step.action === 'go_qa' && (
                <Link to="/admin/qa-command-centre"><Button size="sm" variant="outline">Open →</Button></Link>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Copy Packs */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Quick-Copy Packs (paste directly into ChatGPT)</h2>
        {QUICK_COPY_PACKS.map(pack => (
          <Card key={pack.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-xs">{pack.label}</CardTitle>
                <Button size="sm" variant="outline" onClick={() => copy(pack.content, pack.id)}>
                  <Copy className="w-3 h-3 mr-1" />{copiedId === pack.id ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-secondary/50 rounded-lg p-3 overflow-x-auto overflow-y-auto max-h-40 whitespace-pre-wrap font-mono">
                {pack.content}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Code Audit Export', to: '/admin/code-audit-export' },
          { label: 'Playwright Test Centre', to: '/admin/playwright-test-centre' },
          { label: 'Developer Handoff', to: '/admin/developer-handoff' },
          { label: 'QA Command Centre', to: '/admin/qa-command-centre' },
        ].map(l => (
          <Link key={l.to} to={l.to}>
            <Card className="hover:border-primary/40 transition-colors cursor-pointer h-full">
              <CardContent className="p-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <p className="text-xs font-semibold">{l.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}