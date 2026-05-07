# Gannon Waye Platform — Master System Specification

**Status**: Pre-Commercial Launch (May 10, 2026)  
**Safety Level**: Hardened for 1-2 concurrent users  
**Environment**: Australia/Sydney timezone  

---

## PART 1: ARCHITECTURE OVERVIEW

### System Philosophy
- **Single Source of Truth**: Centralized business logic (lib/businessLogic.js), data sync (lib/dataSync.js), event system (lib/eventAutomation.js)
- **Event-Driven**: All state changes emit events → automations → side effects (emails, sheets, analytics)
- **Idempotent**: All side-effect functions check IdempotenceLog before executing
- **Locked**: Per-customer order locks prevent concurrent transactions
- **Audited**: Every entity change logged with rollback capability

### Core Layers

```
┌─ Frontend (React + Vite)
│  ├─ Pages (public + admin)
│  ├─ Components (UI + business logic)
│  ├─ Hooks (auth, queries, forms)
│  └─ State (React Query, local storage)
│
├─ Backend Functions (Deno Deploy)
│  ├─ Payment (Stripe integration)
│  ├─ Email (Gmail API)
│  ├─ CRM (booking workflow)
│  ├─ Sync (Google Sheets)
│  └─ Analytics (custom events)
│
├─ Data Layer (Base44 Entities)
│  ├─ Commerce (products, orders, contributions)
│  ├─ CRM (subscribers, supporters, bookings)
│  ├─ System (audit logs, idempotence, locks)
│  └─ Media (releases, videos, fan submissions)
│
└─ Integrations (OAuth connectors)
   ├─ Gmail (send, read)
   ├─ Google Sheets (sync orders)
   └─ Stripe (payments)
```

---

## PART 2: ENTITY MODEL

### Core Entities & Relationships

#### Commerce Domain
```
MerchProduct
├─ id, name, description, category
├─ sale_price, cost_price, delivery_cost, merchant_fee_percent
├─ profit_margin_percent, total_profit_per_unit (calculated)
├─ stock_quantity, sizes_available
├─ image_url, images_array
└─ is_active

MerchOrder
├─ id, customer_name, customer_email, shipping_address
├─ items[] { product_id, product_name, size, quantity, price }
├─ total_amount
├─ status (pending→confirmed→shipped→delivered)
└─ tracking_number, notes

SupportContribution
├─ id, supporter_name, supporter_email
├─ amount (base), total_charged (with fees)
├─ frequency (once, fortnightly, monthly)
├─ tier_label, stripe_payment_id
├─ message
├─ idempotence_key (payment_id for retry safety)
└─ description
```

#### CRM Domain
```
EmailSubscriber
├─ email, name, phone
├─ date_of_birth (for birthday discounts)
├─ how_found (marketing source)
└─ description

SupporterProfile
├─ supporter_email, supporter_name
├─ tier (with_you, movement, inner_circle, day_one)
├─ total_contributed (LTV in AUD)
├─ message, is_public, badge
└─ description

BookingEnquiry
├─ full_name, company_venue, email, phone
├─ booking_type (live_performance, festival, private_event, wedding, etc.)
├─ event_date, budget_range, location, audience_size
├─ event_details, accessibility_needs, technical_requirements
├─ social_links[], attachment_urls[]
├─ status (new_enquiry→reviewing→contacted→negotiating→confirmed→completed)
├─ assigned_to, notes, last_updated
└─ referral_source

GiftRequirementTracker
├─ subscriber_email, subscriber_name
├─ tiktok_followed, instagram_followed, post_engaged (booleans)
├─ screenshot_submitted (URL or status)
├─ status (not_started→in_progress→all_requirements_met→gift_claimed→gift_sent)
├─ checklist_token (unique, no-login access)
├─ gift_sent_date
└─ notes
```

#### Content Domain
```
Release
├─ title, type (single, ep, album)
├─ status (idea→writing→pre_production→recording→mixing→mastering→ready→released)
├─ release_date, artwork_url, description, lyrics, credits
├─ distributor, distributor_link
├─ streaming_links (spotify, apple_music, youtube)
├─ price, is_published
└─ other_links[]

SocialVideo
├─ title, platform (instagram, tiktok)
├─ url, thumbnail_url
├─ is_featured, sort_order
└─ description

FeaturedVideo
├─ title, platform (instagram, tiktok, youtube)
├─ url, thumbnail_url
└─ is_active

FanMedia
├─ name, caption, file_url
├─ file_type (photo, video)
├─ consent_feature, is_featured
└─ description

FanPost
├─ author_name, author_email, content
├─ type (message, review, photo)
├─ status (pending→approved→rejected)
```

