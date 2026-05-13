import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Bell, CheckCircle2, Loader2 } from 'lucide-react';

export default function EpisodeNotifyModal({ episode, onClose }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.email.trim() || !form.email.includes('@')) errs.email = true;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    // Show success immediately — save in background
    setDone(true);
    setLoading(false);

    base44.entities.EmailSubscriber.filter({ email: form.email })
      .then(existing => {
        if (existing.length === 0) {
          return base44.entities.EmailSubscriber.create({
            email: form.email,
            name: form.name,
            description: `Requested notify for Episode ${episode.number}: ${episode.title}`,
          });
        }
        return null;
      })
      .catch(() => {
        base44.entities.EmailSubscriber.create({
          email: form.email,
          name: form.name,
          description: `Requested notify for Episode ${episode.number}: ${episode.title}`,
        }).catch(() => {});
      });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/40 max-w-sm">
        {done ? (
          <div className="text-center py-6 space-y-3">
            <DialogTitle className="sr-only">Notification registered</DialogTitle>
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <p className="font-display text-xl text-foreground">You're on the list 🤍</p>
            <p className="font-body text-sm text-muted-foreground">
              We'll let you know the moment Episode {episode.number} — <em>{episode.title}</em> drops.
            </p>
            <Button onClick={onClose} className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Notify Me
              </DialogTitle>
              <p className="font-body text-sm text-muted-foreground">
                Episode {episode.number} — <em>{episode.title}</em> is coming. Enter your details and we'll let you know when it drops.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 mt-2" noValidate>
              <div>
                <Input
                  placeholder="Your name *"
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(v => ({ ...v, name: false })); }}
                  className={`bg-secondary/50 border-border/40 ${errors.name ? 'border-destructive' : ''}`}
                  autoFocus
                />
                {errors.name && <p className="font-body text-xs text-destructive mt-1">Name required</p>}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="your@email.com *"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(v => ({ ...v, email: false })); }}
                  className={`bg-secondary/50 border-border/40 ${errors.email ? 'border-destructive' : ''}`}
                  inputMode="email"
                />
                {errors.email && <p className="font-body text-xs text-destructive mt-1">Valid email required</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Notify Me'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}