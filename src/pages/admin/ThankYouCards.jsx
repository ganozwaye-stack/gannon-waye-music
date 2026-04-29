import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, Download, ExternalLink, Copy, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PERSONAL_MESSAGE = `Thank you for showing me just who you are! What a champion for supporting my life long dream to release music and share my journey in hopes to resonate with others and change lives for the better!

I have so much pride in what I have created and I am so excited that now I will have a place in your world with this purchase.

As a token of my total appreciation use code FOUNDATIONVIP20 to get yourself another 20% off — but don't share this code because this one is a one time use and so you will lose it if you share it.

It is personally me thanking you because I know you wanted another item didn't you :P hahaha

Sending all my love and positivity your way and may we climb mountains together!

#GANNONARMY :)

— Gannon Waye`;

const CARD_PRINTERS = [
  {
    name: 'Vistaprint',
    url: 'https://www.vistaprint.com.au',
    description: 'Most popular for affordable postcards & business cards. Ships to Australia.',
    tags: ['Postcards', 'Business Cards', 'Cheap'],
    recommended: true,
    notes: 'Use "postcard" — 4×6 inch for the Thank You insert. Often has 50% off deals.',
  },
  {
    name: 'Canva Print',
    url: 'https://www.canva.com/print/',
    description: 'Design and print in one place. Great quality for postcards. Australian shipping.',
    tags: ['Postcards', 'Business Cards', 'Design Tool'],
    recommended: true,
    notes: 'Easiest workflow — design in Canva, print directly. Good value.',
  },
  {
    name: 'Officeworks Print',
    url: 'https://www.officeworks.com.au/print-and-copy',
    description: 'Australian-based, fast turnaround, pick up in store.',
    tags: ['Fast', 'Australia', 'Business Cards'],
    recommended: false,
    notes: 'Best for urgent small runs. Less polished finish than Vistaprint.',
  },
  {
    name: 'Moo',
    url: 'https://www.moo.com/au/',
    description: 'Premium quality business cards and postcards. Slightly more expensive but beautiful finish.',
    tags: ['Premium', 'Business Cards', 'Postcards'],
    recommended: false,
    notes: 'Worth it for a luxury feel. Ships to Australia.',
  },
  {
    name: 'Printful',
    url: 'https://www.printful.com',
    description: 'Print-on-demand, can integrate with your store for auto-fulfilment.',
    tags: ['Print on Demand', 'Scalable'],
    recommended: false,
    notes: 'Good if you want cards automatically inserted into merch orders at scale.',
  },
];

const CARD_SPECS = {
  front: 'Single artwork cover (once revealed on May 10) — postcard size 148mm × 105mm (A6) or 6×4 inch',
  back: 'Personal thank you message + autograph + gold "Thank You" decorative halo',
  finish: 'Matte or soft-touch laminate recommended for premium feel',
  paper: '350gsm or above',
};

