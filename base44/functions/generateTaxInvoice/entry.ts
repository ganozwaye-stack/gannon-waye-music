import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { format } from 'npm:date-fns@4.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get contribution by payment intent ID
    const { paymentIntentId } = await req.json();
    
    if (!paymentIntentId) {
      return Response.json({ error: 'Payment intent ID required' }, { status: 400 });
    }

    const contributions = await base44.entities.SupportContribution.filter({
      stripe_payment_id: paymentIntentId
    });

    if (contributions.length === 0) {
      return Response.json({ error: 'Contribution not found' }, { status: 404 });
    }

    const contribution = contributions[0];
    
    // Generate tax invoice number
    const invoiceNumber = `INV-${format(new Date(), 'yyyyMMdd')}-${contribution.id.slice(0, 6).toUpperCase()}`;
    
    // Build HTML invoice
    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; padding: 40px; background: #f8f9fa; }
    .invoice { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 2px solid #c9a84c; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; }
    .subtitle { color: #666; font-size: 14px; }
    .invoice-title { font-size: 28px; font-weight: 700; color: #c9a84c; margin: 20px 0; }
    .details { margin: 30px 0; }
    .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .row.total { border-bottom: none; border-top: 2px solid #c9a84c; font-weight: 700; font-size: 18px; color: #c9a84c; }
    .label { color: #666; font-size: 14px; }
    .value { font-weight: 600; color: #1a1a1a; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 12px; }
    .badge { display: inline-block; background: #c9a84c; color: white; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-top: 10px; }
    .charity-note { background: #f0f4ff; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 3px solid #4a90d9; }
    .charity-note p { margin: 0; font-size: 13px; color: #333; }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="logo">Gannon Waye</div>
      <div class="subtitle">Singer, Songwriter, Storyteller</div>
      <div class="invoice-title">Support Contribution Receipt</div>
      <div class="badge">FOR YOUR RECORDS</div>
    </div>

    <div class="details">
      <div class="row">
        <span class="label">Invoice Number</span>
        <span class="value">${invoiceNumber}</span>
      </div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${format(new Date(contribution.created_date), 'dd MMMM yyyy')}</span>
      </div>
      <div class="row">
        <span class="label">Supporter</span>
        <span class="value">${contribution.supporter_name || 'Anonymous'}</span>
      </div>
      <div class="row">
        <span class="label">Email</span>
        <span class="value">${contribution.supporter_email}</span>
      </div>
      ${contribution.message ? `
      <div class="row" style="display: block;">
        <span class="label">Message</span>
        <span class="value" style="display: block; margin-top: 5px;">${contribution.message}</span>
      </div>
      ` : ''}
    </div>

    <div class="details">
      <div class="row">
        <span class="label">Contribution Amount</span>
        <span class="value">$${contribution.amount.toFixed(2)} AUD</span>
      </div>
      ${contribution.frequency !== 'once' ? `
      <div class="row">
        <span class="label">Frequency</span>
        <span class="value">${contribution.frequency.charAt(0).toUpperCase() + contribution.frequency.slice(1)}</span>
      </div>
      ` : ''}
      <div class="row total">
        <span class="label">Total Contribution</span>
        <span class="value">$${contribution.amount.toFixed(2)} AUD</span>
      </div>
    </div>

    <div class="charity-note">
      <p><strong>10% Giving Commitment:</strong> 10% of this donation will be passed on to 1800RESPECT, supporting women, men, and children fleeing domestic and family violence. This includes specialised support for LGBTQIA+ individuals in same-sex relationships, ensuring everyone has access to safe, inclusive care when they need it most.</p>
    </div>

    <div class="footer">
      <p>This receipt is for your personal records only.</p>
      <p>Support contributions are not represented as tax-deductible donations unless deductible gift recipient status is confirmed in writing. You may receive a receipt for your personal records, not as tax advice or a tax-deductibility statement.</p>
      <p>Gannon Waye is an independent artist. 10% of support received is donated to 1800RESPECT.</p>
      <p style="margin-top: 10px;">Thank you for your support. 🤍</p>
    </div>
  </div>
</body>
</html>
    `;

    return Response.json({
      success: true,
      invoiceHtml,
      invoiceNumber,
      contribution: {
        id: contribution.id,
        amount: contribution.amount,
        supporter_name: contribution.supporter_name,
        supporter_email: contribution.supporter_email,
        created_date: contribution.created_date,
      }
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});