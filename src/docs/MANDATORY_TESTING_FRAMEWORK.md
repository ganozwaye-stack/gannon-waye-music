# MANDATORY RUNTIME TESTING FRAMEWORK

**This is not optional.** Launch is locked until these tests pass.

---

## TEST EXECUTION ORDER

### PHASE 1: Core Functionality (May 8, Morning)
**Duration:** 2 hours  
**Critical:** YES

#### Test 1.1: Payment Processing
```gherkin
Given user is on /back-this
When user selects $5 contribution (once)
And user enters name: "Test User"
And user enters email: "test-may8@gannonwaye.com"
And user enters message: "Testing payment"
And user clicks "Continue"
And user clicks "Continue to Payment"
And user enters card: 4242 4242 4242 4242
And user enters expiry: 12/26
And user enters CVC: 123
Then payment should succeed
And no modal lock should occur
And SupporterProfile should be created in database
And SupportContribution record should have correct amounts
And receipt email should arrive within 120 seconds
And receipt should show:
  - Base amount: $5.00
  - GST: $0.50
  - Service fee: $0.25
  - Total: $5.75
  - Charity allocation: $0.50
  - 1800RESPECT disclaimer
```

**Pass Criteria:**
- ✅ Payment succeeds
- ✅ No errors in browser console
- ✅ Success page displays
- ✅ SupporterProfile created (query database)
- ✅ Email arrives with correct content

**Fail Actions:**
- Check Stripe logs for error
- Check browser console for JS errors
- Check database for partial records
- Document error message

---

#### Test 1.2: Duplicate Order Prevention
```gherkin
Given user just completed payment (Test 1.1)
When user clicks browser back button
And user submits payment form again
Then ONLY ONE order should be created
And payment should either:
  1. Show "Already processed" error, OR
  2. Succeed with identical order ID
And database should have only ONE SupportContribution record
And customer should NOT be charged twice
```

**Pass Criteria:**
- ✅ No duplicate SupportContribution
- ✅ No double charge on Stripe
- ✅ Browser console clean

---

#### Test 1.3: Email Delivery Verification
```gherkin
Given user completed payment in Test 1.1
When 2 minutes elapse
And I check gmail inbox for test-may8@gannonwaye.com
Then email should exist with:
  - From: hello@gannonwaye.com
  - Subject contains: "Receipt"
  - Body contains: $5.75
  - Body contains: "1800RESPECT"
  - Body contains: "10%"
And email should be HTML formatted
And all links in email should work
And PDF receipt download should work
```

**Pass Criteria:**
- ✅ Email arrives
- ✅ Content correct
- ✅ PDF downloads
- ✅ No malformed HTML

**Fail Actions:**
- Check Gmail connector logs
- Verify GOOGLE_SHEET_ID secret
- Check function: `generateDonorReceipt`

---

#### Test 1.4: Customer Profile Integrity
```gherkin
Given Test 1.1 completed successfully
When I query database for:
  - SupporterProfile (supporter_email = "test-may8@gannonwaye.com")
  - SupportContribution (supporter_email = "test-may8@gannonwaye.com")
Then I should find:
  - EXACTLY 1 SupporterProfile record
  - EXACTLY 1 SupportContribution record
And SupporterProfile should have:
  - supporter_name: "Test User"
  - total_contributed: 5.00
  - tier: "with_you"
  - badge: "supporter"
  - message: "Testing payment"
And SupportContribution should have:
  - amount: 5.00
  - total_charged: 5.75
  - frequency: "once"
  - stripe_payment_id: [valid Stripe ID]
```

**Pass Criteria:**
- ✅ No duplicate profiles
- ✅ Amounts match
- ✅ Tier correct
- ✅ No orphaned records

---

### PHASE 2: Mobile & UI (May 8, Afternoon)
**Duration:** 1.5 hours  
**Critical:** YES

#### Test 2.1: Mobile Responsive Checkout
```gherkin
Given device: iPhone 12 (390px width)
When I navigate to /back-this
And I complete full checkout form
Then all form fields should:
  - Fit within viewport
  - Be tappable (min 44px height)
  - Have working keyboard
And checkout total should calculate correctly
And payment modal should:
  - Display fully without cutoff
  - Accept card input
  - Show error messages clearly
And success page should display fully
```

**Pass Criteria:**
- ✅ No horizontal scroll
- ✅ All buttons tappable
- ✅ Form submits successfully
- ✅ No layout shifts

**Test Devices:**
- iPhone 12 (required)
- Android device if available

---

#### Test 2.2: Image Management
```gherkin
Given I am admin at /admin/merch
When I create product with name: "Test Hoodie"
And I upload 3 images:
  1. hoodie-front.jpg
  2. hoodie-back.jpg
  3. hoodie-tag.jpg
Then all 3 images should display in gallery
When I reorder images: back → front → tag
And I save product
And I refresh page
Then image order should persist
When I delete the middle image (front)
Then image should disappear from UI
And gallery should show 2 images in correct order
And deleted image should be gone from storage
When I refresh page again
Then deleted image should still be gone (no stale rendering)
```

**Pass Criteria:**
- ✅ Upload succeeds
- ✅ Reorder persists
- ✅ Delete removes from UI
- ✅ Delete removes from storage
- ✅ No stale images after refresh

---

#### Test 2.3: Modal State Management
```gherkin
Given modal is open (product edit, order details, etc.)
When I click browser back button
Then modal should:
  - Close cleanly, OR
  - Show confirmation if unsaved changes
And page should be navigable again (not locked)
And closing modal should NOT show errors
```

**Pass Criteria:**
- ✅ Modal closes
- ✅ No JS errors
- ✅ Page remains responsive

