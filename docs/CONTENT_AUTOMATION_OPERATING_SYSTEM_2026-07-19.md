# Content Automation Operating System

Date: 2026-07-19

## Operating Rule

The system may auto-organise, auto-script, auto-caption, auto-brief edits, auto-create thumbnails, auto-create ApprovalQueue items and auto-prepare Metricool/TikTok/YouTube-ready packages.

The system must not auto-post, auto-schedule, send emails, spend money, change prices, order products, delete files or expose private coaching/memorial material without Gannon approval.

## Source Of Truth

Google Drive is the source of truth for source files and finished exports:

`G:\My Drive\Gannon Waye Music\Content Production`

The Base44/Emergent dashboard should store records and links, not become the only copy of the media.

## Workflow

1. Record video on phone.
2. Save the raw file into `00-Recordings Inbox`.
3. Video Intake Agent creates or updates a VideoIntakeItem.
4. Scripting and Caption Agent creates hook, script, caption, first comment, hashtags, CTA and CapCut prompt.
5. Brand preset is attached: Raw Truth, Black Gold Merch, Memorial Garden or Release Energy.
6. Edited draft goes into `03-Edited Drafts`.
7. Final package goes to `04-Approval Queue`.
8. Gannon approves, rejects or requests edits in the Approval Queue.
9. Approved package moves to `05-Approved To Schedule`.
10. Scheduling happens through Metricool/native platform only after approval.
11. Posted proof and public URL are saved to `07-Posted Archive`.
12. Performance Learning Agent reviews clicks, orders, email signups and engagement, then recommends more of what worked.

## Agents Coming Over

- `video_intake_agent`: watches/classifies Drive media and creates intake records.
- `scripting_caption_agent`: writes hooks, captions, first comments, hashtags and CapCut prompts.
- `metricool_agent`: monitors approved scheduling and imported performance.
- `content_revenue_agent`: creates revenue-focused content ideas.
- `merch_sales_agent`: creates merch push ideas and bundle actions.
- `performance_learning_agent`: reviews clicks, orders, subscriber growth and engagement.
- `literature_researcher`: stays as a research/literature review agent, not a publisher.
- `approval_gate`: remains the safety controller.
- `revenue_orchestrator`: coordinates money tasks and proposals.

## CapCut Role

CapCut should be the hands-on editor for now, not the automation engine. The dashboard generates CapCut prompts and preset instructions. A human or editor exports the MP4 back into Drive. Full automated rendering can be considered later with a dedicated video rendering API if needed.

## Fastest Money Path

Today/tomorrow priority:

1. Push THANKYOU merch with three short videos.
2. Every public music, memorial and merch page captures email.
3. Coaching stays private until Gannon approves public launch.
4. Use Metricool and platform stats to identify which clips create clicks or store visits.
5. Repeat the winning format with the same preset and stronger CTA.

## Three Starter Videos

1. `Who are you saying thankyou to?`
   - Preset: Release Energy.
   - CTA: comment a name, listen, visit store.
   - Product angle: THANKYOU collection.

2. `Respect is earned`
   - Preset: Black Gold Merch.
   - CTA: shop the hoodie.
   - Product angle: hoodie plus song meaning.

3. `Winter writing bundle`
   - Preset: Black Gold Merch.
   - CTA: view the bundle.
   - Product angle: journal, pen and thermos as a healing/creative ritual.

## Metrics To Review Weekly

- Video views.
- Average watch time.
- Clicks to store.
- Email subscriber growth.
- Orders by campaign.
- Revenue by product.
- Approval rejects/edits, because rejected drafts tell the agents what not to repeat.
