import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Loader2, Check, Calendar, Music, ShoppingBag, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

const REMINDER_TYPES = [
  { id: 'new_release', label: 'New Release', desc: 'Remind me when Gannon drops new music', icon: Music },
  { id: 'album_drop', label: 'Album Release', desc: 'Remind me when the album comes out', icon: Sparkles },
  { id: 'next_single', label: 'Next Single', desc: 'Remind me about the next single', icon: Music },
  { id: 'merch_drop', label: 'Merch Drop', desc: 'Remind me when new merch launches', icon: ShoppingBag },
  { id: 'tour_date', label: 'Tour / Live Show', desc: 'Remind me about upcoming shows', icon: MapPin },
  { id: 'general', label: 'Custom Reminder', desc: 'Set a custom date and message', icon: Calendar },
];

export default function FanReminders() {
  const [selectedType, setSelectedType] = useState('');
  const [form, setForm] = useState({ email: '', name: '', remindAt: '', customMessage: '' });
  const [status, setStatus] = useState('form'); // form → done
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !selectedType) {
      setError('Please enter your email and choose a reminder type.');
      return;
    }

    setLoading(true);
    try {
      let remindAt = form.remindAt;
      if (!remindAt) {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        remindAt = d.toISOString();
      }

      await base44.entities.FanReminder.create({
        email: form.email,
        name: form.name,
        reminder_type: selectedType,
        remind_at: remindAt,
        custom_message: form.customMessage,
        is_sent: false,
      });

      setStatus('done');
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'done') {
    return (
      <div className="min-h-screen py-24 px-4 md:px-8 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <div className="bg-card border border-primary/30 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 mx-auto mb-6">
              <Check className="w-7 h-7 text-primary" />
            </div>
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Reminder Set</p>
            <h1 className="font-display text-3xl text-foreground mb-3">You're In!</h1>
            <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
              We'll send you an email reminder at the right time. Keep an eye on your inbox — we won't spam you, ever.
            </p>
            <Link to="/music">
              <Button className="rounded-full font-body text-xs tracking-wider uppercase gradient-gold-button border-0 w-full">
                Back to Music
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
            <Bell className="w-7 h-7" />
          </div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Never Miss Out</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Fan Reminders</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Get a personal nudge when new music drops, merch launches, or shows are announced. Set it once — we'll handle the rest.
          </p>
        </motion.div>

        {/* Reminder type selection */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="font-display text-lg text-foreground mb-4">What do you want to be reminded about?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REMINDER_TYPES.map(type => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className="text-left p-4 rounded-xl transition-all"
                  style={{
                    background: isSelected ? 'hsl(var(--primary) / 0.10)' : 'hsl(var(--secondary) / 0.3)',
                    border: `1px solid hsl(var(--primary) / ${isSelected ? 0.4 : 0.15})`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-display text-sm ${isSelected ? 'text-primary' : 'text-foreground/80'}`}>{type.label}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{type.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 mb-6 space-y-4">
          <h2 className="font-display text-lg text-foreground mb-2">Your Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Name (optional)</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">When to remind you (optional — defaults to 1 month)</Label>
            <Input
              type="date"
              value={form.remindAt ? form.remindAt.split('T')[0] : ''}
              onChange={e => setForm({ ...form, remindAt: e.target.value ? new Date(e.target.value).toISOString() : '' })}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Anything you want us to know? (optional)</Label>
            <Textarea
              value={form.customMessage}
              onChange={e => setForm({ ...form, customMessage: e.target.value })}
              placeholder="e.g. Remind me when the Without You Here music video drops"
              maxLength={500}
              rows={3}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-card border border-primary/30 rounded-2xl p-6">
          {error && <p className="font-body text-sm text-red-400 mb-3 text-center">{error}</p>}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-full font-body text-sm tracking-wider uppercase gradient-gold-button border-0 gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Setting reminder…</>
            ) : (
              <><Bell className="w-4 h-4" />Set My Reminder</>
            )}
          </Button>
          <p className="font-body text-[10px] text-muted-foreground/50 text-center mt-3 leading-relaxed">
            We'll only email you about what you asked for. No spam, ever. Unsubscribe anytime.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link to="/music" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Back to Music
          </Link>
        </div>
      </div>
    </div>
  );
}