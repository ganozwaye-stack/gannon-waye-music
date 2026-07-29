# Platform Pricing Snapshot - 2026-07-30

Status: current public-pricing snapshot for decision support. Prices change; verify again before subscribing or changing plans.

## Short Recommendation

Do not move the live Gannon Waye suite to Emergent tonight just because of price. The green GitHub PR plus a non-production preview is the safer path. Use Emergent, Lovable, Replit, Netlify, or Vercel only after the Base44 parity checklist is satisfied.

For this suite, the best near-term path is:

1. Keep Base44 live.
2. Keep PR #31 as the current audited staging branch.
3. Use a non-production preview for review after explicit approval.
4. Treat Emergent or another AI builder as a rebuild/import lane, not a live cutover lane.

## Current Pricing Notes

### Base44

Official Base44 pricing article, dated July 2026:

- Free: $0, 25 message credits, 100 integration credits.
- Starter: $16/month annually or $20 month-to-month, 100 message credits, 2,000 integration credits.
- Builder: $40/month annually or $50 month-to-month, 250 message credits, 10,000 integration credits.
- Pro: $80/month annually or $100 month-to-month, 500 message credits, 20,000 integration credits.
- Elite: $160/month annually or $200 month-to-month, 1,200 message credits, 50,000 integration credits.

Useful for this project when the live Base44 site must remain stable and the existing Base44 app is still the production fallback.

Source: `https://base44.com/blog/how-much-does-base44-cost`

### Emergent

Official Emergent pricing page:

- Free: $0/month, 10 monthly credits.
- Standard: $20/month on annual billing, 100 credits/month.
- Pro: $200/month on annual billing, 750 monthly credits.
- Enterprise: custom.

The same page FAQ also describes annual-equivalent starting points as $17/month for individual builders, $167/month for power users, and $250/month for teams. Treat the visible pricing cards and checkout screen as authoritative before subscribing.

Useful for this project as a separate build/import environment if we want agentic rebuilding and GitHub integration, but not a direct Base44 replacement until parity is proven.

Source: `https://emergent.sh/`

### Lovable

Official Lovable docs:

- Free plan exists for smaller projects.
- Pro starts from 100 monthly credits.
- Business starts from 100 monthly credits.
- Pro 100-credit tier: $25 monthly or $250 annual, shown as about $21/month.
- Business 100-credit tier: $50 monthly or $500 annual, shown as about $42/month.
- Pro and Business include 5 daily build credits, monthly Cloud grant, monthly AI grant, Git sync, and code download.

Useful for this project if we want a cheaper AI builder sandbox with Git sync and code export. It still needs parity testing and careful private-media handling.

Sources:

- `https://docs.lovable.dev/introduction/subscription-plans`
- `https://lovable.dev/pricing`

### Replit

Official Replit pricing page:

- Starter: free, includes free daily Agent credits and publishing up to 1 project.
- Core: $25/month or $20/month billed annually, includes $25 monthly credits and up to 2 agents in parallel.
- Pro: $100/month or $95/month billed annually, includes $100 monthly credits and up to 10 agents in parallel.
- Enterprise: custom.

Useful for this project if we want an AI app-building workspace with easy previews. It is not the best canonical source for this repo unless the GitHub workflow remains the source of truth.

Source: `https://replit.com/pricing`

### Vercel

Official Vercel pricing page:

- Hobby: $0/month for personal projects.
- Pro: $20/month, includes $20 usage credit and spend management.
- Enterprise: custom.

Useful for this project as a GitHub-based hosting/preview path. It is a hosting/deployment platform, not a replacement for Base44 entities/functions without rebuild work.

Source: `https://vercel.com/pricing`

### Netlify

Official Netlify pricing page:

- Free: $0 forever, 300 credit limit/month, private by default until publish, unlimited deploy previews.
- Personal: $9/month, 1,000 credits/month.
- Pro: $20/month with unlimited members, starting at 3,000 credits/month.
- Enterprise: custom starts at $500/month.

Useful for this project as a GitHub-based preview/deploy path, especially because deploy previews can be used before public publish. It still requires approval before publishing anything production-facing.

Source: `https://www.netlify.com/pricing/`

## Practical Comparison For Gannon Waye

Lowest-risk tonight:

- Keep Base44 live.
- Use GitHub PR #31 and local/preview checks.
- Do not switch DNS or checkout yet.

Cheapest AI-builder sandbox:

- Lovable Pro starts lower than Emergent Pro and lower than Base44 Builder, but credits can run out quickly during heavy rebuild work.

Best code-owned AI-builder candidate:

- Emergent is attractive if its GitHub integration and generated-code ownership are important, but it should be used as a rebuild lane, not an instant migration lane.

Best hosting/preview path:

- Netlify or Vercel are cheaper for hosting/previews than running the whole product inside an AI builder, but they do not replace Base44 backend/data automatically.

Best current launch answer:

- Stay with Base44 live plus PR #31 staging until parity is proven.
- Use Netlify/Vercel preview or an approved AI-builder sandbox only after the approval gates are clear.
