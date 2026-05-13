# Site Audit — Gannon Waye Website
**Date:** 13 May 2026  
**Status:** Pre-launch — Stripe in test mode, store closed

---

## ✅ FIXES APPLIED THIS SESSION

| Issue | Fix Applied |
|-------|-------------|
| Store was showing "Order Now" buttons with Stripe inactive | All products now show "I love this! Notify me" interest buttons — no checkout |
| "🔥 THANKYOU15 promo code" launch banner was live | Removed |
| Promo code entry field shown in checkout | Removed (store is closed) |
| "Pre-save Coming Soon" link went nowhere meaningful | Changed to "Hear more about it →" → /music |
| GW Heart in sticky bar showing double artwork thumbnail | Fixed — uses correct heart image |
| Footer support link missing heart branding | GW heart added both sides of centre CTA |
| Checkout had apparel delay warning with specific dates | Removed (store is closed) |
| Delivery dates showed "05 June" specific day | Simplified to "June 2026" / "July 2026" |

---

## 🔴 CRITICAL — Must fix before store opens

### Stripe
- [ ] Switch from TEST mode to LIVE mode — get live keys from Stripe dashboard
- [ ] Replace STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in Settings → Environment Variables  
- [ ] Test a real $1 transaction before opening store
- [ ] Set STORE_OPEN = true in pages/Store.jsx

### Payment flow
- [ ] The checkout uses "setup" mode (saves card, charges later) — confirm this is still the intended model
- [ ] Pre-order charge date is hardcoded as "June 5, 2026" in CheckoutModal — update if this changes

---

## 🟡 NEEDS ATTENTION — Content & UX

### Pages with potential dead ends
- **/music** — Spotify/Apple Music/YouTube links only appear after June 5 (`isReleased()`). Before that, no links show. ✅ Correct behaviour, but make sure links are entered in the database the day of release.
- **/lyrics** — Reads from database. If no lyrics are entered, the page may appear empty. **→ Add lyrics to the Release record in Admin → Releases**
- **/videos** — Fetches from FeaturedVideo and SocialVideo entities. If empty, page shows nothing. **→ Add at least 1-2 videos in Admin → Videos**
- **/community** — Fan posts require admin approval. New visitors see an empty wall until posts are approved. Consider approving a few starter posts.
- **/impact** — Reads from SupportContribution & CharityDonationTracker. If no data, numbers show as $0. Acceptable for now.
- **/bookings** — Form works. Enquiries go to Admin → Fans. Email notification fires. ✅
- **/fan-profile** — Requires login. If user not logged in, may error. Check login redirect.
- **/order-status** — Works for email lookup. ✅
- **/7-day-standard** — Static page. ✅
- **/mastering** — Full upload workflow. Needs testing with a real audio file.
- **/gift-checklist** — Token-based, no login required. ✅

### Navigation dead ends / confusing links
- Navbar: "Store" highlighted like a CTA — consider making it just a normal link now store is closed
- Footer "Back This Project 🤍" is correct ✅
- Mobile bottom tabs — make sure they reflect current nav correctly

### Content gaps
- No pre-save link exists anywhere (Spotify pre-save not set up). Remove all mentions of "pre-save" until this is live.
- Social media links (TikTok, Instagram, YouTube) in footer/settings — confirm these are updated in Admin → Settings
- Merch product descriptions are short — could be richer for SEO and conversion

---

## 🟢 WORKING WELL

- ✅ Email subscriber signup (footer form) — captures name, email, phone, birthday, how_found
- ✅ Welcome email automation fires on new subscriber
- ✅ Interest registration for merch products
- ✅ Admin notification emails for new orders, bookings, interest
- ✅ Order status lookup by email
- ✅ Support/Back This contribution flow (BackThis page)
- ✅ Promo code validation system (ready for when store opens)
- ✅ Image gallery rotation on merch products (tote, tee)
- ✅ Countdown timer to June 5 release
- ✅ Ambient audio player in sticky bar
- ✅ Admin dashboard — orders, subscribers, merch management
- ✅ SEO-friendly page titles and meta descriptions
- ✅ Mobile responsive on all pages
- ✅ The 7 Day Standard page
- ✅ Community fan post submission with moderation

---

## 💡 RECOMMENDED UPGRADES (when ready)

1. **Spotify Pre-Save** — Create a pre-save campaign via SubmitHub or feature.fm. Add the link to the hero and music page. This is the #1 missing promotional tool right now.

2. **YouTube channel** — Create dedicated "Gannon Waye" artist channel. Upload the promotional reel, behind-the-scenes content, and lyric videos. Link in Site Settings.

3. **TikTok presence** — Even 3 short clips before June 5 will drive organic traffic. Use content from the website itself (quote cards, behind the scenes).

4. **Press kit page** — /press — high-res photos, bio, press release, contact. Journalists and event promoters need this.

5. **Email automation** — Send a "1 week to go" email blast to all subscribers on May 29.

6. **Fan reviews** — ProductReview entity exists. Add review display to the store product cards.

7. **Merch bundle discount** — Consider a "CD + Tote" bundle offer at launch.

---

## ❓ DOES THE APP WORK WHEN YOUR COMPUTER IS OFF?

**YES — completely.** The app runs on Base44's servers, not your computer. Once published:
- The website is live 24/7 regardless of your device
- Email automations fire automatically (welcome emails, order notifications, etc.)
- Subscribers can sign up at any time
- Interest registrations capture regardless of whether you're online
- The only things that need YOU are: approving fan posts, managing orders, and answering booking enquiries

---

## 🎬 PROMOTIONAL REEL — What to capture

For your social media reel to promote the website, capture these screens/moments:

1. **Hero section** — full-screen background image with "Thank You" debut single text fading in
2. **Countdown timer** — close-up of the days counting down to June 5
3. **Store products** — slow scroll through the tote bag gallery rotating, then the tee
4. **Community wall** — fan posts and the "Be part of this" section
5. **The 7 Day Standard** — opening title card
6. **"Back This" page** — the support tier cards
7. **Mobile view** — show it looking great on phone
8. **Sticky bar** — the ambient audio player playing "Thank You"

**Write-up for the reel caption:**
> "The Gannon Waye website is live — and it's more than just a website. It's a home for honest music, real stories, and a community that actually means something. Debut single 'Thank You' drops 5 June 2026. Pre-order merch, join the community, and be part of this. Link in bio. 🤍"