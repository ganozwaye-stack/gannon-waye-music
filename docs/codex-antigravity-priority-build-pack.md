# Codex and Antigravity Priority Build Pack

Repository: ganozwaye-stack/gannon-waye-music
Branch: upgrade/gwm-command-centre-v2
Issue: #24

## Mission
Complete the Gannon Waye Music OS priority sprint today without breaking the working store, checkout, Stripe, orders, webhooks, promo codes, inventory, legal pages, admin auth, approval queue, Metricool safety, or agent safety rules.

## Non negotiable safety rules

1. Do not expose `/mum` or `/without-you-here` publicly.
2. Keep the existing MumTribute page available only behind admin authentication.
3. Do not delete the existing MumTribute work. Move or protect it.
4. Do not publish, auto post, spend money, contact people, or change Stripe without approval.
5. Do not generate or use synthetic Sonia voice without explicit family approval.
6. Family upload content must be reviewed by Gannon before it appears anywhere public.
7. Preserve all existing public store and checkout behavior.

## Phase 1: Make Mum Tribute private now

### Goal
Remove public access to the current Mum Tribute page and make it admin only.

### Current files to inspect

- `src/App.jsx`
- `src/pages/MumTribute.jsx`
- `src/components/admin/AdminLayout.jsx`
- any existing auth guard components

### Required route behavior

Public routes:

- `/mum` redirects to `/` or a simple private notice page.
- `/without-you-here` redirects to `/` or a simple private notice page.

Admin routes:

- `/admin/mum`
- `/admin/mum-tribute`
- `/admin/without-you-here`

All three admin routes should render the existing `MumTribute` page for now.

### Acceptance checks

- Logged out visitor cannot view `/mum`.
- Logged out visitor cannot view `/without-you-here`.
- Admin can view `/admin/mum`.
- Admin can view `/admin/mum-tribute`.
- Admin can view `/admin/without-you-here`.

## Phase 2: Build Admin Scheduler and Action Centre

### Goal
Create the daily task brain Gannon can use immediately.

### Routes

- `/admin/scheduler`
- `/admin/today`
- `/admin/action-centre`

All routes can point to the same new page initially.

### Page file

Create:

- `src/pages/admin/GannonScheduler.jsx`

### Required features for first version

- Add task form
- Task title
- Category: Music, Website, Mum Tribute, Store, Legal, Personal, Family, Admin
- Priority: critical, high, medium, low
- Status: todo, doing, waiting, done
- Due date field
- Notes field
- Suggested by field: Gannon, Agent, System
- Today list
- Overdue list
- Agent suggested tasks list
- Done list
- Local storage persistence if no existing entity is available
- Buttons for mark doing, mark done, delete
- No external sending or automation yet

### Seed tasks

Add default tasks on first load:

- Make Mum page private
- Build family upload portal
- Review family photos and voice messages
- Create Mum Tribute Studio layout
- Collect eulogy and speeches
- Prepare Sonia Memory Chat knowledge base
- Review website routes after privacy update
- Confirm store and checkout still work
- Review next music release plan

## Phase 3: Build Family Upload Portal

### Public route

- `/family/sonia-upload`

### Admin route

- `/admin/family-uploads`

### Public page file

Create:

- `src/pages/family/SoniaUpload.jsx`

### Admin page file

Create:

- `src/pages/admin/FamilyUploads.jsx`

### Public upload fields

- Name
- Relationship to Sonia
- Email or phone optional
- Upload type: photo, video, voice note, eulogy, speech, story, other
- Memory title
- Written memory
- File input
- Consent checkbox
- Submit button

### Storage approach for first version

If Base44 upload entity exists, use it. If not, store metadata in local storage for the prototype and show a clear placeholder saying backend storage must be connected before public launch.

### Admin review fields

- Pending uploads
- Approved uploads
- Rejected uploads
- Notes
- Approve button
- Reject button
- Mark needs follow up button

## Phase 4: Build Mum Tribute Studio shell

### Route

- `/admin/mum-tribute-studio`

### Page file

Create:

- `src/pages/admin/MumTributeStudio.jsx`

### Sections

- Tribute vision
- Photo library plan
- Children and family priority section
- Garden scene builder
- Scroll animation plan
- Eulogy and speeches archive
- Voice archive
- Sonia Memory Chat source library
- Approval checklist

## Phase 5: Build Sonia Memory Chat shell

### Route

- `/admin/sonia-memory-chat`

### Page file

Create:

- `src/pages/admin/SoniaMemoryChatAdmin.jsx`

### Requirements

- Admin only
- Explain that it answers from approved memories only
- Text input for testing
- Source list placeholder
- Response area
- Safety note: it is a memory companion, not a claim to literally be Sonia
- No synthetic voice output in this phase

## Phase 6: Update Master Blueprint

Update `src/pages/admin/MasterBlueprint.jsx` so it lists:

- Private Mum Tribute
- Gannon Scheduler
- Today Action Centre
- Family Upload Portal
- Family Upload Review
- Mum Tribute Studio
- Sonia Memory Chat
- Voice Archive Policy

Each should show status `missing`, `review`, or `ok` accurately.

## Phase 7: Test

Run or update existing route tests if possible.

Manual checks:

- `/mum` is no longer publicly accessible
- `/without-you-here` is no longer publicly accessible
- `/admin/mum` loads for admin
- `/admin/scheduler` loads
- `/family/sonia-upload` loads
- `/admin/family-uploads` loads
- `/admin/mum-tribute-studio` loads
- `/admin/sonia-memory-chat` loads

## Deliverable

Create a pull request from `upgrade/gwm-command-centre-v2` to `main` with a summary of changed routes, new pages, safety notes, and test results.
