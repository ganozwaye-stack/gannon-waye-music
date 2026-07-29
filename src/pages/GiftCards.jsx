import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Loader2, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

const PRESET_VALUES = [25, 50, 100, 150];

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'GW-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += '-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function GiftCards() {
  const [step, setStep] = useState('select'); // select → details → processing → done
  const [value, setValue] = useState(/** @type {number | 'custom'} */ (50));
  const [customValue, setCustomValue] = useState('');
  const [form, setForm] = useState({
    purchaserName: '', purchaserEmail: '',
    recipientName: '', recipientEmail: '', message: '',
  });
  const [giftCardCode, setGiftCardCode] = useState('');
  const [error, setError] = useState('');

  const finalValue = value === 'custom' ? Math.max(10, parseFloat(customValue) || 0) : value;

  const handlePurchase = async () => {
    setError('');
    if (!form.purchaserName || !form.purchaserEmail || !form.recipientName || !form.recipientEmail) {
      setError('Please fill in all required fields.');
      return;
    }
    if (finalValue < 10) {
      setError('Gift card value must be at least $10 AUD.');
      return;
    }

    setStep('processing');
    try {
      const code = generateCode();
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      await base44.entities.GiftCard.create({
        code,
        value: finalValue,
        purchaser_name: form.purchaserName,
        purchaser_email: form.purchaserEmail,
        recipient_name: form.recipientName,
        recipient_email: form.recipientEmail,
        message: form.message,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      });

      // Create Stripe checkout session
      const res = await base44.functions.invoke('createCheckoutSession', {
        amount: Math.round(finalValue * 100),
        product_name: `Gift Card ($${finalValue} AUD) — Code ${code}`,
        metadata: {
          type: 'gift_card',
          gift_card_code: code,
          recipient_email: form.recipientEmail,
          purchaser_email: form.purchaserEmail,
        },
        success_url: `${window.location.origin}/gift-cards?status=success&code=${code}`,
        cancel_url: `${window.location.origin}/gift-cards?status=cancelled`,
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        // If no Stripe URL, show the code directly (payment will be handled separately)
        setGiftCardCode(code);
        setStep('done');
      }
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
      setStep('details');
    }
  };

  // Check for success redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      const code = params.get('code');
      if (code) {
        setGiftCardCode(code);
        setStep('done');
      }
    }
  }, []);

  if (step === 'done') {
    return (
      <div className="min-h-screen py-24 px-4 md:px-8 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <div className="bg-card border border-primary/30 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 mx-auto mb-6">
              <Check className="w-7 h-7 text-primary" />
            </div>
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Gift Card Purchased</p>
            <h1 className="font-display text-3xl text-foreground mb-3">Thank You!</h1>
            <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
              Your gift card is being processed. The recipient will receive their code and your message by email.
            </p>
            {giftCardCode && (
              <div className="bg-secondary/40 rounded-xl p-4 mb-6">
                <p className="font-body text-[10px] tracking-widest uppercase text-primary/50 mb-1">Your Gift Card Code</p>
                <p className="font-display text-2xl text-primary tracking-wider">{giftCardCode}</p>
              </div>
            )}
            <Link to="/store">
              <Button className="rounded-full font-body text-xs tracking-wider uppercase gradient-gold-button border-0 w-full">
                Continue to Store
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-lg mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center border border-primary/20 text-primary/60 mx-auto mb-6">
            <Gift className="w-7 h-7" />
          </div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Share the Music</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Gift Cards</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Give the gift of music and merch. Digital gift cards can be spent on anything in the store — CDs, hoodies, bundles, or digital downloads.
          </p>
        </motion.div>

        {/* Step 1: Select value */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="font-display text-lg text-foreground mb-4">Choose a Value</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {PRESET_VALUES.map(v => (
              <button
                key={v}
                onClick={() => { setValue(v); setCustomValue(''); }}
                className="font-display text-xl py-4 rounded-xl transition-all"
                style={{
                  background: value === v ? 'hsl(var(--primary) / 0.12)' : 'hsl(var(--secondary) / 0.3)',
                  border: `1px solid hsl(var(--primary) / ${value === v ? 0.4 : 0.15})`,
                  color: value === v ? 'hsl(var(--primary))' : 'hsl(var(--foreground) / 0.7)',
                }}
              >
                ${v}
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setValue('custom')}
              className="font-body text-xs tracking-wider uppercase px-4 py-2 rounded-full transition-all"
              style={{
                background: value === 'custom' ? 'hsl(var(--primary) / 0.12)' : 'transparent',
                border: `1px solid hsl(var(--primary) / ${value === 'custom' ? 0.4 : 0.2})`,
                color: value === 'custom' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              }}
            >
              Custom Amount
            </button>
            {value === 'custom' && (
              <div className="flex items-center gap-2">
                <span className="font-body text-sm text-muted-foreground">$</span>
                <Input
                  type="number"
                  min="10"
                  value={customValue}
                  onChange={e => setCustomValue(e.target.value)}
                  className="w-28"
                  placeholder="50"
                />
                <span className="font-body text-xs text-muted-foreground">AUD</span>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Details */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 mb-6 space-y-4">
          <h2 className="font-display text-lg text-foreground mb-2">Recipient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Your Name *</Label>
              <Input value={form.purchaserName} onChange={e => setForm({ ...form, purchaserName: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Your Email *</Label>
              <Input type="email" value={form.purchaserEmail} onChange={e => setForm({ ...form, purchaserEmail: e.target.value })} placeholder="jane@email.com" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Recipient Name *</Label>
              <Input value={form.recipientName} onChange={e => setForm({ ...form, recipientName: e.target.value })} placeholder="John Smith" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Recipient Email *</Label>
              <Input type="email" value={form.recipientEmail} onChange={e => setForm({ ...form, recipientEmail: e.target.value })} placeholder="john@email.com" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Personal Message (optional)</Label>
            <Textarea
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Happy birthday! Here's some music and merch to enjoy."
              maxLength={500}
              rows={3}
            />
          </div>
        </div>

        {/* Summary + CTA */}
        <div className="bg-card border border-primary/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-body text-sm text-muted-foreground">Gift Card Value</span>
            <span className="font-display text-2xl text-primary">${finalValue.toFixed(0)} AUD</span>
          </div>
          {error && <p className="font-body text-sm text-red-400 mb-3 text-center">{error}</p>}
          <Button
            onClick={handlePurchase}
            disabled={step === 'processing'}
            className="w-full rounded-full font-body text-sm tracking-wider uppercase gradient-gold-button border-0 gap-2"
          >
            {step === 'processing' ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Processing…</>
            ) : (
              <><Sparkles className="w-4 h-4" />Purchase Gift Card</>
            )}
          </Button>
          <p className="font-body text-[10px] text-muted-foreground/50 text-center mt-3 leading-relaxed">
            Secure payment via Stripe. Gift card codes are delivered by email and valid for 12 months.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link to="/store" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
