import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoachingOverviewTab from '@/components/admin/coaching-hub/CoachingOverviewTab';
import CoachingProgramsTab from '@/components/admin/coaching-hub/CoachingProgramsTab';
import CoachingClientsTab from '@/components/admin/coaching-hub/CoachingClientsTab';
import CoachingLeadsTab from '@/components/admin/coaching-hub/CoachingLeadsTab';
import CoachingResourcesTab from '@/components/admin/coaching-hub/CoachingResourcesTab';
import CoachingMeditationsTab from '@/components/admin/coaching-hub/CoachingMeditationsTab';

export default function CoachingHub() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin</p>
          <h1 className="font-display text-3xl text-foreground">Coaching Hub</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Gannon Waye Coaching — life coaching, mindset mentoring, self worth work</p>
        </div>
        {/* Intake forms stay canonical on their own screen. */}
        <Link
          to="/admin/coaching-intakes"
          className="inline-flex items-center gap-2 rounded-full border border-primary/35 text-primary px-4 py-2 font-body text-xs hover:bg-primary/10 transition-colors"
        >
          <Inbox className="w-3.5 h-3.5" /> Coaching Intakes
        </Link>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto gap-1 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Programs &amp; Offers</TabsTrigger>
          <TabsTrigger value="clients">Clients &amp; Sessions</TabsTrigger>
          <TabsTrigger value="leads">Leads &amp; Pipeline</TabsTrigger>
          <TabsTrigger value="resources">Workbooks &amp; Resources</TabsTrigger>
          <TabsTrigger value="meditations">Meditations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><CoachingOverviewTab /></TabsContent>
        <TabsContent value="programs"><CoachingProgramsTab /></TabsContent>
        <TabsContent value="clients"><CoachingClientsTab /></TabsContent>
        <TabsContent value="leads"><CoachingLeadsTab /></TabsContent>
        <TabsContent value="resources"><CoachingResourcesTab /></TabsContent>
        <TabsContent value="meditations"><CoachingMeditationsTab /></TabsContent>
      </Tabs>
    </div>
  );
}