#### System Domain
```
AuditLog
├─ entity_name, entity_id, action (create, update, delete)
├─ user_email, user_role, timestamp
├─ changes[] { field, old_value, new_value }
├─ description
└─ metadata { rollback_snapshot, ip_address, session_id }

IdempotenceLog
├─ idempotence_key (payment_id or request_id)
├─ result { success, timestamp, data }
└─ created_at

OrderLock
├─ customer_email (unique constraint)
├─ locked_at, locked_until (5 min expiry)
└─ order_id

SiteReveal
├─ artwork_revealed, merch_revealed (booleans)
├─ release_date_text, release_date_iso
└─ description

SiteSettings
├─ artist_name, bio
├─ hero_image_url, profile_image_url
├─ social_urls (instagram, facebook, twitter, tiktok, youtube, spotify, apple_music)
└─ email_contact

PromoCode
├─ code, discount_percent
├─ max_uses, times_used
├─ description, is_active

CharityDonationTracker
├─ month (YYYY-MM), total_support_received
├─ donation_amount_owed (10%), donation_amount_paid
├─ status (pending→paid→verified)
├─ contribution_count, payment_date, payment_reference
└─ notes

EmailPreference
├─ email, name
├─ consent_new_music, consent_behind_scenes, consent_tour_events
├─ consent_merch_drops, consent_exclusive_content, consent_personal_stories
└─ description

MerchInterest
├─ product_id, product_name, name, email, phone
├─ consent_email, consent_news, consent_events, consent_merch
└─ description

User (built-in)
├─ id, email, full_name, role (admin, user)
└─ (extensible with custom fields)
```

### Indexes & Constraints
```sql
-- Uniqueness constraints
OrderLock: UNIQUE(customer_email)
PromoCode: UNIQUE(code)
MerchProduct: Index on is_active, stock_quantity

-- Foreign key relationships (implicit via IDs)
MerchOrder.items[].product_id → MerchProduct.id
BookingEnquiry.assigned_to → User.email
GiftRequirementTracker.subscriber_email → EmailSubscriber.email
SupporterProfile.supporter_email → EmailSubscriber.email

-- Search indexes
AuditLog: Index on entity_name, user_email, timestamp (for audit queries)
IdempotenceLog: Index on idempotence_key (for fast dedup)
MerchOrder: Index on customer_email, status
```

---

## PART 3: INFRASTRUCTURE

### Deployment Topology
```
┌─ Frontend (Vite SPA)
│  ├─ Static hosting (Base44 CDN)
│  ├─ React 18 + Tailwind CSS
│  └─ Build: npm run build

├─ Backend Functions (Deno Deploy)
│  ├─ 33 serverless functions
│  ├─ Environment: Deno 1.x
│  └─ No persistent state (stateless)

├─ Database (Base44 Managed)
│  ├─ PostgreSQL-compatible
│  ├─ Real-time subscriptions
│  └─ 20 entity types

└─ Integrations (OAuth)
   ├─ Gmail (SMTP equivalent)
   ├─ Google Sheets (sync)
   └─ Stripe (payments)
```

### Secrets & Environment
```
STRIPE_SECRET_KEY (for server-side payment processing)
STRIPE_PUBLISHABLE_KEY (for client-side payment UI)
GOOGLE_SHEET_ID (target sheet for order/supporter sync)
```

### Storage & Backups
- **Files**: Base44 managed (user uploads, generated PDFs, images)
- **Database**: Base44 managed (daily snapshots, point-in-time recovery)
- **Audit Trail**: Permanent (IdempotenceLog, AuditLog retention = 30+ days)

### CDN & Performance
- **Frontend**: Vite builds to static assets, cached globally
- **Images**: Lazy-loaded, optimized
- **API**: Base44 SDK handles connection pooling

---

## PART 4: AUTHENTICATION & AUTHORIZATION

