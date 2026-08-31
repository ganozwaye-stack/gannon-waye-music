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
          <p className="font-body text-sm text-muted-foreground">Last updated: May 7, 2026</p>
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
            <h2 className="font-display text-xl text-foreground mb-3">3A. Support Contributions</h2>
            <p className="mb-2">Support contributions made through this website are voluntary payments to support independent music creation. By making a support contribution, you acknowledge:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Support contributions are not represented as tax-deductible donations unless deductible gift recipient status is confirmed in writing</li>
              <li>You may receive a receipt for your personal records, not as tax advice or a tax-deductibility statement</li>
              <li>10% of all support contributions received each month will be donated to 1800RESPECT</li>
              <li>Support contributions are non-refundable unless required by Australian Consumer Law</li>
              <li>Recurring contributions (fortnightly/monthly) will continue until you cancel by emailing hello@gannonwaye.com</li>
            </ul>
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
            <h2 className="font-display text-xl text-foreground mb-3">8. Australian Consumer Law</h2>
            <p>Our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">9. Privacy</h2>
            <p>Your use of this website is also governed by our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>, which outlines how we collect, use, and protect your personal information.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">10. Changes to Terms</h2>
            <p>We may update these terms from time to time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the website after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-3">11. Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:hello@gannonwaye.com" className="text-primary hover:underline">hello@gannonwaye.com</a>.</p>
            <p className="mt-2 text-xs text-muted-foreground">Gannon Waye Music | Melbourne, Victoria, Australia | ABN: 22 931 809 349</p>
          </section>
        </div>
      </div>
    </div>
  );
}