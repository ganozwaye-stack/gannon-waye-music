import Subscribers from '@/pages/admin/Subscribers';
import MusicFanHub from '@/pages/admin/MusicFanHub';

// CRM & Fan Subscriptions: the full Subscribers CRM table (EmailSubscriber,
// GiftRequirementTracker, MerchOrder and SupportContribution entities) plus
// the Music Fan Hub (KnowledgeVault entity, story themes) — merged verbatim.
// Zero function loss.
export default function CrmFanTab() {
  return (
    <div className="space-y-10">
      <Subscribers />
      <div className="border-t border-border/40 pt-8">
        <MusicFanHub />
      </div>
    </div>
  );
}