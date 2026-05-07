import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Heart, CheckCircle2, ArrowLeft, Info } from 'lucide-react';
import ShareButtons from '@/components/public/ShareButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import StripePaymentForm from '@/components/store/StripePaymentForm';
import { emitEvent, EVENT_TYPES } from '@/lib/eventAutomation';

// Fee constants (same as merch checkout)
const GST_RATE = 0.10;
const FEE_RATE = 0.05;

function calcTotal(base) {
  const gst = base * GST_RATE;
  const fee = base * FEE_RATE;
  return { gst, fee, total: base + gst + fee };
}

const TIERS = [
  { amount: 5,  label: "I'm with you",          desc: "A small contribution that helps keep this going" },
  { amount: 10, label: "I support the movement", desc: "You're part of building something bigger" },
  { amount: 25, label: "Inner circle supporter",  desc: "You're backing this journey in a real way" },
];

const FREQUENCIES = [
  { value: 'once',        label: 'Once Off' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly',     label: 'Monthly' },
];

export default function BackThis() {
  const { toast } = useToast();
  const [step, setStep] = useState('choose'); // choose | details | payment | done
  const [selectedTier, setSelectedTier] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [customError, setCustomError] = useState('');

  const baseAmount = selectedTier !== 'custom'
    ? (selectedTier ?? 0)
    : (parseFloat(customAmount) || 0);

  const pricing = calcTotal(baseAmount);

  const handleChooseNext = () => {
    if (!selectedTier) {
      toast({ title: 'Please select a support amount', variant: 'destructive' });
      return;
    }
    if (selectedTier === 'custom') {
      const val = parseFloat(customAmount);
      if (!val || val < 5) {
        setCustomError('Minimum amount is $5');
        return;
      }
      setCustomError('');
    }
    setStep('details');
  };

  const handleDetailsNext = (e) => {
    e.preventDefault();
    if (!form.email) {
      toast({ title: 'Please enter your email', variant: 'destructive' });
      return;
    }
    setStep('payment');
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    const tierLabel = selectedTier === 'custom' ? 'Custom' : TIERS.find(t => t.amount === selectedTier)?.label;
    const tierKey = baseAmount >= 25 ? 'inner_circle' : baseAmount >= 10 ? 'movement' : 'with_you';
    const badge = baseAmount >= 25 ? 'inner_circle' : baseAmount >= 10 ? 'top_supporter' : 'supporter';

    const contribution = await base44.entities.SupportContribution.create({
      supporter_name: form.name || null,
      supporter_email: form.email,
      amount: baseAmount,
      total_charged: pricing.total,
      frequency,
      tier_label: tierLabel,
      stripe_payment_id: paymentIntent.id,
      message: form.message || null,
    });

    // Emit event for automation
    await emitEvent(EVENT_TYPES.CONTRIBUTION_RECEIVED, {
      id: contribution.id,
      supporter_name: form.name,
      supporter_email: form.email,
      amount: baseAmount,
      total_charged: pricing.total,
      frequency,
    });

    // Upsert SupporterProfile
    const existing = await base44.entities.SupporterProfile.filter({ supporter_email: form.email });
    if (existing.length > 0) {
      await base44.entities.SupporterProfile.update(existing[0].id, {
        total_contributed: (existing[0].total_contributed || 0) + baseAmount,
        supporter_name: form.name || existing[0].supporter_name,
        message: form.message || existing[0].message,
      });
    } else {
      await base44.entities.SupporterProfile.create({
        supporter_name: form.name || null,
        supporter_email: form.email,
        tier: tierKey,
        total_contributed: baseAmount,
        message: form.message || null,
        badge,
        is_public: true,
      });
    }

    setStep('done');
  };

  const handlePaymentError = (msg) => {
    toast({ title: msg || 'Payment failed. Please try again.', variant: 'destructive' });
  };

  const frequencyNote = frequency === 'once' ? '' : frequency === 'fortnightly' ? ' every 2 weeks' : ' per month';

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">

        {/* DONE */}
        {step === 'done' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 space-y-6">
            <Heart className="w-16 h-16 text-primary mx-auto" />
            <h2 className="font-display text-4xl text-foreground">Thank you.</h2>
            <p className="font-body text-foreground/60 leading-relaxed max-w-md mx-auto">
              {form.name ? `${form.name}, you're` : "You're"} part of this now. Your support means more than you know. 🤍
            </p>
            
            {/* 1800RESPECT Commitment */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8 max-w-lg mx-auto text-left">
              <p className="font-body text-xs tracking-widest uppercase text-blue-600 mb-3">10% Giving Commitment</p>
              <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">
                Every month, I donate 10% of all support received to <strong>1800RESPECT</strong> — Australia's national sexual assault, domestic and family violence counselling service.
              </p>
              <p className="font-body text-sm text-foreground/70 leading-relaxed mb-3">
                As a man in a same-sex relationship, I know how isolating violence can feel when you don't see yourself reflected in the stories being told. 1800RESPECT provides inclusive, confidential support for everyone — women, men, and children fleeing violence, including specialised LGBTQIA+ support that understands the unique challenges of leaving abusive situations when you're already marginalised.
              </p>
              <p className="font-body text-sm text-foreground/70 leading-relaxed">
                Your support doesn't just fund my music — it helps fund safety, healing, and hope for others walking similar paths. Thank you for being part of this ripple effect. 🤍
              </p>
              <p className="font-body text-xs text-muted-foreground mt-4">
                <a href="https://www.1800respect.org.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Learn more about 1800RESPECT →</a>
              </p>
            </div>
            {frequency !== 'once' && (
              <p className="font-body text-xs text-muted-foreground">
                Your {frequency} contribution of ${pricing.total.toFixed(2)} AUD will continue automatically. You can cancel anytime by emailing hello@gannonwaye.com
              </p>
            )}
            
            {/* Tax Invoice Download */}
            <div className="mt-6 space-y-3">
              <p className="font-body text-xs text-muted-foreground">Need your receipt?</p>
              <Button 
                variant="outline" 
                onClick={async () => {
                  try {
                    const contributions = await base44.entities.SupportContribution.filter({ 
                      supporter_email: form.email 
                    }, '-created_date', 1);
                    
                    if (contributions.length > 0) {
                      const res = await base44.functions.invoke('generateDonorReceipt', {
                        contributionId: contributions[0].id
                      });
                      
                      if (res.data.success) {
                        const blob = new Blob([res.data.receiptHtml], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                        
                        toast({ 
                          title: 'Receipt generated!', 
                          description: `Receipt #${res.data.receiptNumber} opened` 
                        });
                      }
                    }
                  } catch (err) {
                    toast({ 
                      title: 'Could not generate receipt', 
                      description: 'Email hello@gannonwaye.com', 
                      variant: 'destructive' 
                    });
                  }
                }}
                className="rounded-full font-body text-sm border-primary/40 text-primary hover:bg-primary/10 gap-2"
              >
                Download Official Receipt 📄
              </Button>
              <p className="font-body text-[10px] text-muted-foreground">
                Official receipt provided. 10% of your contribution supports 1800RESPECT.
              </p>
            </div>
            
            <Button onClick={() => window.location.href = '/'} className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase px-8 mt-4">
              Back to Home
            </Button>
            <div className="pt-2">
              <p className="font-body text-xs text-muted-foreground mb-3">Help spread the word 🤍</p>
              <div className="flex justify-center gap-3">
                <ShareButtons
                  url="https://gannonwaye.com/back-this"
                  text="I just backed Gannon Waye's debut single 'Thank You' — you can too."
                />
              </div>
              <Link to="/impact" className="inline-flex items-center gap-2 mt-4 text-primary font-body text-xs hover:underline">
                See your community impact →
              </Link>
            </div>
          </motion.div>
        )}

        {/* HEADER */}
        {step !== 'done' && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Back This</p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">Support the<br />"Thank You" Project</h1>
              <p className="font-body text-foreground/60 leading-relaxed max-w-lg mx-auto">
                This isn't just a song. This is a story. This is healing. This is choosing yourself.
              </p>
              <p className="font-body text-foreground/50 text-sm mt-4 max-w-md mx-auto leading-relaxed">
                If something in this journey has resonated with you — if you've felt seen, even for a moment — this is your way to be part of it.
              </p>
              
              {/* 1800RESPECT Note in Header */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6 max-w-lg mx-auto text-left">
                <p className="font-body text-xs text-blue-700 leading-relaxed">
                  <strong>10% Giving Promise:</strong> Every month, I donate 10% of all support received to 1800RESPECT, supporting inclusive domestic violence services for women, men, and children — including specialised LGBTQIA+ support for those in same-sex relationships fleeing violence. Your contribution creates ripples of change. 🤍
                </p>
              </div>
            </motion.div>

            {/* What your support does */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="bg-card border border-border/40 rounded-2xl p-6 mb-8 space-y-2">
              <p className="font-body text-xs tracking-widest uppercase gradient-gold-glow mb-3">What your support does</p>
              {['Helps fund future releases', 'Supports independent music creation', 'Builds a safe space for others going through similar experiences', 'Keeps this movement growing'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="font-body text-sm text-foreground/70">{item}</p>
                </div>
              ))}
            </motion.div>
          </>
        )}

        {/* STEP 1 — CHOOSE AMOUNT + FREQUENCY */}
        {step === 'choose' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Frequency */}
            <div className="mb-6">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">How often?</p>
              <div className="grid grid-cols-3 gap-3">
                {FREQUENCIES.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFrequency(f.value)}
                    className={`py-2.5 rounded-xl border font-body text-sm transition-all ${
                      frequency === f.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/50 text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier cards */}
            <div className="mb-4">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Choose an amount</p>
              <div className="space-y-3">
                {TIERS.map(tier => {
                  const p = calcTotal(tier.amount);
                  return (
                    <button
                      key={tier.amount}
                      onClick={() => setSelectedTier(tier.amount)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all ${
                        selectedTier === tier.amount
                          ? 'border-primary bg-primary/10'
                          : 'border-border/40 bg-card hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-display text-xl text-foreground">${tier.amount} AUD{frequencyNote}</p>
                          <p className="font-body text-xs gradient-gold-glow mt-0.5">{tier.label}</p>
                          <p className="font-body text-xs text-muted-foreground mt-1">{tier.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-4 ${selectedTier === tier.amount ? 'border-primary bg-primary' : 'border-border/50'}`} />
                      </div>
                      <p className="font-body text-[11px] text-muted-foreground/60 mt-2">Total charged: ${p.total.toFixed(2)} (incl. GST + service fee)</p>
                    </button>
                  );
                })}

                {/* Custom amount */}
                <button
                  onClick={() => setSelectedTier('custom')}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    selectedTier === 'custom'
                      ? 'border-primary bg-primary/10'
                      : 'border-border/40 bg-card hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-display text-xl text-foreground">Custom amount</p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">Choose your own contribution (min $5)</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-4 ${selectedTier === 'custom' ? 'border-primary bg-primary' : 'border-border/50'}`} />
                  </div>
                  {selectedTier === 'custom' && (
                    <div onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-muted-foreground">$</span>
                        <Input
                          type="number"
                          min="5"
                          step="1"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={e => { setCustomAmount(e.target.value); setCustomError(''); }}
                          className="bg-secondary/50 border-border/40 w-36"
                          autoFocus
                        />
                        <span className="font-body text-xs text-muted-foreground">AUD</span>
                      </div>
                      {customError && <p className="font-body text-xs text-destructive mt-1">{customError}</p>}
                      {parseFloat(customAmount) >= 5 && (
                        <p className="font-body text-[11px] text-muted-foreground/60 mt-2">
                          Total charged: ${calcTotal(parseFloat(customAmount)).total.toFixed(2)} (incl. GST + service fee)
                        </p>
                      )}
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Fee note */}
            <div className="flex items-start gap-2 mb-6 bg-secondary/30 rounded-xl p-3">
              <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                All amounts shown in AUD. A 10% GST and 5% service & processing fee applies to all contributions. The fee breakdown is shown on each option above.
              </p>
            </div>

            <Button onClick={handleChooseNext} className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5">
              <Heart className="w-4 h-4 mr-2" /> Continue
            </Button>
          </motion.div>
        )}

        {/* STEP 2 — DETAILS */}
        {step === 'details' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setStep('choose')} className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-3 h-3" /> Back
            </button>

            <div className="bg-secondary/30 rounded-2xl p-4 mb-6 flex justify-between items-center">
              <div>
                <p className="font-body text-sm text-foreground font-medium">
                  ${baseAmount} AUD{frequency !== 'once' ? ` ${frequency}` : ''}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {selectedTier === 'custom' ? 'Custom contribution' : TIERS.find(t => t.amount === selectedTier)?.label}
                </p>
              </div>
              <p className="font-display text-xl gradient-gold-glow">${pricing.total.toFixed(2)} total</p>
            </div>

            <form onSubmit={handleDetailsNext} className="space-y-4">
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Your Name (optional)</Label>
                <Input placeholder="Gannon's biggest fan" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email *</Label>
                <Input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Leave a message (optional)</Label>
                <Input placeholder="This song helped me through..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>

              <div className="bg-secondary/30 rounded-xl p-4 space-y-1.5 text-sm font-body">
                <div className="flex justify-between text-foreground/60"><span>Base amount</span><span>${baseAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-foreground/60"><span>GST (10%)</span><span>${pricing.gst.toFixed(2)}</span></div>
                <div className="flex justify-between text-foreground/60"><span>Service & processing (5%)</span><span>${pricing.fee.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-foreground border-t border-border/40 pt-2">
                  <span>Total charged</span><span className="gradient-gold-glow">${pricing.total.toFixed(2)} AUD</span>
                </div>
              </div>

              <Button type="submit" className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5">
                Continue to Payment
              </Button>
            </form>
          </motion.div>
        )}

        {/* STEP 3 — PAYMENT */}
        {step === 'payment' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setStep('details')} className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-3 h-3" /> Back
            </button>

            <div className="bg-secondary/30 rounded-2xl p-4 mb-6 flex justify-between items-center">
              <p className="font-body text-sm text-foreground">
                {selectedTier === 'custom' ? 'Custom' : TIERS.find(t => t.amount === selectedTier)?.label}
                {frequency !== 'once' ? ` · ${frequency}` : ''}
              </p>
              <p className="font-display text-xl gradient-gold-glow">${pricing.total.toFixed(2)} AUD</p>
            </div>

            {frequency !== 'once' && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4 text-center">
                <p className="font-body text-xs text-primary/80">
                  This will charge ${pricing.total.toFixed(2)} AUD today, then automatically {frequency === 'fortnightly' ? 'every 2 weeks' : 'every month'}. Cancel anytime by emailing hello@gannonwaye.com
                </p>
              </div>
            )}

            <StripePaymentForm
              amount={pricing.total}
              customerEmail={form.email}
              customerName={form.name || 'Supporter'}
              productName={`Support — ${selectedTier === 'custom' ? `$${baseAmount} custom` : TIERS.find(t => t.amount === selectedTier)?.label}`}
              metadata={{ frequency, base_amount: String(baseAmount), type: 'support_contribution' }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />

            <p className="font-body text-xs text-muted-foreground text-center mt-3">🔒 Payments secured by Stripe</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}