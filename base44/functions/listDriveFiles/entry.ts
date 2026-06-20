import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    const body = await req.json().catch(() => ({}));
    const folderId = body.folderId || 'root';
    const pageToken = body.pageToken || null;
    const query = body.query || null;

    let url = `https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,size,modifiedTime,webViewLink,thumbnailLink,parents),nextPageToken&orderBy=modifiedTime+desc&pageSize=50`;

    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    } else if (folderId !== 'root') {
      url += `&q=${encodeURIComponent(`'${folderId}' in parents and trashed=false`)}`;
    } else {
      url += `&q=${encodeURIComponent("trashed=false")}`;
    }

    if (pageToken) {
      url += `&pageToken=${encodeURIComponent(pageToken)}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return Response.json({ files: data.files || [], nextPageToken: data.nextPageToken || null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});