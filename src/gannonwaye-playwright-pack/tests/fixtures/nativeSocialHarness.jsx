import React from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import ScheduleQueueTab from '@/components/admin/social-hub/ScheduleQueueTab';
export function mountQueueFixture() {
 const host=document.createElement('div');document.body.replaceChildren(host);
 createRoot(host).render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><ScheduleQueueTab /></QueryClientProvider>);
}
