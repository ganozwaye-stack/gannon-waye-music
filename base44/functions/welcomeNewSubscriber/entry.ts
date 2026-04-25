import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { data } = await req.json();

    if (!data?.email) {
      return Response.json({ error: 'No email provided' }, { status: 400 });
    }

    const settings = await base44.entities.SiteSettings.list();
    const artistName = settings[0]?.artist_name || 'Gannon Waye';

    await base44.integrations.Core.SendEmail({
      to: data.email,
      subject: `Welcome to ${artistName}'s Community`,
      body: `Hi${data.name ? ' ' + data.name : ''},\n\nThank you for subscribing! You're now part of a community built for connection, authenticity, and growth.\n\nYou'll hear from me about new music releases, behind-the-scenes moments, and exclusive updates.\n\nThis is a space where vulnerability becomes strength.\n\nWelcome home.\n\n${artistName}`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});