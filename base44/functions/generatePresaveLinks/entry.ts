import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Generate presave links for upcoming releases across platforms
// Creates shareable links for fans to presave music
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { release_id } = body;
    if (!release_id) {
      return Response.json({ error: 'release_id required' }, { status: 400 });
    }

    const release = await base44.asServiceRole.entities.Release.filter({ id: release_id }, '', 1);
    if (!release || release.length === 0) {
      return Response.json({ error: 'Release not found' }, { status: 404 });
    }

    const rel = release[0];
    const presaveLinks = {
      spotify: `https://distrokid.com/spotify/presave?artist=${encodeURIComponent(rel.artist || 'Gannon Waye')}&release=${encodeURIComponent(rel.title || 'Untitled')}`,
      appleMusic: `https://distrokid.com/apple/presave?artist=${encodeURIComponent(rel.artist || 'Gannon Waye')}&release=${encodeURIComponent(rel.title || 'Untitled')}`,
      deezer: `https://distrokid.com/deezer/presave?artist=${encodeURIComponent(rel.artist || 'Gannon Waye')}&release=${encodeURIComponent(rel.title || 'Untitled')}`,
      amazonMusic: `https://distrokid.com/amazon/presave?artist=${encodeURIComponent(rel.artist || 'Gannon Waye')}&release=${encodeURIComponent(rel.title || 'Untitled')}`,
      youtubeMusic: `https://distrokid.com/youtube/presave?artist=${encodeURIComponent(rel.artist || 'Gannon Waye')}&release=${encodeURIComponent(rel.title || 'Untitled')}`,
    };

    // Store presave link record
    await base44.asServiceRole.entities.KnowledgeVault.create({
      title: `Presave Links: ${rel.title}`,
      category: 'evidence',
      content: JSON.stringify(presaveLinks, null, 2),
      summary: `Presave links for "${rel.title}" release — all platforms`,
      source: `PresaveLinks:${release_id}`,
      tags: ['presave', `release:${release_id}`, 'distribution'],
      access_level: 'admin_only',
    });

    // Log to agent
    await base44.asServiceRole.entities.AgentTaskLog.create({
      agent_name: 'PresaveLinkGenerator',
      task_title: `Generated presave links for "${rel.title}"`,
      task_description: 'Presave links created for all 5 major platforms',
      outcome: 'Links stored and ready for sharing',
      was_automatic: true,
      required_approval: false,
      risk_check_result: 'pass',
      tags: ['presave', 'release', 'distribution'],
    });

    return Response.json({ success: true, links: presaveLinks });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});