export default function ThankYouCards() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyMessage = () => {
    navigator.clipboard.writeText(PERSONAL_MESSAGE);
    setCopied(true);
    toast({ title: 'Message copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCardBack = () => {
    const link = document.createElement('a');
    link.href = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e973573d4_generated_image.png';
    link.download = 'gannon-waye-thankyou-card-back.png';
    link.target = '_blank';
    link.click();
  };

  const downloadGWLogo = () => {
    const link = document.createElement('a');
    link.href = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/85b671cc8_generated_image.png';
    link.download = 'gannon-waye-GW-logo.png';
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Merch Packaging</p>
        <h1 className="font-display text-3xl text-foreground mb-2">Thank You Cards</h1>
        <p className="font-body text-sm text-muted-foreground">Design assets, message copy, and recommended printers for your order inserts.</p>
      </motion.div>

      {/* Card Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Front */}
        <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/30">
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Card Front — Single Artwork</p>
          </div>
          <div className="aspect-[3/2] bg-secondary/40 flex items-center justify-center p-6 relative">
            <div className="w-full h-full rounded-xl overflow-hidden border border-border/30 bg-secondary/60 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="font-display text-lg gradient-gold-glow">GW</span>
              </div>
              <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">Artwork revealed May 10</p>
              <p className="font-body text-[10px] text-muted-foreground/50">Replace with single cover once revealed</p>
            </div>
          </div>
          <div className="p-4 space-y-1 text-xs font-body text-muted-foreground">
            <p><span className="text-foreground/60">Size:</span> {CARD_SPECS.front}</p>
          </div>
        </div>

        {/* Back */}
        <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
          <div className="p-4 border-b border-border/30">
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Card Back — Thank You Message</p>
          </div>
          <div className="aspect-[3/2] bg-black overflow-hidden relative">
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e973573d4_generated_image.png"
              alt="Thank You Card Back"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 flex gap-2">
            <Button size="sm" onClick={downloadCardBack} className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase gap-1.5">
              <Download className="w-3 h-3" /> Download
            </Button>
          </div>
        </div>
      </div>

      {/* GW Logo for Merch */}
      <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
        <div className="p-4 border-b border-border/30">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">GW Circle Logo — For Merch</p>
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <img
            src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/85b671cc8_generated_image.png"
            alt="GW Logo"
            className="w-32 h-32 object-contain rounded-xl border border-border/30 bg-secondary/30 p-2"
          />
          <div className="flex-1 space-y-3">
            <p className="font-body text-sm text-foreground/70">Your GW circle monogram logo — suitable for embroidery, screen printing, and merchandise.</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={downloadGWLogo} className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase gap-1.5">
                <Download className="w-3 h-3" /> Download PNG
              </Button>
            </div>
            <p className="font-body text-xs text-muted-foreground/60">Note: Send this to your printer or embroiderer. Ask for a vector (SVG/AI) version if they need it for large-format print.</p>
          </div>
        </div>
      </div>

      {/* Message Copy */}
      <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Personal Message — Copy for Your Printer</p>
          <Button size="sm" variant="outline" onClick={copyMessage} className="rounded-full font-body text-xs gap-1.5">
            {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Text</>}
          </Button>
        </div>
        <div className="p-6">
          <pre className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">{PERSONAL_MESSAGE}</pre>
          <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex gap-2 items-start">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="font-body text-xs text-foreground/60">Remember to add your autograph/signature image at the bottom of the card. Upload it to your printer's design tool.</p>
          </div>
        </div>
      </div>

      {/* Print Specs */}
      <div className="rounded-2xl border border-border/40 bg-card p-6">
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">Recommended Print Specs</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(CARD_SPECS).map(([key, val]) => (
            <div key={key} className="bg-secondary/40 rounded-xl p-3">
              <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">{key}</p>
              <p className="font-body text-sm text-foreground/80">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Printers */}
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Recommended Card Printers</p>
        <div className="space-y-3">
          {CARD_PRINTERS.map((p) => (
            <div key={p.name} className={`rounded-2xl border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${p.recommended ? 'border-primary/30' : 'border-border/40'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-display text-lg text-foreground">{p.name}</p>
                  {p.recommended && (
                    <span className="font-body text-[9px] tracking-widest uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Recommended</span>
                  )}
                </div>
                <p className="font-body text-sm text-muted-foreground mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {p.tags.map(t => (
                    <span key={t} className="font-body text-[10px] border border-border/50 rounded-lg px-2 py-0.5 text-muted-foreground">{t}</span>
                  ))}
                </div>
                <p className="font-body text-xs text-foreground/50 italic">{p.notes}</p>
              </div>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="rounded-full font-body text-xs tracking-wider uppercase gap-1.5 shrink-0">
                  Visit <ExternalLink className="w-3 h-3" />
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <p className="font-body text-xs tracking-widest uppercase gradient-gold-glow mb-2">Viewing Subscribers</p>
        <p className="font-body text-sm text-foreground/70">
          Go to <strong className="text-foreground">Admin → Fan Management</strong> to see everyone who has signed up, registered merch interest, or submitted a community post. Email subscribers are also tracked there.
        </p>
      </div>
    </div>
  );
}