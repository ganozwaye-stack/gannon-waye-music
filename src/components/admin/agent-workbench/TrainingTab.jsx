import TrainingHub from '@/components/admin/agent-workbench/TrainingHub';

// Training & Developer Credentials: the full training hub (MODULES,
// LEVEL_CONFIG, SECURITY_ALERTS plus the Stripe Webhooks and TikTok Portal
// developer links) rendered verbatim. Zero function loss.
export default function TrainingTab() {
  return <TrainingHub />;
}