import React from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import ScheduleQueueTab from '@/components/admin/social-hub/ScheduleQueueTab';
export function mountQueueFixture(records) {
 if(!['localhost','127.0.0.1'].includes(location.hostname))throw new Error('Local fixture only');
 const client=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:Infinity}}});
 client.setQueryData(['schedule-queue'],records);
 const host=document.createElement('div');document.body.replaceChildren(host);
 createRoot(host).render(<QueryClientProvider client={client}><ScheduleQueueTab /></QueryClientProvider>);
}
