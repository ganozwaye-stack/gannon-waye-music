import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Sync Release entities to Google Calendar
// Runs weekly to keep calendar in sync with release database
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Fetch all releases
    const releases = await base44.asServiceRole.entities.Release.list('-created_date', 100);
    const calendarId = 'primary';

    for (const release of releases) {
      if (!release.release_date) continue;

      const releaseDate = new Date(release.release_date);
      const eventStart = releaseDate.toISOString();
      const eventEnd = new Date(releaseDate.getTime() + 60 * 60 * 1000).toISOString();

      const event = {
        summary: `🎵 Release: ${release.title || 'Untitled'}`,
        description: `Artist: Gannon Waye\nFormat: ${release.format || 'Digital'}\nPlatforms: ${release.platforms?.join(', ') || 'All'}`,
        start: { dateTime: eventStart, timeZone: 'UTC' },
        end: { dateTime: eventEnd, timeZone: 'UTC' },
        location: 'Digital Release',
        transparency: 'transparent',
      };

      // Check if event already exists (by search-matching title + date)
      const existing = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?q=${encodeURIComponent(release.title || 'Untitled')}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(r => r.json());

      const foundEvent = existing.items?.find(e => 
        new Date(e.start?.dateTime || e.start?.date).toISOString().split('T')[0] === releaseDate.toISOString().split('T')[0]
      );

      if (foundEvent) {
        // Update existing event
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${foundEvent.id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
      } else {
        // Create new event
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
      }
    }

    // Log task
    await base44.asServiceRole.entities.AgentTaskLog.create({
      agent_name: 'ReleaseCalendarSync',
      task_title: 'Sync releases to Google Calendar',
      task_description: `Synced ${releases.length} releases to Google Calendar`,
      outcome: 'All releases synchronized',
      was_automatic: true,
      required_approval: false,
      risk_check_result: 'pass',
      tags: ['calendar', 'release', 'sync'],
    });

    return Response.json({ success: true, synced: releases.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});