import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, ExternalLink,
  Shield, Wifi, Lock, Info, Copy, ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';

const EXPECTED_REDIRECT = 'https://gannonwaye.com/tiktok-callback';
const EXPECTED_SCOPES = 'user.info.basic,video.upload';
const EXPECTED_ENDPOINT = 'https://www.tiktok.com/v2/auth/authorize/';

function DiagRow({ label, value, ok, warn, mono = true }) {
  const color = ok === true ? 'text-green-400' : ok === false ? 'text-red-400' : 'text-amber-400';
  const dot = ok === true ? 'bg-green-400' : ok === false ? 'bg-red-400' : 'bg-amber-400';
  return (
    <div className="flex items-center gap-3 py-1.5 border-b border-border/20 last:border-0">
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
      <span className="text-sm flex-1 text-foreground/80">{label}</span>
      {value !== undefined && (
        <span className={`${mono ? 'font-mono' : ''} text-xs ${color} text-right max-w-[240px] truncate`}>{String(value)}</span>
      )}
      {warn && <span className="text-xs text-red-400 font-semibold ml-1">{warn}</span>}
    </div>
  );
}

const PORTAL_CHECKS = [
  { key: 'login_kit', label: 'Login Kit product added to this app in TikTok Developer Portal' },
  { key: 'content_posting', label: 'Content Posting API product added to this app' },
  { key: 'web_platform', label: 'Platforms → Web enabled in the app' },
  { key: 'redirect_uri', label: `Redirect URI registered under Login Kit: ${EXPECTED_REDIRECT}` },
  { key: 'website', label: 'Website URL set to: https://gannonwaye.com/' },
  { key: 'terms', label: 'Terms URL: https://gannonwaye.com/terms-of-service' },
  { key: 'privacy', label: 'Privacy URL: https://gannonwaye.com/privacy-policy' },
  { key: 'app_icon', label: 'App icon 1024×1024 uploaded' },
  { key: 'scopes', label: 'Scopes selected: only user.info.basic + video.upload' },
  { key: 'mode', label: 'App mode (Production vs Sandbox) matches credentials being used' },
  { key: 'test_user', label: 'If Sandbox: test user added and accepted invite' },
];

