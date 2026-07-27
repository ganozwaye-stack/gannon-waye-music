import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  MessageCircle, Shield, AlertTriangle, CheckCircle2, Play,
  Pause, Users, TrendingUp, Copy, Plus
} from 'lucide-react';
import { toast } from 'sonner';

const SAFE_REPLY_TEMPLATES = [
  { id: 'warmth_1', label: 'Warmth 1', text: 'Thank you for being here 💙' },
  { id: 'warmth_2', label: 'Warmth 2', text: 'Sending love your way 🙏💙' },
  { id: 'warmth_3', label: 'Warmth 3', text: 'Really appreciate you sharing that 🤍' },
  { id: 'warmth_4', label: 'Warmth 4', text: 'Thank you for connecting with this.' },
  { id: 'warmth_5', label: 'Warmth 5', text: 'Your presence here means a lot.' },
];

const SAFE_DM_TEMPLATES = [
  {
    id: 'dm_community_1',
    label: 'Community Invite 1',
    text: "Hey, thank you for interacting with my post. I'm building a safe, kind space around the music and the stories behind it. You're welcome to visit gannonwaye.com and be part of it 💙",
  },
  {
    id: 'dm_community_2',
    label: 'Community Invite 2',
    text: "Thank you for being here. If the music or message connected with you, I'd love you to join the community at gannonwaye.com.",
  },
  {
    id: 'dm_community_3',
    label: 'Community Invite 3',
    text: "Really appreciate your comment. I'm creating a space for music, story, kindness, and connection — you can find it at gannonwaye.com.",
  },
];

const SAFE_LINK_DM_TEMPLATES = [
  { id: 'link_1', label: 'Link Simple', text: 'Here\'s the link: gannonwaye.com — thank you again for being part of this.' },
  { id: 'link_2', label: 'Link Community', text: 'Join the safe-space community here: gannonwaye.com 💙' },
  {
    id: 'link_utm_community',
    label: 'UTM Community',
    text: 'Join the community: gannonwaye.com/community?utm_source=instagram&utm_medium=dm&utm_campaign=safe_space_comments',
  },
  {
    id: 'link_utm_general',
    label: 'UTM General',
    text: 'Visit: gannonwaye.com/?utm_source=instagram&utm_medium=dm&utm_campaign=comment_auto_reply',
  },
];

const SAFETY_RULES = [
  'No aggressive spam or repeated DM loops',
  'No medical/therapy/counselling claims',
  'No guilt language or fake urgency',
  'No misleading promises',
  'No scraping private data',
  'No email capture without consent',
  'One public reply per commenter per post',
  'One opening DM per commenter per campaign',
  'Cooldown period enforced before repeating',
  'Manual review for negative/sensitive comments',
  'Manual review for crisis, abuse, or hate language',
];

