# Birthday Discount System - Setup Guide

## Overview
Automated birthday discount system that sends personalized merch store discounts to subscribers on their birthday.

## Features Implemented

### 1. Date of Birth Collection
- **EmailSubscriber Entity**: Added `date_of_birth` field (optional)
- **Signup Form**: Collects DOB with age validation (13+ required)
- **Privacy**: DOB is only visible to admin users

### 2. Automated Birthday Emails
- **Function**: `sendBirthdayDiscount.js`
- **Triggers**: 
  - Manual: Click "Check Birthdays Now" in admin dashboard
  - Automatic: Can be scheduled to run daily via automation
- **Features**:
  - Checks for birthdays today and next 3 days
  - Generates personalized discount codes (e.g., `BDAY25-GAN26`)
  - Discount percentage = age (max 30%)
  - Single-use codes valid for 7 days
  - Sends beautiful birthday email with discount code

### 3. Admin Dashboard (`/admin/birthdays`)
- **Stats Cards**:
  - Total subscribers with DOB
  - Birthdays in next 30 days
  - Codes generated
  - Discounts used
- **Upcoming Birthdays List**:
  - Sorted by days until birthday
  - Shows age turning, discount percentage
  - Highlights birthdays within 3 days
- **Manual Trigger**: "Check Birthdays Now" button

### 4. Discount Code System
- **Format**: `BDAY{age}-{name initials}{year}`
- **Example**: `BDAY25-GAN26` = 25th birthday, Gannon, 2026
- **Discount**: Age-based, capped at 30%
- **Usage**: Single use, 7-day validity
- **Tracking**: Integrated with existing PromoCode entity

## How It Works

### Subscriber Flow:
1. User signs up via homepage form
2. Optionally provides date of birth (13+ validation)
3. Data saved to EmailSubscriber entity
4. Receives welcome email with gift checklist

### Birthday Flow:
1. System checks for upcoming birthdays (today + 3 days)
2. For each birthday subscriber:
   - Calculates age on next birthday
   - Generates personalized discount code
   - Creates PromoCode record (age% discount, 1 use)
   - Sends birthday email with code
3. Admin can view all upcoming birthdays in dashboard

### Email Template:
```
Subject: 🎂 Happy Birthday [Name]! Your Special Gift Inside

Hi [Name],

Happy Birthday! 🎉🎂

Wishing you an amazing day filled with joy and music. 
As a special birthday gift from me, here's an exclusive discount:

**Your Birthday Discount: [age]% OFF**
**Code: BDAY{age}-{initials}{year}**

Valid for 7 days, one-time use on any merchandise.

🎁 Shop here: [Store URL]

With gratitude,
Gannon Waye
```

## Setup Instructions

### 1. Entity Updated ✅
- EmailSubscriber now has `date_of_birth` field
- Existing subscribers can be updated via admin dashboard

### 2. Backend Function Deployed ✅
- Function: `sendBirthdayDiscount`
- Location: `/functions/sendBirthdayDiscount.js`
- Status: Active and tested

### 3. Admin Dashboard Created ✅
- Route: `/admin/birthdays`
- Navigation: Added to "Marketing" section in sidebar
- Features: Stats, upcoming birthdays, manual trigger

### 4. Signup Form Updated ✅
- Collects DOB with validation
- Shows benefit: "Get Birthday Discounts!"
- Age restriction: 13+ only

## Usage

### For Admins:
1. Go to `/admin/birthdays`
2. View upcoming birthdays (next 30 days)
3. Click "Check Birthdays Now" to process immediately
4. Monitor discount code usage in stats

### For Subscribers:
1. Sign up on homepage
2. Add date of birth (optional but recommended)
3. Receive birthday email with discount code
4. Use code at checkout for age-based discount

## Scheduling (Optional)

To automate daily checks, create an automation:

```javascript
// Create automation via dashboard or backend
automation_type: "scheduled"
name: "Daily Birthday Check"
function_name: "sendBirthdayDiscount"
repeat_interval: 1
repeat_unit: "days"
start_time: "09:00" // 9 AM Sydney time
```

## Metrics to Track

- **Conversion Rate**: % of subscribers who add DOB
- **Redemption Rate**: % of birthday codes used
- **Revenue Impact**: Sales from birthday discounts
- **Engagement**: Birthday email open/click rates

## Future Enhancements

- [ ] Automated scheduling (daily at 9 AM)
- [ ] Birthday week reminders
- [ ] Tiered discounts (VIP = higher %)
- [ ] Birthday month promotions
- [ ] Integration with loyalty program
- [ ] A/B test email templates
- [ ] Analytics dashboard for ROI

## Testing

Tested successfully:
- ✅ Function deploys without errors
- ✅ Returns correct structure
- ✅ Handles empty subscriber list
- ✅ Timezone-aware (Australia/Sydney)
- ✅ Age calculation accurate
- ✅ Discount code generation works
- ✅ PromoCode integration functional

## Support

For issues or questions:
- Check function logs in dashboard
- Review subscriber data in `/admin/subscribers`
- Verify promo codes in `/admin/promo-codes`
- Test with sample subscriber data

---

**Status**: ✅ COMPLETE AND READY FOR USE

**Next Steps**:
1. Encourage existing subscribers to add DOB via email campaign
2. Monitor birthday signups in analytics
3. Consider scheduling daily automation
4. Track redemption rates and adjust discount percentages if needed