import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

type AuthUser = {
  email?: string;
};

type ReleaseRecord = {
  id?: string;
  title?: string;
  version_label?: string;
};

function isOwner(user: AuthUser | null | undefined): boolean {
  return Boolean(user?.email && OWNER_EMAILS.has(user.email.toLowerCase()));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me() as AuthUser | null;

    if (!isOwner(user)) {
      return Response.json({ error: 'Forbidden: exact owner account required' }, { status: 403 });
    }

    const body = await req.json() as { release_id?: string };
    const releaseId = body.release_id?.trim();
    if (!releaseId) {
      return Response.json({ error: 'release_id required' }, { status: 400 });
    }

    const matches = await base44.asServiceRole.entities.Release.filter({ id: releaseId }, '', 1) as ReleaseRecord[];
    const release = matches[0];

    if (!release?.id) {
      return Response.json({ error: 'Release not found' }, { status: 404 });
    }

    const title = release.title?.trim() || 'Unlabelled release';
    const version = release.version_label?.trim() || 'unspecified version';
    const approval = await base44.asServiceRole.entities.ApprovalQueue.create({
      agent_name: 'PresaveDisclosureReview',
      action_title: `Verify real presave link for "${title}"`,
      action_description: 'Review the exact distributor-provided presave URL and decide whether this release may be disclosed publicly. No link is generated or published automatically.',
      description: 'This function does not fabricate platform links, publish release information, write KnowledgeVault evidence, or schedule promotion.',
      risk_type: ['publishing', 'brand', 'reputation'],
      risk_level: 'high',
      status: 'pending',
      payload: {
        release_id: release.id,
        release_title: title,
        version_label: version,
        operation: 'presave_disclosure_review',
        required_evidence: 'Exact distributor-provided URL',
        requested_by: user?.email,
      },
      proposed_output: `Supply and verify the real distributor presave URL for "${title}" (${version}). Then obtain separate explicit owner approval before any public disclosure.`,
      auto_eligible: false,
      tags: ['release', 'presave', 'review-only', `release:${release.id}`],
    });

    return Response.json({
      success: true,
      review_created: true,
      links: {},
      published: false,
      approval_id: approval.id,
      release_id: release.id,
    });
  } catch (error: unknown) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
});
