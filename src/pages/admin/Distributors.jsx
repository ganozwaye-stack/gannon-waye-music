import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink, CheckCircle2, AlertTriangle, Clock, XCircle, Music, Rocket, Plug } from 'lucide-react';

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
    name: 'Toolost',
    selected: true,
    login_link: 'https://toolost.com',
    contact_email: 'support@toolost.com',
    catalog_status: 'Not connected',
    release_status: 'Not connected',
    royalty_status: 'Not connected',
    sync_status: 'Not connected',
    notes: 'Primary distributor. Connect once with your Too Lost login — the app keeps its own connection and renews it automatically, so no API token is ever stored. Once connected, new releases sync automatically when submitted from the New Release Studio.',
    next_action: 'Connect your Too Lost account below to enable release sync',
    features: ['Distribution to 150+ DSPs', 'Royalty tracking', 'ISRC/UPC generation', 'Release scheduling', 'Spotify for Artists claim'],
  },
];

export default function Distributors() {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const { data: connection } = useQuery({
    queryKey: ['tooLostConnection'],
    queryFn: () => base44.entities.TooLostConnection.filter({}),
    staleTime: 60_000,
  });
  const connected = Array.isArray(connection) && connection.length > 0;

  const startConnect = async () => {
    setConnecting(true);
    try {
      const res = await base44.functions.invoke('tooLostOAuth', { action: 'authorize_url' });
      sessionStorage.setItem('toolost_oauth_state', res.data.state);
      window.location.href = res.data.url;
    } catch (err) {
      toast({
        title: 'Could not start the connection',
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
        <p className="text-yellow-300 text-xs"><strong>Do-Not-Spend-Or-Lose Rule:</strong> No releases may be submitted, priced, or published automatically. All distribution actions require manual approval. Credentials must be provided by the account owner.</p>
      </div>

      <div className="space-y-4">
        {DISTRIBUTORS.map(rawDist => {
          const dist = connected
            ? {
                ...rawDist,
                catalog_status: 'Connected',
                release_status: 'Live',
                royalty_status: 'Connected',
                sync_status: 'Live',
                next_action: 'All set — upload releases through the New Release Studio',
              }
            : rawDist;
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
                {/* Status grid */}
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

                {/* Features */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {dist.features.map(f => <Badge key={f} variant="outline" className="text-xs">{f}</Badge>)}
                  </div>
                </div>

                {/* Notes */}
                <div className="border border-border rounded-lg p-3 bg-card/50">
                  <p className="text-xs text-muted-foreground">{dist.notes}</p>
                </div>

                {/* Next action */}
                <div className="flex items-start gap-2 p-3 border border-primary/20 bg-primary/5 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Next Action Required</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{dist.next_action}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={startConnect} disabled={connecting} className="text-xs gradient-gold-button">
                    <Plug className="w-3 h-3 mr-1" />
                    {connecting ? 'Opening Too Lost…' : connected ? 'Reconnect Too Lost' : 'Connect Too Lost'}
                  </Button>
                  <a href={dist.login_link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-xs"><ExternalLink className="w-3 h-3 mr-1" />Open Portal</Button>
                  </a>
                  <a href={`mailto:${dist.contact_email}`}>
                    <Button size="sm" variant="ghost" className="text-xs">Contact Support</Button>
                  </a>
                </div>
                {connected && connection[0]?.connected_email && (
                  <p className="text-xs text-muted-foreground">Connected as {connection[0].connected_email}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* New Release Studio */}
      <Card className="border-primary/30">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-primary mb-2">🚀 One-button releases</p>
          <p className="text-xs text-muted-foreground mb-3">Upload a new song once — name, release date, artwork and lyrics — and it saves to your admin, syncs to Too Lost, schedules the site to update on release day, and creates your press release and playlist pitch drafts.</p>
          <Link to="/admin/new-release-studio">
            <Button size="sm" className="text-xs"><Rocket className="w-3 h-3 mr-1" />Open New Release Studio</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}