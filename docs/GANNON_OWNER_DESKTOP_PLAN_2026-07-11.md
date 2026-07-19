# Gannon Owner Desktop / One-Stop Dashboard Plan

Status date: 2026-07-11

## Purpose

Create one private admin desktop for Gannon to run the whole business day-to-day:

- daily tasks and next best action
- money moves and revenue checks
- music, merch, coaching and GanozMix opportunities
- content creation, editing, approval and scheduling
- communication and lead follow-up
- AI agent monitoring and approval gates
- key external links: Skool, Pressmaster, HeyGen, Metricool, Stripe, Google Drive and Base44
- an Ask Gannon OS command layer so Gannon can type natural questions instead of hunting through menus

This is an owner cockpit, not a public page.

## Long-term operating-system map

The private OS should consolidate these areas:

1. Home / Daily briefing
2. Music Command Centre
3. Coaching Command Centre
4. Content Studio
5. Creative Studio
6. Revenue Centre
7. Communications Hub
8. AI Workforce
9. Owner Dashboard
10. Knowledge Vault
11. Automation Centre

The point is not to add more separate tools. The point is to make every tool report into one daily operating system.

## Current finding

The app already has many of the right systems, but they are spread across many admin routes.

Already present:

- `/admin` dashboard
- `/admin/ask-gannon-os`
- `/admin/ai-twin-content-studio`
- `/admin/mission-control`
- `/admin/business-attention-centre`
- `/admin/todays-money-moves`
- `/admin/store-orders`
- `/admin/launch-content`
- `/admin/social-schedule-queue`
- `/admin/metricool-command`
- `/admin/coaching-command`
- `/admin/coaching-programs`
- `/admin/coaching-content-library`
- `/admin/automation-agents`
- `/admin/agent-registry`
- `/admin/agent-task-log`
- `/admin/agent-revenue-status`
- `/admin/creative-studio`
- `/admin/video-agent-command`
- `/admin/mum`
- `/admin/mum-tribute-studio`
- `/admin/systems-qa`
- `/admin/site-health`

The main weakness was not a lack of pages. The weakness was that the entry dashboard was too static, too stale in places, and did not clearly guide the day.

## Completed this pass

Updated `src/pages/admin/Dashboard.jsx` into a clearer Owner Desktop with:

1. live summary cards:
   - tracked store revenue
   - approval items
   - content pipeline
   - agent work today
2. today's command stack:
   - business alerts
   - pending approvals
   - pending orders
   - system issues
   - fallback daily actions when nothing urgent is detected
3. operating hubs:
   - Money Desk
   - Content + Social
   - Coaching + Skool
   - AI Agents
   - Creative Studio
   - Mum's Garden
4. outside tool links:
   - Skool
   - Pressmaster
   - HeyGen
   - Metricool
   - Stripe
   - Google Drive
   - Base44
5. a safety banner:
   - no spending
   - no publishing
   - no price changes
   - no member invites
   - no scheduling without approval
6. Ask Gannon OS private command layer:
   - daily briefing snapshot
   - natural-language prompt buttons
   - approval, revenue, music, coaching, communications and content answers
   - route links into the right admin module
   - no external sending, publishing or scheduling

## Phase 1 build order

1. Owner Dashboard — first version upgraded locally.
2. Daily Briefing Engine — first version added inside `/admin/ask-gannon-os`.
3. Unified Task Manager — next entity/page build.
4. Communications Centre — next entity/page build.
5. Revenue Dashboard — existing hub, needs deeper live Stripe/revenue reconciliation.
6. AI Workforce — existing hub, needs clearer performance and task scoring.
7. Content Pipeline — existing hub, needs end-to-end status across idea, draft, media, approval, schedule, published and performance.

## Ask Gannon OS

First local version exists at:

`/admin/ask-gannon-os`

It currently answers:

