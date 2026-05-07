import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const tunecoreApiKey = Deno.env.get('TUNECORE_API_KEY');
    if (!tunecoreApiKey) {
      return Response.json(
        { error: 'TUNECORE_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Fetch releases from Tunecore API
    // This is a basic example — adjust endpoints based on Tunecore's actual API
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

    // Sync to Release entity
    for (const release of tunecoreReleases.data || []) {
      const existing = await base44.asServiceRole.entities.Release.filter({
        title: release.title,
      });

      const releaseData = {
        title: release.title,
        type: release.type || 'single',
        release_date: release.release_date,
        description: release.description,
        artwork_url: release.artwork_url,
        spotify_link: release.spotify_link,
        apple_music_link: release.apple_music_link,
        youtube_link: release.youtube_link,
        is_published: true,
      };

      if (existing.length > 0) {
        await base44.asServiceRole.entities.Release.update(
          existing[0].id,
          releaseData
        );
      } else {
        await base44.asServiceRole.entities.Release.create(releaseData);
      }
    }

    return Response.json({
      success: true,
      synced: tunecoreReleases.data?.length || 0,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});