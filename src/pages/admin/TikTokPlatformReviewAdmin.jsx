import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, ExternalLink,
  Shield, Wifi, Lock, Info, Copy, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const StatusDot = ({ ok, unknown }) => {
  if (unknown) return <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40 shrink-0" />;
  return <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${ok ? 'bg-green-400' : 'bg-red-400'}`} />;
};

export default function TikTokPlatformReviewAdmin() {
  const [diagnostics, setDiagnostics] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const loadDiagnostics = async () => {
    setLoading(true);
    try {
      const [diagRes, statusRes] = await Promise.all([
        base44.functions.invoke('tiktokOAuth', { action: 'get_diagnostics' }),
        base44.functions.invoke('tiktokOAuth', { action: 'get_status' }),
      ]);
      setDiagnostics(diagRes.data);
      setStatus(statusRes.data);
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadDiagnostics(); }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await base44.functions.invoke('tiktokOAuth', { action: 'get_auth_url' });
      if (res.data?.url) {
        window.open(res.data.url, '_blank');
        toast.info('TikTok OAuth opened in new tab. Complete consent then return here and refresh status.');
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
      loadDiagnostics();
    } catch (e) {
      toast.error(e?.response?.data?.error || e.message);
    }
  };

  const copyOAuthUrl = () => {
    if (!diagnostics?.sample_url_shape) return;
    navigator.clipboard.writeText(diagnostics.sample_url_shape);
    toast.success('OAuth URL shape copied');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">TikTok Integration</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">TikTok Platform Review</h1>
          <p className="text-muted-foreground text-sm mt-1">OAuth diagnostics · client_key validation · safe token management</p>
        </div>
        <Button onClick={loadDiagnostics} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Diagnostics
        </Button>
      </div>

      {/* Connection Status */}
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

      {/* Known Error Explanation */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400 mb-1">client_key Error — Root Cause Analysis</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              TikTok is returning "client_key" error. This means the OAuth URL is being built with an invalid client_key value.
              The most common causes are: (1) TIKTOK_CLIENT_KEY has leading/trailing whitespace in Base44 Secrets,
              (2) the wrong key was pasted (e.g. client_secret instead of client_key),
              (3) the app is in Sandbox mode but using Production credentials or vice versa,
              (4) the TikTok Developer Portal app configuration doesn't match the redirect URI exactly.
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Last error log ID reported: <span className="font-mono text-amber-300">202605270931556367AE5C510BDBB84BA9</span></p>
              <p>Required redirect URI: <span className="font-mono text-blue-300">https://gannonwaye.com/tiktok-callback</span></p>
              <p>Required OAuth endpoint: <span className="font-mono text-blue-300">https://www.tiktok.com/v2/auth/authorize/</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnostics */}
      {diagnostics && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Safe Diagnostics (no secrets exposed)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {[
              { label: 'TIKTOK_CLIENT_KEY present', ok: diagnostics.client_key_present },
              { label: 'TIKTOK_CLIENT_SECRET present', ok: diagnostics.client_secret_present },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3 py-1.5 border-b border-border/20 last:border-0">
                <StatusDot ok={row.ok} />
                <span className="text-sm flex-1">{row.label}</span>
                <Badge variant="outline" className={`text-[10px] ${row.ok ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'}`}>
                  {row.ok ? 'present' : 'MISSING'}
                </Badge>
              </div>
            ))}
            {diagnostics.client_key_present && (
              <>
                <div className="flex items-center gap-3 py-1.5 border-b border-border/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-sm flex-1">Key length</span>
                  <span className="text-xs font-mono text-muted-foreground">{diagnostics.client_key_length} chars</span>
                </div>
                <div className="flex items-center gap-3 py-1.5 border-b border-border/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-sm flex-1">Key prefix (first 3 chars only)</span>
                  <span className="text-xs font-mono text-muted-foreground">{diagnostics.client_key_prefix}…</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-3 py-1.5 border-b border-border/20">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
              <span className="text-sm flex-1">OAuth endpoint</span>
              <span className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">{diagnostics.oauth_endpoint}</span>
            </div>
            <div className="flex items-center gap-3 py-1.5 border-b border-border/20">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
              <span className="text-sm flex-1">Redirect URI</span>
              <span className="text-xs font-mono text-muted-foreground">{diagnostics.redirect_uri}</span>
            </div>
            <div className="flex items-center gap-3 py-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
              <span className="text-sm flex-1">Scopes requested</span>
              <span className="text-xs font-mono text-muted-foreground">{diagnostics.scopes}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Checklist */}
      <Card className="border-amber-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Required Actions to Fix client_key Error</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {[
            {
              step: '1',
              title: 'Re-enter TIKTOK_CLIENT_KEY in Base44 Secrets',
              detail: 'Go to Base44 dashboard → Settings → Environment Variables. Delete the current TIKTOK_CLIENT_KEY and re-enter it carefully with NO leading/trailing spaces. Copy it directly from TikTok Developer Portal → your app → Client key (not Client secret).',
            },
            {
              step: '2',
              title: 'Verify TikTok Developer Portal configuration',
              detail: 'In TikTok Developer Portal → your app → Configuration. Website must be: https://gannonwaye.com/ — Redirect URI must be EXACTLY: https://gannonwaye.com/tiktok-callback (no trailing slash, no query params). Products must include: Login Kit + Content Posting API.',
            },
            {
              step: '3',
              title: 'Confirm app is not in Sandbox-only mode',
              detail: 'If the TikTok app is in Sandbox mode, only whitelisted test accounts can use OAuth. Check Portal → your app → Overview → App status. For live use you need "Approved" status for the scopes used.',
            },
            {
              step: '4',
              title: 'After re-entering secret: click Connect TikTok above',
              detail: 'The .trim() fix is already in the backend code. After re-entering the key without spaces, the OAuth URL will be built correctly.',
            },
          ].map(item => (
            <div key={item.step} className="flex gap-3 p-3 border border-border/30 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{item.step}</div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}

          <div className="flex gap-2 pt-2 flex-wrap">
            <a href="https://developers.tiktok.com/apps/" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> TikTok Developer Portal
              </Button>
            </a>
            <a href="https://base44.com" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Base44 Secrets
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* MCP note */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-400">Approval Gate — No Auto-Posting</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Even after OAuth connects, TikTok video.upload requires ApprovalQueue approval before any draft is sent.
              TikTok's API uploads as a DRAFT — creators must manually review and publish in the TikTok app.
              No content ever auto-posts publicly.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap">
        <Link to="/admin/tiktok-recording-studio"><Button variant="outline" size="sm">Recording Studio</Button></Link>
        <Link to="/admin/tiktok-screen-guide"><Button variant="outline" size="sm">Screen Guide</Button></Link>
        <Link to="/admin/approval-queue"><Button variant="outline" size="sm">Approval Queue</Button></Link>
        <Link to="/admin/guided-setup-concierge"><Button variant="outline" size="sm">Setup Concierge</Button></Link>
      </div>
    </div>
  );
}