# Base44 Transfer Audit - 17 July 2026

## What Was Audited

- Live Base44 app: `69eb7905ca6eb4180010f794`
- Local clone: `work/gwm-home-redesign-clone`
- Base44 login verified as the site owner account before querying live data.
- Local project assets checked: `base44/entities`, `base44/functions`, `base44/agents`, `base44/connectors`, and the public React site.
- Local Base44 config exists, but this clone is not linked with `.app.jsonc`; use `--app-id 69eb7905ca6eb4180010f794` for CLI checks until it is linked intentionally.

This audit is a transfer map, not a full export. Three live tables already hit the 1,000-record fetch cap, so the final migration needs a paginated export script before anything is considered fully moved.

## System Size

| Area | Local Config Count | Notes |
|---|---:|---|
| Entity schemas | 111 | Broad system, not just a music site |
| Backend functions | 114 | Store, social, release, automation, email, Stripe, alerts |
| Agent config files | 32 | The cleaner local agent layer |
| Connector configs | 8 | Airtable, Gmail, Google, Instagram, Notion, Slack |
| Live AgentRegistry records | 223 | 216 active, 7 inactive; should be consolidated before rebuild |

## Verdict

Base44 should be treated as the messy source system, not the final product. It contains valuable data, workflows, automation ideas, store logic, release planning, content pipelines, and owner dashboards, but it should not be copied over wholesale. The rebuild should preserve the real information and business logic while replacing the cluttered Base44 surface with a cleaner public site and a smaller owner command centre.

The practical verdict:

- Keep Base44 available as the fallback/source archive until export parity is proven.
- Rebuild the public Gannon Waye Music site cleanly first.
- Export and reconcile data with scripts, not screenshots or manual copy/paste.
- Consolidate agents and admin pages aggressively.
- Keep risky commerce/publishing actions behind approval gates.
- Do not mix Gannon Waye Music merch/orders/supporters with GanozMix Direct sourcing, eBay, or dropshipping workflows.

## GanozMix Direct

GanozMix is in scope, but it is a separate business lane.

- Current public/app URL: `https://ganozmixdirect.base44.app`
- Source Base44 app id from the handoff: `69eb857abaebfe9e3df48083`
- Local bridge route: `/admin/ganozmix`
- Public case study route: `/systems/case-studies/ganozmix-direct`
- Current handoff doc: `docs/emergent-ganozmix-handoff.md`
- Agent blueprint: `base44/agents/GanozMixDirectBlueprint.md`

Current evidence says GanozMix Direct is not production-ready as a marketplace system. It has product/opportunity data and a useful operating blueprint, but the eBay state was previously recorded as expired, order count was zero, and job/error records included unresolved sync failures. That means GanozMix should be rebuilt as a read-only review and approval dashboard first, then reconnected to eBay only after OAuth, supplier checks, pricing, image rights, and listing approval are confirmed.

GanozMix rebuild boundary:

- Preserve product opportunities, supplier checks, margin calculations, listing templates, marketplace readiness, job/error dashboard, and approval queue.
- Do not inherit Gannon Waye Music Stripe logic, merch orders, fan/supporter identity, customer email flows, or music-store fulfilment.
- Do not allow auto-publishing, supplier ordering, paid listings, or customer emails without explicit approval.
- Use the Magnetic Cable Organiser proof product from the handoff as a manual test item before any broader marketplace push.

## Live Data Snapshot

| Entity | Live Count Fetched | Status |
|---|---:|---|
| Lyric | 17 | 3 published, 14 private/unpublished |
| Release | 9 | All published records; 1 released, 3 mastering, 2 recording, 3 ideas |
| MerchProduct | 9 | 9 active products |
| MerchOrder | 5 | Includes confirmed, shipped, cancelled, and duplicate orders |
| EmailSubscriber | 7 | Exists; do not copy contact details into public docs |
| ApprovalQueue | 352 | 245 pending, 98 approved, 6 in review, 1 actioned, 2 archived |
| ApiIntegrationSetup | 43 | 22 need credentials, 19 not connected, 2 live |
| SystemHealthIssue | 136 | 69 open, 34 resolved, 30 dismissed, 3 need approval |
| AdminNotification | 1,000 fetched | Likely more; needs pagination |
| AgentTaskLog | 1,000 fetched | Likely more; needs pagination |
| KnowledgeVault | 1,000 fetched | Likely more; needs pagination |

## Lyrics Vault Check

Live Base44 has 17 lyric records:

- Will You Even Listen
- I'm Still Here
- Set Free
- Thankyou
- Because of You
- Broken Inside
- Stand By Me Now
- Killing Both Our Hearts
- I Found Me
- So Arrogant
- Letting Go
- You're My Mum
- All I Ever Wanted
- Unexpected
- One Day
- Run Away
- Without You Here

Important migration note: `src/docs/lyrics_archive_import_report.md` is stale. It says all lyrics are private and lists `Run` / `I've Been Set Free`, but live Base44 now shows 3 published lyric records and the titles `Run Away` / `Set Free`.

## Public Site Status

The current local public site is moving in the right direction:

