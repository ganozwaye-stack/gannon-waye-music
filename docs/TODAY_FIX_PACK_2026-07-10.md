# Today Fix Pack — 2026-07-10

This is the practical queue for getting the system earning, publishing, and safe.

## 1. HeyGen — Gannon AI twin

Status: ready for first private test.

Use:

- Avatar look: `646da572f3284a1fa6bff984d6f3471c`
- Voice: `f7ffebd851b74bd1ad83d83a1087b2f4`
- Best first format: portrait 9:16 for TikTok/Reels/Shorts.

### First 15-second test script

> Hey, it’s Gannon. I wrote these songs for the moments when you feel like you have to hold it all together on your own. If you’ve been carrying something heavy, I hope this music gives you a place to breathe.

Purpose:

- Test face quality.
- Test voice quality.
- Test emotional tone.
- Test captions.
- Do not publish.

Recommended visual style:

- Cinematic.
- Deep garden green, warm gold, soft black.
- Minimal text.
- Artist documentary feeling.

### First 30-second release script

> Hey, it’s Gannon. “Without You Here” is one of the most personal songs I’ve ever made. I wrote it in my loungeroom, not from a perfect place, but from the ache of missing Mum and trying to turn that grief into something honest. Mum’s Garden is where I’m building a place for people to come, remember, listen, and feel less alone. If you’ve ever missed someone so much it changed the air around you, this one is for you.

Purpose:

- Private review only.
- Use as launch/release content after approval.
- Do not auto-post.

## 2. HeyGen API key

Status: present in Windows User environment.

Do not:

- Paste the key into chat.
- Put it in `VITE_` variables.
- Commit it.
- Show it in screenshots.

Next:

- Restart local terminal/app sessions so new processes can read the key.
- Add the same value to Base44 server secrets once Base44 login/settings access works.

## 3. Mum's Garden

Status: local page renders and private access route works.

Next fixes:

1. Manual play-test Ave Maria and Amazing Grace.
2. Confirm all final images are approved.
3. Remove/avoid grave, coffin, blurred, duplicate, and unclear-context images.
4. Confirm family upload form goes to approval queue only.
5. Deploy current local code to Base44 once CLI/editor sync works.

Do not:

- Generate a fake Sonia/Mum “alive” deepfake without explicit consent wording and asset approval.
- Use living family/grandchild names publicly unless approved.

## 4. Store / merch money blocker

Critical blocker:

- Base44 has open `PaymentDiagnostic` records: `STRIPE_SECRET_KEY missing or invalid`.

Fix:

1. Confirm the live Stripe secret key in Base44 server secrets.
2. Do a low-value test checkout.
3. Confirm order row appears.
4. Confirm webhook/receipt.
5. Resolve the PaymentDiagnostic records only after a successful test.

Also:

- Hide or relabel active products with zero stock.
- Thea Elsworth shipped order exists but needs tracking or “shipped without tracking” wording.

## 5. Content automation

Current issue:

- Drafts exist.
- Media is not started.
- Metricool readiness is false.
- Approval queue is backing up.

Fix:

1. Pick one post per day only.
2. Create media asset.
3. Attach public media URL.
4. Mark media approved.
5. Send/schedule via Metricool only after approval.

Best first post:

- “Without You Here / Mum’s Garden” 30-second HeyGen/Gannon private test video.

## 6. Coaching / mindset business

Current issue:

- Coaching pages exist.
- Leads table has one test/request.
- Workbooks/resources are empty.

Best build:

1. Use public-safe Resilience Fitness material.
2. Create one free lead magnet: “The Self Respect Reset Workbook.”
3. Create one paid starter offer: “Resilience Foundations.”
4. Create one premium offer: “Creative Breakthrough Coaching.”
5. Add consent wording: coaching is not therapy, crisis support not provided, emergency help required for crisis.

Do not use publicly:

- Client names.
- Court documents.
- Relationship/counselling documents.
- Private legal, health, or financial documents.

## 7. GanozMix Direct

Current issue:

- eBay token expired / invalid token type.
- Orders table empty.
- JobQueue has dead-letter extraction/enrichment jobs.
- Some products look “listed” but have no real live URL.

Best first product:

- Magnetic Cable Organiser (Bamboo).

Fix:

1. Reconnect eBay OAuth with proper Bearer token.
2. Clear or archive dead test jobs.
3. Verify supplier cost, shipping, and return risk.
4. Create one approved listing template.
5. Publish only after manual approval.

## 8. Laptop/account hardening

Current issue:

- Victor De Mauro and `victo` accounts are enabled.
- They are normal Users, not Administrators.
- They show password not required.
- No active SMB sessions found.
- RDP disabled.
- Defender on.
- File and Printer Sharing is enabled on Public network.

Recommended next actions after file migration is safe:

1. Disable Victor De Mauro and `victo`.
2. Disable File and Printer Sharing inbound rules if not needed.
3. Reboot modem/router.
4. Change Wi-Fi password.
5. Remove unknown devices from modem admin panel.
6. Change Microsoft, Google, Base44, Stripe, TikTok, HeyGen passwords and ensure MFA.

Do not delete profiles until archive/migration verification is complete.

## 9. Private phone / Brazil contact

Safe setup:

- Public website: contact form only.
- Admin: call log and lead follow-up.
- VoIP provider: private outbound calls.
- No public phone number shown.

Do not spoof caller ID or bypass provider registration.

## Immediate approve/reject list

Approve one at a time:

1. Create private 15-second HeyGen Gannon test video.
2. Create private 30-second “Without You Here / Mum’s Garden” test video.
3. Fix Stripe secret in Base44.
4. Reconnect GanozMix eBay OAuth.
5. Build first coaching workbook from Resilience Fitness materials.
6. Disable Victor/victo accounts.
7. Disable File and Printer Sharing inbound rules.
