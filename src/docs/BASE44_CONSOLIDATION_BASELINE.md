# Base44 Consolidation Baseline — Verified 2026-07-13

## System Overview

- **Main application:** Gannon Waye Music (gannonwaye.com)
- **Total Base44 applications in account:** 5 (1 main + 4 copies)
- **Entity schemas:** 106
- **Admin routes (approx):** 239
- **Total routes (approx):** 290
- **Admin sidebar destinations (approx):** 41
- **Admin routes NOT in sidebar (approx):** 198

## Data Baseline (Verified from Entity Records)

| Entity | Total Records | Notes |
|--------|--------------|-------|
| AgentRegistry | 223 | 216 labelled "active" — active label is not proof of working |
| ApprovalQueue | 332 | ~225 pending |
| ApprovalQueueItem | 10 | All require approval |
| AdminNotification | 500+ | High volume |
| AgentTaskLog | 500+ | High volume |
| SystemHealthIssue | ~131 | ~64 open, 3 requiring approval |
| IdeaOpportunity | ~431 | ~355 still marked "new" |
| ContentCalendarPost | ~152 | 109 drafts, 36 needing visuals, 7 waiting for approval |
| SocialAsset | ~71 | ~70 remain raw |

## Commercial Data (Verified)

| Entity | Records |
|--------|---------|
| Release | 9 |
| Lyric | 17 |
| MasteringProject | 5 |
| MerchProduct | 9 |
| MerchOrder | 5 |
| CoachingLead | (active) |
| EmailSubscriber | (active) |
| FoundingSupporter | (active) |
| PaymentDiagnostic | (active) |
| Supplier | (active) |
| ContentPost | (active) |
| SocialAsset | 71 |

## Previous Audit Comparison

| Metric | Previous Audit | Current |
|--------|---------------|---------|
| Routes | 278 | ~290 |
| Entities | 104 | 106 |
| Agents | 32 | 223 registry records |
| Automations | 24 | (not recounted) |
| Integrations | 6 | 6+ |

The system has expanded significantly since the previous audit. The older report should not be relied upon without verification.

## Application Copies Checklist

> Do not delete any of the five applications until this comparison is completed and exported.

| # | Question | Status |
|---|----------|--------|
| 1 | Which application is connected to gannonwaye.com? | **Main application** — verify in Base44 dashboard |
| 2 | Which has the newest source? | **Main application** — Owner Command V3 is built here |
| 3 | Which contains production customer and payment data? | **Main application** — MerchOrder, StripeEventLog, PaymentDiagnostic |
| 4 | Which contains unique entities or records? | **Main application** — 106 entity schemas |
| 5 | Which integrations and functions use each application ID? | **Main application** — 6 connectors: Instagram, Slack, Google Drive, Google Calendar, Gmail, Google Sheets |
| 6 | Which copy may become the single recovery snapshot? | **Pending investigation** — export and compare all 5 before deciding |

## Connector Status (Verified)

| Connector | Integration Type | Status |
|-----------|-----------------|--------|
| Instagram | instagram | Authorized (business_basic, content_publish) |
| Slack | slack | Authorized (chat:write, users:read) |
| Google Drive | googledrive | Authorized (email) + workspace connector registered |
| Google Calendar | googlecalendar | Authorized (calendar.events) |
| Gmail | gmail | Authorized (gmail.send) |
| Google Sheets | googlesheets | Authorized (spreadsheets, drive.file) |

## Secret Inventory (Names Only — Values Not Exposed)

- GITHUB_TOKEN, OPENAI_API_KEY, CURSOR_API_KEY
- METRICOOL_BLOG_ID, METRICOOL_USER_ID, METRICOOL_API_TOKEN
- STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY
- TIKTOK_CLIENT_SECRET, TIKTOK_CLIENT_KEY
- GOOGLE_SHEET_ID

No secrets were changed, rotated, revealed, or hardcoded during this work.

## Backend Functions

112 backend functions exist in the account. None were modified during this work.

## Safety Confirmations

- ✅ No entities deleted, renamed, or merged
- ✅ No records deleted
- ✅ No existing admin routes removed
- ✅ Default dashboard unchanged (still /admin/dashboard)
- ✅ No secrets modified
- ✅ No Stripe, webhook, or payment logic modified
- ✅ No public pages modified
- ✅ No Mum's Garden or memorial content modified
- ✅ No social content, newsletters, or emails published or sent
- ✅ No automations triggered by this work
- ✅ All new code is read-only aggregation over existing data
- ✅ All new code is behind existing admin authentication