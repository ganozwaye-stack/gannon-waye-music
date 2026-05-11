import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

const ADDONS = [
  { key: 'addon_signed_cd', label: 'Signed CD single' },
  { key: 'addon_gift_wrap', label: 'Gift wrapping' },
  { key: 'addon_sticker', label: 'Exclusive sticker pack' },
  { key: 'addon_thank_you_note', label: 'Handwritten thank you note' },
  { key: 'addon_bundle', label: 'Full bundle (all add-ons)' },
];

const INITIAL_FORM = {
  name: '', email: '', phone: '',
  addon_signed_cd: false,
  addon_gift_wrap: false,
  addon_sticker: false,
  addon_thank_you_note: false,
  addon_bundle: false,
};

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${checked ? 'border-primary bg-primary' : 'border-border hover:border-primary/50'}`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
            <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="font-body text-sm text-foreground/80">{label}</span>
    </label>
  );
}

export default function MerchInterestModal({ product, onClose }) {
  const { toast } = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Selecting "Full bundle" auto-checks everything
  const handleAddonChange = (key) => {
    if (key === 'addon_bundle') {
      const newVal = !form.addon_bundle;
      setForm(f => ({
        ...f,
        addon_bundle: newVal,
        addon_signed_cd: newVal,
        addon_gift_wrap: newVal,
        addon_sticker: newVal,
        addon_thank_you_note: newVal,
      }));
    } else {
      setForm(f => ({ ...f, [key]: !f[key], addon_bundle: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast({ title: 'Name, email and phone are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const selectedAddons = ADDONS.filter(a => form[a.key]).map(a => a.label);
    await base44.entities.MerchInterest.create({
      product_id: product?.id || 'preorder-general',
      product_name: product?.name || 'Gannon Waye Merch Pre-order',
      name: form.name,
      email: form.email,
      phone: form.phone,
      consent_merch: true,
      description: selectedAddons.length > 0
        ? `Add-ons requested: ${selectedAddons.join(', ')}`
        : 'No add-ons selected',
    });
    setDone(true);
    setLoading(false);
  };

  const handleClose = () => {
    setDone(false);
    setForm(INITIAL_FORM);
    onClose();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border/40 max-w-md max-h-[90vh] overflow-y-auto">
        {done ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto" />
            <h3 className="font-display text-2xl text-foreground">You're on the Pre-order List 🤍</h3>
            <p className="font-body text-sm text-foreground/70 leading-relaxed max-w-xs mx-auto">
              We'll email you before payment is scheduled so you're never surprised. No charge today.
            </p>
            <Button onClick={handleClose} className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase px-8">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow">Register Pre-order Interest</p>
              </div>
              <h2 className="font-display text-xl text-foreground leading-snug">
                {product?.name || 'Gannon Waye Merch'}
              </h2>
              <div className="flex flex-col gap-2 mt-1">
                <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                  <p className="font-body text-xs text-foreground/70 leading-relaxed">
                    Pre-order interest only. <strong>No charge today.</strong> Payment scheduled for June 1, 2026, subject to confirmation.
                  </p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                  <p className="font-body text-xs text-amber-300 leading-relaxed">
                    🔥 <strong>Launch discount available on all orders until 5pm Sunday.</strong> Hurry — only while stocks last. Who's in?
                  </p>
                </div>
                <div className="bg-card border border-border/30 rounded-lg px-3 py-2">
                  <p className="font-body text-[11px] text-foreground/60 leading-relaxed">
                    <span className="text-primary font-semibold">Want an even better deal? 📲</span><br />
                    Follow Gannon on Instagram, comment <em>"Yes! Me please!"</em> on his latest post, like the <em>"Sing Along Here"</em> video, then comment <em>"yes please"</em>. Reply to your welcome email with screenshot proof. Reviewed manually — extra code sent after approval. <strong>Instagram actions are not automatically verified.</strong> Do the steps in order or the offer may not be approved.
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {/* Contact details */}
              <div className="space-y-3">
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1 block">Name *</Label>
                  <Input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Your name"
                    className="bg-secondary/50 border-border/40"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1 block">Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="you@example.com"
                    className="bg-secondary/50 border-border/40"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1 block">Phone *</Label>
                  <Input
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="+61 4xx xxx xxx"
                    className="bg-secondary/50 border-border/40"
                  />
                </div>
              </div>

              {/* Add-ons */}
              <div className="border-t border-border/30 pt-4">
                <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-3">Optional Add-ons</p>
                <div className="space-y-2.5">
                  {ADDONS.map(a => (
                    <Checkbox
                      key={a.key}
                      checked={form[a.key]}
                      onChange={() => handleAddonChange(a.key)}
                      label={a.label}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase"
              >
                {loading ? 'Registering...' : 'Register Pre-order Interest'}
              </Button>

              <p className="font-body text-xs text-muted-foreground text-center leading-relaxed">
                We'll email you before any payment is processed. Your details are never shared.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}