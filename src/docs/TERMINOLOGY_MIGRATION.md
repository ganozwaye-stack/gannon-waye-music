# Terminology Migration Guide

## Official Terminology Update

This document outlines the terminology shift across the Gannon Waye platform, moving from "fan" language to "supporter" language for a more premium, community-driven brand positioning.

---

## Terminology Map

| Old Term | New Term | Context |
|----------|----------|---------|
| Fan | Supporter | General audience member |
| Fans | Supporters | Plural audience |
| Fan Community | Inner Circle / Movement | Community members |
| Fan Messages | Community Posts | User-generated content |
| Fan Media | Supporter Media | Photos/videos from supporters |
| Fan Wall | Supporter Wall | Public showcase |
| Fan Activity | Supporter Activity | Live feed |
| Fan Management (Admin) | Community Management | Admin section |
| Fan Newsletter | Subscriber Newsletter | Email marketing |
| Fan Engagement | Supporter Engagement | Metrics/scoring |
| Followers | Supporters | Community size |

---

## Page URL Updates

### Public Routes
```
/fan-profile → /supporter-profile (optional redirect)
/fan-activity → /supporter-activity (optional redirect)
/community → /community (unchanged - already correct)
/email-preferences → /email-preferences (unchanged)
```

### Admin Routes
```
/admin/fans → /admin/fans (kept for backward compatibility, but label updated to "Community Messages")
/admin/newsletter → /admin/newsletter (renamed internally to "Subscriber Newsletter")
/admin/subscribers → /admin/subscribers (new CRM page)
```

---

## Component Naming Updates

### Updated Components
- ✓ `SupporterLeaderboard` (was `SupporterLeaderboard`)
- ✓ `CommunityMessages` (context for fan posts)
- ✓ `SupporterActivity` (page/section)
- ✓ `EngagementScoring` (new system)
- ✓ `SupporterMilestones` (new badges)

### Badge System
```javascript
SUPPORTER_BADGES = {
  EARLY_SUPPORTER: 'Early Supporter',
  DAY_ONE: 'Day One',
  MAJOR_SUPPORTER: 'Major Supporter',
  RECURRING_CHAMPION: 'Recurring Champion',
  COMMUNITY_VOICE: 'Community Voice',
  GIFT_COLLECTOR: 'Gift Collector',
  MERCH_ENTHUSIAST: 'Merch Enthusiast',
}
```

---

## Database & CMS Updates

### Entity References
- `EmailSubscriber` → remains `EmailSubscriber` (core entity)
- `FanPost` → label changed to "Community Posts"
- `FanMedia` → label changed to "Supporter Media"
- `SupportContribution` → already correct
- `GiftRequirementTracker` → already correct
- `SupporterProfile` → already correct

### Field Labels
```javascript
// In forms and admin dashboards
"Fan Name" → "Supporter Name"
"Fan Email" → "Supporter Email"
"Fan Message" → "Community Message"
"Fan Engagement Score" → "Engagement Score"
```

---

## CTA & Button Text Updates

| Old | New | Location |
|-----|-----|----------|
| "Join the Fan Community" | "Join the Inner Circle" | Community page |
| "Be a Fan" | "Be a Supporter" | CTAs |
| "Fan Support" | "Support Now" | Buttons |
| "Message the Fans" | "Share With Community" | Community posts |
| "View Fan Wall" | "View Supporter Wall" | Gallery sections |

---

## Email Template Updates

### Newsletter Subject Lines
```
"Welcome. You're a fan now" 
→ "Welcome. You're part of this movement"
```

### Email Body References
```
"Thank you for being a fan"
→ "Thank you for your support"

"Fans like you make this possible"
→ "Supporters like you make this possible"

"Join our fan community"
→ "Join the inner circle"
```

---

## Admin Dashboard Updates

### Labels
- "Fan Management" → "Community Management"
- "Fan Newsletter" → "Subscriber Newsletter"
- "Fans" → "Community Members"
- "Supporter Registry" (new page)
- "Engagement Reports" (new name for "Report & Data")

### Sidebar Navigation
```
Community
├── Supporter Registry (new CRM)
├── Community Messages
├── Community Media Wall
├── Social Videos
├── Subscriber Newsletter
├── Promo Codes
├── Engagement Reports
└── Reveal Newsletter
```

---

## Analytics & Reporting

### Metrics Labels
```
"Fan Count" → "Supporter Count"
"Fan Engagement" → "Engagement Score"
"Fan Posts" → "Community Posts"
"Fan Media" → "Supporter Media"
"Active Fans" → "Active Supporters"
```

---

## Brand Copy Examples

### Before
> "This community is for fans who get it. For people who understand the message."

### After
> "This is the inner circle. For supporters who believed first, before the noise, before everything changed."

### Before
> "Thank you to all our fans for the love and support."

### After
> "Thank you to our early supporters. You're the movement."

---

## Social Media & Marketing

### Hashtags
```
#GannonFans → #GannonMovement
#FanCommunity → #InnerCircle
#SupportGannon → #BePartOfThis
```

### Bio / Description Updates
```
"Home of Gannon's fan community"
→ "An intimate movement of supporters, believers, and Day Ones"
```

---

## Migration Checklist

### Content Updates (In Progress)
- [ ] Update all page headers & titles
- [ ] Update all button text & CTAs
- [ ] Update all email templates
- [ ] Update email subject lines
- [ ] Update admin dashboard labels
- [ ] Update navigation sidebar
- [ ] Update form field labels
- [ ] Update error messages
- [ ] Update success messages
- [ ] Update help text & tooltips

### Technical Updates (In Progress)
- [ ] Update component props & names
- [ ] Update database field display labels
- [ ] Update API response formatting
- [ ] Update analytics event names
- [ ] Add URL redirects for old paths
- [ ] Update sitemap & metadata

### Brand Updates (In Progress)
- [ ] Update social media bios
- [ ] Update email signatures
- [ ] Update about page copy
- [ ] Update homepage messaging
- [ ] Update contact/support page
- [ ] Update privacy policy (if needed)
- [ ] Update terms of service (if needed)

### Testing (In Progress)
- [ ] Test all CTAs link correctly
- [ ] Test terminology consistent across pages
- [ ] Test mobile display of new terminology
- [ ] Test form validation messages
- [ ] Test email content
- [ ] Grammar & spell check all copy
- [ ] Brand voice review

---

## Backward Compatibility

### URL Redirects
All old URLs redirect to new ones automatically:
```
/fan-profile → /supporter-profile (optional)
/fan-activity → /supporter-activity (optional)
```

### Data Structures
No changes to underlying data structures. All terminology updates are UI/copy only.

### APIs
API endpoints remain unchanged. Response field names unchanged. Only display labels updated.

---

## Style Guide

### Capitalization
- "Supporter" (capitalized when referring to the group)
- "supporter" (lowercase in general text)
- "Inner Circle" (always capitalized - brand term)
- "Movement" (capitalized when referring to the community)

### Tone
- Professional but warm
- Community-focused, not transactional
- Emotionally resonant
- Authentic to Gannon's voice
- No corporate jargon

---

## Questions & Support

For questions about terminology implementation:
- Refer to this guide
- Check the TESTING_CHECKLIST.md for verification
- Review brand voice in existing pages
- Maintain consistency across sections

**Last Updated:** May 7, 2026  
**Status:** Active Migration  
**Phase:** 1 Complete, 2-3 In Progress