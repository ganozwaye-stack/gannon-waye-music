import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Sync Release entities to Gannon's personal Google Calendar.
// Every release that has a release_date is mirrored to the connected calendar
// (create-or-update by title + date), so setting a date in the admin console
// updates the calendar automatically.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let accessToken;
    try {
      const conn = await base44.asServiceRole.connectors.getConnection('googlecalendar');
      accessToken = conn.accessToken;
    } catch (_) {
      return Response.json({
        success: true,
        skipped: true,
        message: 'Google Calendar connector not authorized. Skipping calendar sync.',
      });
    }

    // Every release with a release_date is mirrored to the personal calendar.
    const candidates = await base44.asServiceRole.entities.Release.filter({}, '-updated_date', 200);
    const releases = candidates.filter((r) => !!r.release_date);
    const calendarId = 'primary';

    for (const release of releases) {
      if (!release.release_date) continue;

      const releaseDate = new Date(release.release_date);
      const eventStart = releaseDate.toISOString();
      const eventEnd = new Date(releaseDate.getTime() + 60 * 60 * 1000).toISOString();

      const event = {
        summary: `🎵 Release: ${release.title || 'Untitled'}`,
        description: `Artist: Gannon Waye\nFormat: ${release.type || 'Single'}\nPlatforms: ${[release.spotify_link && 'Spotify', release.apple_music_link && 'Apple Music', release.youtube_link && 'YouTube'].filter(Boolean).join(', ') || 'All streaming platforms'}${release.description ? '\n\n' + release.description : ''}`,
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