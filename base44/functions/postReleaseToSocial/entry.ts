import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

type ReleaseRecord = {
  id?: string;
  title?: string;
  version_label?: string;
  status?: string;
  is_published?: boolean;
  publishing_safe?: boolean;
  public_release_approval_status?: string;
  public_release_approved_by?: string;
  public_release_approved_at?: string;
  artwork_url?: string;
};

function isApprovedPublicRelease(release: ReleaseRecord | undefined): release is ReleaseRecord {
  return Boolean(
    release?.id
      && release.is_published === true
      && release.publishing_safe === true
      && release.status === 'released'
      && release.public_release_approval_status === 'approved'
      && release.public_release_approved_by
      && OWNER_EMAILS.has(release.public_release_approved_by.toLowerCase())
      && release.public_release_approved_at,
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

const STORE_LINK = 'https://gannonwaye.com/store';

// Posts the cover artwork + store link to the connected Instagram Business account.
async function postToInstagram(accessToken: string, artworkUrl: string, caption: string) {
  // 1. Resolve the Instagram Business account id.
  const meRes = await fetch(
    `https://graph.instagram.com/me?fields=id,username&access_token=${encodeURIComponent(accessToken)}`,
  );
  const me = await meRes.json();
  const igUserId = me?.id;
  if (!igUserId) throw new Error(`Instagram account id not resolved: ${JSON.stringify(me)}`);

  // 2. Create a media container with the cover artwork.
  const createRes = await fetch(
    `https://graph.instagram.com/v21.0/${igUserId}/media?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: artworkUrl, caption }),
    },
  );
  const created = await createRes.json();
  const creationId = created?.id;
  if (!creationId) throw new Error(`Instagram media container failed: ${JSON.stringify(created)}`);

  // 3. Publish the container.
  const pubRes = await fetch(
    `https://graph.instagram.com/v21.0/${igUserId}/media_publish?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: creationId }),
    },
  );
  const published = await pubRes.json();
  if (!published?.id) throw new Error(`Instagram publish failed: ${JSON.stringify(published)}`);
  return { ig_user_id: igUserId, media_id: published.id };
}

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json() as {
      data?: ReleaseRecord;
      old_data?: ReleaseRecord;
    };

    // Only fire on the actual publication transition (not already published).
    if (body.old_data?.is_published === true || body.data?.is_published !== true) {
      return Response.json({ skipped: true, reason: 'Not a new publication transition' });
    }

    const releaseId = body.data?.id;
    if (!releaseId) {
      return Response.json({ skipped: true, reason: 'Missing release id' });
    }

    const matches = await base44.asServiceRole.entities.Release.filter({ id: releaseId }, '', 1) as ReleaseRecord[];
    const release = matches[0];

    if (!isApprovedPublicRelease(release)) {
      return Response.json({
        skipped: true,
        reason: 'Release is not fully owner-approved for public publication',
      });
    }

    const title = release.title?.trim() || 'New release';
    const artworkUrl = release.artwork_url;
    if (!artworkUrl) {
      return Response.json({ skipped: true, reason: 'Release has no artwork_url to share' });
    }

    const releaseLink = `https://gannonwaye.com/release/${release.id}`;
    const caption = `"${title}" is out now. Listen and shop the collection at ${STORE_LINK}.\n\n${releaseLink}\n\n#GannonWaye #NewRelease #IndependentMusic`;

    let postResult: { ig_user_id: string; media_id: string } | null = null;
    let postError: string | null = null;
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
      postResult = await postToInstagram(accessToken, artworkUrl, caption);
    } catch (err) {
      postError = errorMessage(err);
    }

    return Response.json({
      posted: postResult !== null,
      instagram: postResult,
      error: postError,
      release_id: release.id,
      title,
      caption,
      store_link: STORE_LINK,
    });
  } catch (error: unknown) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
});