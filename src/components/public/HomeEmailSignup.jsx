import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Mail } from 'lucide-react';

export default function HomeEmailSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const existing = await base44.entities.EmailSubscriber.filter({ email });
    if (existing.length === 0) {
      await base44.entities.EmailSubscriber.create({ email, name });
    }
    setDone(true);
    setLoading(false);
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-xl mx-auto text-center">
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
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Your name (optional)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-secondary/50 border-border/40 font-body"
              />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-secondary/50 border-border/40 font-body"
              />
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase shrink-0"
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