### User Roles
```javascript
// Built-in
'admin' - Full access (orders, subscribers, settings, reports)
'user'  - Limited access (own orders, own supporter profile, email preferences)

// RLS (Row-Level Security) Rules Applied
MerchProduct:   CREATE/UPDATE/DELETE = admin only; READ = active or admin
MerchOrder:     READ = own customer_email or admin; UPDATE/DELETE = admin only
Booking:        READ/UPDATE/DELETE = admin only
AuditLog:       READ/UPDATE/DELETE = admin only
SupporterProfile: READ = public profiles + own email + admin; UPDATE = self or admin
EmailPreference:   UPDATE = self; READ = admin only
```

### OAuth Integrations
```
Gmail:
  ├─ Scopes: gmail.send, gmail.readonly
  ├─ Used by: sendOrderReceipt, sendWelcomeEmailGmail, etc.
  └─ Token refresh: Pre-fetched before long operations

GoogleSheets:
  ├─ Scopes: spreadsheets, drive.file
  ├─ Used by: syncOrderToSheets, syncTunecore
  └─ Token refresh: Pre-fetched before long operations

Stripe:
  ├─ Method: API keys (not OAuth)
  ├─ Used by: createPaymentIntent, payment processing
  └─ Secret key = server-side only
```

---

## PART 5: EVENT SYSTEM & WORKFLOWS

### Event Registry

```javascript
EVENT_TYPES = {
  // Orders
  ORDER_CREATED,
  ORDER_UPDATED,
  ORDER_SHIPPED,
  ORDER_DELIVERED,
  ORDER_CANCELLED,
  
  // Contributions
  CONTRIBUTION_RECEIVED,
  
  // Subscribers
  SUBSCRIBER_ADDED,
  
  // Products
  PRODUCT_CREATED,
  PRODUCT_UPDATED,
  PRODUCT_DELETED,
  
  // Inventory
  INVENTORY_CHANGED,
  INVENTORY_LOW,
  
  // Customers
  SUPPORTER_CREATED,
  SUPPORTER_UPDATED,
  
  // Campaigns
  GIFT_CLAIMED,
  PROMO_USED,
  BIRTHDAY_TRIGGERED,
  
  // System
  CHARITY_DONATION,
  PAYMENT_FAILED,
  EMAIL_FAILED,
}
```

### Event Handlers (Automations)

**ORDER_CREATED** → onNewOrderAutomation
```
1. Check IdempotenceLog (prevent duplicate processing)
2. Decrement inventory (optimistic locking)
3. Send receipt email (Gmail)
4. Update supporter profile
5. Sync to Google Sheets
6. Notify admin
7. Record IdempotenceLog
```

**CONTRIBUTION_RECEIVED** → generateDonorReceipt + syncSupporterProfile
```
1. Check Idempotence
2. Generate donor receipt (PDF)
3. Allocate 10% to 1800RESPECT
4. Update SupporterProfile (tier, LTV, badge)
5. Create EmailPreference if needed
6. Record IdempotenceLog
```

**SUBSCRIBER_ADDED** → onNewSubscriberWelcome
```
1. Check IdempotenceLog
2. Send welcome email
3. Create GiftRequirementTracker
4. Record IdempotenceLog
```

**BOOKING_CREATED** → notifyAdminBookingEnquiry
```
1. Send confirmation to enquirer
2. Notify admin
3. Create audit log
```

**ORDER_SHIPPED** → onOrderShipped
```
1. Send tracking email
2. Update order status
3. Emit ORDER_SHIPPED event
```

### State Machines

**Booking Workflow**
```
new_enquiry → reviewing → contacted → negotiating → confirmed → completed
                                    ↓
                                 declined → archived
```

Rules enforced in `lib/bookingStateMachine.js`

**Gift Claim Workflow**
```
not_started → in_progress → all_requirements_met → gift_claimed → gift_sent
```

**Order Status**
```
pending → confirmed → shipped → delivered
            ↓
         cancelled
```

---

## PART 6: API CONTRACTS

### Payment Intent Creation
```
POST /api/functions/createPaymentIntent
{
  "amount": number (AUD cents),
  "currency": "aud",
  "customerEmail": string,
  "customerName": string,
  "productName": string,
  "metadata": { frequency, base_amount, type }
}

Response:
{
  "clientSecret": string,
  "publishableKey": string,
  "amount": number
}
```

