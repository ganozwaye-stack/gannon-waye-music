import React, { useState } from 'react';
import OwnerCommandShell from '@/components/admin-v3/OwnerCommandShell';
import TodayView from '@/components/admin-v3/TodayView';
import MusicMastering from '@/components/admin-v3/workspaces/MusicMastering';
import ContentPublishing from '@/components/admin-v3/workspaces/ContentPublishing';
import StoreFulfilment from '@/components/admin-v3/workspaces/StoreFulfilment';
import CoachingClients from '@/components/admin-v3/workspaces/CoachingClients';
import FansSupport from '@/components/admin-v3/workspaces/FansSupport';
import MoneyPayments from '@/components/admin-v3/workspaces/MoneyPayments';
import SystemsApprovals from '@/components/admin-v3/workspaces/SystemsApprovals';
import LegacyIndex from '@/components/admin-v3/LegacyIndex';

export default function OwnerCommandV3() {
  const [activeTab, setActiveTab] = useState('today');

  const renderWorkspace = () => {
    switch (activeTab) {
      case 'today': return <TodayView />;
      case 'music': return <MusicMastering />;
      case 'content': return <ContentPublishing />;
      case 'store': return <StoreFulfilment />;
      case 'coaching': return <CoachingClients />;
      case 'fans': return <FansSupport />;
      case 'money': return <MoneyPayments />;
      case 'systems': return <SystemsApprovals />;
      case 'legacy': return <LegacyIndex />;
      default: return <TodayView />;
    }
  };

  return (
    <OwnerCommandShell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderWorkspace()}
    </OwnerCommandShell>
  );
}