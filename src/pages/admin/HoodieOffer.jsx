import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send } from 'lucide-react';

const HOODIE_PRICE = 98;
const HOODIE_COST = 30;

export default function HoodieOffer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sendingEmail, setSendingEmail] = useState(false);

  const { data: subscribers } = useQuery({
    queryKey: ['emailSubscribers'],
    queryFn: () => base44.entities.EmailSubscriber.list('-created_date'),
    initialData: [],
  });

  const { data: promos } = useQuery({
    queryKey: ['promoCodes'],
    queryFn: () => base44.entities.PromoCode.filter({ code: 'HOODIE20' }),
    initialData: [],
  });

  const createPromo = useMutation({
    mutationFn: () =>
      base44.entities.PromoCode.create({
        code: 'HOODIE20',
        discount_percent: 20,
        description: 'Early supporter gift offer — 20% off hoodie sale price only',
        is_active: true,
        max_uses: null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
      toast({ title: '✓ Promo code created: HOODIE20 (20% off)' });
    },
  });

  const sendGiftEmails = async () => {
    setSendingEmail(true);
    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      try {
        await base44.functions.invoke('sendGiftOfferEmail', { email: sub.email });
        sent++;
      } catch {
        failed++;
      }
    }

    setSendingEmail(false);
    toast({
      title: `Emails sent: ${sent} | Failed: ${failed}`,
      description: `Gift offer emails sent to ${sent} subscribers.`,
    });
  };

  const promo = promos[0];
  const discountAmount = HOODIE_PRICE * 0.2;
  const discountedPrice = HOODIE_PRICE - discountAmount;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl text-foreground mb-8">Hoodie Gift Offer</h1>

      {/* Pricing Info */}
      <div className="bg-card border border-border/40 rounded-2xl p-6 mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Retail Price</p>
            <p className="font-display text-2xl text-foreground">${HOODIE_PRICE}</p>
          </div>
          <div>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Cost to You</p>
            <p className="font-display text-2xl text-foreground">${HOODIE_COST}</p>
          </div>
        </div>
        <div className="border-t border-border/30 pt-4">
          <p className="font-body text-sm text-muted-foreground mb-3">
            With 20% early supporter discount (HOODIE20):
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Discounted Price</p>
              <p className="font-display text-2xl gradient-gold-glow">${discountedPrice.toFixed(2)}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">(-${discountAmount.toFixed(2)})</p>
            </div>
            <div>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Your Margin</p>
              <p className="font-display text-2xl text-primary">${(discountedPrice - HOODIE_COST).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary/30 rounded-lg p-3 border border-primary/20">
          <p className="font-body text-xs text-primary/80 leading-relaxed">
            ✓ Discount applies only to the $98 hoodie sale price<br/>
            ✓ All fees, shipping, and taxes are NOT discounted
          </p>
        </div>
      </div>

      {/* Promo Code Management */}
      <div className="bg-card border border-border/40 rounded-2xl p-6 mb-8">
        <h2 className="font-display text-xl text-foreground mb-4">Promo Code Setup</h2>
        {promo ? (
          <div className="space-y-3">
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Active Code</p>
              <p className="font-display text-2xl text-primary">HOODIE20</p>
              <p className="font-body text-sm text-foreground/70 mt-2">20% discount on hoodie sale price</p>
              <p className="font-body text-xs text-muted-foreground mt-2">
                Uses: {promo.times_used || 0} {promo.max_uses ? `/ ${promo.max_uses}` : '(unlimited)'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-body text-sm text-muted-foreground">
              Create the HOODIE20 promo code to enable 20% discounts for early supporters.
            </p>
            <Button onClick={() => createPromo.mutate()} disabled={createPromo.isPending}>
              {createPromo.isPending ? 'Creating...' : 'Create HOODIE20 Code'}
            </Button>
          </div>
        )}
      </div>

      {/* Email Campaign */}
      <div className="bg-card border border-border/40 rounded-2xl p-6">
        <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" /> Gift Offer Email Campaign
        </h2>

        <div className="space-y-4">
          <div className="bg-secondary/30 rounded-lg p-4">
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
              Send the gift offer email to all {subscribers.length} current subscribers. They'll receive details on how to claim their gift by following you on social media.
            </p>
            <p className="font-body text-xs text-primary bg-primary/10 rounded px-3 py-2">
              ℹ️ Emails sent after May 10 will automatically include the gift offer to all new signups until June 10, 2026.
            </p>
          </div>

          <Button
            onClick={sendGiftEmails}
            disabled={sendingEmail || subscribers.length === 0}
            className="w-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5 gap-2"
          >
            <Send className="w-4 h-4" />
            {sendingEmail ? 'Sending...' : `Send to ${subscribers.length} Subscribers`}
          </Button>
        </div>

        {/* Preview */}
        <div className="mt-6 border-t border-border/30 pt-6">
          <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-3">Email Preview</p>
          <div className="bg-secondary/30 rounded-lg p-4 font-body text-sm text-foreground/80 space-y-2 max-h-48 overflow-y-auto">
            <p>Hi there,</p>
            <p>Thank you for signing up. You've shown me who you are, and that means everything.</p>
            <p>As a token of my appreciation, I'm sending you something special before the May 10 release.</p>
            <p className="font-semibold text-primary mt-2">How to claim your gift:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Follow me on TikTok @gann0nwaye and Instagram @gann0nwaye</li>
              <li>Like, comment, and share my latest post</li>
              <li>Reply to this email or DM me with a screenshot</li>
              <li>I'll personally send your gift 🤍</li>
            </ol>
            <p className="mt-2">This is my way of saying thank you for believing in this from the beginning.</p>
            <p>See you on the other side,<br/>Gannon</p>
          </div>
        </div>
      </div>
    </div>
  );
}