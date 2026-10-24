import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalendarTab from '@/components/social-studio/CalendarTab';
import ComposerTab from '@/components/social-studio/ComposerTab';
import InboxTab from '@/components/social-studio/InboxTab';
import TemplatesTab from '@/components/social-studio/TemplatesTab';
import AssetsTab from '@/components/social-studio/AssetsTab';
import AnalyticsTab from '@/components/social-studio/AnalyticsTab';
import ConnectionsTab from '@/components/social-studio/ConnectionsTab';

export default function SocialStudio() {
  const [tab, setTab] = useState('calendar');
  const [editing, setEditing] = useState(null);
  const [calendarKey, setCalendarKey] = useState(0);

  const openInComposer = (post) => {
    setEditing(post);
    setTab('composer');
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-foreground flex items-center gap-3">
          <Share2 className="w-6 h-6 text-primary" /> Social Studio
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Plan, approve, schedule and publish posts. Publishing only runs for connected channels, on your action or the schedule, and never claims success without the provider confirming.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="composer">Composer</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-4">
          <CalendarTab onOpenPost={openInComposer} reloadKey={calendarKey} />
        </TabsContent>
        <TabsContent value="composer" className="mt-4">
          <ComposerTab post={editing} onPostChange={setEditing} onSaved={() => setCalendarKey((k) => k + 1)} />
        </TabsContent>
        <TabsContent value="inbox" className="mt-4"><InboxTab /></TabsContent>
        <TabsContent value="templates" className="mt-4">
          <TemplatesTab onCreated={openInComposer} />
        </TabsContent>
        <TabsContent value="assets" className="mt-4"><AssetsTab /></TabsContent>
        <TabsContent value="analytics" className="mt-4"><AnalyticsTab /></TabsContent>
        <TabsContent value="connections" className="mt-4"><ConnectionsTab /></TabsContent>
      </Tabs>
    </div>
  );
}