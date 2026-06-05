import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FAQS = [
  {
    q: 'Who is Gannon Waye?',
    a: 'Gannon Waye is an Australian singer-songwriter based in Melbourne, originally from Adelaide. He writes deeply personal music about grief, healing, self-discovery, and the quiet transformation that comes from lived experience. His debut single "Thank You" is the beginning of a larger body of work.',
  },
  {
    q: 'Where can I listen to the debut single "Thank You"?',
    a: 'The debut single "Thank You" was released on June 5, 2026. You can stream it now on Spotify, Apple Music, YouTube, and all other major music platforms.',
  },
  {
    q: 'How do I stay updated on new music and events?',
    a: 'Sign up for the newsletter on the home page or visit your Fan Profile to choose exactly what you want to hear about — new music, merch drops, tour dates, behind-the-scenes content, and more. No spam, ever.',
  },
  {
    q: 'How do I order merch?',
    a: "Head to the Store page. The store opened May 10 at 2pm AEST. You can pre-order items and they'll ship before June 9, 2026. Use code LAUNCH15 for 15% off your first order (first 20 orders only).",
  },
  {
    q: 'What is the "Back This" page?',
    a: '"Back This" is a direct support page where fans can contribute to help fund the music independently. You can give once, fortnightly, or monthly. Every contribution genuinely helps, and Gannon personally reads every message left there.',
  },
  {
    q: 'Can I share my own photos or videos on the fan wall?',
    a: 'Yes! Head to the Community page or scroll down on the home page to find the Fan Media section. You can upload a photo or video, give consent for it to be featured, and become part of the visual story of this chapter.',
  },
  {
    q: 'Can I leave a message for Gannon?',
    a: 'Absolutely. The Community page has an open message wall where fans leave real messages. All posts are moderated before going live. You can also use the Contact page to send a direct message.',
  },
  {
    q: 'How does the AI reply work on my community post?',
    a: "When you post in the Community section and include your email, Gannon's system sends a personalised reply based on the tone and meaning of your message. It's not a bot template — it's crafted to feel genuine and considered.",
  },
  {
    q: 'Where can I follow Gannon on social media?',
    a: 'On Instagram and TikTok as @gann0nwaye, and YouTube as @gannonwayeofficial. You can also find videos embedded on the Videos page directly on this site.',
  },
  {
    q: 'I have a question not listed here. How do I get in touch?',
    a: 'Visit the Contact page and send a message directly. For bookings, press, or collaboration enquiries, email hello@gannonwaye.com.',
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