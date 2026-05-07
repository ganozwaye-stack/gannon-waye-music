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
          <p className="font-body text-sm text-muted-foreground">Last updated: May 7, 2026</p>
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
            <h2 className="font-display text-xl text-foreground mb-3">7. Cookies</h2>
            <p>We use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us understand how you use our site. You can choose to disable cookies through your browser settings, but this may affect your ability to use certain features of the website.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">8. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites (e.g., streaming platforms, social media, 1800RESPECT). We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">9. International Data Transfers</h2>
            <p>Some of our service providers (e.g., Stripe, email services) may process data outside of Australia. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">10. Children's Privacy</h2>
            <p>Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">12. Complaints</h2>
            <p>If you have a complaint about how we handle your personal information, please contact us at hello@gannonwaye.com. We will respond to your complaint within 30 days. If you are not satisfied with our response, you may have the right to lodge a complaint with the Office of the Australian Information Commissioner.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">13. Contact</h2>
            <p>For any privacy-related questions or requests, contact us at <a href="mailto:hello@gannonwaye.com" className="text-primary hover:underline">hello@gannonwaye.com</a>.</p>
            <p className="mt-2 text-xs text-muted-foreground">Gannon Waye | Melbourne, Victoria, Australia</p>
          </section>
        </div>
      </div>
    </div>
  );
}