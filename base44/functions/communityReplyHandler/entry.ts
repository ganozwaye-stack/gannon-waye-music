import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Handles community reply creation with moderation + admin notification
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { post_id, content, author_name, author_email, parent_reply_id } = body;

    if (!post_id || !content?.trim() || !author_name?.trim()) {
      return Response.json({ error: 'post_id, content and author_name required' }, { status: 400 });
    }

    const PROFANITY = ['fuck','shit','cunt','bitch','asshole','bastard','dick','pussy','cock','piss','bollocks','wanker','twat','arsehole','motherfucker','faggot','slut','whore'];
    const hasProfanity = PROFANITY.some(w => new RegExp(`\\b${w}\\b`, 'i').test(content));

    const reply = await base44.asServiceRole.entities.CommunityReply.create({
      post_id,
      parent_reply_id: parent_reply_id || null,
      author_name: author_name.trim(),
      author_email: author_email?.trim() || '',
      content: content.trim(),
      status: hasProfanity ? 'pending' : 'approved',
      is_flagged: hasProfanity,
      flag_reason: hasProfanity ? 'Profanity detected' : null,
    });

    // Notify admin via central notifier
    await base44.asServiceRole.functions.invoke('notifyAdmin', {
      notification_type: 'reply',
      title: `New community reply from ${author_name}`,
      summary: content.trim().substring(0, 150),
      severity: hasProfanity ? 'high' : 'info',
      linked_route: '/community',
      linked_entity: 'CommunityReply',
      linked_id: reply.id,
      requires_action: hasProfanity,
      source: 'CommunityReplyHandler',
    });

    return Response.json({ success: true, reply });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});