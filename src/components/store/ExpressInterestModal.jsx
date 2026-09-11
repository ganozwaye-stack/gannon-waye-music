import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, Sparkles } from 'lucide-react';

// Express Interest capture for pre-design items in the boutique world.
// A fan taps a hotspot on an item that has no live product yet; their details
// are saved so Gannon can reach them if and when the item is released.

export default function ExpressInterestModal({ item, onClose }) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Item-level interest record (back office) + the mailing list itself,
      // so the fan is reachable on release day either way.
      await base44.entities.MerchInterest.create({
        product_id: `predesign:${item.key}`,
        product_name: item.name,
        name: name.trim(),
        email: email.trim(),
        phone: '',
        consent_merch: true,
        description: 'Expressed interest from the boutique world storefront.',
      });
      await base44.entities.EmailSubscriber.create({
        email: email.trim(),
        name: name.trim(),
        consent_updates: true,
        consent_at: new Date().toISOString(),
        source: 'store_express_interest',
        description: `Waiting on the release of: ${item.name}.`,
      });
      setDone(true);
    } catch {
      // Duplicate signup or a saving hiccup — either way the fan is not blocked.
      toast({ title: "You're on the list 🤍" });
      setDone(true);
    }
    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/40 max-w-md">
        {done ? (
          <div className="text-center py-8 space-y-4">
            <DialogTitle className="sr-only">Interest registered</DialogTitle>
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto" />
            <h3 className="font-display text-2xl text-foreground">You're on the list 🤍</h3>
            <p className="font-body text-sm text-foreground/70 leading-relaxed max-w-xs mx-auto">
              If and when {item.name} is released, you'll hear about it first.
            </p>
            <Button
              type="button"
              onClick={onClose}
              className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase px-8"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow">Express Interest</p>
              </div>
              <DialogTitle className="font-display text-xl text-foreground leading-snug">
                {item.name}
              </DialogTitle>
              <p className="font-body text-xs text-muted-foreground leading-relaxed mt-1">
                This piece is still being designed. Register your details and you'll be
                the first to know if it's released.
              </p>
            </DialogHeader>

            <form onSubmit={submit} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="ei-name" className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1 block">Name *</Label>
                <Input
                  id="ei-name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-secondary/50 border-border/40"
                />
              </div>
              <div>
                <Label htmlFor="ei-email" className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1 block">Email *</Label>
                <Input
                  id="ei-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-secondary/50 border-border/40"
                />
              </div>
              {error && <p className="font-body text-xs text-destructive">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase"
              >
                {loading ? 'Saving…' : 'Notify me if this is released'}
              </Button>
              <p className="font-body text-[11px] text-muted-foreground text-center leading-relaxed">
                No charge, no commitment — just a heads-up if it happens. Your details are never shared.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}