### Order Locking Middleware
```
POST /api/functions/orderLockingMiddleware
{
  "customerEmail": string,
  "action": "acquire" | "release"
}

Response (acquire):
{
  "locked": false|true,
  "message": string
}

Response (release):
{
  "success": true
}
```

### Booking Workflow Handler
```
POST /api/functions/bookingWorkflowHandler
{
  "bookingId": string,
  "targetState": "reviewing" | "contacted" | "negotiating" | "confirmed" | "declined",
  "notes": string (optional)
}

Response:
{
  "success": true,
  "newStatus": string
}

Errors:
{
  "error": "Cannot transition from X to Y",
  "validStates": string[]
}
```

### Promo Code Validation
```
POST /api/functions/validatePromoCode
{
  "code": string
}

Response:
{
  "valid": true,
  "discountPercent": number,
  "times_used": number,
  "max_uses": number
}

Errors:
{
  "error": "Invalid code" | "Code limit reached"
}
```

### Email Sending
```
Idempotence key pattern: {emailType}_{recipientEmail}_{timestamp}

All email functions check IdempotenceLog before sending.
If already sent within 24h, skip.
```

### Webhook Handlers (Future)
```
POST /api/functions/onGmailWebhook
  ├─ Check signature
  ├─ Process new mail
  └─ Update inbox

POST /api/functions/onSheetUpdate
  ├─ Check signature
  ├─ Sync inventory
  └─ Notify admin
```

---

## PART 7: DATA SYNCHRONIZATION

### Sync Flows

**Order → Inventory**
```
MerchOrder created
  ↓
orderLockingMiddleware.acquire() [prevent concurrent]
  ↓
For each item:
  - Check current stock (optimistic lock)
  - Decrement stock_quantity
  - Emit INVENTORY_CHANGED
  ↓
orderLockingMiddleware.release()
```

**Contribution → Supporter Profile**
```
SupportContribution created
  ↓
Fetch all orders + contributions for email
  ↓
Calculate totalLTV = merch_spend + donation_spend
  ↓
Determine tier: LTV >= 500 → inner_circle
  ↓
Upsert SupporterProfile with tier + badge
```

**Order → Google Sheets**
```
MerchOrder created
  ↓
Refresh GoogleSheets OAuth token (pre-fetch)
  ↓
Append row to configured sheet:
  [date, customer, items, amount, status, tracking]
  ↓
Record IdempotenceLog (prevent duplicate rows)
```

### Conflict Resolution
- **Inventory**: Optimistic locking (check stock before update)
- **Orders**: Per-customer locks (5 min expiry)
- **Profiles**: Last-write-wins (timestamps for audit)
- **Idempotence**: Key-based deduplication (payment_id, email_id)

---

## PART 8: OBSERVABILITY & MONITORING

### Audit System
```javascript
AuditLog captures:
├─ Entity changes (create, update, delete)
├─ User identity (email, role)
├─ Field-level changes (old_value, new_value)
├─ Rollback snapshots (for delete operations)
└─ Metadata (IP, session, timestamp)

Accessible: /admin/audit-log
Retention: 30+ days
Rollback: performRollback(auditLogId)
```

### Health Checks
```
/admin/site-health runs:
├─ Database connectivity
├─ OAuth token freshness
├─ Payment processor status
├─ Email service status
├─ Google Sheets sync status
└─ Inventory consistency

Automated: Every 6 hours
Manual: On-demand from dashboard
```

### Operational Status Dashboard
```
/admin/operational-status shows:
├─ Current constraints (max 1 concurrent order/user)
├─ Infrastructure limits (1000 products max)
├─ Token refresh status
├─ Lock acquisition health
└─ Idempotence cache stats
```

### Logging Strategy
```
Console logs (Deno Deploy):
├─ Function entry/exit
├─ Error conditions
├─ Retry attempts
├─ Token refresh events

Database logs (AuditLog):
├─ Entity state changes
├─ User actions
├─ Admin operations
└─ Rollback events
```

---

## PART 9: TESTING STRATEGY

### Unit Tests (Planned)
```
lib/businessLogic.js
├─ calculateProductProfitability()
├─ calculateOrderFinancials()
├─ calculateCustomerLTV()
└─ calculateInventoryValuation()

lib/dataSync.js
├─ syncProductUpdate()
├─ syncInventoryChange()
├─ syncSupporterProfile()
└─ cleanupOrphanedData()

lib/eventAutomation.js
├─ emitEvent()
├─ registerEventHandler()
└─ performRollback()
```

