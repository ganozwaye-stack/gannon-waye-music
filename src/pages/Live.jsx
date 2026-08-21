import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Radio, Instagram, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import StripePaymentForm from '@/components/store/StripePaymentForm';
import { emitEvent, EVENT_TYPES } from '@/lib/eventAutomation';
import { calculateCheckoutTotal } from '@/lib/checkoutCalculations';

const ALLOWED_EMBED_HOSTS = ['youtube.com', 'youtu.be', 'vimeo.com', 'streamyard.com', 'restream.io'];

function isSafeEmbedUrl(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    return ALLOWED_EMBED_HOSTS.some(h => u.hostname === h || u.hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

function BroadcasterGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-6 text-left max-w-4xl mx-auto mt-8 shadow-xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-display text-lg text-foreground hover:text-primary transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>🔧</span> Broadcaster Multi-Streaming Guide
        </span>
        <span className="font-body text-xs text-muted-foreground bg-secondary/50 border border-border/40 rounded-lg px-2 py-1">
          {isOpen ? 'Hide Instructions' : 'Show Instructions'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-6 space-y-6 border-t border-border/30 pt-6">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="font-body text-sm text-foreground font-semibold mb-2">Central RTMP Distribution Coordinates</p>
            <p className="font-body text-xs text-muted-foreground leading-relaxed mb-4">
              Connect OBS Studio or Restream.io to broadcast to TikTok Live, Instagram Live, and Facebook Live simultaneously. Use these settings inside your encoder:
            </p>
            <div className="space-y-3 font-body text-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between bg-background border border-border/40 rounded-lg p-3 gap-2">
                <div>
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Restream RTMP Server URL</span>
                  <p className="font-mono text-foreground mt-0.5 font-medium select-all">rtmp://live.restream.io/live</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('rtmp://live.restream.io/live', 'server')} className="self-start md:self-auto text-[10px] h-8 rounded-lg">
                  {copiedKey === 'server' ? 'Copied! ✓' : 'Copy URL'}
                </Button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between bg-background border border-border/40 rounded-lg p-3 gap-2">
                <div>
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Restream Stream Key</span>
                  <p className="font-mono text-foreground mt-0.5 font-medium">Set the stream key directly in your broadcaster. Never store it in site source.</p>
                </div>
                <Button size="sm" variant="outline" disabled className="self-start md:self-auto text-[10px] h-8 rounded-lg">
                  Key Not Stored
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold text-foreground">Step-by-Step Multi-Broadcast Routing</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-body text-xs">
              <div className="bg-secondary/20 border border-border/30 rounded-xl p-4 space-y-2">
                <span className="font-bold text-primary">1. OBS Encoder Setup</span>
                <p className="text-muted-foreground leading-relaxed">
                  Open OBS Studio settings. Set resolution to <strong>1080x1920</strong> (Vertical portrait layout for TikTok/Instagram/Facebook streams). Set video bitrate to <strong>4500 Kbps</strong>, audio to <strong>128 Kbps</strong>, and keyframe interval to <strong>2 seconds</strong>.
                </p>
              </div>

              <div className="bg-secondary/20 border border-border/30 rounded-xl p-4 space-y-2">
                <span className="font-bold text-primary">2. Restream destinations</span>
                <p className="text-muted-foreground leading-relaxed">
                  Log in to Restream.io. Add custom RTMP outputs or direct integrations for your socials: TikTok Live, Instagram Live Producer, and Facebook Live Page.
                </p>
              </div>

              <div className="bg-secondary/20 border border-border/30 rounded-xl p-4 space-y-2">
                <span className="font-bold text-primary">3. Going Live & Tipping</span>
                <p className="text-muted-foreground leading-relaxed">
                  Press <strong>Start Streaming</strong> in OBS. Broadcast begins instantly on all channels. Direct chat viewers to visit <strong>gannonwaye.com/live</strong> to send live tipping gifts and see real-time alerts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OfflineScreen({ settings }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg"
      >
        <div className="w-20 h-20 rounded-full bg-secondary/50 border border-border/40 flex items-center justify-center mx-auto mb-6">
          <Radio className="w-8 h-8 text-muted-foreground/40" />
        </div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Live Stream</p>
        <h1 className="font-display text-4xl text-foreground mb-4">
          {settings?.live_stream_status === 'scheduled' ? 'Coming Soon' : 'Nothing On Right Now'}
        </h1>
        {settings?.live_stream_title && (
          <p className="font-body text-lg text-foreground/70 mb-2">{settings.live_stream_title}</p>
        )}
        {settings?.live_stream_scheduled_at && settings?.live_stream_status === 'scheduled' && (
          <div className="flex items-center justify-center gap-2 mb-6 text-primary">
            <Calendar className="w-4 h-4" />
            <span className="font-body text-sm">
              {new Date(settings.live_stream_scheduled_at).toLocaleString('en-AU', {
                dateStyle: 'long', timeStyle: 'short',
              })}
            </span>
          </div>
        )}
        <p className="font-body text-sm text-muted-foreground mb-8">
          Follow on socials to be notified the moment Gannon goes live.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://www.tiktok.com/@gann0nwaye" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary">
              TikTok @gann0nwaye
            </Button>
          </a>
          <a href="https://www.instagram.com/gann0nwaye" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary">
              <Instagram className="w-3 h-3 mr-1" /> Instagram @gann0nwaye
            </Button>
          </a>
        </div>
        <p className="font-body text-xs text-muted-foreground/70 mt-8">
          Owner-approved releases and official listening links appear on the Music page.
        </p>
      </motion.div>
      <div className="w-full max-w-4xl px-4 mt-8">
        <BroadcasterGuide />
      </div>
    </div>
  );
}

export default function Live() {
  const [activeGift, setActiveGift] = useState(null);
  const { data: settingsArr } = useQuery({
    queryKey: ['site-settings-live'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  const settings = settingsArr?.[0];

  const isLive = settings?.live_stream_enabled && settings?.live_stream_status === 'live';
  const hasEmbed = isSafeEmbedUrl(settings?.live_stream_embed_url);
  const hasChatEmbed = isSafeEmbedUrl(settings?.live_stream_chat_url);

  if (!settings?.live_stream_enabled || !isLive || !hasEmbed) {
    return <OfflineScreen settings={settings} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-body text-xs text-red-400 font-semibold tracking-widest uppercase">Live</span>
          </div>
          <span className="font-display text-lg text-foreground">{settings.live_stream_title || 'Gannon Waye — Live'}</span>
        </div>
        {settings.live_stream_provider && (
          <span className="font-body text-xs text-muted-foreground">{settings.live_stream_provider}</span>
        )}
      </div>

      {/* Stream */}
      <div className={`flex flex-col md:flex-row flex-1 gap-0`}>
        <div className={`flex-1 aspect-video md:aspect-auto`}>
          <iframe
            src={settings.live_stream_embed_url}
            className="w-full h-full min-h-[56vw] md:min-h-[500px]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Gannon Waye Live Stream"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          />
        </div>
        {hasChatEmbed && (
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border/40">
            <iframe
              src={settings.live_stream_chat_url}
              className="w-full h-64 md:h-full"
              title="Live Chat"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        )}
      </div>

      {/* Social Live Links */}
      {(settings?.live_stream_tiktok_url || settings?.live_stream_instagram_url) && (
        <div className="bg-secondary/20 border-b border-border/40 py-4 px-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-left">
              <span className="text-xl">📱</span>
              <div>
                <p className="font-display text-sm font-semibold text-foreground">Simulcasting to Socials</p>
                <p className="font-body text-xs text-muted-foreground">Prefer to watch, comment, or share on your favorite app?</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {settings.live_stream_tiktok_url && (
                <a href={settings.live_stream_tiktok_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/5">
                    🔴 Watch TikTok Live
                  </Button>
                </a>
              )}
              {settings.live_stream_instagram_url && (
                <a href={settings.live_stream_instagram_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/5">
                    <Instagram className="w-3.5 h-3.5 mr-1.5" /> Watch Instagram Live
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Gifting & Support Panel */}
      <div className="px-4 py-10 max-w-5xl mx-auto w-full text-center space-y-6">
        <div>
          <h2 className="font-display text-2xl text-foreground flex items-center justify-center gap-2">
            <span className="animate-pulse">💝</span> Send a Live Gift
          </h2>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Support Gannon directly on stream. 10% of all contributions support 1800RESPECT domestic violence services.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Coffee ☕', amount: 5, desc: 'Fuel the writing session' },
            { label: 'Guitar String 🎸', amount: 10, desc: 'Keep Gannon in tune' },
            { label: 'Studio Hour 🎙️', amount: 50, desc: 'Physical Autographed Art Print shipped to you' },
            { label: 'Gold Heart 💛', amount: 100, desc: 'Physical CD & Poster Bundle shipped to you' },
            { label: '15 Min Chat 💬', amount: 200, desc: 'A private 15-minute video call with Gannon' },
          ].map(gift => (
            <div 
              key={gift.label}
              onClick={() => setActiveGift(gift)}
              className="bg-card border border-border/40 hover:border-primary/45 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:bg-primary/5 flex flex-col items-center justify-between shadow-lg"
            >
              <div className="text-center">
                <span className="text-3xl block mb-2">{gift.label.split(' ')[1] || '🎁'}</span>
                <h3 className="font-display text-sm font-semibold text-foreground">{gift.label.split(' ')[0]}</h3>
                <p className="font-body text-[10px] text-muted-foreground/60 mt-1.5 leading-relaxed">{gift.desc}</p>
              </div>
              <Button size="sm" className="mt-4 w-full gradient-gold-button border-0 font-body text-[10px] tracking-wider uppercase">
                Send ${gift.amount} AUD
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Setup instructions for Gannon */}
      <div className="px-4 pb-10 w-full">
        <BroadcasterGuide />
      </div>

      <div className="px-4 py-3 border-t border-border/40 text-center bg-card/25">
        <p className="font-body text-xs text-muted-foreground">
          Gannon Waye — Independent artist · <a href="https://gannonwaye.com" className="text-primary hover:underline">gannonwaye.com</a>
        </p>
      </div>

      {activeGift && (
        <LiveTippingModal gift={activeGift} onClose={() => setActiveGift(null)} />
      )}
    </div>
  );
}

function LiveTippingModal({ gift, onClose }) {
  const { toast } = useToast();
  const [step, setStep] = useState('details'); // details | payment | success
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [shipping, setShipping] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
  });

  const needsShipping = gift?.amount === 50 || gift?.amount === 100;
  const baseAmount = gift?.amount || 0;

  const calcTotal = (base) => {
    const calc = calculateCheckoutTotal(base, true);
    return {
      gst: calc.gst,
      fee: calc.merchantFee,
      total: calc.total,
      charity: calc.charityAllocation,
    };
  };

  const pricing = calcTotal(baseAmount);

  const handleDetailsSubmit = (e) => {
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
    try {
      await base44.functions.invoke('orderLockingMiddleware', {
        customerEmail: form.email,
        action: 'acquire',
      });
    } catch (err) {
      console.error('Lock acquisition failed:', err);
    }

    const emailPrefs = await base44.entities.EmailPreference.filter({ email: form.email });
    const hasConsent = emailPrefs.length > 0 || window.confirm('Can we send you updates about your support?');
    
    if (!hasConsent) {
      await base44.functions.invoke('orderLockingMiddleware', {
        customerEmail: form.email,
        action: 'release',
      }).catch(() => {});
      toast({ title: 'Email consent required', variant: 'destructive' });
      return;
    }

    const tierLabel = gift.label;
    const tierKey = baseAmount >= 200 ? 'video_chat' : baseAmount >= 100 ? 'cd_bundle' : baseAmount >= 50 ? 'art_print' : baseAmount >= 10 ? 'movement' : 'with_you';
    const badge = baseAmount >= 200 ? 'video_chat' : baseAmount >= 100 ? 'vip_backer' : baseAmount >= 50 ? 'gold_supporter' : baseAmount >= 10 ? 'top_supporter' : 'supporter';

    const idempotenceKey = `contribution_${paymentIntent.id}`;
    const shippingMessageStr = needsShipping 
      ? `\n\n[SHIPPING DETAILS]\nName: ${form.name || 'Anonymous'}\nAddress: ${shipping.address1}${shipping.address2 ? `, ${shipping.address2}` : ''}\nCity: ${shipping.city}\nState: ${shipping.state}\nPostcode: ${shipping.postcode}\nCountry: ${shipping.country}`
      : '';
    const finalMessage = `${form.message || ''}${shippingMessageStr}`.trim();

    try {
      const contribution = await base44.entities.SupportContribution.create({
        supporter_name: form.name || null,
        supporter_email: form.email,
        amount: baseAmount,
        total_charged: pricing.total,
        frequency: 'once',
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

      await emitEvent(EVENT_TYPES.CONTRIBUTION_RECEIVED, {
        id: contribution.id,
        supporter_name: form.name,
        supporter_email: form.email,
        amount: baseAmount,
        total_charged: pricing.total,
        frequency: 'once',
        idempotence_key: idempotenceKey,
      });

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
    } catch (err) {
      console.error('Tipping recording failed:', err);
    } finally {
      await base44.functions.invoke('orderLockingMiddleware', {
        customerEmail: form.email,
        action: 'release',
      }).catch(() => {});
    }

    setStep('success');
  };

  const handlePaymentError = (msg) => {
    toast({ title: msg || 'Payment failed. Please try again.', variant: 'destructive' });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/40 max-w-md max-h-[90vh] overflow-y-auto">
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground flex items-center gap-2">
                <span>💝</span> Send {gift.label.split(' ')[0]}
              </DialogTitle>
              <p className="font-body text-xs text-muted-foreground">
                Tipping ${gift.amount} AUD directly on stream · 10% supports 1800RESPECT
              </p>
            </DialogHeader>

            <form onSubmit={handleDetailsSubmit} className="space-y-4 mt-2">
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Your Name (optional)</Label>
                <Input placeholder="Gannon's biggest fan" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Email *</Label>
                <Input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-secondary/50 border-border/40" required />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Message (optional)</Label>
                <Input placeholder="Loving the live stream!" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="bg-secondary/50 border-border/40" />
              </div>

              {needsShipping && (
                <div className="space-y-4 border-t border-border/30 pt-4">
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
                </div>
              )}

              {/* Price Breakdown */}
              <div className="bg-secondary/40 rounded-xl p-4 space-y-1.5 text-xs font-body">
                <div className="flex justify-between text-foreground/60"><span>Base amount</span><span>${baseAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-foreground/60"><span>GST (10%)</span><span>${pricing.gst.toFixed(2)}</span></div>
                <div className="flex justify-between text-foreground/60"><span>Service & processing (5%)</span><span>${pricing.fee.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-foreground border-t border-border/40 pt-2 text-sm">
                  <span>Total charged</span><span className="gradient-gold-glow">${pricing.total.toFixed(2)} AUD</span>
                </div>
              </div>

              <Button type="submit" className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5">
                Continue to Payment
              </Button>
            </form>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">Confirm Tip</DialogTitle>
              <p className="font-body text-xs text-muted-foreground">
                ${pricing.total.toFixed(2)} AUD for {gift.label.split(' ')[0]}
              </p>
            </DialogHeader>

            <button onClick={() => setStep('details')} className="flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-foreground mb-4 mt-2">
              <ArrowLeft className="w-3 h-3" /> Back
            </button>

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
              productName={`Live Tipping — ${gift.label}`}
              metadata={{ frequency: 'once', base_amount: String(baseAmount), type: 'support_contribution' }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary text-3xl">
              🤍
            </div>
            <h3 className="font-display text-2xl text-foreground">Thank you for the support!</h3>
            <p className="font-body text-sm text-foreground/75 leading-relaxed max-w-sm mx-auto">
              Your gift has been sent and alerts have been triggered. Thank you for supporting the movement!
            </p>
            <Button onClick={onClose} className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase px-6">
              Back to Live Stream
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}