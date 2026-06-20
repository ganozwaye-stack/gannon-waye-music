import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);

    const state = body.data?._provider_meta?.['x-goog-resource-state'];

    // Acknowledge sync ping
    if (state === 'sync') {
      return Response.json({ status: 'sync_ack' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Load stored page token from entity
    const existing = await base44.asServiceRole.entities.DriveSync.list();
    let syncRecord = existing.length > 0 ? existing[0] : null;

    if (!syncRecord) {
      // First run — get a start page token
      const tokenRes = await fetch(
        'https://www.googleapis.com/drive/v3/changes/startPageToken',
        { headers: authHeader }
      );
      const { startPageToken } = await tokenRes.json();
      await base44.asServiceRole.entities.DriveSync.create({ page_token: startPageToken, last_synced: new Date().toISOString() });
      return Response.json({ status: 'initialized' });
    }

    // Fetch changes since last page token
    const baseUrl = `https://www.googleapis.com/drive/v3/changes?fields=changes(file(id,name,mimeType,modifiedTime)),newStartPageToken,nextPageToken`;
    let changesUrl = baseUrl + `&pageToken=${syncRecord.page_token}`;
    const allChanges = [];
    let newPageToken = null;

    while (changesUrl) {
      const changesRes = await fetch(changesUrl, { headers: authHeader });
      if (!changesRes.ok) return Response.json({ status: 'api_error' });
      const page = await changesRes.json();
      allChanges.push(...(page.changes || []));
      if (page.newStartPageToken) newPageToken = page.newStartPageToken;
      changesUrl = page.nextPageToken ? baseUrl + `&pageToken=${page.nextPageToken}` : null;
    }

    // Log a notification for each changed file
    for (const change of allChanges) {
      const file = change.file;
      if (!file) continue;
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: 'info',
        title: `Google Drive: ${file.name} changed`,
        summary: `File "${file.name}" (${file.mimeType}) was modified on Google Drive.`,
        source: 'google_drive_webhook',
        linked_entity: 'DriveSync',
        is_read: false,
      });
    }

    // Save updated page token
    if (newPageToken) {
      await base44.asServiceRole.entities.DriveSync.update(syncRecord.id, {
        page_token: newPageToken,
        last_synced: new Date().toISOString(),
        changes_detected: allChanges.length,
      });
    }

    return Response.json({ status: 'ok', changes: allChanges.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});