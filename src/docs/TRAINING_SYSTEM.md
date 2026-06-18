# 🎓 Gannon Waye Platform Training System

**Version:** 1.0  
**Last Updated:** May 7, 2026  
**For:** Gannon Waye (Artist/Admin)

---

## 📖 HOW TO USE THIS TRAINING SYSTEM

This is your complete guide to managing the Gannon Waye platform. Use the search function (Ctrl+F / Cmd+F) to find specific topics.

**Quick Navigation:**
- **Getting Started** → Section 1
- **Admin Dashboard** → Section 2
- **Music Management** → Section 3
- **Merchandise** → Section 4
- **Community** → Section 5
- **Finance** → Section 6
- **Marketing** → Section 7
- **Legal & Compliance** → Section 8
- **Troubleshooting** → Section 9

---

## 🔍 QUICK SEARCH INDEX

**Common Tasks:**
- Add new merch product → 4.2
- Send newsletter → 5.4
- View sales reports → 6.1
- Generate tax receipt → 8.3
- Post to social media → 7.2
- Edit release → 3.2
- Manage orders → 4.5
- Track charity donations → 6.4

**Page Locations:**
- `/admin` → Main Dashboard
- `/admin/merch` → Merchandise Management
- `/admin/orders` → Order Management
- `/admin/subscribers` → Subscriber CRM
- `/admin/financials` → Financial Dashboard
- `/admin/impact` → Charity Impact (public: `/impact`)
- `/admin/releases` → Music Releases
- `/docs/SOCIAL_MEDIA_CALENDAR.md` → Social Media Posts

---

## SECTION 1: GETTING STARTED

### 1.1 Accessing the Admin Panel

**URL:** https://gannonwaye.com/admin

**Login:**
1. Go to gannonwaye.com
2. Click "Admin" in navigation (or go to /admin)
3. Log in with your email: ganozwaye@gmail.com
4. You'll be redirected to the admin dashboard

**Navigation:**
- Left sidebar: Main navigation (desktop)
- Top bar: Mobile navigation
- Each section has dedicated pages

### 1.2 Understanding the Dashboard

**Main Dashboard (`/admin`)** shows:
- Total revenue (merch + support)
- Order statistics
- Subscriber count
- Fan engagement metrics
- Recent activity
- Quick links to key sections

**Key Metrics:**
- **Revenue:** Total sales + donations
- **Orders:** Pending, confirmed, shipped
- **Subscribers:** Email list size
- **Support Contributions:** One-time + recurring

### 1.3 User Roles

**Admin (You):**
- Full access to all sections
- Can create, edit, delete everything
- Can invite other admins

**Regular Users:**
- Can view their own orders
- Can update their profile
- Cannot access admin panel

---

## SECTION 2: ADMIN DASHBOARD NAVIGATION

### 2.1 Overview Section

**Path:** `/admin`

**What You See:**
- Business KPIs (revenue, orders, subscribers)
- 6-month trend charts
- Fan interest metrics
- Pending orders alert
- Release status overview

**Actions:**
- Click any metric to drill down
- View pending orders → `/admin/orders`
- Check release status → `/admin/releases`

### 2.2 Music Management

**Path:** `/admin/releases`

**Features:**
- Add new releases (singles, EPs, albums)
- Edit release details (title, artwork, lyrics)
- Set release dates
- Add streaming links (Spotify, Apple Music, etc.)
- Track release status (idea → released)

**How to Add a Release:**
1. Click "Add Release"
2. Fill in: Title, Type, Release Date
3. Upload artwork
4. Add description, lyrics, credits
5. Add streaming links when available
6. Set status
7. Click "Save"

**Release Status Workflow:**
- Idea → Writing → Pre-Production → Recording → Mixing → Mastering → Ready → Released

### 2.3 Countdown Management

**Path:** `/admin/release-countdown`

**Features:**
- Set release date (human-readable + ISO)
- Toggle artwork reveal
- Toggle merch store open/close
- Live countdown preview

**How to Set Countdown:**
1. Go to `/admin/release-countdown`
2. Click "Configure"
3. Set release date text (e.g., "THANKYOU out now")
4. Set ISO date for countdown timer
5. Toggle artwork/merch reveals
6. Click "Save"

**Current Settings:**
- Artwork: Hidden until reveal
- Merch: Opens May 10, 6pm AEST
- Countdown: Active

---

## SECTION 3: MERCHANDISE MANAGEMENT

### 3.1 Product Management

**Path:** `/admin/merch`

**Features:**
- Add/edit/delete products
- Multi-image gallery
- Size management
- Stock tracking
- Financial calculations (auto)

