import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { calculateCheckoutTotal } from '@/lib/checkoutCalculations';

const BACK_THIS_LOGO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/1bb3c542d_image.png';
const HERO_BG = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/af70e9d80_image.png';

// Use centralized calculation
const calcTotal = (base) => {
  const calc = calculateCheckoutTotal(base, true);
  return {
    gst: calc.gst,
    fee: calc.merchantFee,
    total: calc.total,
    charity: calc.charityAllocation,
  };
};

const ALL_TIERS = [
  { amount: 5,   label: "I'm with you",          desc: "A small contribution that helps keep this going" },
  { amount: 10,  label: "I support the movement", desc: "You're part of building something bigger" },
  { amount: 50,  label: "Thank You Autographed Print (Physical)", desc: "A physical autographed art print shipped directly to you" },
  { amount: 100, label: "Thank You CD & Poster Bundle (Physical)", desc: "The physical CD & autographed poster bundle shipped to you" },
  { amount: 200, label: "1-on-1 Video Chat (15 min)", desc: "A private 15-minute video call with Gannon to chat about music and life" },
];

const TIERS = ALL_TIERS.slice(0, 4);

const FREQUENCIES = [
  { value: 'once',        label: 'Once Off' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly',     label: 'Monthly' },
];

// Wax-seal stamp eyebrow. Circular, dark interior, metallic gold rim and
// embossed arched "BACK THIS" lettering. Matches the approved mockup exactly.
function _BackThisSeal({ size = 104 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className="block"
      style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.45))' }}
      aria-label="Back This seal"
      role="img"
    >
      <defs>
        <linearGradient id="backThisSealGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a9842c" />
          <stop offset="38%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f0e6c8" />
          <stop offset="62%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#a9842c" />
        </linearGradient>
        <radialGradient id="backThisSealFace" cx="50%" cy="42%" r="68%">
          <stop offset="0%" stopColor="#2b2621" />
          <stop offset="100%" stopColor="#16130f" />
        </radialGradient>
        <path id="backThisSealArc" d="M 22 60 A 38 38 0 0 1 98 60" fill="none" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#backThisSealFace)" stroke="url(#backThisSealGold)" strokeWidth="3.5" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#backThisSealGold)" strokeWidth="1" opacity="0.55" />
      <circle cx="60" cy="60" r="47" fill="none" stroke="url(#backThisSealGold)" strokeWidth="0.5" opacity="0.25" />
      <text
        fill="url(#backThisSealGold)"
        fontSize="11.5"
        fontWeight="600"
        letterSpacing="3.5"
        fontFamily="Poppins, sans-serif"
        style={{ textTransform: 'uppercase' }}
      >
        <textPath href="#backThisSealArc" startOffset="50%" textAnchor="middle">BACK THIS</textPath>
      </text>
    </svg>
  );
}

