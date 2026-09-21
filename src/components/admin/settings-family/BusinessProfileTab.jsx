import BusinessProfileSettings from '@/components/admin/settings-family/BusinessProfileSettings';

// Business Profile & Legal Details: the full Business Profile Settings screen
// (serves /admin/business-profile-settings and /admin/settings/business-details)
// — BusinessProfileSettings entity, FIELD_GROUPS and STRIPE_STEPS configs,
// business addresses, Stripe onboarding checklists, and the exact legal copy
// "Source of truth for all public business details. Changes to public emails
// and legal copy require Gannon's explicit confirmation." Rendered verbatim.
// Zero function loss.
export default function BusinessProfileTab() {
  return <BusinessProfileSettings />;
}