import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { format } from 'npm:date-fns@4.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contributionId } = await req.json();
    
    if (!contributionId) {
      return Response.json({ error: 'Contribution ID required' }, { status: 400 });
    }

    const contributions = await base44.entities.SupportContribution.filter({
      id: contributionId
    });

    if (contributions.length === 0) {
      return Response.json({ error: 'Contribution not found' }, { status: 404 });
    }

    const c = contributions[0];
    
    // Generate official receipt number
    const receiptNumber = `RCP-${format(new Date(c.created_date), 'yyyyMMdd')}-${c.id.slice(0, 6).toUpperCase()}`;
    
    // Calculate charity impact
    const charityAmount = c.amount * 0.10;
    
    const receiptHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', sans-serif; padding: 40px; background: #f8f9fa; }
    .receipt { max-width: 650px; margin: 0 auto; background: white; padding: 45px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 3px solid #c9a84c; padding-bottom: 25px; margin-bottom: 35px; }
    .logo { font-size: 26px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px; }
    .subtitle { color: #666; font-size: 14px; letter-spacing: 0.5px; }
    .receipt-title { font-size: 32px; font-weight: 800; color: #c9a84c; margin: 25px 0 10px; }
    .badge { display: inline-block; background: linear-gradient(135deg, #c9a84c, #f5d06e); color: white; padding: 6px 16px; border-radius: 6px; font-size: 12px; font-weight: 700; margin-top: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .section { margin: 30px 0; }
    .row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #f0f0f0; }
    .row.total { border-bottom: none; border-top: 3px solid #c9a84c; font-weight: 700; font-size: 20px; color: #c9a84c; padding-top: 15px; }
    .label { color: #555; font-size: 14px; font-weight: 500; }
    .value { font-weight: 600; color: #1a1a1a; font-size: 15px; }
    .footer { margin-top: 45px; padding-top: 25px; border-top: 2px solid #e0e0e0; text-align: center; color: #666; font-size: 12px; line-height: 1.6; }
    .impact-box { background: linear-gradient(135deg, #f0f4ff, #e8f0fe); padding: 20px; border-radius: 10px; margin-top: 25px; border-left: 4px solid #4a90d9; }
    .impact-box h3 { margin: 0 0 10px 0; color: #2c5282; font-size: 16px; font-weight: 700; }
    .impact-box p { margin: 0; font-size: 13px; color: #2d3748; line-height: 1.6; }
    .charity-note { background: #fffbeb; padding: 18px; border-radius: 8px; margin-top: 20px; border: 1px solid #fcd34d; }
    .charity-note p { margin: 0; font-size: 13px; color: #92400e; }
    .legal-text { font-size: 11px; color: #999; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="logo">Gannon Waye</div>
      <div class="subtitle">Singer, Songwriter, Storyteller</div>
      <div class="receipt-title">Donation Receipt</div>
      <div class="badge">Tax Deductible Donation</div>
    </div>

    <div class="section">
      <div class="row">
        <span class="label">Receipt Number</span>
        <span class="value">${receiptNumber}</span>
      </div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${format(new Date(c.created_date), 'dd MMMM yyyy')}</span>
      </div>
      <div class="row">
        <span class="label">Supporter Name</span>
        <span class="value">${c.supporter_name || 'Anonymous'}</span>
      </div>
      <div class="row">
        <span class="label">Email Address</span>
        <span class="value">${c.supporter_email}</span>
      </div>
      ${c.message ? `
      <div class="row" style="display: block;">
        <span class="label">Message</span>
        <span class="value" style="display: block; margin-top: 8px; font-style: italic;">${c.message}</span>
      </div>
      ` : ''}
      ${c.frequency !== 'once' ? `
      <div class="row">
        <span class="label">Frequency</span>
        <span class="value">${c.frequency.charAt(0).toUpperCase() + c.frequency.slice(1)}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="row">
        <span class="label">Donation Amount (Base)</span>
        <span class="value">$${c.amount.toFixed(2)} AUD</span>
      </div>
      ${c.total_charged > c.amount ? `
      <div class="row">
        <span class="label">Fees & GST (included in total)</span>
        <span class="value">$${(c.total_charged - c.amount).toFixed(2)} AUD</span>
      </div>
      ` : ''}
      <div class="row total">
        <span class="label">Total Tax-Deductible Amount</span>
        <span class="value">$${c.amount.toFixed(2)} AUD</span>
      </div>
    </div>

    <div class="impact-box">
      <h3>🤍 Your Impact</h3>
      <p><strong>$${charityAmount.toFixed(2)}</strong> from your donation will be passed on to 1800RESPECT, supporting women, men, and children fleeing domestic and family violence — including specialised LGBTQIA+ support for those in same-sex relationships.</p>
    </div>

    <div class="charity-note">
      <p><strong>10% Giving Commitment:</strong> Every month, 10% of all support received is donated to 1800RESPECT. Your contribution creates ripples of change beyond supporting independent music.</p>
    </div>

    <div class="footer">
      <p>This receipt serves as proof of your tax-deductible donation to an independent artist.</p>
      <p>Gannon Waye is an independent musician based in Melbourne, Australia.</p>
      <p class="legal-text">ABN: [To be advised] | For tax purposes, this is a donation to support independent music creation and related artistic activities.</p>
      <p style="margin-top: 15px; font-size: 13px; color: #c9a84c; font-weight: 600;">Thank you for your support. 🤍</p>
    </div>
  </div>
</body>
</html>
    `;

    return Response.json({
      success: true,
      receiptHtml,
      receiptNumber,
      contribution: {
        id: c.id,
        amount: c.amount,
        total_charged: c.total_charged,
        supporter_name: c.supporter_name,
        supporter_email: c.supporter_email,
        created_date: c.created_date,
        frequency: c.frequency,
      },
      charityImpact: {
        amountDonated: charityAmount,
        charity: '1800RESPECT',
        description: 'Supporting survivors of domestic and family violence',
      }
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});