### Integration Tests (Planned)
```
Payment flow:
├─ createPaymentIntent → Stripe
├─ processPayment → OrderLocking
├─ createContribution → IdempotenceLog
└─ syncSupporterProfile → Database

Email flow:
├─ onOrderAutomation → Gmail
├─ sendWelcomeEmail → IdempotenceLog
└─ validateNoDoubleEmail()

Inventory flow:
├─ MerchOrder creation → stock decrement
├─ Concurrent orders → lock enforcement
└─ Low stock → notification
```

### E2E Tests (Planned)
```
Playwright scenarios:
├─ User subscribes → gets welcome email
├─ User buys product → inventory decrements
├─ User backs project → profile tier updates
├─ Admin creates booking → email sent
└─ Admin changes order status → customer notified
```

### Load Testing (Phase 2)
```
k6 script targets:
├─ 100 concurrent orders (should fail gracefully)
├─ Email batch processing
├─ Sheet sync performance
└─ Query response times
```

---

## PART 10: ROLLBACK & RECOVERY

### Automatic Rollback

**Payment Failure**
```
1. Stripe webhook: charge.failed
2. cancelOrder() → set status = 'cancelled'
3. restoreInventory() → increment stock
4. notifyCustomer()
5. AuditLog entry with reason
```

**Email Failure**
```
1. Gmail API: 500 error
2. Retry up to 2 times
3. If persists: log to EmailFailure
4. Admin notified
5. Manual retry available
```

**Inventory Mismatch**
```
1. Health check detects: stock < 0
2. Alert admin
3. Lock new orders for that product
4. Manual inventory audit
5. Correct counts
6. Emit INVENTORY_CHANGED (sync profiles)
```

### Manual Rollback

**Order Reversal**
```
GET /admin/audit-log?entity=MerchOrder&id=xxx
{
  "action": "create",
  "changes": [...],
  "metadata": { "rollback_snapshot": { "previous_state": null, "can_rollback": true } }
}

POST /rollback?auditId=yyy
→ Delete order, restore inventory, emit INVENTORY_CHANGED
```

**Contribution Reversal**
```
POST /rollback?auditId=zzz
→ Delete contribution, refund payment, update profile, emit CONTRIBUTION_REFUNDED
```

---

## PART 11: DEPLOYMENT

### Build & Deploy

**Frontend**
```bash
npm run build
# Output: dist/ (static assets)
# Hosted: Base44 CDN
# Cache: Aggressive (versioned assets)
```

**Backend Functions**
```bash
# Deployed to functions/*.js
# Auto-deployed on save
# Environment: Deno Deploy
# Secrets: Injected from dashboard
```

**Database**
```bash
# Entities deployed via entities/*.json
# Auto-deployed on save
# RLS rules: Enforced per entity
# Migrations: Handled by Base44
```

### Environment Matrix

```
Development:
├─ Frontend: http://localhost:5173
├─ Backend: Local Deno runtime
├─ Database: Base44 dev database
└─ Secrets: .env.local (gitignored)

Staging (Pre-launch):
├─ Frontend: staging.gannonwaye.com
├─ Backend: Deno Deploy (staging)
├─ Database: Base44 staging database
└─ Secrets: Staging keys

Production (May 10):
├─ Frontend: gannonwaye.com
├─ Backend: Deno Deploy (prod)
├─ Database: Base44 production database
└─ Secrets: Production keys (vault-managed)
```

### Deployment Checklist
```
Pre-launch (May 9):
✅ All entities created
✅ RLS rules tested
✅ OAuth tokens refreshed
✅ IdempotenceLog cleared
✅ Promo codes configured
✅ Email templates tested
✅ Payment processor live
✅ Site settings final
✅ Admin users invited
✅ Health check passes
✅ Audit trail enabled
✅ Backups configured

Post-launch (May 10+):
📊 Monitor order volume
🔔 Check email delivery
📦 Verify inventory sync
👥 Watch supporter signups
🎯 Track conversion metrics
```

---

## PART 12: FRONTEND ARCHITECTURE

