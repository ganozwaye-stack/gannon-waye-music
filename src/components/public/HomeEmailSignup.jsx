import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Mail } from 'lucide-react';

const HOW_FOUND_OPTIONS = [
  { value: 'google', label: 'Google' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'x_twitter', label: 'X (Twitter)' },
  { value: 'friend_word_of_mouth', label: 'Friend / Word of Mouth' },
  { value: 'i_know_gannon', label: 'I know Gannon' },
  { value: 'other', label: 'Other' },
];

export default function HomeEmailSignup() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', how_found: '' });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.email.trim()) e.email = true;
    if (!form.how_found) e.how_found = true;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    const existing = await base44.entities.EmailSubscriber.filter({ email: form.email });
    if (existing.length === 0) {
      await base44.entities.EmailSubscriber.create(form);
    }
    setDone(true);
    setLoading(false);
  };

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: false }));
  };

  const inputCls = (field) =>
    `bg-secondary/50 border-border/40 font-body ${errors[field] ? 'border-destructive' : ''}`;

  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Stay Connected</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">Join the Inner Circle</h2>
          <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
            Be the first to hear about new music, behind-the-scenes stories, and exclusive updates.
          </p>

          {done ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <p className="font-body text-sm text-foreground">You're in. Thank you 🤍</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
              {/* Name */}
              <div>
                <Input
                  placeholder="Full name *"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  className={inputCls('name')}
                />
                {errors.name && <p className="font-body text-xs text-destructive mt-1">Name is required</p>}
              </div>

              {/* Phone */}
              <div>
                <Input
                  placeholder="Phone number incl. country code e.g. +61 400 000 000 *"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  className={inputCls('phone')}
                />
                {errors.phone && <p className="font-body text-xs text-destructive mt-1">Phone number is required</p>}
              </div>

              {/* Email */}
              <div>
                <Input
                  type="email"
                  placeholder="Email address *"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={inputCls('email')}
                />
                {errors.email && <p className="font-body text-xs text-destructive mt-1">Email is required</p>}
              </div>

              {/* How found */}
              <div>
                <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2">
                  How did you come across this page? *
                </p>
                <div className="flex flex-wrap gap-2">
                  {HOW_FOUND_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('how_found', opt.value)}
                      className={`px-3 py-1.5 rounded-full border font-body text-xs transition-all ${
                        form.how_found === opt.value
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-border/50 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {errors.how_found && <p className="font-body text-xs text-destructive mt-1">Please select an option</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase mt-2"
              >
                {loading ? '...' : 'Subscribe'}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}