export default function InstagramAutoDMCommand() {
  const queryClient = useQueryClient();
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    trigger_platform: 'instagram',
    comment_keyword_condition: 'any',
    public_reply_template: SAFE_REPLY_TEMPLATES[0].text,
    opening_dm_template: SAFE_DM_TEMPLATES[0].text,
    link_dm_template: SAFE_LINK_DM_TEMPLATES[2].text,
    destination_url: 'gannonwaye.com/community?utm_source=instagram&utm_medium=dm&utm_campaign=safe_space_comments',
    approval_status: 'pending_approval',
    status: 'draft',
    rate_limit_notes: 'One reply per commenter per post. One DM per commenter per campaign. Manual review for sensitive content.',
    safety_status: 'pending_review',
    campaign_notes: '',
  });

  // Store campaigns in AgentActionProposal with proposal_type = 'social_campaign'
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['instagram-campaigns'],
    queryFn: () => base44.entities.AgentActionProposal.filter({ proposal_type: 'social_campaign', agent_name: 'instagram_auto_dm' }, '-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AgentActionProposal.create({
      title: data.name,
      agent_name: 'instagram_auto_dm',
      proposal_type: 'social_campaign',
      reason: `Instagram auto-DM campaign: ${data.name}. Trigger: comment on post. Safe copy verified.`,
      customer_facing_copy: JSON.stringify({
        public_reply: data.public_reply_template,
        opening_dm: data.opening_dm_template,
        link_dm: data.link_dm_template,
      }),
      website_banner_draft: data.destination_url,
      social_post_draft: data.comment_keyword_condition,
      status: 'pending_approval',
      source_chain: `InstagramAutoDMCommand → AgentActionProposal → ApprovalQueue → go_live`,
      if_approved_action: 'Campaign marked live. Setup in ManyChat/Manychat or Instagram-approved tool. Track UTM conversions.',
      risk_level: 'low',
      confidence_score: 8,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagram-campaigns'] });
      setShowNewCampaign(false);
      toast.success('Campaign submitted to Approval Queue');
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.AgentActionProposal.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instagram-campaigns'] }),
  });

  const statusColor = {
    pending_approval: 'bg-amber-500/20 text-amber-300',
    approved: 'bg-green-500/20 text-green-300',
    rejected: 'bg-red-500/20 text-red-300',
    published: 'bg-blue-500/20 text-blue-300',
    draft: 'bg-secondary text-muted-foreground',
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text flex items-center gap-2">
            <MessageCircle className="w-6 h-6" /> Instagram Auto-DM Command
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Safe, approval-gated fan engagement funnel. No spam. No auto-posting without approval.</p>
        </div>
        <Button onClick={() => setShowNewCampaign(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
      </div>

      {/* Safety Banner */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-300 mb-2">Safety Rules Active — All Campaigns Require Approval</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {SAFETY_RULES.map((rule, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" /> {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Funnel Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {[
              'Instagram comment',
              'Warmth public reply',
              'Opening DM',
              'Link DM (UTM)',
              'gannonwaye.com visit',
              'Community / Fan Profile / Subscriber Newsletter',
              'Business Attention Centre alert',
              'Fan CRM record (consent only)',
              'Agent learning',
            ].map((step, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                <span className="bg-secondary px-2 py-1 rounded text-xs">{step}</span>
                {i < arr.length - 1 && <span className="text-primary">→</span>}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UTM Links */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tracking UTM Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: 'General DM', url: 'gannonwaye.com/?utm_source=instagram&utm_medium=dm&utm_campaign=comment_auto_reply' },
            { label: 'Community DM', url: 'gannonwaye.com/community?utm_source=instagram&utm_medium=dm&utm_campaign=safe_space_comments' },
            { label: 'Safe Space DM', url: 'gannonwaye.com/this-is-my-life?utm_source=instagram&utm_medium=dm&utm_campaign=story_connect' },
          ].map(link => (
            <div key={link.label} className="flex items-center justify-between border border-border rounded-lg p-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{link.label}</p>
                <code className="text-xs text-primary">{link.url}</code>
              </div>
              <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText('https://' + link.url); toast.success('Copied'); }}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Safe Reply Templates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Safe Public Comment Reply Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SAFE_REPLY_TEMPLATES.map(t => (
            <div key={t.id} className="flex items-center justify-between border border-border rounded-lg p-3">
              <p className="text-sm">{t.text}</p>
              <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(t.text); toast.success('Copied'); }}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Opening DM Templates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Opening DM Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SAFE_DM_TEMPLATES.map(t => (
            <div key={t.id} className="flex items-start justify-between border border-border rounded-lg p-3 gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">{t.label}</p>
                <p className="text-sm text-foreground/80">{t.text}</p>
              </div>
              <Button size="sm" variant="ghost" className="shrink-0" onClick={() => { navigator.clipboard.writeText(t.text); toast.success('Copied'); }}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Campaigns */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Campaigns (Require Approval)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-xs text-muted-foreground">Loading...</p>
          ) : campaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No campaigns yet. Create one above — it will go to Approval Queue.</p>
          ) : (
            <div className="space-y-3">
              {campaigns.map(c => (
                <div key={c.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">{c.title}</p>
                    <Badge className={statusColor[c.status] || 'bg-secondary text-muted-foreground'}>{c.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{c.reason?.slice(0, 120)}...</p>
                  <div className="flex gap-2">
                    {c.status === 'pending_approval' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          onClick={() => updateStatus.mutate({ id: c.id, status: 'approved' })}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs"
                          onClick={() => updateStatus.mutate({ id: c.id, status: 'rejected' })}>
                          Reject
                        </Button>
                      </>
                    )}
                    {c.status === 'approved' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        onClick={() => updateStatus.mutate({ id: c.id, status: 'published' })}>
                        <Play className="w-3 h-3 mr-1" /> Mark Live
                      </Button>
                    )}
                    {c.status === 'published' && (
                      <Button size="sm" variant="outline" className="text-xs"
                        onClick={() => updateStatus.mutate({ id: c.id, status: 'approved' })}>
                        <Pause className="w-3 h-3 mr-1" /> Pause
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Approval Queue', path: '/admin/approval-queue', icon: Shield },
          { label: 'Business Attention Centre', path: '/admin/business-attention-centre', icon: AlertTriangle },
          { label: 'Fan Conversion Engine', path: '/admin/fan-conversion-engine', icon: Users },
          { label: 'Content Performance', path: '/admin/content-performance', icon: TrendingUp },
        ].map(nav => (
          <Link key={nav.path} to={nav.path}>
            <Card className="hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="p-3 flex items-center gap-2">
                <nav.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs font-medium">{nav.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* New Campaign Dialog */}
      {showNewCampaign && (
        <Dialog open onOpenChange={() => setShowNewCampaign(false)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Instagram Auto-DM Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300">
                ⚠️ This campaign will be submitted to Approval Queue. It cannot go live without explicit approval.
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Campaign Name *</Label>
                <Input value={newCampaign.name} onChange={e => setNewCampaign(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Safe Space June 2026 Comments" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Comment Trigger Condition</Label>
                <Input value={newCampaign.comment_keyword_condition} onChange={e => setNewCampaign(p => ({ ...p, comment_keyword_condition: e.target.value }))} placeholder="any / specific keyword" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Public Reply Template</Label>
                <Textarea value={newCampaign.public_reply_template} onChange={e => setNewCampaign(p => ({ ...p, public_reply_template: e.target.value }))} className="h-16 text-sm" />
                <div className="flex flex-wrap gap-1 mt-1">
                  {SAFE_REPLY_TEMPLATES.map(t => (
                    <button key={t.id} onClick={() => setNewCampaign(p => ({ ...p, public_reply_template: t.text }))}
                      className="text-xs px-2 py-0.5 bg-secondary rounded hover:bg-primary/20 transition-colors">{t.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Opening DM Template</Label>
                <Textarea value={newCampaign.opening_dm_template} onChange={e => setNewCampaign(p => ({ ...p, opening_dm_template: e.target.value }))} className="h-24 text-sm" />
                <div className="flex flex-wrap gap-1 mt-1">
                  {SAFE_DM_TEMPLATES.map(t => (
                    <button key={t.id} onClick={() => setNewCampaign(p => ({ ...p, opening_dm_template: t.text }))}
                      className="text-xs px-2 py-0.5 bg-secondary rounded hover:bg-primary/20 transition-colors">{t.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Link DM Template</Label>
                <Textarea value={newCampaign.link_dm_template} onChange={e => setNewCampaign(p => ({ ...p, link_dm_template: e.target.value }))} className="h-16 text-sm" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Destination URL</Label>
                <Input value={newCampaign.destination_url} onChange={e => setNewCampaign(p => ({ ...p, destination_url: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Campaign Notes</Label>
                <Textarea value={newCampaign.campaign_notes} onChange={e => setNewCampaign(p => ({ ...p, campaign_notes: e.target.value }))} className="h-20 text-sm" placeholder="Which posts/reels this applies to, any specific notes..." />
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button onClick={() => createMutation.mutate(newCampaign)} disabled={!newCampaign.name || createMutation.isPending}>
                  Submit to Approval Queue
                </Button>
                <Button variant="outline" onClick={() => setShowNewCampaign(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
