import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { format } from 'npm:date-fns@4.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Service role for admin operations
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all contributions from current month (Sydney time)
    const now = new Date();
    const sydneyTime = new Date(now.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }));
    const firstDayOfMonth = new Date(sydneyTime.getFullYear(), sydneyTime.getMonth(), 1);
    
    const contributions = await base44.entities.SupportContribution.filter({
      frequency: 'once' // For now, track one-time donations
    });
    
    // Filter for current month manually (since filter doesn't support date ranges)
    const monthlyContributions = contributions.filter(c => 
      new Date(c.created_date) >= firstDayOfMonth
    );
    
    const totalAmount = monthlyContributions.reduce((sum, c) => sum + c.amount, 0);
    const donationAmount = totalAmount * 0.10; // 10% commitment
    
    // Create charity tracking record
    const trackingRecord = await base44.entities.CharityDonationTracker.create({
      month: format(firstDayOfMonth, 'yyyy-MM'),
      total_support_received: totalAmount,
      donation_amount_owed: donationAmount,
      donation_amount_paid: 0,
      status: 'pending',
      contribution_count: monthlyContributions.length,
    });
    
    return Response.json({
      success: true,
      month: format(firstDayOfMonth, 'MMMM yyyy'),
      totalSupportReceived: totalAmount,
      donationAmountOwed: donationAmount,
      contributionCount: monthlyContributions.length,
      trackerId: trackingRecord.id,
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});