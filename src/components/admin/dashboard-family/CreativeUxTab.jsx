import CreativeStudio from '@/components/admin/dashboard-family/CreativeStudio';
import PremiumUX from '@/components/admin/dashboard-family/PremiumUX';
import EducationHub from '@/components/admin/dashboard-family/EducationHub';

// Creative Suite & UX Audits: the full Creative Studio (KnowledgeVault
// entity, CREATIVE_TOOLS and NOVA_PROMPTS configs), the Premium UX audits
// (AUDIT_CATEGORIES config), and the Education Hub (TrainingModule entity)
// — merged verbatim. Zero function loss.
export default function CreativeUxTab() {
  return (
    <div className="space-y-10">
      <CreativeStudio />
      <div className="border-t border-border/40 pt-8">
        <PremiumUX />
      </div>
      <div className="border-t border-border/40 pt-8">
        <EducationHub />
      </div>
    </div>
  );
}