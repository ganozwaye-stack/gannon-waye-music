import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, RefreshCw, LogOut, ExternalLink, User, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function TikTokConnectionCard({ onStatusChange }) {
  const { toast } = useToast();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('tiktokOAuth', { action: 'get_status' });
      setStatus(res.data);
      onStatusChange?.(res.data);
    } catch (err) {
      setStatus({ connected: false, error: err.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();

    // When returning from same-tab redirect, the code will be in the URL
    // The callback page handles the exchange — we just need to re-check status
    // (handled by TikTokCallback redirecting back here)
  }, []);

  // Listen for storage event — set by popup callback flow
  useEffect(() => {
    const onStorage = async (e) => {
      if (e.key === 'tiktok_oauth_code' && e.newValue) {
        const code = e.newValue;
        localStorage.removeItem('tiktok_oauth_code');
        setConnecting(true);
        try {
          const exchangeRes = await base44.functions.invoke('tiktokOAuth', { action: 'exchange_code', code });
          if (exchangeRes.data?.success) {
            toast({ title: `Connected: @${exchangeRes.data.display_name || exchangeRes.data.username || 'TikTok Creator'}` });
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

  // Check if we just returned from a same-tab redirect (callback sets tiktok_just_connected)
  useEffect(() => {
    const justConnected = sessionStorage.getItem('tiktok_just_connected');
    if (justConnected) {
      sessionStorage.removeItem('tiktok_just_connected');
      checkStatus();
      toast({ title: 'TikTok account connected successfully!' });
    }
  }, []);

  const handleConnect = async () => {
    setConnecting(true);

    // CRITICAL FIX: Open a blank popup SYNCHRONOUSLY during the click event.
    // This is treated as a direct user gesture — browsers won't block it.
    // We then navigate the popup to the real OAuth URL once we have it.
    let popup = null;
    try {
      popup = window.open('', 'tiktok_oauth', 'width=600,height=700,scrollbars=yes,noopener=0');
    } catch (_) {
      // popup blocked — will fallback to same-tab below
    }

    try {
      const res = await base44.functions.invoke('tiktokOAuth', { action: 'get_auth_url' });
      const authUrl = res.data?.url;
      if (!authUrl) throw new Error('No auth URL returned');

      if (popup && !popup.closed) {
        // Navigate the already-open popup to the real TikTok OAuth URL
        popup.location.href = authUrl;

        // Poll for popup close or localStorage code set by callback
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
        // Popup was blocked — fall back to same-tab redirect
        window.location.href = authUrl;
        // (TikTokCallback page will handle the return)
      }
    } catch (err) {
      if (popup && !popup.closed) popup.close();
      toast({ title: err.message || 'Failed to start OAuth', variant: 'destructive' });
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-5 flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Checking TikTok connection...</span>
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
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-base">🎵</span> TikTok Creator Connection
            {status?.connected
              ? <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Connected</Badge>
              : <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30">Not Connected</Badge>}
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

          <div className="flex gap-2 flex-wrap">
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
                size="sm"
                className="gradient-gold-button border-0 gap-1.5 text-xs"
                onClick={handleConnect}
                disabled={connecting}
              >
                {connecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                {connecting ? 'Opening TikTok OAuth...' : 'Connect TikTok (Login Kit)'}
              </Button>
            )}
          </div>

          {!status?.connected && !connecting && (
            <p className="text-xs text-muted-foreground/60">
              Opens the official TikTok consent screen. If a popup is blocked by your browser, the page will redirect you directly to TikTok and return automatically.
            </p>
          )}
          {connecting && (
            <p className="text-xs text-amber-400/80">
              Complete the TikTok authorization in the popup. If no popup appeared, check your browser's address bar — you may have been redirected.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}