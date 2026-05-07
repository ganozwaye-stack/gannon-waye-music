/**
 * Legal Compliance Audit & Hardening
 * Australian Consumer Law, Privacy Act, GDPR, Accessibility, Refund Compliance
 */

// Compliance constants
export const LEGAL_CONFIG = {
  // Australian Consumer Law
  ACL: {
    refunds_allowed: true,
    major_failure_required: false, // Can refund for change of mind if policy allows
    time_limit_days: null, // No statutory time limit
    proof_of_purchase_required: true,
  },
  
  // Privacy Act 1988 (Cth)
  PRIVACY: {
    australian_business: true,
    collects_personal_info: true,
    must_have_privacy_policy: true,
    must_allow_access_correction: true,
    data_breach_notification: true,
  },
  
  // GDPR (for EU visitors)
  GDPR: {
    applies_to_eu_residents: true,
    right_to_access: true,
    right_to_erasure: true,
    right_to_portability: true,
    consent_required: true,
  },
  
  // Email compliance (Spam Act 2003)
  EMAIL: {
    consent_required: true,
    unsubscribe_required: true,
    sender_identification_required: true,
  },
  
  // Charity compliance
  CHARITY: {
    // IMPORTANT: NOT tax deductible unless registered with ACFID and has DGR status
    tax_deductible: false,
    donation_percentage: 10,
    charity_name: '1800RESPECT',
    charity_abn: null, // Would need to verify with charity
    requires_dgr_status: true,
  },
  
  // Accessibility (WCAG 2.1 AA)
  ACCESSIBILITY: {
    target_level: 'AA',
    keyboard_navigation_required: true,
    screen_reader_support_required: true,
    color_contrast_required: true,
    alt_text_required: true,
  },
};

/**
 * Validate donation/tax wording for legal safety
 */
export const validateDonationWording = (text) => {
  const unsafePhrases = [
    'tax deductible',
    'tax-deductible',
    'deductible donation',
    'claim on tax',
    'tax receipt',
  ];
  
  const safePhrases = [
    'official receipt',
    'donation receipt',
    'contribution receipt',
    'support receipt',
  ];
  
  const lowerText = text.toLowerCase();
  const unsafe = unsafePhrases.find(phrase => lowerText.includes(phrase));
  
  if (unsafe) {
    return {
      valid: false,
      issue: `Unsafe phrase detected: "${unsafe}"`,
      suggestion: 'Use "official receipt" or "donation receipt" instead',
    };
  }
  
  return { valid: true };
};

/**
 * Generate compliant refund policy text
 */
export const generateRefundPolicy = () => {
  return `REFUND POLICY\n\nMerchandise Refunds:\nUnder Australian Consumer Law, you are entitled to a refund if the product has a major fault or failure (e.g., significantly different from description, unsafe, or would not have been purchased if the fault was known).\n\nFor change-of-mind refunds:\nWe accept change-of-mind returns within 30 days of purchase, provided the item is unused, in original packaging, and in resalable condition. Return shipping costs are the responsibility of the customer.\n\nTo request a refund:\nEmail hello@gannonwaye.com with your order number and reason for return.\n\nRefund processing time: 5-10 business days after we receive the returned item.\n\nDigital Products:\nDigital downloads (e.g., music files) are non-refundable unless faulty.\n\nDonations:\nDonations are non-refundable. If you made a donation in error, please contact hello@gannonwaye.com and we will review your request on a case-by-case basis.\n\nContact:\nFor any refund enquiries, please contact:\nEmail: hello@gannonwaye.com\nAddress: [Business Address]\n\nThis policy complies with Australian Consumer Law.`;
};

/**
 * Generate compliant privacy policy sections
 */
export const generatePrivacyPolicySections = () => {
  return {
    collection: `WHAT WE COLLECT\n\nWe collect personal information that you voluntarily provide to us when you:\n- Subscribe to our email list\n- Purchase merchandise\n- Make a donation\n- Submit a booking enquiry\n- Contact us directly\n\nInformation collected may include:\n- Name and email address\n- Phone number\n- Shipping address\n- Payment information (processed securely by Stripe)\n- Booking details and event information`,
    
    use: `HOW WE USE YOUR INFORMATION\n\nWe use your information to:\n- Process and fulfill your orders\n- Send you updates about music, merch, and events (with your consent)\n- Respond to your enquiries\n- Improve our services\n- Comply with legal obligations\n\nWe do NOT sell your personal information to third parties.`,
    
    disclosure: `DISCLOSURE TO THIRD PARTIES\n\nWe may disclose your information to:\n- Payment processors (Stripe) for transaction processing\n- Shipping carriers for order delivery\n- Email service providers for newsletter delivery\n- Legal authorities if required by law\n\nAll third parties are required to protect your information and use it only for specified purposes.`,
    
    access: `YOUR RIGHTS\n\nYou have the right to:\n- Access your personal information\n- Request correction of inaccurate information\n- Request deletion of your information (subject to legal obligations)\n- Unsubscribe from marketing communications at any time\n- Lodge a complaint with the Office of the Australian Information Commissioner\n\nTo exercise these rights, contact: hello@gannonwaye.com`,
    
    security: `DATA SECURITY\n\nWe implement appropriate security measures to protect your personal information, including:\n- Secure payment processing via Stripe (PCI DSS compliant)\n- Encrypted data transmission (SSL/TLS)\n- Restricted access to personal information\n- Regular security reviews`,
    
    cookies: `COOKIES\n\nOur website uses cookies to:\n- Enhance user experience\n- Analyze website traffic\n- Remember your preferences\n\nYou can control cookie settings through your browser. Disabling cookies may affect website functionality.`,
    
    international: `INTERNATIONAL DATA TRANSFERS\n\nIf you access our website from outside Australia, your information may be transferred to and processed in Australia. By using our website, you consent to this transfer.`,
    
    children: `CHILDREN'S PRIVACY\n\nOur website is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.`,
    
    changes: `CHANGES TO THIS POLICY\n\nWe may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.`,
  };
};