### Route Structure
```
/                       → Home
/music                  → Music/releases
/store                  → Merchandise
/community              → Fan posts & media
/videos                 → Social videos
/about (→ /this-is-my-life)
/this-is-my-life        → Artist bio
/lyrics                 → Song lyrics
/back-this              → Support/donation flow
/email-preferences      → Subscription management
/fan-profile            → User profile (auth required)
/orders                 → Order history (auth required)
/impact                 → Charity transparency
/member-tiers           → Support tiers explanation
/portrait-gallery       → Photo gallery
/faq                    → FAQ
/contact                → Booking inquiry form
/privacy-policy         → Legal
/terms-of-service       → Legal
/supporter-activity     → Recent supporters
/gift-checklist         → Gift progress tracker

/admin                  → Dashboard
/admin/merch            → Product management
/admin/orders           → Order management
/admin/subscribers      → Email subscriber CRM
/admin/supporters       → Supporter profiles
/admin/fans             → Fan management
/admin/financials       → Financial dashboard
/admin/settings         → Site configuration
/admin/audit-log        → Audit trail
/admin/operational-status → Infrastructure health
```

### Component Hierarchy
```
PublicLayout
├─ Navbar
├─ Page Content (Outlet)
└─ Footer (StickySupportBar)

AdminLayout
├─ Sidebar (navigation)
├─ Breadcrumbs
├─ Page Content (Outlet)
└─ CommandPalette (⌘K)

Shared Components:
├─ Button, Input, Label, Badge
├─ Card, Dialog, Dropdown
├─ Select, Textarea, Checkbox
├─ Table, Pagination
└─ Toast, Loader
```

### State Management
```
React Query:
├─ Entity caching (products, orders, subscribers)
├─ Automatic invalidation on mutations
├─ Stale-while-revalidate caching
└─ Optimistic updates for mutations

Local State:
├─ Form input (useState)
├─ Modal visibility
├─ Filter/sort preferences
└─ UI interactions

Auth Context:
├─ Current user (base44.auth.me())
├─ Login/logout state
└─ Role-based access
```

### Data Fetching
```javascript
// Pattern: useQuery + useMutation
const { data: products } = useQuery({
  queryKey: ['merchProducts'],
  queryFn: () => base44.entities.MerchProduct.list('-created_date'),
  staleTime: 5 * 60 * 1000,
});

const mutation = useMutation({
  mutationFn: (data) => base44.entities.MerchProduct.update(id, data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['merchProducts'] }),
});
```

---

## PART 13: COMMERCE STRUCTURE

### Checkout Flow
```
Store page → Product browse → Add to cart → Checkout
                                              ↓
                                         Payment details
                                              ↓
                                         createPaymentIntent()
                                              ↓
                                         Stripe iframe
                                              ↓
                                         Payment success
                                              ↓
                                         orderLockingMiddleware.acquire()
                                              ↓
                                         Create MerchOrder
                                              ↓
                                         Decrement inventory
                                              ↓
                                         Send receipt email
                                              ↓
                                         Sync to Google Sheets
                                              ↓
                                         orderLockingMiddleware.release()
                                              ↓
                                         Order confirmation page
```

### Pricing Model
```
sale_price           = Retail price
cost_price           = Supplier cost
delivery_cost        = Per-unit shipping
merchant_fee_percent = Payment processor (3.5%)

profit_margin_percent = (sale_price - cost - delivery - fee) / sale_price * 100
total_profit_per_unit = sale_price - cost - delivery - fee

All calculated real-time in ProductFinancials component
```

### Promo Code System
```
PromoCode entity:
├─ code (e.g., "LAUNCH15")
├─ discount_percent (e.g., 15)
├─ max_uses, times_used
├─ is_active

Validation:
├─ Check is_active
├─ Check times_used < max_uses
├─ Increment times_used on apply
└─ Return discount amount
```

---

## PART 14: CRM STRUCTURE

### Supporter Lifecycle

