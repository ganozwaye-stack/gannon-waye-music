# TikTok Review Submission Package

## Purpose

This package supports TikTok Developer review for the Gannon Waye Music creator workflow.

The platform should be described as a private creator workflow tool for Gannon Waye. It is not a mass automation tool, not a third-party account manager, and not an auto-publishing system.

## Products to request

- Login Kit
- Content Posting API

Do not request Share Kit unless a real Share Kit flow is built and demonstrated.

## Scopes to request

- `user.info.basic`
- `user.info.stats`
- `video.list`
- `video.upload`

Do not request `video.publish` for this workflow. The safer review story is draft upload only, with final publishing controlled inside the TikTok app.

## Short app description

Official Gannon Waye creator workflow for content drafts, approvals, store operations, and TikTok creator tools.

## Longer review description

Gannon Waye Music is the official creator workflow platform for Australian singer-songwriter Gannon Waye. The platform manages content drafts, approvals, store operations, and TikTok creator tools for one authorised creator account.

The TikTok integration connects only to Gannon Waye's authorised creator account. Public website visitors do not connect their own TikTok accounts.

Login Kit is used to authenticate the creator account and display creator account details and statistics inside the private admin dashboard.

Content Posting API is used to upload approved video drafts to the creator's TikTok inbox for final review. Nothing is auto-published. The creator must manually publish from inside TikTok.

The platform is not used for mass automation, bulk posting, spam distribution, engagement manipulation, or third-party account management.

## Demo voiceover

> This is the TikTok creator workflow inside Gannon Waye Music.
>
> The platform connects to my authorised TikTok creator account using Login Kit.
>
> AI helps prepare content ideas, captions, drafts, and workflow recommendations, but nothing is automatically published without my approval.
>
> When a TikTok draft is ready, it goes through the Approval Queue first.
>
> After I approve it, the system uploads the draft to my authorised TikTok account for final creator review.
>
> The platform is designed for creator workflow management, not spam automation, not bulk posting, and not third-party account control.

## Recording route

Use these local/admin routes for the review recording:

1. `/admin/tiktok-review`
2. `/admin/tiktok-platform-review`
3. `/admin/tiktok-recording-studio`
4. `/tiktok-platform-review`

## Recording safety checklist

- Do not show API keys, client secrets, OAuth tokens, cookies, or passwords.
- Do not show private fan/customer/order data.
- Demonstrate creator approval before TikTok upload.
- State that upload is to TikTok Drafts/InBox only.
- State that final publish happens manually inside TikTok.
- Keep the recording calm, human, and easy for a TikTok reviewer to follow.

## Output location

The generated review recording and screenshots should be saved under:

- `review-screenshots/`
- `review-shots/`

