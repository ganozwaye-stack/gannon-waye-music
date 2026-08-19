import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif']);
const VIDEO_EXTENSIONS = new Set(['.mov', '.mp4', '.m4v', '.webm']);
const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.aiff', '.aif', '.flac', '.m4a']);

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'POST required' }, { status: 405 });
    }

    const expectedKey = Deno.env.get('ICLOUD_INGEST_KEY');
    if (!expectedKey) {
      return Response.json({ error: 'ICLOUD_INGEST_KEY is not configured' }, { status: 500 });
    }

    const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const providedKey = req.headers.get('x-icloud-ingest-key') || bearer;
    if (!providedKey || providedKey !== expectedKey) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);
    const payload = await parsePayload(req);
    if (!payload.file) {
      return Response.json({ error: 'File is required' }, { status: 400 });
    }

    const fileName = sanitizeFilename(payload.file.name || payload.file_name || 'icloud-upload');
    const ext = extensionOf(fileName);
    const mediaKind = classifyMedia(ext, payload.file.type || payload.mime_type || '');
    if (mediaKind === 'unsupported') {
      return Response.json({ error: `Unsupported media type for ${fileName}` }, { status: 400 });
    }

    const sourcePath = String(payload.source_path || 'icloud');
    const sha256 = String(payload.sha256 || 'unknown');
    const dedupeName = `${fileName}__${sha256}`;
    const existing = await base44.asServiceRole.entities.SocialAsset.filter({ name: dedupeName });
    if (existing.length > 0) {
      return Response.json({ success: true, skipped: true, reason: 'duplicate', social_asset_id: existing[0].id });
    }

    const uploaded = await base44.asServiceRole.integrations.Core.UploadFile({ file: payload.file });
    const fileUrl = uploaded.file_url || uploaded.url;
    if (!fileUrl) {
      throw new Error('UploadFile did not return file_url');
    }

    const commonNotes = [
      'Imported from local iCloud watcher.',
      `source_path=${sourcePath}`,
      `sha256=${sha256}`,
      `modified_at=${payload.modified_at || ''}`,
      'No originals deleted or moved by automation.',
    ].join('\n');

    const socialAsset = await base44.asServiceRole.entities.SocialAsset.create({
      name: dedupeName,
      asset_type: mediaKind === 'video' ? 'video' : mediaKind === 'image' ? 'image' : 'audio',
      platform_tags: mediaKind === 'video' ? ['tiktok', 'instagram_reels', 'youtube_shorts'] : ['instagram', 'tiktok', 'website'],
      campaign: payload.campaign || 'icloud_ingest',
      content_type_tags: ['raw', 'icloud', mediaKind],
      file_url: fileUrl,
      status: 'raw',
      notes: commonNotes,
    });

    let sourceVideo = null;
    let galleryImage = null;
    if (mediaKind === 'video') {
      sourceVideo = await base44.asServiceRole.entities.SourceVideo.create({
        title: fileName,
        video_url: fileUrl,
        status: 'uploaded',
        topic_keywords: ['icloud', 'raw_source'],
        notes: commonNotes,
        is_active: true,
      });
    }

    if (mediaKind === 'image') {
      galleryImage = await base44.asServiceRole.entities.GalleryImage.create({
        title: fileName,
        image_url: fileUrl,
        category: payload.gallery_category || 'behind_scenes',
        description: commonNotes,
        image_date: payload.image_date || undefined,
        is_published: false,
        sort_order: 0,
      });
    }

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'info',
      title: `iCloud media ingested: ${fileName}`,
      summary: `${mediaKind} imported to SocialAsset${sourceVideo ? ' and SourceVideo' : ''}${galleryImage ? ' and GalleryImage' : ''}.`,
      source: 'icloudIngest',
      requires_action: false,
      linked_entity: 'SocialAsset',
      linked_id: socialAsset.id,
      linked_route: '/admin/social-asset-library',
      delivered_email: false,
      delivered_slack: false,
    });

    return Response.json({
      success: true,
      external_actions_performed: false,
      file_url: fileUrl,
      social_asset_id: socialAsset.id,
      source_video_id: sourceVideo?.id || null,
      gallery_image_id: galleryImage?.id || null,
      media_kind: mediaKind,
    });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'automation_failed',
        severity: 'high',
        title: 'iCloud ingest failed',
        summary: error.message || String(error),
        source: 'icloudIngest',
        requires_action: true,
        linked_route: '/admin/social-asset-library',
        delivered_email: false,
        delivered_slack: false,
      });
    } catch {
      // Keep original failure visible.
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function parsePayload(req) {
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) throw new Error('multipart field "file" must be a File');
    const fields = Object.fromEntries([...form.entries()].filter(([key]) => key !== 'file').map(([key, value]) => [key, String(value)]));
    return { ...fields, file };
  }

  const body = await req.json();
  if (!body.file_base64 || !body.file_name) {
    return body;
  }

  const bytes = Uint8Array.from(atob(String(body.file_base64)), c => c.charCodeAt(0));
  const file = new File([bytes], sanitizeFilename(body.file_name), { type: body.mime_type || 'application/octet-stream' });
  return { ...body, file };
}

function sanitizeFilename(name) {
  return String(name).replace(/[\\/:*?"<>|]/g, '_').slice(0, 180);
}

function extensionOf(name) {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

function classifyMedia(ext, mime) {
  if (IMAGE_EXTENSIONS.has(ext) || mime.startsWith('image/')) return 'image';
  if (VIDEO_EXTENSIONS.has(ext) || mime.startsWith('video/')) return 'video';
  if (AUDIO_EXTENSIONS.has(ext) || mime.startsWith('audio/')) return 'audio';
  return 'unsupported';
}