**How to Add a Product:**
1. Click "Add Product"
2. Enter: Name, Description, Category
3. Upload images (multiple supported)
4. Set pricing:
   - Sale Price (customer pays)
   - Cost Price (your cost)
   - Delivery Cost (shipping per unit)
   - Merchant Fee % (default 3.5%)
5. Add sizes (S, M, L, XL, etc.)
6. Set stock quantity
7. Toggle "Active" to show/hide in store
8. Click "Save"

**Auto-Calculations:**
- Profit per unit = Sale Price - Cost - Delivery - Fees
- Profit margin % = (Profit / Sale Price) × 100

### 3.2 Product Financials

**Path:** `/admin/merch-financials`

**Features:**
- View profit margins per product
- Edit cost prices
- Bulk edit mode
- Search products
- Total store financials

**Key Metrics:**
- Revenue per product
- Costs (product + delivery)
- Profit per unit
- Profit margin %
- Units sold

**How to Edit Costs:**
1. Go to `/admin/merch-financials`
2. Click "Costs" on any product
3. Enter: Cost Price, Delivery Cost, Merchant Fee %
4. See live profit calculation
5. Click "Save Financials"

### 3.3 Order Management

**Path:** `/admin/orders`

**Features:**
- View all orders
- Filter by status
- Update order status
- Send receipts
- Add tracking numbers
- Export to Google Sheets (auto)

**Order Statuses:**
- Pending → Confirmed → Shipped → Delivered
- Or: Cancelled

**How to Fulfill an Order:**
1. Go to `/admin/orders`
2. Find order (search or filter)
3. Click order to view details
4. Update status to "Shipped"
5. Add tracking number
6. Click "Send Receipt" (emails customer)
7. Order auto-syncs to Google Sheets

### 3.4 Thank You Cards

**Path:** `/admin/thank-you-cards`

**Features:**
- Add handwritten thank you cards to orders
- Track which orders received cards
- Bulk add cards to recent orders

**How to Add Cards:**
1. Go to `/admin/thank-you-cards`
2. Select recent orders
3. Click "Add Thank You Cards"
4. Cards marked as "sent" in system

### 3.5 Product Intelligence (AI)

**Path:** `/admin/product-insights`

**Features:**
- AI-generated marketing strategies
- Product performance analysis
- Target audience suggestions
- Social media caption ideas

**How to Use:**
1. Go to `/admin/product-insights`
2. Click "Generate Insights" on any product
3. AI analyzes sales + product data
4. Get: Description, angles, audience, captions
5. Copy/paste for marketing

---

## SECTION 4: COMMUNITY & CRM

### 4.1 Subscriber Management

**Path:** `/admin/subscribers`

**Features:**
- View all email subscribers
- Search/filter subscribers
- See supporter profiles
- Track engagement scores
- Add notes/tags

**Subscriber Data:**
- Name, email, phone
- Date of birth (for birthday discounts)
- How they found you
- Support tier (based on contributions)
- Total contributed
- Engagement score

**How to Add Notes:**
1. Click subscriber name
2. Scroll to "Add Note"
3. Type note (e.g., "VIP supporter", "Met at show")
4. Click "Save"

### 4.2 Gift Requirement Tracker

**Path:** `/admin/gift-verification`

**Features:**
- Track hoodie gift claims
- Verify social media screenshots
- Mark gifts as sent
- View completion status

**Gift Requirements:**
1. Follow on TikTok @gannonwaye
2. Follow on Instagram @ganozwaye
3. Like/comment/share latest post
4. Submit screenshot

**How to Verify:**
1. Go to `/admin/gift-verification`
2. Click pending verification
3. Check screenshot proof
4. Mark requirements as met
5. Update gift status to "Ready to Ship"
6. Add tracking when sent

### 4.3 Fan Management

**Path:** `/admin/fans`

**Features:**
- View community posts
- Approve/reject posts
- Feature fan content
- Moderate content

**Moderation:**
- All posts start as "Pending"
- Approve to show on community page
- Reject to hide (with reason)
- Feature to highlight on homepage

### 4.4 Newsletter

**Path:** `/admin/newsletter`

**Features:**
- Send welcome emails
- Broadcast to all subscribers
- Preview email content
- Track sent emails

**How to Send Newsletter:**
1. Go to `/admin/newsletter`
2. Preview email content
3. Click "Send to All Subscribers"
4. Emails sent via Gmail connector
5. Track in sent folder

**Welcome Email:**
- Auto-sent to new subscribers
- Includes your story
- Links to music + merch
- Personal touch

---

## SECTION 5: FINANCE & REPORTING

### 5.1 Financial Dashboard

**Path:** `/admin/financials`

**Features:**
- Total revenue breakdown
- GST calculations
- Net profit tracking
- Product-level financials
- Support contributions
- Tax reports

**Key Reports:**
- Income Statement (monthly)
- Product Profitability
- Support Revenue
- GST Obligations (10%)
- Net Profit After Tax

