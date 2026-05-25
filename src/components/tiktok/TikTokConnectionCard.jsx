import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, RefreshCw, LogOut, ExternalLink, User, AlertTriangle, ShieldCheck, ShieldX, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function TikTokConnectionCard({ onStatusChange }) {
  const { toast } = useToast();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);   // { isAdmin, email, role }
  const [adminLoading, setAdminLoading] = useState(true);
  const [lastError, setLastError] = useState(null);
  const [lastAttempt, setLastAttempt] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // ── 1. Verify admin session first ────────────────────────────────────────
  useEffect(() => {
    const checkAdmin = async () => {
      setAdminLoading(true);
      try {
        const user = await base44.auth.me();
        setAdminInfo({
          isAdmin: user?.role === 'admin',
          role: user?.role || 'unknown',
          hasSession: true,
        });
      } catch (_) {
        setAdminInfo({ isAdmin: false, role: 'none', hasSession: false });
      }
      setAdminLoading(false);
    };
    checkAdmin();
  }, []);

  // ── 2. Check TikTok connection status (only after admin confirmed) ────────
  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('tiktokOAuth', { action: 'get_status' });
      setStatus(res.data);
      onStatusChange?.(res.data);
      setLastError(null);
    } catch (err) {
      const msg = err.message || 'Unknown error';
      setStatus({ connected: false, error: msg });
      setLastError(msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only call status check after admin check resolves
    if (!adminLoading) {
      checkStatus();
    }
  }, [adminLoading]);

  // ── Listen for popup OAuth code ──────────────────────────────────────────
  useEffect(() => {
    const onStorage = async (e) => {
      if (e.key === 'tiktok_oauth_code' && e.newValue) {
        const code = e.newValue;
        localStorage.removeItem('tiktok_oauth_code');
        setConnecting(true);
        try {
          const exchangeRes = await base44.functions.invoke('tiktokOAuth', { action: 'exchange_code', code });
          if (exchangeRes.data?.success) {
            toast({ title: `Connected: @${exchangeRes.data.display_name || 'TikTok Creator'}` });
            await checkStatus();
          } else {
            toast({ title: exchangeRes.data?.error || 'Connection failed', variant: 'destructive' });
          }
        } catch (err) {
          toast({ title: err.message || 'Connection failed', variant: 'destructive' });
        }
        setConnecting(false);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // ── Listen for same-tab redirect return ─────────────────────────────────
  useEffect(() => {
    const justConnected = sessionStorage.getItem('tiktok_just_connected');
    if (justConnected) {
      sessionStorage.removeItem('tiktok_just_connected');
      checkStatus();
      toast({ title: 'TikTok account connected successfully!' });
    }
  }, []);

  // ── Connect handler ──────────────────────────────────────────────────────
  const handleConnect = async () => {
    setConnecting(true);
    setLastAttempt(new Date().toISOString());
    setLastError(null);

    // Open blank popup synchronously during user gesture (prevents browser block)
    let popup = null;
    try {
      popup = window.open('', 'tiktok_oauth', 'width=600,height=700,scrollbars=yes,noopener=0');
    } catch (_) {}

    try {
      const res = await base44.functions.invoke('tiktokOAuth', { action: 'get_auth_url' });
      const authUrl = res.data?.url;
      if (!authUrl) throw new Error(res.data?.error || 'No auth URL returned from backend');

      if (popup && !popup.closed) {
        popup.location.href = authUrl;

        const poll = setInterval(async () => {
          if (!popup || popup.closed) {
            clearInterval(poll);
            setConnecting(false);
            await checkStatus();
            return;
          }
          try {
            const code = localStorage.getItem('tiktok_oauth_code');
            if (code) {
              clearInterval(poll);
              localStorage.removeItem('tiktok_oauth_code');
              const exchangeRes = await base44.functions.invoke('tiktokOAuth', { action: 'exchange_code', code });
              if (exchangeRes.data?.success) {
                toast({ title: `Connected: @${exchangeRes.data.display_name || 'TikTok Creator'}` });
                await checkStatus();
              } else {
                toast({ title: exchangeRes.data?.error || 'Connection failed', variant: 'destructive' });
              }
              setConnecting(false);
              popup?.close();
            }
          } catch (_) {}
        }, 800);
      } else {
        // Popup blocked — same-tab redirect
        window.location.href = authUrl;
      }
    } catch (err) {
      if (popup && !popup.closed) popup.close();
      const msg = err.message || 'Failed to start OAuth';
      setLastError(msg);

      // Friendly message for 401/403
      let friendlyMsg = msg;
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('authentication')) {
        friendlyMsg = 'TikTok connection was blocked because the backend did not recognise your admin session. Please refresh the page, log in again, or contact system admin.';
        setShowDiagnostics(true);
      } else if (msg.includes('403') || msg.toLowerCase().includes('forbidden')) {
        friendlyMsg = 'Access denied — this action requires admin role. Please ensure you are logged in as Gannon (admin).';
        setShowDiagnostics(true);
      }

      toast({ title: friendlyMsg, variant: 'destructive' });
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await base44.functions.invoke('tiktokOAuth', { action: 'disconnect' });
      toast({ title: 'TikTok disconnected' });
      const newStatus = { connected: false };
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (err) {
      toast({ title: 'Disconnect failed', variant: 'destructive' });
    }
    setDisconnecting(false);
  };

  // ── Admin status pill ────────────────────────────────────────────────────
  const AdminStatusBadge = () => {
    if (adminLoading) return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="w-3 h-3 animate-spin" /> Checking admin access...
      </span>
    );
    if (adminInfo?.isAdmin) return (
      <span className="inline-flex items-center gap-1 text-xs text-green-400">
        <ShieldCheck className="w-3 h-3" /> Connected as admin: yes
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-400">
        <ShieldX className="w-3 h-3" /> Connected as admin: no (role: {adminInfo?.role || 'unknown'})
      </span>
    );
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (adminLoading || loading) {
    return (
      <Card>
        <CardContent className="p-5 flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {adminLoading ? 'Checking admin access...' : 'Checking TikTok connection...'}
          </span>
        </CardContent>
      </Card>
    );
  }

  // ── Not admin — show clear message ──────────────────────────────────────
  if (!adminInfo?.isAdmin) {
    return (
      <Card className="border-red-500/30">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldX className="w-5 h-5" />
            <p className="text-sm font-medium">Admin access required</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {adminInfo?.hasSession
              ? `You are logged in but your role is "${adminInfo.role}". You must be logged in as admin (Gannon) to connect TikTok.`
              : 'No session detected. Please log in as admin before connecting TikTok.'}
          </p>
          <Button size="sm" variant="outline" onClick={() => base44.auth.redirectToLogin(window.location.pathname)}>
            Log in as admin
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Secret rotation warning */}
      <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-3 flex items-start gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs text-red-300/80">
          <strong className="text-red-300">Security:</strong> Rotate TikTok client secret before production submission.
          Tokens are stored server-side only — never visible in the browser.
        </div>
      </div>

      <Card className={status?.connected ? 'border-green-500/30' : 'border-border'}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between gap-2 flex-wrap">
            <span className="flex items-center gap-2">
              <span className="text-base">🎵</span> TikTok Creator Connection
              {status?.connected
                ? <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Connected</Badge>
                : <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30">Not Connected</Badge>}
            </span>
            <AdminStatusBadge />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status?.connected ? (
            <div className="flex items-center gap-4">
              {status.avatar_url ? (
                <img src={status.avatar_url} alt="TikTok avatar" className="w-12 h-12 rounded-full border border-border" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{status.display_name || 'TikTok Creator'}</p>
                {status.username && <p className="text-xs text-muted-foreground">@{status.username}</p>}
                {status.open_id && <p className="text-xs text-muted-foreground/50 font-mono truncate">ID: {status.open_id}</p>}
                {status.connected_at && <p className="text-xs text-muted-foreground">Connected {new Date(status.connected_at).toLocaleDateString()}</p>}
              </div>
              {status.follower_count !== undefined && (
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-primary">{status.follower_count?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">followers</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No TikTok account connected</p>
            </div>
          )}

          {/* Security confirmation row */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border border-border/50 rounded px-2 py-1.5">
              <p className="text-muted-foreground/60 uppercase tracking-wider text-[10px]">Access Token</p>
              <p className="text-green-400 font-medium">Hidden — server only</p>
            </div>
            <div className="border border-border/50 rounded px-2 py-1.5">
              <p className="text-muted-foreground/60 uppercase tracking-wider text-[10px]">Client Secret</p>
              <p className="text-green-400 font-medium">Hidden — env var only</p>
            </div>
          </div>

          {status?.scope && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Authorised Scopes</p>
              <div className="flex flex-wrap gap-1">
                {status.scope.split(',').map(s => (
                  <code key={s} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{s.trim()}</code>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons — always visible */}
          <div className="flex gap-2 flex-wrap items-center">
            {status?.connected ? (
              <>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={checkStatus} disabled={loading}>
                  <RefreshCw className="w-3 h-3" /> Refresh Status
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={handleDisconnect} disabled={disconnecting}>
                  {disconnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                size="default"
                className="gradient-gold-button border-0 gap-2"
                onClick={handleConnect}
                disabled={connecting}
              >
                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                {connecting ? 'Opening TikTok OAuth...' : 'Connect TikTok'}
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-xs text-muted-foreground ml-auto"
              onClick={() => setShowDiagnostics(v => !v)}
            >
              {showDiagnostics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
            </Button>
          </div>

          {!status?.connected && !connecting && (
            <p className="text-xs text-muted-foreground/60">
              Opens the official TikTok consent screen. If a popup is blocked, the page will redirect you directly to TikTok and return automatically.
            </p>
          )}
          {connecting && (
            <p className="text-xs text-amber-400/80">
              Complete the TikTok authorization in the popup. If no popup appeared, check your browser's address bar — you may have been redirected.
            </p>
          )}

          {/* Diagnostics panel */}
          {showDiagnostics && (
            <div className="border border-border/50 rounded-lg p-3 bg-secondary/20 space-y-2 text-xs font-mono">
              <p className="text-muted-foreground font-sans font-semibold text-[11px] uppercase tracking-wider mb-2">Diagnostics</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <span className="text-muted-foreground">Admin session detected</span>
                <span className={adminInfo?.hasSession ? 'text-green-400' : 'text-red-400'}>{adminInfo?.hasSession ? 'yes' : 'no'}</span>
                <span className="text-muted-foreground">Role</span>
                <span className={adminInfo?.isAdmin ? 'text-green-400' : 'text-amber-400'}>{adminInfo?.role || 'unknown'}</span>
                <span className="text-muted-foreground">TikTok OAuth function</span>
                <span className="text-blue-400">tiktokOAuth</span>
                <span className="text-muted-foreground">Last OAuth error</span>
                <span className={lastError ? 'text-red-400' : 'text-muted-foreground/50'}>{lastError || 'none'}</span>
                <span className="text-muted-foreground">Last attempt</span>
                <span className="text-muted-foreground/70">{lastAttempt ? new Date(lastAttempt).toLocaleTimeString() : 'none'}</span>
              </div>
              {lastError && (lastError.includes('401') || lastError.toLowerCase().includes('unauthorized')) && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-300 font-sans text-xs">
                  <strong>Next action:</strong> Refresh the page and log in again. If the issue persists, check that your Base44 session cookie is active on gannonwaye.com.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}