import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink, CheckCircle2, AlertTriangle, Clock, XCircle, Music } from 'lucide-react';

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
    sync_status: 'Needs credentials',
    notes: 'Selected primary distributor. Requires account credentials to connect. Once connected: sync release catalog, configure royalty splits, set up ISRC codes.',
    next_action: 'Provide Toolost account login credentials to enable sync',
    features: ['Distribution to 150+ DSPs', 'Royalty tracking', 'ISRC/UPC generation', 'Release scheduling', 'Spotify for Artists claim'],
  },
  {
    name: 'TuneCore',
    selected: false,
    login_link: 'https://www.tunecore.com',
    contact_email: 'support@tunecore.com',
    catalog_status: 'Needs credentials',
    release_status: 'Needs credentials',
    royalty_status: 'Needs credentials',
    sync_status: 'Needs credentials',
    notes: 'Secondary distributor option. Integration exists via syncTunecore backend function. Requires TuneCore API credentials.',
    next_action: 'Configure TUNECORE_API_KEY secret to enable sync',
    features: ['Distribution to 150+ DSPs', 'Social media monetization', 'YouTube Content ID', 'Annual fee model'],
  },
];

export default function Distributors() {
  const [selectedDist, setSelectedDist] = useState(null);

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
        {DISTRIBUTORS.map(dist => {
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

                <div className="flex gap-2">
                  <a href={dist.login_link} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-xs"><ExternalLink className="w-3 h-3 mr-1" />Open Portal</Button>
                  </a>
                  <a href={`mailto:${dist.contact_email}`}>
                    <Button size="sm" variant="ghost" className="text-xs">Contact Support</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Credentials reminder */}
      <Card className="border-yellow-500/20">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-yellow-400 mb-2">🔑 Credentials Required</p>
          <p className="text-xs text-muted-foreground">To activate Toolost sync: provide your Toolost account email and API key via Settings → Environment Variables → add <code className="text-primary bg-primary/10 px-1 rounded">TOOLOST_API_KEY</code>. Contact Toolost support if you don't have an API key yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}