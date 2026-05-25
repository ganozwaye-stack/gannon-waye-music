import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, RefreshCw, LogOut, ExternalLink, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function TikTokConnectionCard({ onStatusChange }) {
  const { toast } = useToast();
  const [status, setStatus] = useState(null); // null = loading
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

  useEffect(() => { checkStatus(); }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await base44.functions.invoke('tiktokOAuth', { action: 'get_auth_url' });
      const popup = window.open(res.data.url, 'tiktok_oauth', 'width=600,height=700,scrollbars=yes');
      
      // Poll for callback — the callback page will set a flag
      const poll = setInterval(async () => {
        if (!popup || popup.closed) {
          clearInterval(poll);
          setConnecting(false);
          await checkStatus();
        }
        // Check if callback page stored the code
        try {
          const code = localStorage.getItem('tiktok_oauth_code');
          if (code) {
            clearInterval(poll);
            localStorage.removeItem('tiktok_oauth_code');
            const exchangeRes = await base44.functions.invoke('tiktokOAuth', { action: 'exchange_code', code });
            if (exchangeRes.data?.success) {
              toast({ title: `Connected: @${exchangeRes.data.display_name || exchangeRes.data.username}` });
              await checkStatus();
            } else {
              toast({ title: 'Connection failed', variant: 'destructive' });
            }
            setConnecting(false);
            popup?.close();
          }
        } catch (_) {}
      }, 1000);
    } catch (err) {
      toast({ title: 'Failed to start OAuth flow', variant: 'destructive' });
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await base44.functions.invoke('tiktokOAuth', { action: 'disconnect' });
      toast({ title: 'TikTok disconnected' });
      setStatus({ connected: false });
      onStatusChange?.({ connected: false });
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
            {status.avatar_url && (
              <img src={status.avatar_url} alt="TikTok avatar" className="w-12 h-12 rounded-full border border-border" />
            )}
            {!status.avatar_url && (
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
            <Button size="sm" className="gradient-gold-button border-0 gap-1.5 text-xs" onClick={handleConnect} disabled={connecting}>
              {connecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
              {connecting ? 'Waiting for OAuth...' : 'Connect TikTok (Login Kit)'}
            </Button>
          )}
        </div>

        {!status?.connected && (
          <p className="text-xs text-muted-foreground/60">
            Clicking "Connect TikTok" opens the official TikTok OAuth consent screen. Only Gannon Waye's authorised creator account connects here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}