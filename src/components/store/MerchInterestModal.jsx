import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Heart, CheckCircle2, LogIn } from 'lucide-react';

export default function MerchInterestModal({ product, open, onClose }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', consent_email: false, consent_news: false, consent_events: false, consent_merch: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [isAuthed, setIsAuthed] = useState(null); // null = checking

  useEffect(() => {
    if (open) {
      base44.auth.isAuthenticated().then(setIsAuthed);
    }
  }, [open]);

  const handleSignIn = () => {
    base44.auth.redirectToLogin(window.location.pathname);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast({ title: 'Name and email are required', variant: 'destructive' }); return; }
    setLoading(true);
    await base44.entities.MerchInterest.create({
      product_id: product.id,
      product_name: product.name,
      ...form
    });
    setDone(true);
    setLoading(false);
  };

  const handleClose = () => { setDone(false); setIsAuthed(null); setForm({ name: '', email: '', phone: '', consent_email: false, consent_news: false, consent_events: false, consent_merch: false }); onClose(); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border/40 max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {done ? 'Interest Registered!' : `I'm Interested: ${product?.name}`}
          </DialogTitle>
          <DialogDescription className="font-body text-muted-foreground text-sm">
            {done ? "We'll let you know the moment this is available." : 'Register your interest and be first to know when this drops on May 10.'}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="font-body text-sm text-muted-foreground">You're on the list. Watch your inbox on May 10!</p>
          </div>
        ) : isAuthed === null ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : !isAuthed ? (
          <div className="text-center py-8 space-y-4">
            <LogIn className="w-10 h-10 text-primary mx-auto" />
            <p className="font-body text-sm text-foreground/70 leading-relaxed max-w-xs mx-auto">
              Create a free account to register your interest and be first in line when the store drops on May 10.
            </p>
            <Button onClick={handleSignIn} className="rounded-full gradient-gold-button border-0 font-body tracking-wider uppercase px-8">
              Sign Up / Log In
            </Button>
            <p className="font-body text-xs text-muted-foreground">It's free — takes 30 seconds.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className="mt-1" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Phone (optional)</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+61 4xx xxx xxx" className="mt-1" />
            </div>

            <div className="border-t border-border/30 pt-4">
              <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-3">Permission to contact you about:</p>
              <div className="space-y-2">
                {[
                  { key: 'consent_email', label: 'General news & updates' },
                  { key: 'consent_news', label: 'New music releases' },
                  { key: 'consent_events', label: 'Upcoming events & shows' },
                  { key: 'consent_merch', label: 'Merchandise & exclusive drops' },
                ].map(c => (
                  <label key={c.key} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setForm(f => ({ ...f, [c.key]: !f[c.key] }))}
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${form[c.key] ? 'border-primary bg-primary' : 'border-border'}`}
                    >
                      {form[c.key] && <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3"><path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="font-body text-sm text-foreground/80">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-full gradient-gold-button border-0 font-body tracking-wider uppercase">
              <Heart className="w-4 h-4 mr-2" />
              {loading ? 'Registering...' : "I'm Interested"}
            </Button>
            <p className="font-body text-xs text-muted-foreground text-center">Your details are safe with us and never shared.</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}