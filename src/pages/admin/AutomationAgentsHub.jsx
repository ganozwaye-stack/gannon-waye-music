import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Database, RefreshCw, Send, Terminal, Network, PlayCircle } from 'lucide-react';

const LOCAL_AGENTS = [
  { name: 'Music Orchestrator', role: 'Coordinates song releases, streaming links and campaign timelines.', status: 'Idle', accuracy: '98%' },
  { name: 'Release Launch Agent', role: 'Validates TikTok / Instagram schedules and posts details.', status: 'Idle', accuracy: '95%' },
  { name: 'Fan Engagement Agent', role: 'Tracks email registrations, signups, and thank you queues.', status: 'Running', accuracy: '94%' },
  { name: 'Merch Sales Agent', role: 'Attributes promo coupon usage and logs order margins.', status: 'Idle', accuracy: '97%' }
];

export default function AutomationAgentsHub() {
  const [activeTab, setActiveTab] = useState('registry');

  // Fetch Knowledge Vault logs (category: 'creative' or 'story' or 'system')
  const { data: vaultItems = [], isLoading: isLoadingVault } = useQuery({
    queryKey: ['knowledge-vault-hub'],
    queryFn: () => base44.entities.KnowledgeVault.list('-created_date'),
    initialData: [],
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Agent Infrastructure</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Automation & Agents Hub</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Coordinate local artificial intelligence units, message bus event lines, and the shared knowledge vault.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/40 border border-border/40 grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1 h-auto">
          <TabsTrigger value="registry" className="text-xs py-2"><Brain className="w-3.5 h-3.5 mr-1 text-primary" /> Agent Registry</TabsTrigger>
          <TabsTrigger value="message-bus" className="text-xs py-2"><Network className="w-3.5 h-3.5 mr-1 text-yellow-400" /> Message Bus</TabsTrigger>
          <TabsTrigger value="vault" className="text-xs py-2"><Database className="w-3.5 h-3.5 mr-1 text-green-400" /> Knowledge Vault</TabsTrigger>
          <TabsTrigger value="quick-links" className="text-xs py-2"><Send className="w-3.5 h-3.5 mr-1" /> Quick Links</TabsTrigger>
        </TabsList>

        {/* ─── TAB: REGISTRY ─────────────────────────────────────────── */}
        <TabsContent value="registry" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LOCAL_AGENTS.map(agent => (
              <Card key={agent.name} className="border-border/40 hover:border-primary/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-primary" /> {agent.name}
                    </CardTitle>
                    <Badge className={agent.status === 'Running' ? 'bg-green-500/10 text-green-400' : 'bg-secondary text-muted-foreground'}>
                      {agent.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-1">{agent.role}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                  <span>Accuracy: {agent.accuracy}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-primary hover:bg-primary/10">
                    <PlayCircle className="w-3.5 h-3.5" /> Invoke Agent
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── TAB: MESSAGE BUS ──────────────────────────────────────── */}
        <TabsContent value="message-bus" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-yellow-400" /> Agent Message Bus Logs
              </CardTitle>
              <CardDescription className="text-xs">Incoming event-driven logs indicating broker messaging routing actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 bg-black/40 border border-border/30 rounded-xl space-y-2 font-mono text-[10px] text-muted-foreground h-64 overflow-y-auto">
                <p className="text-green-400">[2026-06-03 23:12:00] [Broker] Event ORDER_CREATED received for Customer Gannon.</p>
                <p className="text-blue-400">[2026-06-03 23:12:02] [Orchestrator] Dispatched tasks to Merch Sales Agent and Email Agent.</p>
                <p className="text-green-400">[2026-06-03 23:12:05] [Email Agent] Drafted WELCOME_NEWSLETTER for recipient.</p>
                <p className="text-green-400">[2026-06-03 23:15:30] [Broker] Event METRICOOL_QUEUE_SYNC dispatched. 0 items failed.</p>
                <p className="text-yellow-400">[2026-06-03 23:20:00] [Broker] Scheduled cron check: Expired eBay listings sync. Completed with status: OK.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB: KNOWLEDGE VAULT ──────────────────────────────────── */}
        <TabsContent value="vault" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" /> Knowledge Vault Index
              </CardTitle>
              <CardDescription className="text-xs">Context guidelines, Portuguese letter translations, and prompts loaded in memory.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingVault ? (
                <div className="text-center py-6"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" /></div>
              ) : vaultItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs">No context templates saved.</div>
              ) : (
                <div className="space-y-3">
                  {vaultItems.slice(0, 10).map(item => (
                    <div key={item.id} className="p-3 bg-secondary/30 rounded-xl border border-border/40 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground">{item.summary}</p>
                      </div>
                      <Badge className="bg-primary/15 text-primary border border-primary/30 capitalize">{item.category}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB: QUICK LINKS ────────────────────────────────────────── */}
        <TabsContent value="quick-links" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Agent Registry Page', desc: 'Inspect core code schemas for AI agents.', link: '/admin/agent-registry' },
              { title: 'Orchestrator AI Chat', desc: 'Chat directly with your main coordinating LLM.', link: '/admin/orchestrator-chat' },
              { title: 'Research Vault Hub', desc: 'Manage loaded research vectors.', link: '/admin/research-hub' },
              { title: 'Agent Message Bus Monitor', desc: 'Raw event data pipeline logs.', link: '/admin/agent-message-bus' },
              { title: 'Agent Task Logger', desc: 'View chronological audit trails of agent tasks.', link: '/admin/agent-task-log' },
              { title: 'Agent Capability Matrix', desc: 'Configure tool availability maps.', link: '/admin/agent-capability-matrix' }
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
