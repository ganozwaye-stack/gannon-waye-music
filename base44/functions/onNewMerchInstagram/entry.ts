import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Entity automation payload: { event, data }
    const body = await req.json();
    const { event, data } = body;

    // Only fire on create events
    if (!event || event.type !== 'create') {
      return Response.json({ skipped: true, reason: 'not a create event' });
    }

    if (!data) {
      return Response.json({ skipped: true, reason: 'no product data in payload' });
    }

    const { name, image_url, images_array, sale_price, description, category } = data;

    // Need at least one image to post to Instagram
    const imageUrl = image_url || (Array.isArray(images_array) && images_array.length > 0 ? images_array[0] : null);
    if (!imageUrl) {
      return Response.json({ skipped: true, reason: 'no image available for Instagram post' });
    }

    // Build the caption — emotional, on-brand
    const priceText = sale_price ? ` · $${sale_price}` : '';
    const shortDesc = description ? description.slice(0, 120) : 'Shop the official Gannon Waye collection.';
    const caption = `🛍️ New merch just dropped.\n\n${name}${priceText}\n\n${shortDesc}\n\n→ gannonwaye.com/store\n\n#GannonWaye #RespectIsEarned #Thankyou #MerchDrop #IndieArtist #AustralianMusic #SupportIndieArtists`;

    // Get Instagram connection (service role — automations run without user context)
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    if (!accessToken) {
      return Response.json({ skipped: true, reason: 'Instagram not connected' });
    }

    // Step 1: Get Instagram user ID
    const meRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);
    const meData = await meRes.json();
    if (!meData.id) {
      return Response.json({ error: 'Failed to get Instagram user ID', details: meData }, { status: 500 });
    }
    const igUserId = meData.id;

    // Step 2: Create media container
    const createRes = await fetch(`https://graph.instagram.com/${igUserId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken,
      }),
    });
    const createData = await createRes.json();
    if (!createData.id) {
      return Response.json({ error: 'Failed to create Instagram media container', details: createData }, { status: 500 });
    }
    const creationId = createData.id;

    // Step 3: Publish the media — Instagram needs time to process the image, so retry with delays
    let publishData = null;
    const maxRetries = 5;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      // Wait before first attempt and between retries (3s, 5s, 7s, 10s, 15s)
      const delayMs = [3000, 5000, 7000, 10000, 15000][attempt];
      await new Promise(resolve => setTimeout(resolve, delayMs));

      const publishRes = await fetch(`https://graph.instagram.com/${igUserId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      });
      publishData = await publishRes.json();

      if (publishData.id) break; // Success

      // If it's not a "not ready" error, stop retrying
      const errMsg = publishData?.error?.message || '';
      if (!errMsg.includes('not ready') && !errMsg.includes('not available')) {
        break;
      }
    }

    if (!publishData || !publishData.id) {
      return Response.json({ error: 'Failed to publish Instagram media after retries', details: publishData }, { status: 500 });
    }

    // Log success
    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'info',
      title: 'Instagram auto-post published',
      summary: `New merch "${name}" was posted to Instagram automatically.`,
      source: 'onNewMerchInstagram automation',
      is_read: false,
    });

    return Response.json({ success: true, media_id: publishData.id, product: name });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});