**How to Read:**
1. **Revenue:** Total sales + donations
2. **COGS:** Cost of goods sold
3. **GST:** 10% of taxable sales
4. **Fees:** Stripe/payment processing (5%)
5. **Net Profit:** Revenue - All costs

### 5.2 Charity Donation Tracking

**Path:** `/admin/charity-donations` (coming soon)

**Features:**
- Track monthly 10% donations
- Calculate amount owed to 1800RESPECT
- Record payment dates
- Generate impact reports

**Monthly Process:**
1. Run `trackMonthlyCharityDonation` function
2. Review calculated 10% amount
3. Make donation to 1800RESPECT
4. Record payment reference
5. Update status to "Paid"
6. Publish impact report

**Current Stats:**
- Public view: `/impact`
- Shows: Total raised, donated, pending

### 5.3 Tax Receipts

**Function:** `generateDonorReceipt`

**Features:**
- Auto-generate tax receipts
- Unique receipt numbers
- Includes charity impact
- Downloadable PDF/HTML

**How Donors Get Receipts:**
1. Make donation at `/back-this`
2. After payment, see "Download Receipt" button
3. Click to open receipt in new tab
4. Receipt includes:
   - Receipt number
   - Date, amount, donor details
   - 10% charity impact
   - Tax-deductible statement

**Admin View:**
- All receipts logged in SupportContribution entity
- Can regenerate if needed

### 5.4 Back of House Report

**Path:** `/admin/report`

**Features:**
- Comprehensive business report
- Sales analytics
- Engagement metrics
- Export to PDF

**Report Includes:**
- Revenue breakdown
- Top products
- Subscriber growth
- Fan engagement
- Charity impact
- Recommendations

---

## SECTION 6: MARKETING & PROMOTION

### 6.1 Social Media Posts

**Location:** `docs/SOCIAL_MEDIA_CALENDAR.md`

**What's Inside:**
- 21 pre-written posts (3 weeks)
- Optimized for each platform
- Includes captions, hashtags, image ideas
- Posting schedule recommendations
- Buffer/Hootsuite import format

**How to Use:**
1. Open `docs/SOCIAL_MEDIA_CALENDAR.md`
2. Copy post captions
3. Add your images
4. Schedule in Buffer/Hootsuite
5. Post at recommended times

**Platforms Covered:**
- Instagram (feed + stories)
- Facebook
- Twitter/X (thread format)
- LinkedIn
- TikTok (video scripts)

### 6.2 Promo Codes

**Path:** `/admin/promo-codes`

**Features:**
- Create discount codes
- Set discount % 
- Set max uses
- Track usage
- Activate/deactivate

**How to Create:**
1. Go to `/admin/promo-codes`
2. Click "Create Promo Code"
3. Enter: Code (e.g., LAUNCH15)
4. Set discount % (e.g., 15)
5. Set max uses (or unlimited)
6. Add description
7. Click "Save"

**Active Codes:**
- LAUNCH15: 15% off (first 20 orders)
- HOODIE20: 20% off hoodie

### 6.3 Birthday Discounts

**Path:** `/admin/birthdays`

**Features:**
- Auto-generate birthday codes
- Send birthday emails
- Track upcoming birthdays
- 20% discount codes

**How It Works:**
1. System checks subscriber birthdays daily
2. Finds birthdays within 3-day window
3. Generates unique 20% code
4. Sends birthday email with code
5. Code valid for 7 days
6. Excludes CDs (low margin)

**Manual Trigger:**
- Click "Run Birthday Process" to send manually
- View upcoming birthdays list
- See code usage stats

### 6.4 Impact Dashboard

**Public Page:** `/impact`

**Features:**
- Real-time charity stats
- Monthly breakdown
- 1800RESPECT commitment
- Transparency reporting

**Stats Shown:**
- Total supporters
- Total raised
- Amount donated to charity
- Pending donations
- Monthly breakdown with 10% calculations

**Admin Management:**
- Update monthly via `trackMonthlyCharityDonation`
- Record actual donations
- Publish impact reports

---

## SECTION 7: LEGAL & COMPLIANCE

### 7.1 Terms of Service

**Public Page:** `/terms-of-service`

**Key Sections:**
- Acceptance of terms
- Use of site (community rules)
- Merchandise & orders
- Donations & support (tax-deductible)
- Fan-submitted content rights
- Intellectual property
- Limitation of liability
- Australian Consumer Law
- Privacy policy reference
- Changes to terms
- Contact information

**Last Updated:** May 7, 2026

### 7.2 Privacy Policy

**Public Page:** `/privacy-policy`