/**
 * Check page for legal compliance issues
 */
export const auditPageCompliance = (pageContent) => {
  const issues = [];
  
  // Check for unsafe tax claims
  const taxCheck = validateDonationWording(pageContent);
  if (!taxCheck.valid) {
    issues.push({
      type: 'LEGAL_RISK',
      severity: 'HIGH',
      issue: taxCheck.issue,
      suggestion: taxCheck.suggestion,
    });
  }
  
  // Check for refund policy mention
  if (!pageContent.toLowerCase().includes('refund')) {
    issues.push({
      type: 'COMPLIANCE_GAP',
      severity: 'MEDIUM',
      issue: 'No refund policy mentioned',
      suggestion: 'Add link to refund policy on checkout and terms pages',
    });
  }
  
  // Check for privacy policy mention
  if (!pageContent.toLowerCase().includes('privacy')) {
    issues.push({
      type: 'COMPLIANCE_GAP',
      severity: 'MEDIUM',
      issue: 'No privacy policy reference',
      suggestion: 'Add privacy policy link to footer and forms',
    });
  }
  
  // Check for unsubscribe option (if email-related)
  if (pageContent.toLowerCase().includes('subscribe') && !pageContent.toLowerCase().includes('unsubscribe')) {
    issues.push({
      type: 'SPAM_ACT_RISK',
      severity: 'HIGH',
      issue: 'Email signup without unsubscribe mention',
      suggestion: 'Add "You can unsubscribe at any time" to email forms',
    });
  }
  
  return {
    compliant: issues.length === 0,
    issues,
    recommendations: [
      'Ensure all donation pages clearly state "non-tax-deductible"',
      'Add refund policy link to checkout flow',
      'Add privacy policy consent checkbox to all data collection forms',
      'Include unsubscribe link in all marketing emails',
      'Add accessibility statement to footer',
    ],
  };
};

/**
 * Generate compliant email footer
 */
export const generateEmailFooter = () => {
  return `\n\n--\nGannon Waye\nhello@gannonwaye.com\nwww.gannonwaye.com\n\nTo unsubscribe from future emails, click here: [UNSUBSCRIBE_LINK]\n\nGannon Waye acknowledges the Traditional Owners of Country throughout Australia and recognises the continuing connection to land, waters, and culture. We pay our respects to Elders past, present, and emerging.`;
};

/**
 * Generate accessibility checklist
 */
export const generateAccessibilityChecklist = () => {
  return [
    { category: 'Navigation', items: ['Keyboard navigation works', 'Skip to content link', 'Focus indicators visible', 'Logical tab order'] },
    { category: 'Images', items: ['All images have alt text', 'Decorative images marked appropriately', 'Image descriptions are meaningful'] },
    { category: 'Colors', items: ['Text has sufficient contrast (4.5:1 minimum)', 'Color is not the only means of conveying information', 'Links are distinguishable from text'] },
    { category: 'Forms', items: ['All inputs have labels', 'Error messages are clear and helpful', 'Required fields are indicated', 'Form errors announced to screen readers'] },
    { category: 'Content', items: ['Headings are hierarchical (H1 → H2 → H3)', 'Language is clear and simple', 'Text can be resized to 200%', 'Content reflows at different zoom levels'] },
    { category: 'Media', items: ['Videos have captions', 'Audio content has transcripts', 'Auto-playing media can be paused'] },
    { category: 'Interactions', items: ['All interactive elements are accessible via keyboard', 'Time limits can be extended or disabled', 'Users can undo actions'] },
  ];
};

export default {
  LEGAL_CONFIG,
  validateDonationWording,
  generateRefundPolicy,
  generatePrivacyPolicySections,
  auditPageCompliance,
  generateEmailFooter,
  generateAccessibilityChecklist,
};