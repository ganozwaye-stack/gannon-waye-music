import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const state = body.data?._provider_meta?.['x-goog-resource-state'];
    if (state === 'sync') return Response.json({ status: 'sync_ack' });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Load or init sync token
    const existing = await base44.asServiceRole.entities.KnowledgeVault.filter({ category: 'other', source: 'CalendarSyncToken' }, '-created_date', 1);
    const syncRecord = existing.length > 0 ? existing[0] : null;

    let url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=20';
    if (syncRecord?.summary) {
      url += `&syncToken=${syncRecord.summary}`;
    } else {
      url += `&timeMin=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`;
    }

    let res = await fetch(url, { headers: authHeader });
    if (res.status === 410) {
      // syncToken expired — fresh sync
      url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=20&timeMin=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}`;
      res = await fetch(url, { headers: authHeader });
    }
    if (!res.ok) return Response.json({ status: 'api_error' });

    const allItems = [];
    let pageData = await res.json();
    let newSyncToken = null;
    while (true) {
      allItems.push(...(pageData.items || []));
      if (pageData.nextSyncToken) newSyncToken = pageData.nextSyncToken;
      if (!pageData.nextPageToken) break;
      const nextRes = await fetch(url + `&pageToken=${pageData.nextPageToken}`, { headers: authHeader });
      if (!nextRes.ok) break;
      pageData = await nextRes.json();
    }

    // Log changed events to AgentTaskLog
    for (const event of allItems) {
      if (event.status === 'cancelled') continue;
      await base44.asServiceRole.entities.AgentTaskLog.create({
        agent_name: 'CalendarAgent',
        task_title: `Calendar event: ${event.summary || 'Untitled'}`,
        task_description: `Start: ${event.start?.dateTime || event.start?.date || '—'} | Status: ${event.status}`,
        outcome: 'Logged from Google Calendar webhook',
        was_automatic: true,
        required_approval: false,
        risk_check_result: 'pass',
        tags: ['calendar', 'event'],
      });
    }

    // Save new sync token
    if (newSyncToken) {
      if (syncRecord) {
        await base44.asServiceRole.entities.KnowledgeVault.update(syncRecord.id, { summary: newSyncToken });
      } else {
        await base44.asServiceRole.entities.KnowledgeVault.create({
          title: 'Google Calendar Sync Token',
          category: 'other',
          source: 'CalendarSyncToken',
          summary: newSyncToken,
          content: 'Internal sync token for Google Calendar incremental sync. Do not delete.',
          access_level: 'admin_only',
        });
      }
    }

    return Response.json({ success: true, events_processed: allItems.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});