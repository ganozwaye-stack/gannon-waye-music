import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const post = payload?.data;
    if (!post) {
      return Response.json({ error: 'No post data' }, { status: 400 });
    }

    // Get admin email from site settings
    const settings = await base44.asServiceRole.entities.SiteSettings.list();
    const adminEmail = settings[0]?.email_contact || 'gannon@gannonwaye.com';

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `💬 New fan message from ${post.author_name || 'Anonymous'}`,
      body: `You have a new community message on your website!

From: ${post.author_name || 'Anonymous'}
Email: ${post.author_email || 'Not provided'}

Message:
"${post.content}"

---
View all messages: https://gannonwaye.com/admin/fans`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});