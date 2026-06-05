import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Loader2, Copy, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const CAMPAIGN_TYPES = [
  { id: 'email_campaign', label: 'Email Campaign', requiresApproval: false, risk: 'low' },
  { id: 'organic_social', label: 'Organic Social Campaign', requiresApproval: false, risk: 'low' },
  { id: 'launch_plan', label: 'Launch Campaign Plan', requiresApproval: false, risk: 'low' },
  { id: 'pr_outreach', label: 'PR / Media Outreach', requiresApproval: true, risk: 'medium' },
  { id: 'collab_outreach', label: 'Collaboration Outreach', requiresApproval: true, risk: 'medium' },
  { id: 'paid_ads_draft', label: 'Paid Ads Draft', requiresApproval: true, risk: 'high', note: '⚠️ Requires approval before any spend' },
];

export default function MarketingCentre() {
  const [type, setType] = useState('email_campaign');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const qc = useQueryClient();

  const selectedType = CAMPAIGN_TYPES.find(t => t.id === type);

  const generate = async () => {
    if (!input.trim()) return;
    setGenerating(true);
    setResult(null);
    const prompts = {
      email_campaign: `Create a complete email marketing campaign for Gannon Waye. Context: ${input}\n\nInclude: subject line options (3), preview text, full email body, CTA, send timing recommendation. Brand tone: warm, authentic, fan-first. Organic only — no paid spend.`,
      organic_social: `Create an organic social media campaign plan for Gannon Waye. Context: ${input}\n\nInclude: content themes, post schedule (7 days), platform breakdown (TikTok/Instagram/Facebook), caption templates, hashtag strategy. Budget: $0 — organic only.`,
      launch_plan: `Create a complete launch campaign plan for Gannon Waye. Context: ${input}\n\nInclude: pre-launch, launch day, post-launch phases. Timeline, tasks, content, community activation, email sequence. Flag anything that would cost money as APPROVAL REQUIRED.`,
      pr_outreach: `Draft a PR/media outreach strategy and template messages for Gannon Waye. Context: ${input}\n\nInclude: target media outlets, pitch email template, press release draft, key talking points. Note: sending any of these requires approval.`,
      collab_outreach: `Draft a collaboration outreach plan for Gannon Waye. Context: ${input}\n\nInclude: ideal collaboration targets, outreach message templates, what to offer, boundaries. Note: any financial commitment requires approval.`,
      paid_ads_draft: `Draft a paid advertising strategy for Gannon Waye. Context: ${input}\n\n⚠️ DRAFT ONLY — DO NOT SPEND. Include: platform recommendation, audience targeting, ad copy options, budget suggestion, expected outcomes. This draft requires explicit approval before any money is spent.`,
    };
    const res = await base44.integrations.Core.InvokeLLM({ prompt: prompts[type] });
    setResult(res);
    if (selectedType.requiresApproval) {
      await base44.entities.ApprovalQueue.create({
        agent_name: 'Marketing Centre',
        action_title: `${selectedType.label}: ${input.substring(0,60)}`,
        action_description: `Marketing content generated that may require approval before action: ${input}`,
        risk_type: selectedType.risk === 'high' ? ['financial','ads'] : ['reputation'],
        risk_level: selectedType.risk,
        proposed_output: res.substring(0, 500),
        status: 'pending',
      });
      toast.warning('Added to Approval Queue — review before actioning');
    }
    setGenerating(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Marketing Centre</h1>
        <p className="text-muted-foreground text-sm">Campaigns, email, organic growth, PR — automatic where safe, approval required for spend</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {CAMPAIGN_TYPES.map(t => (
          <button key={t.id} onClick={() => setType(t.id)}
            className={`p-3 rounded-lg border text-left text-xs transition-all ${type === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{t.label}</span>
              {t.requiresApproval ? <AlertTriangle className="w-3 h-3 text-yellow-400" /> : <CheckCircle2 className="w-3 h-3 text-green-400" />}
            </div>
            {t.note && <p className="text-yellow-400">{t.note}</p>}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder={`Describe your ${selectedType?.label} goal or context...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
        />
        <div className="flex items-center gap-3">
          <Button onClick={generate} disabled={generating || !input.trim()} className="gradient-gold-button">
            {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Megaphone className="w-4 h-4 mr-2" /> Generate</>}
          </Button>
          {selectedType?.requiresApproval && (
            <Badge className="bg-yellow-500/10 text-yellow-400"><AlertTriangle className="w-3 h-3 mr-1" />Will require approval</Badge>
          )}
        </div>
      </div>

      {result && (
        <Card className="border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-indigo-500/10 text-indigo-400">{selectedType?.label}</Badge>
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied'); }}>
                <Copy className="w-3 h-3 mr-1" /> Copy
              </Button>
            </div>
            {selectedType?.requiresApproval && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded p-2 mb-3 text-xs text-yellow-400">
                ⚠️ This content has been added to the Approval Queue. Review before taking any action.
              </div>
            )}
            <ReactMarkdown className="text-sm prose prose-sm prose-invert max-w-none">
              {result}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}