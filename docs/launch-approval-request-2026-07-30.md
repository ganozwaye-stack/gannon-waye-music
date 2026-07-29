# Launch Approval Request - 2026-07-30

Status: staging is green; live-facing actions are waiting for explicit approval.

Current staging PR: `https://github.com/ganozwaye-stack/gannon-waye-music/pull/31`

Current local control board: `http://127.0.0.1:5173/control-room.html`

## What Is Ready To Review

- Main website staging branch.
- Store-first merch experience: `/store` neon frontage and `/store/all` product grid.
- Mum's Garden private route and Sonia-first garden entrance.
- Micro-brand/dropshipping approval-only procedure.
- Base44-to-Emergent parity checklist.
- Platform pricing snapshot for Emergent/Base44/Lovable/Replit/Vercel/Netlify.

## What Has Passed

- GitHub workflow runs on the current PR head passed: 4 of 4 (`Build`, `Playwright`, `Playwright Store Tests`, `All Tests & Compliance Audits`).
- Local direct typecheck passed.
- `npm run lint` passed.
- `npm run build` passed with the expected local Base44 proxy warning.
- `npm audit --audit-level=moderate` found 0 local vulnerabilities.
- Local focused, commerce, and launch-critical Playwright batches passed as recorded in `docs/gannon-waye-suite-final-run-2026-07-29.md`.

## What Is Not Approved Yet

- Production deployment.
- Hosted non-production preview.
- DNS/domain change.
- Live Stripe checkout or payment proof.
- Marketplace publishing.
- eBay OAuth reconnect.
- Supplier ordering or paid samples.
- Customer, fan, supplier, or press emails.
- Base44 live-state writes or deploys.
- Password, 2FA, or account setting changes.
- AI Sonia voice/avatar publication.
- Uploading or publishing private Mum audio, local Ave Maria acapella audio, review screenshots, or unapproved memorial images.

## Approval Options

Approve only one clear action at a time.

### Option 1 - Approve A Non-Production Preview

Use this if you want a hosted preview link for visual review.

Exact approval wording:

```text
I approve creating a non-production preview from PR #31 only. Do not change DNS, production, Stripe, Base44 live state, marketplace, supplier orders, emails, or AI Sonia publication.
```

What will happen:

- Build a preview from the current PR branch.
- Verify the preview routes.
- Report preview URL, pass/fail checks, and any blocked private-media issue.
- Ask again before any production deploy.

### Option 2 - Keep Staging Only

Use this if you want no external preview yet.

Exact wording:

```text
Keep staging only. Continue audits and documentation. Do not deploy or publish anything.
```

What will happen:

- Continue local/GitHub audit loops.
- Keep PR #31 draft and green.
- Continue documenting blockers and next actions.

### Option 3 - Approve Production Deployment Later

Do not use this until you have reviewed a preview and confirmed checkout/payment risk.

Required later wording:

```text
I approve production deployment of PR #31 to [platform/domain]. I understand this may affect the public website. Do not change DNS, Stripe, marketplace, supplier, emails, Base44 live state, or AI Sonia unless I separately approve them.
```

What will happen:

- Confirm deployment target.
- Run final predeploy checks.
- Deploy only the approved branch.
- Report live link and post-deploy checks.

### Option 4 - Approve Stripe Proof Later

Do not use this until deployment/preview path and Stripe mode are confirmed.

Required later wording:

```text
I approve a controlled Stripe [test/live] checkout proof for [product/cart] only. Do not make any other Stripe, DNS, supplier, marketplace, or customer-email changes.
```

What will happen:

- Confirm Stripe mode.
- Test only the named cart.
- Verify success/cancel, order logging, and no unintended charge risk.

## Recommendation

Next best move: approve Option 1 only when you are ready to inspect a hosted preview. Until then, keep PR #31 as the green staging source and do not move Base44, DNS, Stripe, marketplace, or AI Sonia.
