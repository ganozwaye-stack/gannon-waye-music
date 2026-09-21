import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScheduleQueueTab from '@/components/admin/social-hub/ScheduleQueueTab';
import CommandOverviewTab from '@/components/admin/social-hub/CommandOverviewTab';
import FactoryTab from '@/components/admin/social-hub/FactoryTab';
import AssetsPipelineTab from '@/components/admin/social-hub/AssetsPipelineTab';
import IntegrationsTab from '@/components/admin/social-hub/IntegrationsTab';
import IntelligenceTab from '@/components/admin/social-hub/IntelligenceTab';
import FanKeywordsTab from '@/components/admin/social-hub/FanKeywordsTab';

export default function SocialScheduleQueue() {
  return (
    <div className="pb-10">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Release Sprint</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Social Schedule Queue</h1>
        </div>
        {/* Social Drafts stays canonical for draft copy. */}
        <Link
          to="/admin/social-drafts"
          className="inline-flex items-center gap-2 rounded-full border border-primary/35 text-primary px-4 py-2 font-body text-xs hover:bg-primary/10 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" /> Social Drafts
        </Link>
      </div>

      <Tabs defaultValue="queue">
        <TabsList className="flex-wrap h-auto gap-1 mb-6">
          <TabsTrigger value="queue">Schedule Queue</TabsTrigger>
          <TabsTrigger value="queue-command">Command Overview</TabsTrigger>
          <TabsTrigger value="factory">Post &amp; Reel Factory</TabsTrigger>
          <TabsTrigger value="assets-pipeline">Assets &amp; Pipeline</TabsTrigger>
          <TabsTrigger value="integrations">IG &amp; TikTok</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="fan-keywords">Fan Keywords</TabsTrigger>
        </TabsList>

        <TabsContent value="queue"><ScheduleQueueTab /></TabsContent>
        <TabsContent value="queue-command"><CommandOverviewTab /></TabsContent>
        <TabsContent value="factory"><FactoryTab /></TabsContent>
        <TabsContent value="assets-pipeline"><AssetsPipelineTab /></TabsContent>
        <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
        <TabsContent value="intelligence"><IntelligenceTab /></TabsContent>
        <TabsContent value="fan-keywords"><FanKeywordsTab /></TabsContent>
      </Tabs>
    </div>
  );
}