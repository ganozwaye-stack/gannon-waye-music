import { useState } from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StepBlock from './StepBlock';
import SecureSecretInput from './SecureSecretInput';

const CHECKLIST = [
  { id: 'login_kit', label: 'Login Kit product enabled' },
  { id: 'content_api', label: 'Content Posting API product enabled' },
  { id: 'scope_basic', label: 'Scope: user.info.basic' },
  { id: 'scope_upload', label: 'Scope: video.upload' },
  { id: 'redirect_uri', label: 'Redirect URI: https://gannonwaye.com/tiktok-callback' },
  { id: 'website', label: 'Website: https://gannonwaye.com/' },
  { id: 'privacy_url', label: 'Privacy policy URL set' },
  { id: 'terms_url', label: 'Terms of service URL set' },
];

export default function SetupTikTokFlow({ onComplete, onBlocked }) {
  const [phase, setPhase] = useState('intro');
  const [checks, setChecks] = useState({});
  const [keySaved, setKeySaved] = useState(false);
  const [secretSaved, setSecretSaved] = useState(false);
  const [oauthTested, setOauthTested] = useState(false);
  const [uploadTested, setUploadTested] = useState(false);
  const [oauthResult, setOauthResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const toggle = (id) => setChecks(c => ({ ...c, [id]: !c[id] }));
  const allChecked = CHECKLIST.every(item => checks[item.id]);

  const testOAuth = async () => {
    setTesting(true);
    try {
      window.open('https://gannonwaye.com/admin/tiktok-platform-review', '_blank');
      setOauthResult({ info: 'OAuth page opened in new tab. Complete the TikTok login flow there. Return here when done.' });
    } catch (e) {
      setOauthResult({ error: e.message });
    }
    setTesting(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🎵</span>
          <h2 className="font-semibold text-lg">TikTok Developer Setup</h2>
          <Badge className="ml-auto bg-red-500/20 text-red-300 border-red-500/30">Critical</Badge>
        </div>
        <p className="text-sm text-muted-foreground">OAuth, credentials, video.upload test. App must be in "live" or "review" mode with correct scopes.</p>
      </div>

      <StepBlock number={1} title="Open TikTok Developer Portal" status={phase === 'intro' ? 'active' : 'done'} why="You need to verify your app configuration, products, and credentials.">
        <Button className="gap-2" onClick={() => { window.open('https://developers.tiktok.com/apps', '_blank'); setPhase('portal'); }}>
          <ExternalLink className="w-4 h-4" /> Open TikTok Developer Portal
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Navigate to your app → Manage app → check each item in the next step.</p>
      </StepBlock>

      {phase !== 'intro' && (
        <StepBlock number={2} title="Verify App Configuration" status={allChecked ? 'done' : 'active'} why="Missing products/scopes will cause OAuth failures and 'client_key invalid' errors.">
          <p className="text-sm text-muted-foreground mb-3">Tick each item after verifying in the TikTok portal:</p>
          <div className="space-y-2">
            {CHECKLIST.map(item => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer hover:text-foreground text-sm text-muted-foreground">
                <input type="checkbox" checked={!!checks[item.id]} onChange={() => toggle(item.id)} className="w-3 h-3" />
                {item.label}
              </label>
            ))}
          </div>
          {allChecked && (
            <Button className="mt-3 gap-2" onClick={() => setPhase('keys')}>
              All Verified → Enter Credentials
            </Button>
          )}
        </StepBlock>
      )}

      {phase === 'keys' && (
        <>
          <StepBlock number={3} title="Save TikTok Client Key (no spaces)" status={keySaved ? 'done' : 'active'} why="A single leading space in the client key causes client_key invalid errors.">
            <div className="bg-secondary/50 rounded p-3 mb-3 text-xs text-muted-foreground">
              ⚠️ The client key must have <strong>no leading or trailing spaces</strong>. Copy it fresh from the TikTok portal.
            </div>
            <SecureSecretInput label="TIKTOK_CLIENT_KEY" secretName="TIKTOK_CLIENT_KEY" placeholder="Paste client key (no spaces)" onSaved={() => setKeySaved(true)} />
          </StepBlock>

          {keySaved && (
            <StepBlock number={4} title="Rotate + Save TikTok Client Secret" status={secretSaved ? 'done' : 'active'} why="The client secret must be rotated if it was ever exposed or copied elsewhere.">
              <ol className="text-sm text-muted-foreground mb-3 list-decimal list-inside space-y-1">
                <li>In TikTok portal, find "Client Secret"</li>
                <li>Click "Reset" or "Regenerate"</li>
                <li>Copy the new value immediately</li>
                <li>Paste below — it will not be shown again</li>
              </ol>
              <SecureSecretInput label="TIKTOK_CLIENT_SECRET" secretName="TIKTOK_CLIENT_SECRET" placeholder="Paste new client secret" onSaved={() => setSecretSaved(true)} />
            </StepBlock>
          )}

          {secretSaved && (
            <StepBlock number={5} title="Test TikTok OAuth Flow" status={oauthTested ? 'done' : 'active'} why="Confirms the keys work end-to-end: OAuth opens, consent is given, callback receives auth code, tokens stored.">
              <Button onClick={testOAuth} disabled={testing} className="gap-2 mb-3">
                <ExternalLink className="w-4 h-4" /> Open OAuth Test Page
              </Button>
              {oauthResult?.info && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300 mb-3">
                  ℹ️ {oauthResult.info}
                </div>
              )}
              <div className="space-y-2 text-sm text-muted-foreground mb-3">
                <p className="font-medium text-foreground">After completing TikTok login, confirm:</p>
                {['TikTok official OAuth screen opened (not an error page)', 'You completed consent/login on TikTok', 'Redirect returned to gannonwaye.com/tiktok-callback', 'Creator connected status shown', 'No tokens displayed in UI'].map(item => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                    <input type="checkbox" className="w-3 h-3" /> {item}
                  </label>
                ))}
              </div>
              <Button onClick={() => setOauthTested(true)} variant="outline" className="gap-2">
                <CheckCircle2 className="w-4 h-4" /> OAuth Confirmed Working
              </Button>
            </StepBlock>
          )}

          {oauthTested && (
            <StepBlock number={6} title="Test video.upload Draft" status={uploadTested ? 'done' : 'active'} why="Confirms video drafts can be submitted. Nothing auto-posts publicly.">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-300 mb-3">
                ✅ Safe — drafts are sent to your TikTok Creator inbox only. Nothing is published publicly.
              </div>
              <Button onClick={() => window.open('https://gannonwaye.com/admin/tiktok-platform-review', '_blank')} className="gap-2 mb-3">
                <ExternalLink className="w-4 h-4" /> Open TikTok Upload Test Page
              </Button>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => { setUploadTested(true); onComplete(); }} className="gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4" /> Draft Upload Confirmed — Mark TikTok Complete
                </Button>
                <Button variant="outline" onClick={onBlocked}>Mark Blocked</Button>
              </div>
            </StepBlock>
          )}
        </>
      )}
    </div>
  );
}