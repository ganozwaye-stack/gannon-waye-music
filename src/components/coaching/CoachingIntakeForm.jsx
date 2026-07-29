import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import CoachingDisclaimer from './CoachingDisclaimer';

export default function CoachingIntakeForm({ offerInterest = '', onSuccess = null }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    offer_interest: offerInterest,
    goal: '',
    current_challenge: '',
    support_wanted: '',
    preferred_format: 'no_preference',
    understands_coaching_not_therapy: false,
    crisis_aware: false,
    consent_to_contact: false,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.understands_coaching_not_therapy || !form.consent_to_contact || !form.crisis_aware) {
      setError('Please confirm all three checkboxes before submitting.');
      return;
    }
    setLoading(true);
    setError('');
    await base44.entities.CoachingIntake.create(form);
    // Also create a lead record
    await base44.entities.CoachingLead.create({
      full_name: form.full_name,
      email: form.email,
      goal: form.goal,
      current_challenge: form.current_challenge,
      support_wanted: form.support_wanted,
      understands_coaching_not_therapy: form.understands_coaching_not_therapy,
      consent_to_contact: form.consent_to_contact,
      source_offer: offerInterest,
      source_page: window.location.pathname,
    });
    setLoading(false);
    setSubmitted(true);
    onSuccess?.();
  };

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle className="w-12 h-12 text-primary mx-auto" />
        <h3 className="font-display text-2xl text-foreground italic">Thank you for reaching out.</h3>
        <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
          Your intake form has been received. Gannon will review it personally and be in touch within 2 business days.
        </p>
        <p className="font-body text-xs text-muted-foreground italic">Still here. And so are you.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-body text-xs uppercase tracking-widest text-muted-foreground">Full Name *</Label>
          <Input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your name" required className="bg-card/50 border-border/60" />
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-xs uppercase tracking-widest text-muted-foreground">Email *</Label>
          <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" required className="bg-card/50 border-border/60" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="font-body text-xs uppercase tracking-widest text-muted-foreground">Phone (optional)</Label>
        <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+61 4xx xxx xxx" className="bg-card/50 border-border/60" />
      </div>

      <div className="space-y-1.5">
        <Label className="font-body text-xs uppercase tracking-widest text-muted-foreground">What is your main goal? *</Label>
        <Textarea value={form.goal} onChange={e => set('goal', e.target.value)} placeholder="What are you hoping to work toward?" required className="bg-card/50 border-border/60 min-h-[80px]" />
      </div>

      <div className="space-y-1.5">
        <Label className="font-body text-xs uppercase tracking-widest text-muted-foreground">What's your current challenge? *</Label>
        <Textarea value={form.current_challenge} onChange={e => set('current_challenge', e.target.value)} placeholder="What's been hardest lately?" required className="bg-card/50 border-border/60 min-h-[80px]" />
      </div>

      <div className="space-y-1.5">
        <Label className="font-body text-xs uppercase tracking-widest text-muted-foreground">What would you like support with?</Label>
        <Textarea value={form.support_wanted} onChange={e => set('support_wanted', e.target.value)} placeholder="Self worth, boundaries, creative confidence, rebuilding after a painful chapter..." className="bg-card/50 border-border/60 min-h-[80px]" />
      </div>

      <div className="space-y-1.5">
        <Label className="font-body text-xs uppercase tracking-widest text-muted-foreground">Preferred format</Label>
        <select value={form.preferred_format} onChange={e => set('preferred_format', e.target.value)} className="w-full bg-card/50 border border-border/60 rounded-md px-3 py-2 text-sm text-foreground">
          <option value="no_preference">No preference</option>
          <option value="zoom">Zoom</option>
          <option value="phone">Phone</option>
          <option value="in_person">In person (Melbourne)</option>
        </select>
      </div>

      <div className="bg-secondary/40 border border-border/40 rounded-xl p-4 space-y-3">
        <p className="font-body text-xs text-muted-foreground font-semibold uppercase tracking-widest">Before you submit</p>
        {[
          { key: 'understands_coaching_not_therapy', label: 'I understand this is life coaching and mindset mentoring — not therapy, counselling, or crisis support.' },
          { key: 'crisis_aware', label: 'I understand that if I am in immediate danger or crisis, I should contact emergency services (000) or Lifeline (13 11 14).' },
          { key: 'consent_to_contact', label: 'I consent to Gannon Waye contacting me about my enquiry.' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)} className="mt-0.5 w-4 h-4 accent-yellow-500 shrink-0" />
            <span className="font-body text-xs text-foreground/70 leading-relaxed">{label}</span>
          </label>
        ))}
      </div>

      {error && <p className="font-body text-xs text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full gradient-gold-button border-0 rounded-full py-5 font-body text-sm tracking-wider uppercase">
        {loading ? 'Sending…' : 'Submit Intake Form'}
      </Button>

      <CoachingDisclaimer minimal />
    </form>
  );
}
