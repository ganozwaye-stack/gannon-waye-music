import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Creates a HeyGen Photo Avatar from an uploaded image.
// The avatar can be used to bring a photo to life — speaking with a voice in generated videos.
// This is used for both Gannon's avatars and the memorial page avatar for his mum.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json();
    const { image_url, name, gender, voice_id, purpose, source_asset_authorised, identity_verified, source_asset_owner, owner_approval_id } = body;

    if (!image_url) {
      return Response.json({ error: 'image_url is required' }, { status: 400 });
    }
    if (source_asset_authorised !== true || identity_verified !== true || !source_asset_owner || !owner_approval_id) {
      return Response.json({
        error: 'Avatar creation requires authorised source media, verified identity, named source owner and an exact owner approval record.',
        external_actions_performed: false,
      }, { status: 403 });
    }
    if (Deno.env.get('HEYGEN_AVATAR_CREATION_ENABLED') !== 'true') {
      return Response.json({
        error: 'HeyGen avatar creation is paused to prevent unapproved identity substitution and paid-credit use.',
        external_actions_performed: false,
      }, { status: 403 });
    }

    const heygenApiKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenApiKey) {
      return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });
    }

    // Create a photo avatar via HeyGen v3 API
    // Reference: POST /v3/avatars with type: "photo"
    const createResponse = await fetch('https://api.heygen.com/v3/avatars', {
      method: 'POST',
      headers: {
        'X-Api-Key': heygenApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'photo',
        name: name || 'Gannon Waye Avatar',
        file: {
          type: 'url',
          url: image_url,
        },
      }),
    });

    const createData = await createResponse.json();

    if (!createResponse.ok) {
      return Response.json({
        status: 'error',
        error: 'Failed to create photo avatar',
        heygen_response: createData,
      }, { status: 502 });
    }

    const photoAvatarId = createData.data?.avatar_item?.id || createData.data?.id;

    // Log the creation in a ContentProductionJob for tracking
    if (photoAvatarId) {
      await base44.asServiceRole.entities.ContentProductionJob.create({
        title: `Photo Avatar: ${name || 'Unnamed'}`,
        description: `HeyGen Photo Avatar created${purpose ? ` for ${purpose}` : ''}. Training in progress — webhook will notify when complete.`,
        job_type: 'image_generation',
        status: 'processing',
        heygen_avatar_id: photoAvatarId,
        heygen_voice_id: voice_id || '',
        agent_generated_by: 'brand_kit',
        source_asset_authorised: true,
        identity_verified: true,
        source_asset_owner,
        notes: `Purpose: ${purpose || 'general'} | Image: ${image_url} | Owner approval: ${owner_approval_id}`,
      });
    }

    return Response.json({
      status: 'success',
      message: 'Photo avatar creation started. Training takes a few minutes — you will be notified via webhook when it is ready.',
      photo_avatar_id: photoAvatarId,
      heygen_response: createData.data,
      next_step: 'Once training completes, use this photo_avatar_id in video generation scripts. The avatar will appear in your HeyGen dashboard.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});