export default function BackThis() {
  const { toast } = useToast();
  const location = useLocation();
  const [step, setStep] = useState('choose'); // choose | details | payment | done
  const [selectedTier, setSelectedTier] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [shipping, setShipping] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
  });
  const [customError, setCustomError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const amt = params.get('amount');
    if (amt) {
      const parsed = parseFloat(amt);
      if ([5, 10, 50, 100, 200].includes(parsed)) {
        setSelectedTier(parsed);
      } else if (!isNaN(parsed) && parsed > 0) {
        setSelectedTier('custom');
        setCustomAmount(amt);
      }
    }
  }, [location]);

  const baseAmount = selectedTier !== 'custom'
    ? (selectedTier ?? 0)
    : (parseFloat(customAmount) || 0);

  const pricing = calcTotal(baseAmount);
  
  const needsShipping = selectedTier === 50 || selectedTier === 100 || (selectedTier === 'custom' && baseAmount >= 50);

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
    if (needsShipping) {
      if (!shipping.address1 || !shipping.city || !shipping.state || !shipping.postcode || !shipping.country) {
        toast({ title: 'Please fill in all shipping fields for physical rewards', variant: 'destructive' });
        return;
      }
    }
    setStep('payment');
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    // ACQUIRE LOCK before payment
    try {
      const lockRes = await base44.functions.invoke('orderLockingMiddleware', {
        customerEmail: form.email,
        action: 'acquire',
      });
      
      if (lockRes.data.locked) {
        toast({ title: lockRes.data.message, variant: 'destructive' });
        return;
      }
    } catch (err) {
      console.error('Lock acquisition failed:', err);
    }

    // GDPR: Verify consent before proceeding
    const emailPrefs = await base44.entities.EmailPreference.filter({ email: form.email });
    const hasConsent = emailPrefs.length > 0 || window.confirm('Can we send you updates about your support?');
    
    if (!hasConsent) {
      // Release lock
      await base44.functions.invoke('orderLockingMiddleware', {
        customerEmail: form.email,
        action: 'release',
      }).catch(() => {});
      
      toast({ title: 'Email consent required', variant: 'destructive' });
      return;
    }

    const tierLabel = selectedTier === 'custom' ? 'Custom' : ALL_TIERS.find(t => t.amount === selectedTier)?.label;
    const tierKey = baseAmount >= 200 ? 'video_chat' : baseAmount >= 100 ? 'cd_bundle' : baseAmount >= 50 ? 'art_print' : baseAmount >= 10 ? 'movement' : 'with_you';
    const badge = baseAmount >= 200 ? 'video_chat' : baseAmount >= 100 ? 'vip_backer' : baseAmount >= 50 ? 'gold_supporter' : baseAmount >= 10 ? 'top_supporter' : 'supporter';

    const idempotenceKey = `contribution_${paymentIntent.id}`;
    
    const shippingMessageStr = needsShipping 
      ? `\n\n[SHIPPING DETAILS]\nName: ${form.name || 'Anonymous'}\nAddress: ${shipping.address1}${shipping.address2 ? `, ${shipping.address2}` : ''}\nCity: ${shipping.city}\nState: ${shipping.state}\nPostcode: ${shipping.postcode}\nCountry: ${shipping.country}`
      : '';
    
    const finalMessage = `${form.message || ''}${shippingMessageStr}`.trim();

    const contribution = await base44.entities.SupportContribution.create({
      supporter_name: form.name || null,
      supporter_email: form.email,
      amount: baseAmount,
      total_charged: pricing.total,
      frequency,
      tier_label: tierLabel,
      stripe_payment_id: paymentIntent.id,
      message: finalMessage || null,
      idempotence_key: idempotenceKey,
      shipping_address1: needsShipping ? shipping.address1 : null,
      shipping_address2: needsShipping ? shipping.address2 : null,
      shipping_city: needsShipping ? shipping.city : null,
      shipping_state: needsShipping ? shipping.state : null,
      shipping_postcode: needsShipping ? shipping.postcode : null,
      shipping_country: needsShipping ? shipping.country : null,
    });

    // Emit event for automation
    await emitEvent(EVENT_TYPES.CONTRIBUTION_RECEIVED, {
      id: contribution.id,
      supporter_name: form.name,
      supporter_email: form.email,
      amount: baseAmount,
      total_charged: pricing.total,
      frequency,
      idempotence_key: idempotenceKey,
    });

    // Upsert SupporterProfile
    const existing = await base44.entities.SupporterProfile.filter({ supporter_email: form.email });
    if (existing.length > 0) {
      await base44.entities.SupporterProfile.update(existing[0].id, {
        total_contributed: (existing[0].total_contributed || 0) + baseAmount,
        supporter_name: form.name || existing[0].supporter_name,
        message: finalMessage,
      });
    } else {
      await base44.entities.SupporterProfile.create({
        supporter_name: form.name || null,
        supporter_email: form.email,
        tier: tierKey,
        total_contributed: baseAmount,
        message: finalMessage,
        badge,
        is_public: true,
      });
    }

    // RELEASE LOCK after success
    await base44.functions.invoke('orderLockingMiddleware', {
      customerEmail: form.email,
      action: 'release',
    }).catch(() => {});

    setStep('done');
  };

  const handlePaymentError = (msg) => {
    toast({ title: msg || 'Payment failed. Please try again.', variant: 'destructive' });
  };

  const frequencyNote = frequency === 'once' ? '' : frequency === 'fortnightly' ? ' every 2 weeks' : ' per month';

  return (
    <div className="min-h-screen pb-20">
      {/* DONE */}
      {step === 'done' && (
        <div className="max-w-2xl mx-auto px-4 md:px-6 pt-24">
          <div className="text-right mb-2">
            <Link to="/support/domestic-violence" className="font-body text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
              Support Resources
            </Link>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 space-y-6">
            <Heart className="w-16 h-16 text-primary mx-auto" />
            <h2 className="font-display text-4xl text-foreground">Thank you.</h2>
            <p className="font-body text-foreground/60 leading-relaxed max-w-md mx-auto">
              {form.name ? `${form.name}, you're` : "You're"} part of this now. Your support means more than you know. 🤍
            </p>
            
            {/* Support context — no unverified charitable claim */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-8 max-w-lg mx-auto text-left">
              <p className="font-body text-xs tracking-widest uppercase text-primary mb-3">Where Your Support Goes</p>
              <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">
                Your contribution directly supports Gannon Waye's independent music creation, releases, and related artist activities.
              </p>
              <p className="font-body text-sm text-foreground/70 leading-relaxed mb-3">
                No portion of this contribution is represented as a charitable donation unless a separate verified campaign expressly says so.
              </p>
              <p className="font-body text-[11px] text-primary/70 mt-3 font-medium">
                This is a voluntary support contribution and is not represented as tax-deductible. Please seek independent advice if required.
              </p>
              <p className="font-body text-xs text-muted-foreground mt-2">
                If you need domestic and family violence support, visit <a href="https://www.1800respect.org.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">1800RESPECT →</a>
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
                  } catch {
                    toast({ 
                      title: 'Could not generate receipt', 
                      description: 'Email hello@gannonwaye.com', 
                      variant: 'destructive' 
                    });
                  }
                }}
                className="rounded-full font-body text-sm border-primary/40 text-primary hover:bg-primary/10 gap-2"
              >
                Download Contribution Receipt 📄
              </Button>
              <p className="font-body text-[10px] text-muted-foreground">
                A receipt is provided for your records. This contribution is not represented as tax-deductible.
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
                  text="I just backed Gannon Waye's independent music project — you can too."
                />
              </div>
              <Link to="/impact" className="inline-flex items-center gap-2 mt-4 text-primary font-body text-xs hover:underline">
                See your community impact →
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {step !== 'done' && (
        <>
          {/* HERO — centered logo statement over moody wallpaper */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0">
              <img src={HERO_BG} alt="" aria-hidden className="w-full h-full object-cover object-center opacity-40" />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 38%, rgba(8,8,14,0.30), rgba(8,8,14,0.86)), linear-gradient(180deg, rgba(8,8,14,0.55) 0%, rgba(8,8,14,0.50) 40%, rgba(8,8,14,0.95) 100%)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.07), transparent 45%)' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-10 pb-20">
              <div className="flex justify-end mb-6">
                <Link to="/support/domestic-violence" className="font-body text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
                  Support Resources
                </Link>
              </div>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
                <div className="flex items-center gap-5 md:gap-8 justify-center">
                  <h1 className="font-display text-3xl md:text-5xl gradient-gold-text leading-none">Support the</h1>
                  <img
                    src={BACK_THIS_LOGO}
                    alt="Back This — Gannon Waye"
                    className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover flex-shrink-0"
                    style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))' }}
                  />
                </div>
                <h1 className="font-display text-3xl md:text-5xl gradient-gold-text leading-none mt-5">Thank You Project</h1>
                <p className="font-body text-foreground/75 leading-relaxed mt-8 max-w-xl">
                  This isn't just a song. This is a story. This is healing. This is choosing yourself.
                </p>
                <p className="font-body text-foreground/55 text-sm leading-relaxed mt-3 max-w-xl">
                  If something in this journey has resonated with you, if you've felt seen even for a moment, this is your way to be part of it.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Narrative blocks */}
          <section className="max-w-6xl mx-auto px-4 md:px-6 py-14">
            <div className="grid md:grid-cols-2 gap-5 md:gap-6">
              <div className="bg-card/40 border border-border/30 rounded-2xl p-5">
                <p className="font-body text-[11px] tracking-[0.25em] uppercase gradient-gold-glow mb-2">What supporting this means</p>
                <p className="font-body text-sm text-foreground/70 leading-relaxed">Your support isn't a transaction. It's a vote of belief in honest, independent art. It says that stories told from lived experience matter, and that one person choosing to be vulnerable can give others permission to do the same.</p>
              </div>
              <div className="bg-card/40 border border-border/30 rounded-2xl p-5">
                <p className="font-body text-[11px] tracking-[0.25em] uppercase gradient-gold-glow mb-2">What your support allows</p>
                <p className="font-body text-sm text-foreground/70 leading-relaxed">It lets me finish the album, record properly, and release music that holds nothing back. It covers production, mixing, mastering, and the slow, unglamorous work of turning real life into songs that last.</p>
              </div>
              <div className="bg-card/40 border border-border/30 rounded-2xl p-5">
                <p className="font-body text-[11px] tracking-[0.25em] uppercase gradient-gold-glow mb-2">How it helps the wider community</p>
                <p className="font-body text-sm text-foreground/70 leading-relaxed">10% of every contribution goes to 1800RESPECT, funding inclusive support for women, men, and children fleeing violence, including specialised LGBTQIA+ care. So your support doesn't just reach me, it reaches people in their hardest moments.</p>
              </div>
              <div className="bg-card/40 border border-border/30 rounded-2xl p-5">
                <p className="font-body text-[11px] tracking-[0.25em] uppercase gradient-gold-glow mb-2">My commitments to you</p>
                <p className="font-body text-sm text-foreground/70 leading-relaxed">I commit to staying independent, to writing truthfully, to never exploiting this story for clicks, and to keeping you close to the journey as each release comes to life.</p>
              </div>
              <div className="bg-card/40 border border-border/30 rounded-2xl p-5 md:col-span-2">
                <p className="font-body text-[11px] tracking-[0.25em] uppercase gradient-gold-glow mb-2">Where this is going</p>
                <p className="font-body text-sm text-foreground/70 leading-relaxed max-w-3xl">The debut album. Live shows. A growing community of people who feel less alone. Long term, I want to build a platform where lived experience is treated as art, and where supporting one artist helps many people heal.</p>
              </div>
            </div>
          </section>

          {/* Steps — full width, cohesive with page */}
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            {/* STEP 1 — CHOOSE AMOUNT + FREQUENCY */}
            {step === 'choose' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Frequency — centered */}
                <div className="max-w-md mx-auto mb-10 text-center">
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

                {/* Tier cards — full width, two columns ($5 / $10 side by side) */}
                <div className="mb-6">
                  <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4 text-center">Choose an amount</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                    {TIERS.map(tier => {
                      const p = calcTotal(tier.amount);
                      return (
                        <button
                          key={tier.amount}
                          onClick={() => setSelectedTier(tier.amount)}
                          className={`w-full text-left p-5 rounded-2xl border transition-all flex flex-col ${
                            selectedTier === tier.amount
                              ? 'border-primary bg-primary/10'
                              : 'border-border/40 bg-card hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-display text-xl text-foreground">${tier.amount} AUD{frequencyNote}</p>
                              <p className="font-body text-xs gradient-gold-glow mt-0.5">{tier.label}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-4 ${selectedTier === tier.amount ? 'border-primary bg-primary' : 'border-border/50'}`} />
                          </div>
                          <p className="font-body text-xs text-muted-foreground mt-2">{tier.desc}</p>
                          <p className="font-body text-[11px] text-muted-foreground/60 mt-auto pt-3">Total charged: ${p.total.toFixed(2)} (incl. GST + service fee)</p>
                        </button>
                      );
                    })}

                    {/* Custom amount — spans full width */}
                    <button
                      onClick={() => setSelectedTier('custom')}
                      className={`w-full text-left p-5 rounded-2xl border transition-all md:col-span-2 ${
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

                {/* Action area — centered */}
                <div className="max-w-xl mx-auto">

                {/* Fee note */}
                <div className="flex items-start gap-2 mb-4 bg-secondary/30 rounded-xl p-3">
                  <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    All amounts shown in AUD. A 10% GST and 5% service & processing fee applies to all contributions. The fee breakdown is shown on each option above.
                  </p>
                </div>

                {/* Non-refundable disclaimer */}
                <div className="bg-secondary/30 border border-border/30 rounded-xl p-4 mb-6 text-left">
                  <p className="font-body text-xs text-amber-500 font-semibold uppercase tracking-wider mb-1">⚠️ Contribution Disclaimer</p>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    All contributions are 100% voluntary, direct-support payments and are strictly non-refundable. Physical rewards for the $50 and $100 tiers will be shipped upon release. The $200 tier video session will be scheduled via email.
                  </p>
                </div>

                <Button onClick={handleChooseNext} className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5">
                  <Heart className="w-4 h-4 mr-2" /> Continue
                </Button>
                </div>
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
                    <Input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-secondary/50 border-border/40" required />
                  </div>
                  <div>
                    <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Leave a message (optional)</Label>
                    <Input placeholder="This song helped me through..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="bg-secondary/50 border-border/40" />
                  </div>

                  {needsShipping && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 border-t border-border/30 pt-4"
                    >
                      <p className="font-body text-xs tracking-wider uppercase gradient-gold-glow mb-2">📦 Shipping Information (Physical Rewards)</p>
                      <div>
                        <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Address Line 1 *</Label>
                        <Input placeholder="123 Music Lane" value={shipping.address1} onChange={e => setShipping(s => ({ ...s, address1: e.target.value }))} className="bg-secondary/50 border-border/40" required />
                      </div>
                      <div>
                        <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Address Line 2 (Optional)</Label>
                        <Input placeholder="Apartment, suite, unit, etc." value={shipping.address2} onChange={e => setShipping(s => ({ ...s, address2: e.target.value }))} className="bg-secondary/50 border-border/40" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">City/Suburb *</Label>
                          <Input placeholder="Melbourne" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} className="bg-secondary/50 border-border/40" required />
                        </div>
                        <div>
                          <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">State/Territory *</Label>
                          <Input placeholder="VIC" value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} className="bg-secondary/50 border-border/40" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Postcode/Zip *</Label>
                          <Input placeholder="3000" value={shipping.postcode} onChange={e => setShipping(s => ({ ...s, postcode: e.target.value }))} className="bg-secondary/50 border-border/40" required />
                        </div>
                        <div>
                          <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Country *</Label>
                          <Input placeholder="Australia" value={shipping.country} onChange={e => setShipping(s => ({ ...s, country: e.target.value }))} className="bg-secondary/50 border-border/40" required />
                        </div>
                      </div>
                    </motion.div>
                  )}

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
                    {selectedTier === 'custom' ? 'Custom' : ALL_TIERS.find(t => t.amount === selectedTier)?.label}
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

                {/* Apple/Google Pay Visual Cues */}
                <div className="bg-secondary/40 border border-border/30 rounded-xl p-4 mb-4 flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="font-body text-xs text-foreground font-semibold">Accepted Payment Methods</span>
                    <span className="font-body text-[10px] text-muted-foreground">Credit/Debit Card, Apple Pay, Google Pay</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-body text-[10px] bg-secondary border border-border/50 rounded px-1.5 py-0.5 font-bold uppercase text-foreground">Apple Pay</span>
                    <span className="font-body text-[10px] bg-secondary border border-border/50 rounded px-1.5 py-0.5 font-bold uppercase text-foreground">G Pay</span>
                  </div>
                </div>

                <StripePaymentForm
                  amount={pricing.total}
                  customerEmail={form.email}
                  customerName={form.name || 'Supporter'}
                  productName={`Support — ${selectedTier === 'custom' ? `$${baseAmount} custom` : ALL_TIERS.find(t => t.amount === selectedTier)?.label}`}
                  metadata={{ frequency, base_amount: String(baseAmount), type: 'support_contribution' }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />

                <p className="font-body text-xs text-muted-foreground text-center mt-3">🔒 Payments secured by Stripe</p>
              </motion.div>
            )}
          </div>

          {/* BOTTOM — what your support does + independent support context */}
          <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-2 md:col-span-2">
                <p className="font-body text-xs tracking-widest uppercase gradient-gold-glow mb-3">What your support does</p>
                {['Helps fund future releases', 'Supports independent music creation', 'Builds a safe space for others going through similar experiences', 'Keeps this movement growing'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="font-body text-sm text-foreground/70">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/adcdec40c_GWheartlacewrap.png" alt="GW Heart" className="w-28 h-28 object-contain" />
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-left w-full">
                  <p className="font-body text-xs text-foreground/70 leading-relaxed mb-2">
                    <strong>Independent support:</strong> Contributions support Gannon Waye's music and related artist activities. No charitable transfer is represented unless a separate verified campaign expressly says so.
                  </p>
                  <p className="font-body text-[10px] text-primary/70 font-medium">
                    Support contribution only. Not represented as tax-deductible. See terms for details.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}