import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    const ownerEmail = String(user?.email || '').trim().toLowerCase();

    if (user?.role !== 'admin' || !OWNER_EMAILS.has(ownerEmail)) {
      return Response.json({ error: 'Only Gannon can sync Release metadata' }, { status: 403 });
    }

    const tunecoreApiKey = Deno.env.get('TUNECORE_API_KEY');
    if (!tunecoreApiKey) {
      return Response.json(
        { error: 'TUNECORE_API_KEY not configured' },
        { status: 500 }
      );
    }

    const tunecoreResponse = await fetch('https://api.tunecore.com/releases', {
      headers: {
        'Authorization': `Bearer ${tunecoreApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!tunecoreResponse.ok) {
      throw new Error(`Tunecore API error: ${tunecoreResponse.statusText}`);
    }

    const tunecoreReleases = await tunecoreResponse.json();

    for (const release of tunecoreReleases.data || []) {
      const existing = await base44.asServiceRole.entities.Release.filter({
        title: release.title,
      });

      // Distributor data is metadata only. It must never grant public
      // visibility or preserve an approval across a real metadata change.
      const releaseData = {
        title: release.title,
        type: release.type || 'single',
        release_date: release.release_date,
        description: release.description,
        artwork_url: release.artwork_url,
        spotify_link: release.spotify_link,
        apple_music_link: release.apple_music_link,
        youtube_link: release.youtube_link,
      };

      if (existing.length > 0) {
        const current = existing[0];
        const metadataChanged = Object.entries(releaseData).some(
          ([field, value]) => value != null && current[field] !== value
        );

        if (metadataChanged) {
          await base44.asServiceRole.entities.Release.update(current.id, {
            ...releaseData,
            is_published: false,
            publishing_safe: false,
            public_release_approval_status: 'revoked',
            is_current_single: false,
          });
          await base44.asServiceRole.entities.Lyric.updateMany(
            { release_id: current.id },
            { $set: { release_publication_approved: false } }
          );
        }
      } else {
        await base44.asServiceRole.entities.Release.create({
          ...releaseData,
          status: 'ready',
          is_published: false,
          publishing_safe: false,
          public_release_approval_status: 'pending',
          is_current_single: false,
        });
      }
    }

    return Response.json({
      success: true,
      synced: tunecoreReleases.data?.length || 0,
      public_release_changes: 0,
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
});
