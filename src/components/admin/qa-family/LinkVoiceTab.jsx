import LinkIntegrityAudit from '@/components/admin/qa-family/LinkIntegrityAudit';
import VoiceInputTestPage from '@/components/admin/qa-family/VoiceInputTestPage';

// Link Integrity & Voice Input Tester: the full Link Integrity Audit (live
// URL validator for social handles and redirects) plus the Voice Input Test
// console (browser speech-to-text mic test for admin forms) — merged
// verbatim. Zero function loss.
export default function LinkVoiceTab() {
  return (
    <div className="space-y-10">
      <LinkIntegrityAudit />
      <div className="border-t border-border/40 pt-8">
        <VoiceInputTestPage />
      </div>
    </div>
  );
}