---

### PHASE 3: Navigation (May 8, Late Afternoon)
**Duration:** 45 minutes  
**Critical:** YES

#### Test 3.1: All Routes Accessible
```gherkin
Given app is fully loaded
When I visit these routes:
  - /
  - /music
  - /store
  - /back-this
  - /community
  - /videos
  - /fan-profile
  - /impact
  - /admin
  - /admin/merch
  - /admin/orders
  - /admin/subscribers
  - /admin/financials
Then ALL pages should load without 404 error
And each page should display primary content
And no console errors should appear
```

**Pass Criteria:**
- ✅ No 404 errors
- ✅ All pages load
- ✅ Content displays

---

#### Test 3.2: Admin Breadcrumbs
```gherkin
Given I am on /admin/merch
When I click "Products" in breadcrumb
Then I navigate to /admin/merch
When I click "Admin" in breadcrumb
Then I navigate to /admin
When I am on /admin/orders and click an order
And order detail modal opens
When I close modal and click breadcrumb
Then I return to /admin/orders
```

**Pass Criteria:**
- ✅ Breadcrumbs navigate
- ✅ No modal conflicts

---

#### Test 3.3: Search Navigation
```gherkin
Given any page is open
When I press Cmd+K (Mac) or Ctrl+K (Windows)
Then command palette should open
When I type: "orders"
Then search results should show orders-related pages
When I click result
Then page should navigate and palette close
```

**Pass Criteria:**
- ✅ Search opens
- ✅ Results relevant
- ✅ Navigation works

---

### PHASE 4: Edge Cases (May 9, Morning)
**Duration:** 1 hour  
**Critical:** MEDIUM

#### Test 4.1: Checkout with Existing Customer
```gherkin
Given customer has previous order (Test 1.1)
When same customer (test-may8@gannonwaye.com) makes another donation
Then:
  - New SupportContribution created
  - SupporterProfile updated (NOT duplicated)
  - total_contributed should be 10.00 (5 + 5)
  - tier should remain "with_you"
  - No duplicate profile records
```

**Pass Criteria:**
- ✅ Profile updated, not duplicated
- ✅ LTV correct
- ✅ Tier correct

---

#### Test 4.2: Payment Failure Handling
```gherkin
Given user on payment page
When user enters invalid card: 4000000000000002 (decline code)
And user clicks pay
Then payment should:
  - Fail gracefully
  - Show error message to user
  - NOT create SupportContribution record
  - NOT create SupporterProfile record
And user should be able to retry
```

**Pass Criteria:**
- ✅ Error displayed
- ✅ No orphaned records
- ✅ Retry works

---

#### Test 4.3: Form Validation
```gherkin
Given user on /back-this payment form
When user tries to submit with:
  - No email: should show "Email required"
  - Invalid email: should show "Invalid email"
  - Amount < $5: should show "Minimum $5"
Then form should not submit
And helpful error message should display
```

**Pass Criteria:**
- ✅ All validations work
- ✅ Errors clear

---

## RUNTIME TESTING CHECKLIST

### Before Launch (May 10, 6am)
```
PAYMENT SYSTEM:
[ ] Live card payment succeeds
[ ] No duplicate charge on retry
[ ] Receipt email arrives within 2 min
[ ] Database records created correctly
[ ] Stripe logs show success

MOBILE:
[ ] iPhone 12 checkout completes
[ ] Android device checkout completes (if available)
[ ] Forms fit without scroll
[ ] Buttons responsive
[ ] Payment modal displays

IMAGES:
[ ] Upload 3+ images succeeds
[ ] Reorder persists after refresh
[ ] Delete removes from UI and storage
[ ] No stale images after delete

NAVIGATION:
[ ] All 49 routes load without 404
[ ] No console errors on any page
[ ] Breadcrumbs navigate correctly
[ ] Search ⌘K finds pages
[ ] Modal close doesn't break page

CUSTOMERS:
[ ] First donation creates profile
[ ] Second donation updates profile
[ ] No duplicate profiles in database
[ ] LTV calculated correctly
[ ] Tier assigned correctly

EDGE CASES:
[ ] Payment failure shows error
[ ] Form validation works
[ ] Browser back doesn't duplicate
[ ] Concurrent requests don't duplicate
```

---

## FAILURE PROTOCOL

If any test fails:

1. **Document exact error**
   - Screenshot/console output
   - Steps to reproduce
   - Expected vs actual

2. **Identify root cause**
   - Backend function logs?
   - Database state?
   - Frontend JS error?

3. **Fix and retest**
   - Make minimal change
   - Rerun failing test only
   - Then full test suite again

4. **Escalate if needed**
   - Critical (payment, email): Stop. Fix today.
   - High (mobile, images): Fix before launch.
   - Medium (edge cases): Fix if time permits.

---

## GO/NO-GO DECISION

**Launch approved only if:**
- ✅ All Phase 1 tests pass (payment, email, profiles, duplicates)
- ✅ All Phase 2 tests pass (mobile, images, modals)
- ✅ All Phase 3 tests pass (navigation, breadcrumbs, search)
- ✅ Phase 4 edge cases mostly pass (1-2 minor issues OK)

**Launch blocked if:**
- ❌ Payment fails
- ❌ Email doesn't deliver
- ❌ Duplicate orders created
- ❌ Mobile checkout broken
- ❌ Image deletion leaves stale data
- ❌ 404 errors on navigation
- ❌ Duplicate customer profiles created

---

**Testing starts:** May 8, 8am Sydney time  
**Decision deadline:** May 10, 12pm Sydney time  
**Launch window:** May 10, 6pm AEST (if tests pass)