```
Step 1: Email Signup (EmailSubscriber)
├─ Capture: name, email, phone, how_found
├─ Auto-create: GiftRequirementTracker
├─ Send: Welcome email

Step 2: Engagement Tracking (GiftRequirementTracker)
├─ Check: TikTok follow, Instagram follow, post engagement
├─ Verify: Screenshot proof
├─ Status: not_started → in_progress → all_requirements_met → gift_claimed

Step 3: Supporter Profile (SupporterProfile)
├─ Created on: First order or contribution
├─ Track: total_contributed (LTV)
├─ Assign: tier (with_you, movement, inner_circle, day_one)
├─ Badge: supporter, top_supporter, inner_circle, day_one
└─ Visibility: Public leaderboard or private profile

Step 4: Engagement Scoring
├─ Points: Orders, donations, social follows, shares
├─ Status flags: VIP, at_risk, inactive
├─ Auto-triggered: Birthday discounts, reengagement campaigns
└─ Stored: In SupporterProfile.description (extended)
```

### Booking Inquiry Workflow

```
Step 1: Inquiry Submission (BookingEnquiry)
├─ Form: booking_type, event_date, budget, details, attachments
├─ Email verification
├─ Status: new_enquiry

Step 2: Admin Review
├─ Assign: assigned_to (team member email)
├─ Status: reviewing

Step 3: Contact
├─ Send: Confirmation email
├─ Status: contacted
├─ Note: Internal notes added

Step 4: Negotiation
├─ Status: negotiating
├─ Update: Technical requirements, accessibility needs

Step 5: Confirmation or Decline
├─ Status: confirmed or declined
├─ Archive: archived

Step 6: Post-Event
├─ Status: completed
└─ Notes: Performance feedback
```

### Email Preferences
```
EmailPreference tracks consent:
├─ consent_new_music
├─ consent_behind_scenes
├─ consent_tour_events
├─ consent_merch_drops
├─ consent_exclusive_content
├─ consent_personal_stories

Compliance:
├─ All emails include unsubscribe link
├─ Spam Act 2003 compliance
├─ GDPR-compliant consent checks
└─ Audit: Updated on every send
```

---

## PART 15: SYSTEM CONSTRAINTS & GOTCHAS

### Current Limitations (Option 1)
```
✅ Per-customer order locking     ✅ Idempotence keys for emails
✅ Inventory optimistic locking   ✅ Token pre-refresh (5 min threshold)
✅ Audit trail with rollback      ✅ Event system + automations
✅ GDPR consent validation        ✅ Booking state machine

⚠️  Max 1 concurrent order/user
⚠️  Max 1000 products
⚠️  Single-region deployment
⚠️  Event queue not persistent (in-memory)
⚠️  No distributed transactions (eventual consistency)
⚠️  No circuit breaker (external API failures block orders)
⚠️  No message queue (immediate email sends)
⚠️  No scheduled retry policy (2 attempts max)
```

### Known Issues & Mitigation

| Issue | Impact | Mitigation |
|-------|--------|-----------|
| Stripe timeout | Payment fails | Lock remains 5 min; customer can retry |
| Gmail auth expired | Email unsent | Pre-refresh before long operations |
| Inventory race | Overselling | Optimistic lock with version check |
| Sheet sync fails | Orders not in sheet | Manual sync button + retry automation |
| Duplicate email | Spam | IdempotenceLog check + 24h dedup |
| Admin changes booking, email fails | Inconsistent state | Booking updated; admin retries email |

---

## PART 16: MIGRATION PATH (Month 2+)

### Phase 2 Hardening (Infrastructure)
```
✅ Persistent event queue (SQS or Pub/Sub)
✅ Scheduled retry engine (failed jobs → retry queue)
✅ Circuit breaker pattern (graceful degradation)
✅ Distributed transaction log
✅ Multi-region replication
✅ Load balancer + auto-scaling
✅ Rate limiting per user
✅ Cache layer (Redis)
```

### Phase 3 Maturity (Scale)
```
✅ 100+ concurrent orders/min
✅ 10,000+ products
✅ Real-time inventory alerts
✅ Advanced analytics (cohort analysis)
✅ Custom checkout flow
✅ Subscription management
✅ Advanced CRM (segmentation)
✅ Staff portal (shipping labels, refunds)
```

---

## SUMMARY

This specification defines a **launch-ready, pre-commercial platform** that is:
- **Hardened**: Idempotent, locked, audited
- **Observable**: Full audit trail, health checks, operational dashboards
- **Documented**: This spec serves as source of truth
- **Tested**: Manual + E2E coverage required pre-launch
- **Scalable**: Clear path to production (Phase 2+)

**Status**: Safe to launch May 10, 2026 with 1-2 concurrent users.