- What should I work on today?
- Show me everything waiting for my approval.
- What will make me the most money this week?
- Which song is closest to release?
- Draft three TikToks for Without You Here.
- Which coaching products are still incomplete?
- Show me all outstanding producer conversations.

Current limitation:

It uses local dashboard logic and existing entity data. It is not yet a full AI retrieval system across Google Drive, Gmail, Skool, social comments, producer messages and Base44 history.

## Required next build upgrades

### 1. True task engine

Create a real `DailyTask` or `OwnerTask` entity so the dashboard can store and update tasks instead of only reading alerts from other systems.

Suggested fields:

- title
- description
- business_area
- priority
- due_date
- status
- source
- approval_required
- linked_route
- linked_entity_type
- linked_entity_id

### 2. Unified approval inbox

The dashboard should merge:

- ApprovalQueue
- AdminNotification
- AgentActionProposal
- ContentCalendarPost awaiting approval
- SocialAsset awaiting approval
- RevenueOpportunity awaiting approval
- SoniaMemorySubmission awaiting approval

### 3. Communications centre

Add a single admin communications page for:

- Gmail drafts
- fan replies
- order messages
- coaching leads
- Skool/community reminders
- contact form enquiries

Do not auto-send. Draft and queue for approval first.

### 4. Coaching money pipeline

Connect Skool/coaching setup into the dashboard:

- staged offer list
- free lead magnet status
- paid workbook/course status
- client intake readiness
- weekly coaching content plan
- Skool upload checklist
- pricing approval state

### 5. Content-to-cash workflow

Connect:

Pressmaster idea → script → brand check → Google Drive media → HeyGen/avatar video if approved → caption → platform versions → approval → Metricool schedule.

The dashboard should show where each item is stuck.

### 6. External tool setup tracker

Add status cards for:

- Skool cover/icon uploaded
- Skool pricing gates configured
- HeyGen avatar approved
- Metricool profile connected
- Stripe webhook green
- Base44 deploy/sync confirmed
- Google Drive asset vault live

### 7. Owner morning brief

Generate a private morning brief:

- what needs Gannon today
- what can make money today
- what content is closest to posting
- what order or customer issue needs attention
- what system is broken
- one small action for coaching growth

This can be drafted automatically but should not publish or send externally without approval.

### 8. Ask Gannon OS retrieval engine

Upgrade Ask Gannon OS from local dashboard logic into a true retrieval layer that can safely search:

- Base44 entities
- Google Drive folders
- Gmail drafts and threads
- Skool/community state
- social comments/DM queues
- content calendar
- Stripe/payment diagnostics
- agent logs
- website health

Every answer must include:

- evidence source
- recommended next action
- approval requirement
- linked module/page
- whether the answer is live-current or local/staged

## Safety rules

The dashboard can automate:

- research
- draft content
- organise tasks
- prepare scripts
- prepare captions
- summarise activity
- create internal reminders
- produce private reports

The dashboard must require Gannon approval before:

- spending money
- changing prices
- refunding orders
- publishing products
- sending emails
- posting to socials
- inviting Skool members
- making coaching public
- changing legal/medical/therapy wording
- deleting files or records

## Current status

Dashboard front door: upgraded locally.

Ask Gannon OS: first version added locally.

AI Twin Content Studio: first version added locally.

Purpose:

- feed Pressmaster with the Gannon Waye identity, brand voice, release world and content rules
- prepare 3-minute HeyGen episode scripts using Gannon's private avatar and Australian voice
- create a 15-post launch bank for music, Mum's Garden, resilience/coaching and merch
- keep all content approval-gated before HeyGen generation, Metricool scheduling, publishing or email sending

The current studio intentionally does not generate HeyGen videos automatically. The exact script must be approved first because HeyGen generation can consume credits and the avatar/voice output becomes public-facing creative material.

Skool setup: staged and mostly ready, but not publicly launched.

Main blocker: Base44 CLI/editor sync still needs confirmation before assuming the local dashboard update is live in Base44 production.
