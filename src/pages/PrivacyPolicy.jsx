import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Privacy Policy</h1>
          <p className="font-body text-sm text-muted-foreground">Last updated: May 2026</p>
        </motion.div>

        <div className="space-y-8 font-body text-foreground/75 leading-relaxed text-sm">
          <section>
            <h2 className="font-display text-xl text-foreground mb-3">1. Information We Collect</h2>
            <p>When you visit gannonwaye.com, we may collect personal information you voluntarily provide, including your name and email address when you sign up for updates, place an order, or submit a form. We also collect standard usage data such as IP addresses, browser type, and pages visited through analytics tools.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">2. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Send you music updates, release announcements, and newsletters (only if you opted in)</li>
              <li>Process and fulfil merchandise orders</li>
              <li>Respond to your enquiries and messages</li>
              <li>Improve the website and our communications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">3. Email Communications</h2>
            <p>If you subscribe to updates, you will receive emails about new music, events, merchandise, and behind-the-scenes content. You can update your preferences or unsubscribe at any time by visiting your <a href="/email-preferences" className="text-primary hover:underline">email preferences page</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">4. Third-Party Services</h2>
            <p>We use Stripe for secure payment processing. Stripe has its own privacy policy and we do not store your full payment details. We may also use Google services for analytics and order tracking.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">5. Data Storage & Security</h2>
            <p>Your data is stored securely and we take reasonable steps to protect it from unauthorised access. We do not sell or rent your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">6. Your Rights</h2>
            <p>You have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, email us at <a href="mailto:hello@gannonwaye.com" className="text-primary hover:underline">hello@gannonwaye.com</a>.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">7. Contact</h2>
            <p>For any privacy-related questions, contact us at <a href="mailto:hello@gannonwaye.com" className="text-primary hover:underline">hello@gannonwaye.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}