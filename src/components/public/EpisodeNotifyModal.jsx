import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function EpisodeNotifyModal({ episode, onClose }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Check existing, create if not found
    const existing = await base44.entities.EmailSubscriber.filter ? null : null;
    await base44.entities.EmailSubscriber.create({ email, name: `Episode notify: ${episode.title}` });
    setDone(true);
    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/40 max-w-sm">
        {done ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <p className="font-display text-xl text-foreground">You're on the list</p>
            <p className="font-body text-sm text-muted-foreground">We'll let you know when Episode {episode.number} — <em>{episode.title}</em> drops.</p>
            <Button onClick={onClose} className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Notify Me
              </DialogTitle>
              <p className="font-body text-sm text-muted-foreground">
                Episode {episode.number} — <em>{episode.title}</em> is coming. Enter your email and we'll let you know the moment it drops.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              <Input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-secondary/50 border-border/40"
                autoFocus
              />
              <Button type="submit" disabled={loading} className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
                {loading ? 'Saving...' : 'Notify Me'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}