import CreativeStudio from '@/pages/admin/CreativeStudio';
import PremiumUX from '@/pages/admin/PremiumUX';
import EducationHub from '@/pages/admin/EducationHub';

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