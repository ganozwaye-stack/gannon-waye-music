import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  Lock, Calendar, Briefcase, RefreshCw, Send, AlertTriangle, 
  CheckCircle, ShieldCheck, DollarSign, ListTodo, Plus, Trash2, Edit2
} from 'lucide-react';

const PINNED_TASKS_DEFAULT = [
  { id: 1, text: 'Confirm eBay API Sandbox OAuth token validation status', done: true },
  { id: 2, text: 'Check Stripe checkout success callback redirection path', done: true },
  { id: 3, text: 'Audit Portugal voice memo files upload to memorial Drive folder', done: false },
  { id: 4, text: 'Verify Systems Manager lead form writing validation rules', done: false }
];

export default function OwnerBusinessHub() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Tonight tasks state
  const [tasks, setTasks] = useState(PINNED_TASKS_DEFAULT);
  const [newTaskText, setNewTaskText] = useState('');

  // Sourcing & Sourcing logs
  const [ebayStatus, setEbayStatus] = useState('Connected');
  const [aliexpressStatus, setAliexpressStatus] = useState('Active');

  // Fetch systems manager leads
  const { data: leads = [], isLoading: isLoadingLeads } = useQuery({
    queryKey: ['systems-leads'],
    queryFn: () => base44.entities.SystemsManagerLead.list('-created_date'),
    initialData: [],
  });

  // Mutate leads
  const updateLead = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SystemsManagerLead.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['systems-leads']);
      toast({ title: 'Lead Status Updated ✓' });
    }
  });

  const deleteLead = useMutation({
    mutationFn: (id) => base44.entities.SystemsManagerLead.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(['systems-leads']);
      toast({ title: 'Lead removed' });
    }
  });

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskText, done: false }]);
    setNewTaskText('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-red-400 font-semibold mb-1 flex items-center gap-1">
            <Lock className="w-3 h-3" /> PRIVATE OWNER PANEL
          </p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Owner Business Hub</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Gannon's private flightdeck: manage dropshipping routing, systems client leads, and "Tonight" operational tasks.
          </p>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-mono text-[10px]">OWNER SESSION</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/40 border border-border/40 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1.5 p-1 h-auto">
          <TabsTrigger value="overview" className="text-xs py-2"><ListTodo className="w-3.5 h-3.5 mr-1 text-primary" /> Tonight Tasks</TabsTrigger>
          <TabsTrigger value="leads" className="text-xs py-2"><Briefcase className="w-3.5 h-3.5 mr-1 text-yellow-400" /> Client Pipeline ({leads.length})</TabsTrigger>
          <TabsTrigger value="ganozmix" className="text-xs py-2"><DollarSign className="w-3.5 h-3.5 mr-1 text-green-400" /> Sourcing & eBay</TabsTrigger>
          <TabsTrigger value="quick-links" className="text-xs py-2"><Send className="w-3.5 h-3.5 mr-1" /> Quick Links</TabsTrigger>
        </TabsList>

        {/* ─── TAB: OVERVIEW & PINNED TONIGHT TASKS ────────────────────── */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-primary" /> Pinned "Tonight" Checklist Tasks
              </CardTitle>
              <CardDescription className="text-xs">Your immediate priority checklist for tonight. Mark items complete as you finalize them.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={newTaskText} 
                  onChange={e => setNewTaskText(e.target.value)} 
                  placeholder="Add a priority item..." 
                  className="bg-secondary/40 text-xs border-border/40"
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                />
                <Button onClick={addTask} size="sm" className="gradient-gold-button border-0 text-xs shrink-0">
                  <Plus className="w-4 h-4 mr-1" /> Add Task
                </Button>
              </div>

              <div className="space-y-2 border-t border-border/20 pt-4">
                {tasks.map(task => (
                  <div key={task.id} className="p-3 bg-secondary/20 rounded-xl border border-border/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={task.done} 
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded border-border bg-transparent text-primary focus:ring-0 cursor-pointer"
                      />
                      <span className={task.done ? 'line-through text-muted-foreground' : 'text-white'}>
                        {task.text}
                      </span>
                    </div>
                    <Badge className={task.done ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}>
                      {task.done ? 'Cleared' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB: SYSTEMS LEADS PIPELINE ────────────────────────────── */}
        <TabsContent value="leads" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white">Systems Manager Client Pipeline</CardTitle>
              <CardDescription className="text-xs">Leads submitted from the public systems portfolio page.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLeads ? (
                <div className="text-center py-6"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" /></div>
              ) : leads.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs">No client requests generated yet.</div>
              ) : (
                <div className="space-y-4">
                  {leads.map(lead => (
                    <div key={lead.id} className="p-4 bg-secondary/20 rounded-xl border border-border/30 space-y-3 text-xs">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <p className="font-bold text-white text-sm">{lead.name}</p>
                          <p className="text-[10px] text-muted-foreground">{lead.email} · Business: {lead.business_type}</p>
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <Badge className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 uppercase text-[9px]">{lead.urgency}</Badge>
                          <Badge className="bg-green-500/15 text-green-400 border border-green-500/20 text-[9px]">{lead.budget_range}</Badge>
                          <Select 
                            value={lead.proposal_status || 'received'} 
                            onValueChange={val => updateLead.mutate({ id: lead.id, data: { proposal_status: val } })}
                          >
                            <SelectTrigger className="h-7 text-[10px] w-28 border-border/40 bg-secondary"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="received">Received</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                              <SelectItem value="contract_signed">Signed</SelectItem>
                              <SelectItem value="rejected">Declined</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="p-2.5 bg-black/30 rounded border border-border/20">
                        <p className="font-bold text-white mb-1">Requested Automations / Problem Description:</p>
                        <p className="text-muted-foreground text-[11px] whitespace-pre-wrap">{lead.problem}</p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/10 pt-2">
                        <span>Submitted on {new Date(lead.created_date).toLocaleDateString()}</span>
                        <button onClick={() => deleteLead.mutate(lead.id)} className="hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB: GANOZMIX SOURCING ─────────────────────────────────── */}
        <TabsContent value="ganozmix" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border/40">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">Dropshipping Sourcing Operations</CardTitle>
                <CardDescription className="text-xs">Configure supplier links for GanozMix Direct.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-2">
                    <p className="font-bold text-white">eBay API Bridge</p>
                    <p className="text-muted-foreground">Marketplace: EBAY_AU</p>
                    <div className="flex justify-between items-center pt-2">
                      <span>Status: {ebayStatus}</span>
                      <Button variant="outline" size="sm" className="h-6 text-[10px] border-border/40" onClick={() => toast({ title: 'Refreshing connection...' })}>Test OAuth</Button>
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 space-y-2">
                    <p className="font-bold text-white">AliExpress Connector</p>
                    <p className="text-muted-foreground">Fulfillment: CJ Dropshipping API</p>
                    <div className="flex justify-between items-center pt-2">
                      <span>Status: {aliexpressStatus}</span>
                      <Button variant="outline" size="sm" className="h-6 text-[10px] border-border/40">Sync Catalog</Button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/30 pt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-xs space-y-1.5">
                  <p className="font-bold text-yellow-400 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Listing Safeguards active:</p>
                  <p>• Listing publishes require Gannon's explicit verification before going live to prevent billing anomalies.</p>
                  <p>• CJ inventory reconciliations run every 6 hours; listings with zero stock are automatically paused.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-secondary/10">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">Cross-Business switcher</CardTitle>
                <CardDescription className="text-xs">Instantly load connected databases.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button variant="outline" className="w-full text-xs text-left justify-start border-border/40" onClick={() => window.location.href = '/admin/ganozmix'}>
                  <DollarSign className="w-4 h-4 mr-2 text-primary" /> GanozMix Direct Dashboard
                </Button>
                <Button variant="outline" className="w-full text-xs text-left justify-start border-border/40" onClick={() => window.location.href = '/admin/procurement-command'}>
                  <Briefcase className="w-4 h-4 mr-2 text-primary" /> Procurement Command
                </Button>
                <Button variant="outline" className="w-full text-xs text-left justify-start border-border/40" onClick={() => window.location.href = '/admin/api-setup'}>
                  <CheckCircle className="w-4 h-4 mr-2 text-primary" /> Integration Diagnostics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB: QUICK LINKS ────────────────────────────────────────── */}
        <TabsContent value="quick-links" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Business Profile Settings', desc: 'Modify localized seller addresses.', link: '/admin/business-profile-settings' },
              { title: 'Procurement Console', desc: 'Process bulk orders to AliExpress.', link: '/admin/procurement-command' },
              { title: 'Business Process Command', desc: 'Review active workers state.', link: '/admin/business-process-command' }
            ].map(item => (
              <Card key={item.title} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => window.location.href = item.link}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                    {item.title} <Send className="w-3.5 h-3.5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
