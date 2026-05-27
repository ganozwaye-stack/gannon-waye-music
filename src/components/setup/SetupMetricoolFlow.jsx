import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ExternalLink, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StepBlock from './StepBlock';
import SecureSecretInput from './SecureSecretInput';

const PROFILES = [
  'Website', 'Facebook', 'Instagram', 'Threads', 'X (Twitter)',
  'Bluesky', 'LinkedIn', 'Pinterest', 'TikTok Personal', 'TikTok Business',
  'YouTube', 'Google Business Profile',
];

export default function SetupMetricoolFlow({ onComplete, onBlocked }) {
  const [phase, setPhase] = useState('intro');
  const [tokenSaved, setTokenSaved] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [profileStatus, setProfileStatus] = useState({});

  const runMetricoolTest = async () => {
    setTesting(true);
    try {
      const res = await base44.functions.invoke('validateMetricoolConfig', {});
      setTestResult(res.data);
    } catch (e) {
      setTestResult({ error: e.message, connected: false });
    }
    setTesting(false);
  };

  const toggleProfile = (name, connected) => setProfileStatus(s => ({ ...s, [name]: connected }));

  const connectedCount = Object.values(profileStatus).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">📅</span>
          <h2 className="font-semibold text-lg">Metricool Social Scheduling</h2>
          <Badge className="ml-auto bg-amber-500/20 text-amber-300 border-amber-500/30">High Priority</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Set up API token, verify brand profiles, check connected social accounts. All scheduling goes through ApprovalQueue before any posts are made.</p>
      </div>

      <StepBlock number={1} title="Open Metricool" status={phase === 'intro' ? 'active' : 'done'} why="You need your API token and to check which social profiles are connected.">
        <Button className="gap-2" onClick={() => { window.open('https://app.metricool.com', '_blank'); setPhase('token'); }}>
          <ExternalLink className="w-4 h-4" /> Open Metricool Dashboard
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Navigate to: Settings → Integrations → API to find your token, and Brand → Connected Profiles for social account status.</p>
      </StepBlock>

      {phase !== 'intro' && (
        <StepBlock number={2} title="Save Metricool API Token" status={tokenSaved ? 'done' : 'active'} why="Required to schedule posts, import metrics, and test connectivity.">
          <SecureSecretInput
            label="METRICOOL_API_TOKEN"
            secretName="METRICOOL_API_TOKEN"
            placeholder="Paste Metricool API token"
            onSaved={() => { setTokenSaved(true); setPhase('profiles'); }}
          />
          <p className="text-xs text-muted-foreground mt-2">Also note your <strong>Blog ID</strong> (METRICOOL_BLOG_ID) and <strong>User ID</strong> (METRICOOL_USER_ID) — these are already set but can be updated via Base44 Secrets dashboard if wrong.</p>
        </StepBlock>
      )}

      {phase === 'profiles' && (
        <>
          <StepBlock number={3} title="Test Metricool Connection" status={testResult ? (testResult.connected ? 'done' : 'error') : 'active'} why="Confirms API token works and brand ID is correct.">
            <Button onClick={runMetricoolTest} disabled={testing} className="gap-2 mb-3">
              <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Testing...' : 'Test Metricool Connection'}
            </Button>
            {testResult && (
              <div className={`rounded-lg p-3 text-sm ${testResult.connected ? 'bg-green-500/10 border border-green-500/30 text-green-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
                <p className="font-semibold mb-1">{testResult.connected ? '✅ Connected' : '❌ Connection failed'}</p>
                {testResult.brand && <p className="text-xs">Brand: {testResult.brand}</p>}
                {testResult.error && <p className="text-xs">Error: {testResult.error}</p>}
                {!testResult.connected && (
                  <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                    <p>Check: API token present ✓ / wrong token / wrong blog ID / wrong user ID / rate limited</p>
                    <p>Blog ID and User ID are in Metricool Settings → Integrations</p>
                  </div>
                )}
              </div>
            )}
          </StepBlock>

          <StepBlock number={4} title="Check Connected Social Profiles" status={connectedCount > 0 ? 'active' : 'waiting'} why="Each platform must be connected in Metricool for scheduling to work.">
            <p className="text-sm text-muted-foreground mb-3">In Metricool → Brand → Connected Profiles, check each platform and mark below:</p>
            <div className="grid grid-cols-2 gap-2">
              {PROFILES.map(name => (
                <div key={name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 text-sm">
                  <span className="text-muted-foreground">{name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleProfile(name, true)}
                      className={`px-2 py-0.5 rounded text-xs ${profileStatus[name] === true ? 'bg-green-500 text-white' : 'bg-secondary text-muted-foreground'}`}
                    >✓</button>
                    <button
                      onClick={() => toggleProfile(name, false)}
                      className={`px-2 py-0.5 rounded text-xs ${profileStatus[name] === false ? 'bg-red-500 text-white' : 'bg-secondary text-muted-foreground'}`}
                    >✗</button>
                  </div>
                </div>
              ))}
            </div>
            {connectedCount > 0 && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-300">
                ✅ {connectedCount}/{PROFILES.length} profiles marked connected
              </div>
            )}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 mt-3">
              🛡️ Safety lock: All scheduling actions go to ApprovalQueue first. Nothing posts automatically without your approval.
            </div>
            <div className="flex gap-2 mt-3">
              <Button onClick={onComplete} className="gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4" /> Mark Metricool Complete
              </Button>
              <Button variant="outline" onClick={onBlocked}>Mark Blocked</Button>
            </div>
          </StepBlock>
        </>
      )}
    </div>
  );
}