**Key Sections:**
- Information collected
- How we use information
- Email communications (opt-out available)
- Third-party services (Stripe, Google)
- Data storage & security
- Your rights (access, correct, delete)
- Cookies policy
- Third-party links
- International data transfers
- Children's privacy (under 13)
- Changes to policy
- Complaints process (30-day response)
- OAIC contact info

**Last Updated:** May 7, 2026

### 7.3 Tax Compliance

**Requirements Met:**
- ✅ Tax-deductible receipts generated
- ✅ GST (10%) clearly displayed
- ✅ Service fees disclosed (5%)
- ✅ ABN placeholder (update when registered)
- ✅ Australian Consumer Law compliance
- ✅ Refund policy for major failures

**Monthly Tasks:**
1. Calculate GST collected
2. Calculate net profit
3. Set aside tax amounts
4. Lodge BAS (when registered for GST)
5. Keep records for 5 years

### 7.4 Consumer Protection

**ACL Compliance:**
- Guarantees cannot be excluded
- Replacement/refund for major failure
- Compensation for foreseeable loss
- Clear pricing (AUD)
- Fee breakdown before purchase
- Shipping estimates with variance

**Refund Policy:**
- Merchandise: Refund for defects/major failure
- Donations: Non-refundable (unless ACL applies)
- Digital products: No refund unless defective

---

## SECTION 8: TROUBLESHOOTING

### 8.1 Common Issues

**Issue:** Can't access admin panel  
**Solution:** Ensure you're logged in. Go to `/admin` and log in with ganozwaye@gmail.com

**Issue:** Product not showing in store  
**Solution:** Check "Active" toggle is on. Verify stock quantity > 0

**Issue:** Order not syncing to Google Sheets  
**Solution:** Check Google Sheets connector is authorized. Re-run syncOrderToSheets function

**Issue:** Receipt not generating  
**Solution:** Check contribution has stripe_payment_id. Re-run generateDonorReceipt function

**Issue:** Social posts not scheduling  
**Solution:** Manual posting required. Use Buffer/Hootsuite with docs/SOCIAL_MEDIA_CALENDAR.md

### 8.2 Function Testing

**Test Site Health:**
1. Go to `/admin/site-health`
2. Click "Run Site Health Check"
3. Review results (target: 90+ score)
4. Fix any critical issues

**Test Functions:**
- `automatedSiteTests` - Full system test
- `runSiteHealthCheck` - Quick health check
- `trackMonthlyCharityDonation` - Charity tracking
- `generateDonorReceipt` - Receipt generation

### 8.3 Performance Optimization

**Slow Loading?**
- Clear browser cache
- Check internet connection
- Reduce image file sizes
- Limit query results (use pagination)

**High Credit Usage?**
- Reduce AI function calls
- Optimize image generation
- Use cached data where possible
- Schedule heavy tasks for off-peak

---

## SECTION 9: DOCUMENTATION LOCATIONS

### 9.1 All Documentation Files

**Root Directory:**
- `PLATFORM_STATUS.md` - Overall platform status
- `docs/LEGAL_COMPLIANCE_UPGRADE.md` - Legal compliance details
- `docs/SOCIAL_MEDIA_CALENDAR.md` - Social media posts
- `docs/SOCIAL_MEDIA_SUPPORT_POSTS.md` - Additional social content
- `docs/ENTERPRISE_UPGRADE_COMPLETE.md` - System upgrades
- `docs/TESTING_CHECKLIST.md` - Testing procedures

**How to Access:**
1. In admin panel, look for "Docs" section
2. Or navigate directly: `/docs/[filename]`
3. Use search (Ctrl+F) to find specific topics

### 9.2 Quick Reference Cards

**Daily Tasks:**
- Check orders → `/admin/orders`
- Review subscribers → `/admin/subscribers`
- Monitor finances → `/admin/financials`
- Post to social → Use `docs/SOCIAL_MEDIA_CALENDAR.md`

**Weekly Tasks:**
- Run site health check → `/admin/site-health`
- Review product insights → `/admin/product-insights`
- Update charity tracking → Run `trackMonthlyCharityDonation`
- Send newsletter → `/admin/newsletter`

**Monthly Tasks:**
- Generate financial reports → `/admin/financials`
- Calculate GST obligations
- Track charity donation → 1800RESPECT
- Review legal compliance
- Update social media calendar

---

## 🎓 TRAINING COMPLETION

**Congratulations!** You now have complete knowledge of the Gannon Waye platform.

**Next Steps:**
1. ✅ Review each section
2. ✅ Practice in admin panel
3. ✅ Schedule first week of social posts
4. ✅ Run site health check
5. ✅ Set up monthly charity tracking

**Support:**
- Email: hello@gannonwaye.com
- Documentation: `/docs` folder
- System health: `/admin/site-health`

**Platform Version:** 1.0  
**Last Updated:** May 7, 2026  
**Status:** Production Ready ✅