export default function TikTokPlatformReviewAdmin() {
  const [diag, setDiag] = useState(null);
  const [status, setStatus] = useState(null);
  const [authUrl, setAuthUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [checks, setChecks] = useState({});
  const [appMode, setAppMode] = useState('');
  const [lastError, setLastError] = useState({ error_type: '', logid: '' });
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [diagRes, statusRes, urlRes] = await Promise.all([
        base44.functions.invoke('tiktokOAuth', { action: 'get_diagnostics' }),
        base44.functions.invoke('tiktokOAuth', { action: 'get_status' }),
        base44.functions.invoke('tiktokOAuth', { action: 'get_auth_url' }),
      ]);
      setDiag(diagRes.data);
      setStatus(statusRes.data);
      // Parse auth_url to extract live client_key from OAuth URL
      if (urlRes.data?.url) {
        try {
          const p = Object.fromEntries(new URL(urlRes.data.url).searchParams);
          setAuthUrl(p);
        } catch (_) {}
      }
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await base44.functions.invoke('tiktokOAuth', { action: 'get_auth_url' });
      if (res.data?.url) {
        window.open(res.data.url, '_blank');
        toast.info('TikTok OAuth opened in new tab. Complete consent then refresh status.');
      }
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message);
    }
    setConnecting(false);
  };

  const handleDisconnect = async () => {
    try {
      await base44.functions.invoke('tiktokOAuth', { action: 'disconnect' });
      setStatus(null);
      toast.success('TikTok disconnected');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message);
    }
  };

  const copyReport = () => {
    const lines = [
      `TikTok OAuth Debug Report — ${new Date().toLocaleString('en-AU')}`,
      '',
      '=== RAW SECRET (whitespace analysis) ===',
      `raw_key_length: ${diag?.raw_key_length ?? '(not loaded)'}`,
      `raw_key_prefix (first 3): ${diag?.raw_key_prefix ?? '(not loaded)'}`,
      `raw_key_has_whitespace: ${diag?.raw_key_has_whitespace ?? '(not loaded)'}`,
      `raw_key_leading_space: ${diag?.raw_key_leading_space ?? '(not loaded)'}`,
      `raw_key_trailing_space: ${diag?.raw_key_trailing_space ?? '(not loaded)'}`,
      '',
      '=== TRIMMED KEY (used in code) ===',
      `trimmed_key_length: ${diag?.trimmed_key_length ?? '(not loaded)'}`,
      `trimmed_key_prefix (first 3): ${diag?.trimmed_key_prefix ?? '(not loaded)'}`,
      '',
      '=== OAUTH URL (what TikTok receives) ===',
      `oauth_url_key_length: ${diag?.oauth_url_key_length ?? '(not loaded)'}`,
      `oauth_url_key_prefix (first 3): ${diag?.oauth_url_key_prefix ?? '(not loaded)'}`,
      `redirect_uri: ${diag?.redirect_uri ?? '(not loaded)'}`,
      `scopes: ${diag?.scopes ?? '(not loaded)'}`,
      `oauth_endpoint: ${diag?.oauth_endpoint ?? '(not loaded)'}`,
      '',
      '=== LAST ERROR ===',
      `error_type: ${lastError.error_type || '(none entered)'}`,
      `logid: ${lastError.logid || '(none entered)'}`,
      '',
      '=== APP MODE ===',
      `app_mode: ${appMode || '(not selected)'}`,
      '',
      '=== PORTAL CHECKLIST ===',
      ...PORTAL_CHECKS.map(c => `[${checks[c.key] ? 'x' : ' '}] ${c.label}`),
    ].join('\n');
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Safe debug report copied — no secrets included');
  };

  const hasWhitespace = diag?.raw_key_has_whitespace;
  const isFixed = !hasWhitespace;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">TikTok Integration</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">TikTok Platform Review</h1>
          <p className="text-muted-foreground text-sm mt-1">OAuth diagnostics · client_key whitespace analysis · portal checklist</p>
        </div>
        <Button onClick={load} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Critical whitespace banner */}
      {diag && hasWhitespace && (
        <div className="border border-red-500/50 bg-red-500/10 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">TIKTOK_CLIENT_KEY has leading/trailing whitespace</p>
              <p className="text-sm text-foreground/70 mt-1">
                Raw secret length: <strong>{diag.raw_key_length}</strong> chars · Prefix: <code className="bg-secondary/50 px-1 rounded">{diag.raw_key_prefix}</code>
                {diag.raw_key_leading_space && <span className="text-red-400 font-semibold ml-2">← leading space detected</span>}
                {diag.raw_key_trailing_space && <span className="text-red-400 font-semibold ml-2">← trailing space detected</span>}
              </p>
              <p className="text-sm text-foreground/70 mt-1">
                Trimmed key length: <strong>{diag.trimmed_key_length}</strong> chars · Prefix: <code className="bg-secondary/50 px-1 rounded">{diag.trimmed_key_prefix}</code>
                (the .trim() in code removes it — OAuth URL uses this trimmed key)
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-semibold text-yellow-400">
                ⚠️ Action: Go to Base44 → App Settings → Environment Variables → delete TIKTOK_CLIENT_KEY → re-enter it with NO leading/trailing spaces.
                Copy directly from TikTok Developer Portal → your app → Client key field.
              </p>
            </div>
          </div>
        </div>
      )}

      {diag && !hasWhitespace && (
        <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-3 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-sm text-green-300">TIKTOK_CLIENT_KEY has no whitespace — raw and trimmed lengths match. OAuth URL uses clean key.</p>
        </div>
      )}

      {/* Connection status */}
      <Card className={status?.connected ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/30 bg-amber-500/5'}>
        <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {status?.connected
              ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              : <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
            <div>
              <p className={`font-semibold text-sm ${status?.connected ? 'text-green-400' : 'text-amber-400'}`}>
                {status?.connected ? `Connected: @${status.username || status.display_name}` : 'Not connected to TikTok'}
              </p>
              {status?.connected && (
                <p className="text-xs text-muted-foreground">{status.follower_count?.toLocaleString()} followers · Connected {status.connected_at ? new Date(status.connected_at).toLocaleDateString('en-AU') : ''}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!status?.connected
              ? <Button onClick={handleConnect} disabled={connecting} className="gap-2">
                  {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                  Connect TikTok
                </Button>
              : <Button onClick={handleDisconnect} variant="outline" size="sm" className="text-red-400 border-red-500/30 gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Disconnect
                </Button>}
          </div>
        </CardContent>
      </Card>

      {/* Full diagnostics table */}
      {diag && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-primary" />Full Key Diagnostics (no secrets — prefix first 3 chars only)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">Raw Secret (as stored in Base44)</p>
            <DiagRow label="Raw key length" value={`${diag.raw_key_length} chars`} ok={diag.raw_key_length > 5} />
            <DiagRow label="Raw key prefix (first 3)" value={diag.raw_key_prefix} ok={diag.client_key_present} />
            <DiagRow
              label="Raw key has whitespace"
              value={diag.raw_key_has_whitespace ? 'YES — whitespace detected' : 'No'}
              ok={!diag.raw_key_has_whitespace}
              warn={diag.raw_key_has_whitespace ? '← FIX REQUIRED' : undefined}
            />
            <DiagRow label="Leading space" value={diag.raw_key_leading_space ? 'YES' : 'No'} ok={!diag.raw_key_leading_space} />
            <DiagRow label="Trailing space" value={diag.raw_key_trailing_space ? 'YES' : 'No'} ok={!diag.raw_key_trailing_space} />

            <p className="text-xs text-muted-foreground mt-4 mb-3 font-semibold uppercase tracking-wider">Trimmed Key (what .trim() produces — used in code)</p>
            <DiagRow label="Trimmed key length" value={`${diag.trimmed_key_length} chars`} ok={diag.trimmed_key_length > 5} />
            <DiagRow label="Trimmed key prefix (first 3)" value={diag.trimmed_key_prefix} ok={diag.client_key_present} />

            <p className="text-xs text-muted-foreground mt-4 mb-3 font-semibold uppercase tracking-wider">OAuth URL (what TikTok actually receives)</p>
            <DiagRow label="OAuth URL client_key length" value={`${diag.oauth_url_key_length} chars`} ok={diag.oauth_url_key_length > 5} />
            <DiagRow label="OAuth URL client_key prefix (first 3)" value={diag.oauth_url_key_prefix} ok={diag.oauth_url_key_length > 5} />
            <DiagRow label="OAuth endpoint" value={diag.oauth_endpoint} ok={diag.oauth_endpoint === EXPECTED_ENDPOINT} mono />
            <DiagRow label="Redirect URI" value={diag.redirect_uri} ok={diag.redirect_uri === EXPECTED_REDIRECT} mono />
            <DiagRow label="Scopes" value={diag.scopes} ok={diag.scopes === EXPECTED_SCOPES} mono />
            <DiagRow label="Client secret present" value={diag.client_secret_present ? 'Yes' : 'Missing'} ok={diag.client_secret_present} />
          </CardContent>
        </Card>
      )}

      {/* Auth URL live parse */}
      {authUrl && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Live OAuth URL Parse (from get_auth_url)</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <DiagRow label="client_key in live URL" value={`prefix: ${(authUrl.client_key || '').slice(0,3)}… length: ${(authUrl.client_key || '').length}`} ok={(authUrl.client_key || '').length > 5} />
            <DiagRow label="redirect_uri in live URL" value={authUrl.redirect_uri} ok={authUrl.redirect_uri === EXPECTED_REDIRECT} />
            <DiagRow label="scope in live URL" value={authUrl.scope} ok={decodeURIComponent(authUrl.scope || '') === EXPECTED_SCOPES} />
          </CardContent>
        </Card>
      )}

      {/* Last error input */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Last TikTok Error (paste from browser URL after failed OAuth)</CardTitle></CardHeader>
        <CardContent className="pt-0 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">error_type</label>
            <input
              className="w-full bg-secondary/50 border border-border/40 rounded px-2 py-1.5 text-xs font-mono"
              placeholder="e.g. client_key"
              value={lastError.error_type}
              onChange={e => setLastError(p => ({ ...p, error_type: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">logid</label>
            <input
              className="w-full bg-secondary/50 border border-border/40 rounded px-2 py-1.5 text-xs font-mono"
              placeholder="from URL params"
              value={lastError.logid}
              onChange={e => setLastError(p => ({ ...p, logid: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Portal checklist */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><ClipboardList className="w-4 h-4 text-primary" />TikTok Developer Portal Checklist</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <p className="text-xs text-muted-foreground mb-2">Tick each item after verifying in the TikTok Developer Portal for your app:</p>
          {PORTAL_CHECKS.map(c => (
            <label key={c.key} className="flex items-start gap-2 cursor-pointer select-none p-1.5 rounded hover:bg-secondary/30">
              <input
                type="checkbox"
                checked={!!checks[c.key]}
                onChange={() => setChecks(s => ({ ...s, [c.key]: !s[c.key] }))}
                className="mt-0.5 accent-primary shrink-0"
              />
              <span className={`text-xs ${checks[c.key] ? 'line-through text-muted-foreground/50' : 'text-foreground/80'}`}>{c.label}</span>
            </label>
          ))}
          <div className="mt-3 flex items-center gap-2">
            <label className="text-xs text-muted-foreground">App mode in portal:</label>
            <select
              value={appMode}
              onChange={e => setAppMode(e.target.value)}
              className="bg-secondary/50 border border-border/40 rounded px-2 py-1 text-xs"
            >
              <option value="">— select —</option>
              <option value="Production">Production</option>
              <option value="Sandbox">Sandbox</option>
            </select>
            {appMode && (
              <Badge className={appMode === 'Sandbox' ? 'bg-amber-500/20 text-amber-300 text-xs' : 'bg-blue-500/20 text-blue-300 text-xs'}>
                {appMode === 'Sandbox' ? 'Sandbox: test users only' : 'Production: any user can connect'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={copyReport} variant="outline" className="gap-2">
          {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Safe Debug Report'}
        </Button>
        <a href="https://developers.tiktok.com/apps/" target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="gap-1.5"><ExternalLink className="w-3.5 h-3.5" />TikTok Developer Portal</Button>
        </a>
        <a href="https://base44.com" target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="gap-1.5"><Lock className="w-3.5 h-3.5" />Base44 Secrets</Button>
        </a>
      </div>

      {/* Not complete notice */}
      <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-foreground/70">
            <p className="font-semibold text-amber-300 mb-1">TikTok OAuth is NOT complete</p>
            <p>The code correctly trims the key before use. OAuth still fails with <code className="bg-secondary/50 px-1 rounded">error_type=client_key</code> until:</p>
            <ol className="list-decimal list-inside mt-1 space-y-0.5">
              <li>Secret re-entered without spaces in Base44 → Environment Variables</li>
              <li>TikTok Developer Portal: Login Kit + Content Posting API added, Web platform enabled, redirect URI registered exactly</li>
              <li>Production or Sandbox mode confirmed and credentials match</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Approval gate note */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-blue-400">Approval Gate — No Auto-Posting: </span>
            Even after OAuth connects, video.upload requires ApprovalQueue approval before any draft is sent.
            TikTok's API uploads as a DRAFT — Gannon must manually review and publish in the TikTok app. No content ever auto-posts publicly.
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap">
        <Link to="/admin/tiktok-recording-studio"><Button variant="outline" size="sm">Recording Studio</Button></Link>
        <Link to="/admin/tiktok-screen-guide"><Button variant="outline" size="sm">Screen Guide</Button></Link>
        <Link to="/admin/approval-queue"><Button variant="outline" size="sm">Approval Queue</Button></Link>
      </div>
    </div>
  );
}