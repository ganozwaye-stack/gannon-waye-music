import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Sends an automated Gmail alert to Gannon whenever someone submits a new memory or tribute
// Triggered by entity automations on FanPost (create) and FanMedia (create)
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    // Extract submission details from the entity automation payload
    const { event, data } = body;
    const entityType = event?.entity_name || 'Unknown';
    const entityId = event?.entity_id || 'Unknown';
    
    // Determine the type of submission
    const subject = 'New Memory Submission — Remember Mum';
    let submitterName = 'Someone';
    let preview = '';
    let memoryType = 'memory';
    
    if (entityType === 'FanPost') {
      submitterName = data?.author_name || 'Anonymous';
      preview = data?.content?.slice(0, 200) || '';
      memoryType = data?.type || 'message';
    } else if (entityType === 'FanMedia') {
      submitterName = data?.name || 'Anonymous';
      preview = data?.description?.slice(0, 200) || data?.caption || '';
      memoryType = data?.file_type || 'photo';
    }
    
    // Build the email body
    const emailBody = `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e8e0d0; padding: 40px; border-radius: 12px; border: 1px solid rgba(212,175,55,0.2);">
  <div style="text-align: center; margin-bottom: 32px;">
    <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(212,175,55,0.5); margin: 0 0 8px;">Remember Mum</p>
    <h2 style="font-size: 24px; color: rgba(245,208,110,0.9); margin: 0;">A New Memory Has Been Shared</h2>
  </div>
  
  <div style="background: rgba(255,210,160,0.04); border: 1px solid rgba(255,210,160,0.12); border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <p style="font-size: 12px; color: rgba(255,210,160,0.5); margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.1em;">From</p>
    <p style="font-size: 16px; color: #f0e8d8; margin: 0 0 16px;">${submitterName}</p>
    
    <p style="font-size: 12px; color: rgba(255,210,160,0.5); margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.1em;">Type</p>
    <p style="font-size: 14px; color: #d0c8b8; margin: 0 0 16px; text-transform: capitalize;">${memoryType}</p>
    
    ${preview ? `
    <p style="font-size: 12px; color: rgba(255,210,160,0.5); margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.1em;">Preview</p>
    <p style="font-size: 14px; color: #d0c8b8; margin: 0; line-height: 1.6; font-style: italic;">"${preview}${preview.length >= 200 ? '...' : ''}"</p>
    ` : ''}
  </div>
  
  <div style="text-align: center; margin-top: 32px;">
    <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin: 0 0 8px;">Review and approve this memory at:</p>
    <a href="https://gannonwaye.com/admin/fan-media" style="display: inline-block; padding: 12px 32px; background: linear-gradient(90deg, #c9a84c, #f5d06e, #c9a84c); color: #1a1208; text-decoration: none; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;">Review Memory</a>
  </div>
  
  <p style="text-align: center; font-size: 10px; color: rgba(255,255,255,0.2); margin-top: 40px; letter-spacing: 0.1em;">Forever in our hearts · gannonwaye.com</p>
</div>
    `.trim();
    
    // Send the email via Gmail connector
    const adminEmail = 'ganozwaye@gmail.com';
    
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: adminEmail,
        subject: subject,
        body: emailBody,
        from_name: 'Remember Mum — Memory Alerts',
      });
    } catch (emailErr) {
      // If email fails, still create an admin notification as fallback
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'community_report',
        severity: 'info',
        title: `New memory from ${submitterName}`,
        summary: preview.slice(0, 100),
        source: 'remember_mum',
        linked_entity: entityType,
        linked_id: entityId,
        linked_route: '/admin/fan-media',
        requires_action: true,
        is_read: false,
      });
    }
    
    return Response.json({ success: true, message: 'Memory alert sent' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});