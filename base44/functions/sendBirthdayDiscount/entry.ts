import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { format, addDays } from 'npm:date-fns@4.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get today's date in Australia/Sydney timezone
    const now = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });
    const today = new Date(now);
    const todayStr = format(today, 'MM-dd');
    
    // Get all subscribers with DOB
    const subscribers = await base44.entities.EmailSubscriber.list();
    
    // Find subscribers with birthday today or in the next 3 days
    const birthdaySubscribers = subscribers.filter(sub => {
      if (!sub.date_of_birth) return false;
      const birthDate = new Date(sub.date_of_birth);
      const birthMonthDay = format(birthDate, 'MM-dd');
      
      // Check if birthday is today or within next 3 days
      for (let i = 0; i <= 3; i++) {
        const checkDate = addDays(today, i);
        const checkStr = format(checkDate, 'MM-dd');
        if (birthMonthDay === checkStr) {
          return true;
        }
      }
      return false;
    });
    
    // Generate discount codes for each birthday subscriber
    const results = [];
    for (const sub of birthdaySubscribers) {
      const birthDate = new Date(sub.date_of_birth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
        ? age - 1 
        : age;
      
      // Create personalized discount code (20% flat rate, excludes CDs)
      const discountCode = `BDAY20-${sub.name.split(' ')[0].toUpperCase().slice(0, 3)}${format(today, 'yy')}`;

      // Create or update promo code
      const existingCodes = await base44.entities.PromoCode.filter({ code: discountCode });

      let promoCode;
      if (existingCodes.length === 0) {
        promoCode = await base44.entities.PromoCode.create({
          code: discountCode,
          discount_percent: 20, // Fixed 20% discount
          max_uses: 1,
          times_used: 0,
          description: `Birthday discount for ${sub.name} - 20% OFF (excludes CDs)`,
          is_active: true,
        });
      } else {
        promoCode = existingCodes[0];
      }
      
      results.push({
        subscriber: sub,
        age: adjustedAge,
        discountCode: discountCode,
        discountPercent: 20,
        promoCodeId: promoCode.id,
      });
      
      // Send birthday email
      try {
        await base44.integrations.Core.SendEmail({
          to: sub.email,
          subject: `🎂 Happy Birthday ${sub.name.split(' ')[0]}! Your Special Gift Inside`,
          body: `Hi ${sub.name.split(' ')[0]},

Happy Birthday! 🎉🎂

Wishing you an amazing day filled with joy and music. As a special birthday gift from me, here's an exclusive discount for the merch store:

**Your Birthday Gift: 20% OFF**
**Code: ${discountCode}**

Valid for 7 days, one-time use. Excludes CD purchases.

🎁 **Shop here:** [Your Store URL]

Thank you for being part of this journey. Your support means everything.

Have an incredible birthday! 🤍

With gratitude,
Gannon Waye

---
P.S. Keep an eye on your inbox - there might be more surprises coming your way this week! 🎵`,
          from_name: 'Gannon Waye',
        });
        
        results[results.length - 1].emailSent = true;
      } catch (emailError) {
        console.error('Email send error:', emailError);
        results[results.length - 1].emailSent = false;
      }
    }
    
    return Response.json({
      success: true,
      count: results.length,
      subscribers: results,
      message: `Processed ${results.length} birthday subscriber(s)`,
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});