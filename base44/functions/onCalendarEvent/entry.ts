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

    // Map Google events → CalendarEvent records (dedup by google_event_id)
    const detectType = (summary = '') => {
      const s = (summary || '').toLowerCase();
      if (s.includes('release') || s.includes('single') || s.includes('album')) return 'release';
      if (s.includes('gig') || s.includes('show') || s.includes('live') || s.includes('concert') || s.includes('tour') || s.includes('performance')) return 'gig';
      if (s.includes('rehearsal')) return 'rehearsal';
      if (s.includes('meeting') || s.includes('call')) return 'meeting';
      return 'other';
    };

    for (const event of allItems) {
      const googleId = event.id;
      if (!googleId) continue;

      // Cancelled events → remove from schedule
      if (event.status === 'cancelled') {
        const gone = await base44.asServiceRole.entities.CalendarEvent.filter({ google_event_id: googleId });
        for (const rec of gone) {
          await base44.asServiceRole.entities.CalendarEvent.delete(rec.id);
        }
        continue;
      }

      const eventType = detectType(event.summary);
      const isPublic = eventType === 'gig' || eventType === 'release';

      const payload = {
        google_event_id: googleId,
        title: event.summary || 'Untitled',
        description: event.description || '',
        start_time: event.start?.dateTime || event.start?.date,
        end_time: event.end?.dateTime || event.end?.date,
        location: event.location || '',
        event_type: eventType,
        is_public: isPublic,
        google_html_link: event.htmlLink || '',
      };

      const existing = await base44.asServiceRole.entities.CalendarEvent.filter({ google_event_id: googleId });
      if (existing.length > 0) {
        await base44.asServiceRole.entities.CalendarEvent.update(existing[0].id, payload);
      } else {
        await base44.asServiceRole.entities.CalendarEvent.create(payload);
      }
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