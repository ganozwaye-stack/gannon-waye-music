// Saves the owner's review edits for one release from the Release Review page.
//
// This endpoint never publishes, approves, emails, delivers or charges anything:
// it writes review content only, and it refuses to touch a release once approval
// has begun so a recorded approval can never point at changed content.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.59';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

// Review content that lives on the Release record itself.
const RELEASE_FIELDS = [
  'title',
  'version_label',
  'type',
  'status',
  'release_date',
  'genre',
  'mood',
  'duration',
  'language',
  'credits',
  'lyrics',
  'description',
  'artwork_url',
  'distributor',
  'distributor_link',
];

// Identifiers and listening copy live on the review sheet, so the publication
// gates on the Release record stay exactly as they are.
const SHEET_FIELDS = ['isrc_code', 'upc_code', 'audio_preview_url'];

const RELEASE_STATUSES = new Set([
  'idea', 'writing', 'pre_production', 'recording', 'mixing', 'mastering', 'ready', 'released',
]);
const RELEASE_TYPES = new Set(['single', 'ep', 'album']);

const exact = (value: unknown) => String(value ?? '').trim();

export default async function (req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((error) => (error?.status === 401 ? null : Promise.reject(error)));
    if (!user || user.role !== 'admin' || !OWNER_EMAILS.has(exact(user.email).toLowerCase())) {
      return Response.json({ error: 'Exact owner sign-in is required for release review.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const releaseId = exact(body.release_id);
    if (!releaseId) return Response.json({ error: 'release_id is required.' }, { status: 400 });
    if (body.title !== undefined && !exact(body.title)) {
      return Response.json({ error: 'A song title is required.' }, { status: 400 });
    }
    if (body.status !== undefined && !RELEASE_STATUSES.has(exact(body.status))) {
      return Response.json({ error: 'Unknown release status.' }, { status: 400 });
    }
    if (body.type !== undefined && !RELEASE_TYPES.has(exact(body.type))) {
      return Response.json({ error: 'Release type must be single, ep or album.' }, { status: 400 });
    }
    if (body.release_date && !/^\d{4}-\d{2}-\d{2}$/.test(exact(body.release_date))) {
      return Response.json({ error: 'Release date must be YYYY-MM-DD.' }, { status: 400 });
    }

    const sr = base44.asServiceRole;
    const release = await sr.entities.Release.get(releaseId)
      .catch((error) => (error?.status === 404 ? null : Promise.reject(error)));
    if (!release) return Response.json({ error: 'Release not found' }, { status: 404 });

    const approvalState = exact(release.public_release_approval_status) || 'pending';
    if (
      release.is_published === true
      || release.publishing_safe === true
      || !['pending', 'revoked'].includes(approvalState)
    ) {
      return Response.json({
        error: 'This release is approved or public. Revoke it before editing, so a recorded approval can never point at changed content.',
      }, { status: 409 });
    }

    const patch: Record<string, unknown> = {};
    for (const field of RELEASE_FIELDS) {
      if (body[field] !== undefined) patch[field] = exact(body[field]);
    }

    if (Object.keys(patch).length > 0) {
      const result = await sr.entities.Release.updateMany(
        { id: release.id, updated_date: release.updated_date },
        { $set: patch },
      );
      if (result?.success !== true || Number(result?.updated) !== 1) {
        return Response.json({
          error: 'The release changed while this was saving. Reload and review again; nothing was written.',
        }, { status: 409 });
      }
    }

    const sheetPatch: Record<string, unknown> = { review_notes: exact(body.review_notes).slice(0, 2000) };
    for (const field of SHEET_FIELDS) sheetPatch[field] = exact(body[field]);

    const existing = await sr.entities.ReleaseReviewSheet.filter({ release_id: release.id });
    const current = Array.isArray(existing) ? existing[0] : null;
    const sheet = current?.id
      ? await sr.entities.ReleaseReviewSheet.update(current.id, sheetPatch)
      : await sr.entities.ReleaseReviewSheet.create({ release_id: release.id, ...sheetPatch });

    const savedRelease = await sr.entities.Release.get(release.id);
    return Response.json({ ok: true, release: savedRelease, sheet, published: false });
  } catch (error) {
    return Response.json({ error: (error as Error)?.message || 'Review save failed' }, { status: 500 });
  }
}