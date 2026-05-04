import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
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
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Terms of Service</h1>
          <p className="font-body text-sm text-muted-foreground">Last updated: May 2026</p>
        </motion.div>

        <div className="space-y-8 font-body text-foreground/75 leading-relaxed text-sm">
          <section>
            <h2 className="font-display text-xl text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using gannonwaye.com, you agree to be bound by these Terms of Service. If you do not agree, please do not use this website.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">2. Use of the Site</h2>
            <p className="mb-2">You agree to use this website only for lawful purposes. You must not:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Post content that is abusive, harmful, or offensive in the community section</li>
              <li>Attempt to gain unauthorised access to any part of the site</li>
              <li>Use the site to distribute spam or unsolicited communications</li>
              <li>Reproduce or redistribute music, artwork, or any content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">3. Merchandise & Orders</h2>
            <p>All merchandise purchases are subject to availability. Preorders are charged at the time of order confirmation. Shipping estimates are provided in good faith but may vary. We reserve the right to cancel or refund orders if fulfilment is not possible.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">4. Fan-Submitted Content</h2>
            <p>By submitting a message, photo, or video to this platform, you grant Gannon Waye a non-exclusive right to display and share that content on this site and associated social channels. All submissions are subject to moderation and may be removed at our discretion.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">5. Intellectual Property</h2>
            <p>All music, artwork, photography, written content, and branding on this site are the intellectual property of Gannon Waye unless otherwise noted. Unauthorised reproduction is prohibited.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">6. Limitation of Liability</h2>
            <p>This website is provided "as is." We make no warranties about the accuracy or availability of the content. To the fullest extent permitted by law, Gannon Waye is not liable for any indirect or consequential damages arising from your use of this site.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">7. Governing Law</h2>
            <p>These terms are governed by the laws of Victoria, Australia. Any disputes shall be resolved under Australian law.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">8. Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:hello@gannonwaye.com" className="text-primary hover:underline">hello@gannonwaye.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}