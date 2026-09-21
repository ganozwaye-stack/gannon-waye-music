import AuditLog from '@/pages/admin/AuditLog';

// Platform Change Audit Logs: the full Audit Log screen (AuditLog entity
// table tracking platform state mutations across all entities) — rendered
// verbatim. Zero function loss.
export default function PlatformLogTab() {
  return <AuditLog />;
}