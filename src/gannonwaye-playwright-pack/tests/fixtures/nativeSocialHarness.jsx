import React from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {base44} from '@/api/base44Client';
import ScheduleQueueTab from '@/components/admin/social-hub/ScheduleQueueTab';
export function mountQueueFixture(records) {
 if(!['localhost','127.0.0.1'].includes(location.hostname))throw new Error('Local fixture only');
 base44.entities.ContentCalendarPost.filter=async()=>records;
 base44.entities.ContentCalendarPost.update=async()=>{throw new Error('Unexpected status mutation');};
 const host=document.createElement('div');document.body.replaceChildren(host);
 createRoot(host).render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><ScheduleQueueTab /></QueryClientProvider>);
}
