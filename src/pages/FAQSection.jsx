import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FAQS = [
  {
    q: 'Who is Gannon Waye?',
    a: 'Gannon Waye is an Adelaide-born, Melbourne-based independent singer songwriter. Raised without access to formal music lessons, he built his voice through school choirs, church, worship ministry, drag performance and community stages. His music turns grief, family violence, abusive relationships, addiction, PTSD and rebuilding into contemporary pop for people who need to feel less alone. Music approved for public sharing is listed on the Music page.',
  },
  {
    q: "Where can I listen to Gannon Waye's music?",
    a: 'Visit the Music page. Only releases approved for public sharing appear there, with their official listening links.',
  },
  {
    q: 'How do I stay updated on new music and events?',
    a: 'Follow @gann0nwaye on Instagram for current updates, or use the Contact page. Email registration is paused until a verified double-opt-in and unsubscribe process is connected.',
  },
  {
    q: 'How do I order merch?',
    a: "Head to the Store page to browse currently available merchandise. The price and availability shown there are the current offer; no unverified discount or scarcity claim is made here.",
  },
  {
    q: 'What is the "Back This" page?',
    a: 'Standalone and recurring support contributions are not currently accepted. You can support the music by listening, sharing, or buying an available item from the Store.',
  },
  {
    q: 'Can I share my own photos or videos on the fan wall?',
    a: 'Public fan-media uploads are not currently open. Use the Contact page for general enquiries; do not send private or sensitive material.',
  },
  {
    q: 'Can I leave a message for Gannon?',
    a: 'Use the Contact page to send a message. Messages are reviewed, but a personal reply or response time is not guaranteed.',
  },
  {
    q: 'Will I receive an automated reply?',
    a: "The site does not promise an automated or AI-written reply. If a response is appropriate, it will be handled through Gannon's current contact workflow.",
  },
  {
    q: 'Where can I follow Gannon on social media?',
    a: 'On Instagram and TikTok as @gann0nwaye, and YouTube as @gannonwayeofficial. You can also find videos embedded on the Videos page directly on this site.',
  },
  {
    q: 'I have a question not listed here. How do I get in touch?',
    a: 'Visit the Contact page and send a message directly. For bookings, press, or collaboration enquiries, email gannonwayemusic@gmail.com.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Got Questions?</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">FAQ</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Everything you might want to know about Gannon Waye, the music, the store, and this community.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border/40 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/20 transition-colors"
              >
                <p className="font-body text-sm font-medium text-foreground pr-4">{faq.q}</p>
                <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-sm text-foreground/70 leading-relaxed px-6 pb-6 border-t border-border/30 pt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center space-y-4"
        >
          <p className="font-body text-sm text-muted-foreground">Still have a question?</p>
          <Link to="/contact">
            <Button className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
              Get in Touch
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}