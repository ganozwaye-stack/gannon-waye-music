import AgentTrustHub from '@/pages/admin/AgentTrustHub';

// Trust Centre & Compliance: the full screen that serves /admin/security-trust-centre
// (AgentTrustHub.jsx renders that route) — security compliance checklists, data
// protection rules, secret management status, and public trust verification
// badges — rendered verbatim. Zero function loss.
export default function TrustComplianceTab() {
  return <AgentTrustHub />;
}