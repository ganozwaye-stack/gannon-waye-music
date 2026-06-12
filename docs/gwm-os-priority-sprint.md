# Gannon Waye Music OS Priority Sprint

## Sprint purpose
Build the next priority layer of Gannon Waye Music OS while protecting the working commerce, order, approval, webhook, Metricool, legal, and admin systems.

## Phase 1. Privacy lock for Mum Tribute

Goal: stop public access to the current Mum Tribute page while the new tribute experience is rebuilt properly.

Required changes:

- Remove public access to `/mum`.
- Remove public access to `/without-you-here` if it points to the Mum Tribute page.
- Move Sonia tribute access behind admin routes.
- Add admin only aliases:
  - `/admin/mum`
  - `/admin/mum-tribute`
  - `/admin/without-you-here`
- Add a temporary public message only if required, not the full tribute content.
- Confirm no Sonia images, family photos, private stories, audio, eulogy, or speeches are publicly available until approved.

Acceptance checks:

- Visiting `/mum` as a public visitor does not show the Mum Tribute page.
- Visiting `/without-you-here` as a public visitor does not show the Mum Tribute page.
- Admin can still access the current Mum Tribute page privately.

## Phase 2. Personal Scheduler and Action Centre

Goal: create Gannon's daily operating system so tasks are captured, prioritised, guided, and completed.

Admin routes:

- `/admin/scheduler`
- `/admin/today`
- `/admin/action-centre`

Core features:

- Create personal tasks manually.
- Create business tasks manually.
- Create music release tasks manually.
- Create website tasks manually.
- Create family tribute tasks manually.
- Show tasks identified by agents.
- Priority levels: urgent, high, medium, low.
- Status: inbox, today, in progress, blocked, waiting, done.
- Due date and reminder fields.
- Owner field: Gannon, Agent, Family, Supplier, Producer, Legal, Website, Music.
- Next action guidance field.
- Tick off completed tasks.
- Today dashboard.
- Overdue dashboard.
- Agent suggestions remain drafts until approved.

Safety rules:

- Agents can suggest tasks.
- Agents can draft action steps.
- Agents cannot spend money.
- Agents cannot publish.
- Agents cannot contact anyone externally without approval.
- Agents cannot change legal, Stripe, orders, checkout, or webhooks.

## Phase 3. Mum Tribute Studio

Goal: rebuild the Mum page privately with full creative control before anything goes public.

Admin route:

- `/admin/mum-tribute-studio`

Core features:

- Private photo library.
- Family member tagging.
- Child and sibling relationship tagging.
- Timeline builder.
- Garden scene planning area.
- Hero section planner.
- Eulogy archive.
- Speech archive.
- Voice archive.
- Memory wall.
- Featured family sections.
- Approval status for each memory or asset.
- Public ready toggle must remain off until Gannon approves.

Creative direction:

- Warm, nostalgic, garden based, peaceful, family honouring.
- Tribute by Gannon, but written in a way that respects all her children who love and adore her.
- Prioritise images of Sonia with all children.
- Use real images first.
- Do not use synthetic Sonia imagery publicly until clearly labelled and approved.

## Phase 4. Family Upload Portal

Goal: give family a safe place to contribute files and memories without giving them admin access.

Public or invite route:

- `/family/sonia-upload`

Admin review route:

- `/admin/family-uploads`

Family can submit:

- Photos.
- Videos.
- Voice notes.
- Funeral recording.
- Eulogy.
- Speeches.
- Written memories.
- Favourite sayings.
- Favourite songs.
- Favourite flowers.
- Favourite places.

Required fields:

- Contributor name.
- Relationship to Sonia.
- Contact email or phone optional.
- File upload.
- Memory text.
- Permission checkbox for private archive.
- Separate permission checkbox for public tribute use.
- Notes for Gannon.

Admin review features:

- Pending list.
- Approve for private archive.
- Approve for public tribute.
- Reject or hide.
- Add tags.
- Link to timeline.
- Link to child or family member.

## Phase 5. Sonia Memory Chat

Goal: make the chat box meaningful and safe without pretending to literally be Sonia.

Name:

- Sonia Memory Chat

Data sources:

- Family approved memories.
- Eulogy transcript.
- Speeches.
- Sonia's real sayings.
- Voice message transcripts.
- Captions from videos.
- Gannon's approved notes.

Rules:

- Do not invent memories.
- Say when information is not available.
- Keep tone warm, gentle, nostalgic, and family respectful.
- Clearly label as a memory based tribute assistant.
- No voice cloning unless separately approved by family.

## Phase 6. Voice and archive policy

Goal: preserve Sonia's real voice first, then decide later whether synthetic voice is appropriate.

Immediate safe approach:

- Store real voice messages.
- Store funeral recording.
- Store video audio.
- Transcribe everything.
- Let Sonia Memory Chat answer from transcripts.

Do not rush:

- Voice cloning.
- Synthetic voice replies.
- Public AI generated Sonia videos.

Only consider later with:

- Clear family consent.
- Clear labelling.
- Private review.
- Ability to disable instantly.

## Phase 7. New site direction away from Base44

Goal: plan the long term migration into a cleaner independent app while keeping the current site stable.

Rules:

- Do not throw away working systems.
- Keep commerce live and protected.
- Build new GWM OS modules in parallel.
- Migrate only after export, QA, backups, and feature parity.
- Current priority is stabilise, protect, and extend.

## Protected systems

Do not break:

- Stripe.
- Checkout.
- Cart.
- Orders.
- Webhooks.
- Promo codes.
- Inventory.
- Legal pages.
- Admin auth.
- Approval queue.
- Metricool safety.
- Agent approval rules.
