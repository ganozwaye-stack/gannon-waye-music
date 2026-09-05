import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink, CheckCircle2, AlertTriangle, Clock, XCircle, Music, Rocket, Plug, RefreshCw } from 'lucide-react';

const STATUS_CONFIG = {
  'Not connected': { color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: Clock },
  'Needs credentials': { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: AlertTriangle },
  'Connected': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: CheckCircle2 },
  'Testing': { color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: Clock },
  'Live': { color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle2 },
  'Error': { color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: XCircle },
  'Disabled': { color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: XCircle },
};

const DISTRIBUTORS = [
  {
    name: 'Too Lost',
    selected: true,
    login_link: 'https://toolost.com',
    contact_email: 'support@toolost.com',
    notes: 'Primary distributor. Connect once through the official Too Lost authorization window. Base44 checks the connection every 30 seconds and securely renews an expiring access token with the refresh token.',
    features: ['Distribution to 450+ services', 'Royalty tracking', 'ISRC/UPC generation', 'Release scheduling', 'Spotify for Artists claim'],
  },
];

export default function Distributors() {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const {
    data: connectionStatus,
    error: statusError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['tooLostConnectionStatus'],
    queryFn: async () => {
      const res = await base44.functions.invoke('tooLostOAuth', { action: 'status' });
      return res.data;
    },
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    retry: false,
  });

  useEffect(() => {
    const refreshAfterLogin = (event) => {
      if (event.key === 'toolost_oauth_connected_at') refetch();
    };
    window.addEventListener('storage', refreshAfterLogin);
    return () => window.removeEventListener('storage', refreshAfterLogin);
  }, [refetch]);

  useEffect(() => {
    const refreshAfterPopup = (event) => {
      if (event.data?.type === 'toolost-oauth-complete') refetch();
    };
    window.addEventListener('message', refreshAfterPopup);
    return () => window.removeEventListener('message', refreshAfterPopup);
  }, [refetch]);

  const state = connectionStatus?.status || (statusError ? 'error' : 'checking');
  const connected = state === 'connected';
  const needsReconnect = state === 'reauthorise_required' || state === 'error';
  const notConfigured = state === 'not_configured';
  const checking = state === 'checking';

  const startConnect = async () => {
    const loginWindow = window.open('about:blank', 'toolost-oauth', 'popup,width=760,height=840');
    if (!loginWindow) {
      toast({
        title: 'Allow the Too Lost login window',
        description: 'Your browser blocked the secure login window. Allow pop-ups for this site and try again.',
        variant: 'destructive',
      });
      return;
    }

    setConnecting(true);
    try {
      const res = await base44.functions.invoke('tooLostOAuth', { action: 'authorize_url' });
      loginWindow.location.replace(res.data.url);
      setConnecting(false);

      const closedCheck = window.setInterval(() => {
        if (loginWindow.closed) {
          window.clearInterval(closedCheck);
          refetch();
        }
      }, 1000);
      window.setTimeout(() => window.clearInterval(closedCheck), 10 * 60 * 1000);
    } catch (err) {
      loginWindow.close();
      toast({
        title: 'Could not start the Too Lost connection',
        description: err?.response?.data?.error || err?.message || 'Unknown error',
        variant: 'destructive',
      });
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Distributor Hub</h1>
        <p className="text-muted-foreground text-sm mt-1 font-body">Music distribution partners and release sync management</p>
      </div>

      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Do-Not-Spend-Or-Lose Rule:</strong> No release is finally submitted, priced or published without Gannon's approval. Passwords and verification codes stay with Gannon.</p>
      </div>

      <div className="space-y-4">
        {DISTRIBUTORS.map(rawDist => {
          const offlineStatus = notConfigured ? 'Needs credentials' : needsReconnect ? 'Error' : checking ? 'Testing' : 'Not connected';
          const dist = {
            ...rawDist,
            catalog_status: connected ? 'Connected' : offlineStatus,
            release_status: connected ? 'Connected' : offlineStatus,
            royalty_status: connected ? 'Connected' : offlineStatus,
            sync_status: connected ? 'Live' : offlineStatus,
            next_action: connected
              ? 'Connected. Base44 checks every 30 seconds and renews the login automatically before it expires.'
              : notConfigured
                ? connectionStatus?.detail || 'Complete the Too Lost developer settings, then connect.'
                : needsReconnect
                  ? connectionStatus?.detail || 'Click Reconnect Too Lost to restore the connection.'
                  : checking
                    ? 'Checking the secure Too Lost connection now.'
                    : 'Click Connect Too Lost. Sign in in the separate official Too Lost window, then return here.',
          };
          const syncConfig = STATUS_CONFIG[dist.sync_status] || STATUS_CONFIG['Not connected'];
          const SyncIcon = syncConfig.icon;

          return (
            <Card key={dist.name} className={`${dist.selected ? 'border-primary/40' : 'border-border'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dist.selected ? 'bg-primary/10 border border-primary/30' : 'bg-secondary'}`}>
                      <Music className={`w-5 h-5 ${dist.selected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{dist.name}</CardTitle>
                        {dist.selected && <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">Selected</Badge>}
                      </div>
                      <a href={dist.login_link} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5">
                        {dist.login_link} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <Badge className={`text-xs border ${syncConfig.color}`}>
                    <SyncIcon className="w-3 h-3 mr-1" />
                    {dist.sync_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Catalog', status: dist.catalog_status },
                    { label: 'Releases', status: dist.release_status },
                    { label: 'Royalties', status: dist.royalty_status },
                  ].map(({ label, status }) => {
                    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Not connected'];
                    return (
                      <div key={label} className="border border-border rounded-lg p-3 text-center">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <Badge className={`text-xs border mt-1 ${cfg.color}`}>{status}</Badge>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {dist.features.map(feature => <Badge key={feature} variant="outline" className="text-xs">{feature}</Badge>)}
                  </div>
                </div>

                <div className="border border-border rounded-lg p-3 bg-card/50">
                  <p className="text-xs text-muted-foreground">{dist.notes}</p>
                </div>

                <div className="flex items-start gap-2 p-3 border border-primary/20 bg-primary/5 rounded-lg">
                  {connected ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-xs font-medium text-foreground">{connected ? 'Connection healthy' : 'Next Action Required'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{dist.next_action}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={startConnect} disabled={connecting} className="text-xs gradient-gold-button">
                    <Plug className="w-3 h-3 mr-1" />
                    {connecting ? 'Opening Too Lost...' : connected || needsReconnect ? 'Reconnect Too Lost' : 'Connect Too Lost'}
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => refetch()} disabled={isFetching}>
                    <RefreshCw className={`w-3 h-3 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
                    {isFetching ? 'Checking...' : 'Refresh status'}
                  </Button>
                  <a href={dist.login_link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-xs"><ExternalLink className="w-3 h-3 mr-1" />Open Portal</Button>
                  </a>
                  <a href={`mailto:${dist.contact_email}`}>
                    <Button size="sm" variant="ghost" className="text-xs">Contact Support</Button>
                  </a>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Status refreshes automatically every 30 seconds and whenever you return to this tab.
                  {connectionStatus?.last_refreshed_at ? ` Token last renewed ${new Date(connectionStatus.last_refreshed_at).toLocaleString('en-AU')}.` : ''}
                </p>
                {connected && connectionStatus?.connected_email && (
                  <p className="text-xs text-muted-foreground">Connected as {connectionStatus.connected_email}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/30">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-primary mb-2">One-button releases</p>
          <p className="text-xs text-muted-foreground mb-3">Upload a new song once and save its name, release date, artwork and lyrics to your admin. Too Lost delivery remains behind your final approval.</p>
          <Link to="/admin/new-release-studio">
            <Button size="sm" className="text-xs"><Rocket className="w-3 h-3 mr-1" />Open New Release Studio</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