- Homepage has the centered Gannon Waye name mark, centered subtitle, left-aligned hero storytelling, and right-side current single panel.
- The gold language is back through `gradient-gold-glow` and `gradient-gold-button`.
- `Without You Here` is positioned as the next single, releasing 31 July 2026.
- The top hero now has a "Worth seeing now" rail to fill the dead space with new music, `Thank You`, and `Mum's Garden`.
- Signature quote dividers now appear between major sections to create hook moments instead of long flat scrolls.
- Mum's song internal player now cues the preview from 3:46 to 4:30.

## Biggest Transfer Risk

Local dev currently mocks Base44 on `localhost` / `127.0.0.1` in `src/api/base44Client.js`. That is useful for avoiding crashes, but it can hide migration gaps.

The mock currently covers store/admin basics such as `MerchProduct`, `MerchOrder`, `AdminNotification`, `ApiIntegrationSetup`, `ApprovalQueue`, and `StoreCustomer`. It does not fully mirror the live vault for lyrics, releases, gallery, fan data, content workflow, or the larger agent/automation system.

Decision: before launch, either wire authenticated live Base44 access for owner/admin routes or create a real seed/export snapshot for every critical entity. Do not trust the local mock as proof that Base44 has been fully transferred.

## What To Preserve

### Public Artist Site

- Home, music, store, mum tribute, community, contact, press kit.
- New music and signature lyric moments should be visible without making the page feel like separate landing pages stacked together.
- Keep the gold centrepiece story treatment. It is a strong brand signal.

### Music And Lyrics

- `Release`, `Lyric`, `MasteringProject`, `ReleaseActionPlan`, `FeaturedVideo`.
- Preserve the lyric vault privately, but expose only approved excerpts and release storytelling publicly.
- Reconcile live lyric titles and approval state before any public lyrics page goes live.

### Store And Revenue

- `MerchProduct`, `MerchOrder`, `BundleOffer`, `PromoCode`, `ShippingRateRule`, `Supplier`, `SupplierProduct`, `StoreCustomer`, `StripeEventLog`, `PaymentDiagnostic`, `OrderLock`.
- Store must use the live 9 active Base44 products or the synced local product config, not old placeholder images/prices.
- Shipping and payment issues must be cleared before transfer because live Base44 still has open health issues around shipping/payment diagnostics.

### Content And Social

- `ContentCalendarPost`, `ContentPost`, `ContentPipelineItem`, `SocialAsset`, `SocialVideo`, `ManyChatKeywordDraft`, `VisualGenerationQueue`.
- This should become one clean content studio, not scattered agent output everywhere.

### Community And Fan Layer

- `EmailSubscriber`, `FanPost`, `FanMedia`, `FanPlaylist`, `FanReminder`, `FanReview`, `FoundingSupporter`, `SupportContribution`, `SupporterProfile`.
- Keep public-facing community features polished and controlled; keep admin moderation separate.

### Owner Command Centre

- `ApprovalQueue`, `ApprovalQueueItem`, `DailyDashboardTask`, `SystemHealthIssue`, `RiskAlert`, `AdminNotification`, `KnowledgeVault`.
- This is where the Base44 system is messiest and most valuable. Rebuild it as a dashboard with clear lanes: approvals, release tasks, store health, content queue, integrations, and urgent risks.

### Agents And Automation

- 223 live agent registry records should not become 223 visible tools.
- Keep the useful automation logic, but consolidate it into a small number of understandable workspaces:
  - Release launch
  - Store operations
  - Social/content production
  - Fan/community
  - System health
  - Research/vault

## Recommended Cleaner Rebuild

1. Public site first: make the artist brand, music, store, and mum tribute feel premium and cohesive.
2. Data bridge second: create a paginated Base44 export/import script and map every entity to the new system.
3. Owner command centre third: replace noisy Base44 sprawl with one dashboard.
4. Store proof fourth: verify active products, pricing, images, promo codes, shipping, Stripe events, order creation, and fulfilment.
5. Content workflow fifth: move drafts, calendars, social assets, approvals, and visual queues into a clean production view.
6. Agent consolidation last: keep the intelligence, remove duplicate surface area.

## Launch Blockers

- Need full paginated export for `AdminNotification`, `AgentTaskLog`, and `KnowledgeVault`.
- Need live-vs-local reconciliation for lyrics because the old lyrics report is stale.
- Need decision on local dev mocking versus authenticated live Base44 access.
- Need local Base44 linking decision before deploy/pull workflows are trusted.
- Need triage of 245 pending approval queue records.
- Need triage of 69 open system health issues.
- Need integration cleanup: 22 integrations need credentials and 19 are not connected.
- Need store payment/shipping proof before the store is treated as production-ready.

## Design Recommendations

- Keep the homepage left-aligned where it tells the story, but centre only the title mark, section labels, and intentional quote moments.
- Use more short signature lines between sections. They make the page feel like an artist world, not just information blocks.
- Reduce repeated "Thank You" campaign sections if the page starts feeling long; keep the strongest stream CTA and move extras behind deeper links.
- Keep gold consistent: use the glowing gold brand treatment, not orange/yellow platform colors for page UI.
- Let the hero and story sections breathe, but avoid dead space. Every large gap should either reveal the face/artwork or carry a lyric, release, or feature moment.
