import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Plus, Users, ChevronRight, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const STAGES = ['lead', 'discovery_call', 'proposal_sent', 'approved', 'in_build', 'testing', 'live', 'monthly_support'];
const PACKAGES = ['starter_ai', 'creator_ai', 'ecommerce_ai', 'premium_business_os', 'enterprise_command_centre'];

const STAGE_COLORS = {
  lead: 'bg-slate-500/10 text-slate-400',
  discovery_call: 'bg-blue-500/10 text-blue-400',
  proposal_sent: 'bg-purple-500/10 text-purple-400',
  approved: 'bg-yellow-500/10 text-yellow-400',
  in_build: 'bg-orange-500/10 text-orange-400',
  testing: 'bg-cyan-500/10 text-cyan-400',
  live: 'bg-green-500/10 text-green-400',
  monthly_support: 'bg-emerald-500/10 text-emerald-400',
};

export default function ClientInstalls() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filterStage, setFilterStage] = useState('all');
  const [form, setForm] = useState({ client_name: '', business_type: '', package_type: 'starter_ai', status: 'lead', setup_fee: '', monthly_retainer: '', next_action: '', notes: '' });

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['client-installs'],
    queryFn: () => base44.entities.ClientBlueprintInstall.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ClientBlueprintInstall.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['client-installs'] }); setShowForm(false); setForm({ client_name: '', business_type: '', package_type: 'starter_ai', status: 'lead', setup_fee: '', monthly_retainer: '', next_action: '', notes: '' }); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ClientBlueprintInstall.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['client-installs'] }),
  });

  const filtered = filterStage === 'all' ? clients : clients.filter(c => c.status === filterStage);

  const stageCounts = STAGES.reduce((acc, s) => ({ ...acc, [s]: clients.filter(c => c.status === s).length }), {});

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Client Installs</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">Blueprint installation tracker — private pipeline</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/blueprint-builder"><Button variant="outline">View Packages</Button></Link>
          <Button onClick={() => setShowForm(true)} className="gradient-gold-button border-0"><Plus className="w-4 h-4 mr-1" />Add Client</Button>
        </div>
      </div>

      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Do-Not-Spend-Or-Lose Rule:</strong> No contracts, payments, or commitments may be made without explicit approval. All client actions are tracked here.</p>
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {STAGES.map(s => (
          <button key={s} onClick={() => setFilterStage(filterStage === s ? 'all' : s)}
            className={`border rounded-lg p-2 text-center transition-all ${filterStage === s ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'}`}>
            <p className={`text-lg font-bold ${stageCounts[s] > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>{stageCounts[s]}</p>
            <p className="text-[9px] text-muted-foreground capitalize leading-tight">{s.replace('_', ' ')}</p>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No clients yet. Add your first client installation above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(client => (
            <Card key={client.id} className="hover:border-primary/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{client.client_name}</p>
                      <Badge className={`text-xs ${STAGE_COLORS[client.status] || ''}`}>{client.status?.replace('_', ' ')}</Badge>
                      {client.package_type && <Badge variant="outline" className="text-xs capitalize">{client.package_type.replace(/_/g, ' ')}</Badge>}
                    </div>
                    {client.business_type && <p className="text-xs text-muted-foreground mt-1">{client.business_type}</p>}
                    {client.next_action && <p className="text-xs text-primary mt-1">Next: {client.next_action}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    {client.setup_fee && <p className="text-sm font-medium text-green-400">${client.setup_fee?.toLocaleString()} setup</p>}
                    {client.monthly_retainer && <p className="text-xs text-muted-foreground">${client.monthly_retainer?.toLocaleString()}/mo</p>}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {STAGES.map(s => (
                    <button key={s} onClick={() => updateMutation.mutate({ id: client.id, data: { status: s } })}
                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${client.status === s ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Client Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Client</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Client Name *</Label><Input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} placeholder="Business or person name" /></div>
            <div><Label className="text-xs">Business Type</Label><Input value={form.business_type} onChange={e => setForm(f => ({ ...f, business_type: e.target.value }))} placeholder="e.g. Music artist, ecommerce store" /></div>
            <div>
              <Label className="text-xs">Package</Label>
              <Select value={form.package_type} onValueChange={v => setForm(f => ({ ...f, package_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PACKAGES.map(p => <SelectItem key={p} value={p}>{p.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">Setup Fee ($)</Label><Input type="number" value={form.setup_fee} onChange={e => setForm(f => ({ ...f, setup_fee: e.target.value }))} placeholder="0" /></div>
              <div><Label className="text-xs">Monthly ($)</Label><Input type="number" value={form.monthly_retainer} onChange={e => setForm(f => ({ ...f, monthly_retainer: e.target.value }))} placeholder="0" /></div>
            </div>
            <div><Label className="text-xs">Next Action</Label><Input value={form.next_action} onChange={e => setForm(f => ({ ...f, next_action: e.target.value }))} placeholder="What to do next..." /></div>
            <Button className="w-full gradient-gold-button border-0" onClick={() => createMutation.mutate({ ...form, setup_fee: Number(form.setup_fee) || undefined, monthly_retainer: Number(form.monthly_retainer) || undefined })} disabled={!form.client_name || createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Add Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}