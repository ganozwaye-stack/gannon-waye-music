// @ts-nocheck
import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Loader2, Copy, AlertTriangle, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const WEBSITE_TOOLS = [
  { id: 'seo_audit', label: 'SEO Audit', auto: true },
  { id: 'copy_improve', label: 'Copy Improvement', auto: true },
  { id: 'landing_page', label: 'Landing Page Draft', auto: true },
  { id: 'broken_link', label: 'Link Check Plan', auto: true },
  { id: 'site_audit', label: 'Site Audit Report', auto: true },
  { id: 'publish_plan', label: 'Major Change Plan', auto: false, note: '⚠️ Publishing requires approval' },
];

export default function WebsiteOps() {
  const [tool, setTool] = useState('seo_audit');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);

  const selectedTool = WEBSITE_TOOLS.find(t => t.id === tool);

  const generate = async () => {
    setGenerating(true);
    setResult(null);
    const prompts = {
      seo_audit: `Perform an SEO audit for Gannon Waye's artist website. Context: ${input || 'Artist website with pages: Home, Music/Store/Community/Videos/About/Contact/Back-This/Bookings'}.\n\nProvide: keyword opportunities, meta description improvements, content gaps, page speed recommendations, local SEO (Australian artist), schema markup suggestions. Organic only.`,
      copy_improve: `Improve the following website copy for Gannon Waye's artist website. Brand tone: authentic, warm, emotionally honest, safe-space. Copy to improve: ${input}\n\nProvide 3 improved versions with explanation of changes.`,
      landing_page: `Create a draft landing page for Gannon Waye. Purpose: ${input || 'New single Thank You release'}.\n\nInclude: headline, subheadline, hero copy, key sections, CTAs, trust signals. Brand tone: authentic, warm, fan-first.`,
      broken_link: `Create a broken link audit checklist for an artist website with these sections: ${input || 'Home, Music, Store, Community, Videos, About, Contact, Back-This, Bookings, Privacy Policy, Terms of Service'}.\n\nList all links to check, internal navigation, external links, social links, streaming links, payment links.`,
      site_audit: `Perform a website audit for Gannon Waye's artist website. Context: ${input || 'Full artist platform'}.\n\nCheck: user experience, conversion paths, content quality, navigation clarity, mobile experience, loading speed factors, trust signals, safety signals, call-to-actions. Provide priority improvements.`,
      publish_plan: `Create a safe publishing plan for this website change: ${input}\n\nInclude: what changes, impact assessment, rollback plan, testing steps, approval checklist. Flag any risk as REQUIRES APPROVAL.`,
    };
    const res = await base44.integrations.Core.InvokeLLM({ prompt: prompts[tool] });
    setResult(res);
    if (!selectedTool.auto) {
      await base44.entities.ApprovalQueue.create({
        agent_name: 'Website Ops',
        action_title: `Website change plan: ${input?.substring(0, 60) || 'Major change'}`,
        action_description: 'Website publishing plan generated — requires approval before going live',
        risk_type: ['reputation', 'publishing'],
        risk_level: 'medium',
        proposed_output: res.substring(0, 500),
        status: 'pending',
      });
      toast.warning('Added to Approval Queue — approve before publishing');
    }
    setGenerating(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Website Ops</h1>
        <p className="text-muted-foreground text-sm">SEO, copy, audits, landing pages — automatic where safe</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {WEBSITE_TOOLS.map(t => (
          <button key={t.id} onClick={() => setTool(t.id)}
            className={`p-3 rounded-lg border text-xs text-left transition-all ${tool === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{t.label}</span>
              {t.auto ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <AlertTriangle className="w-3 h-3 text-yellow-400" />}
            </div>
            {t.note && <p className="text-yellow-400 text-xs">{t.note}</p>}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder={`Context for ${selectedTool?.label}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
        />
        <Button onClick={generate} disabled={generating} className="gradient-gold-button">
          {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running...</> : <><Globe className="w-4 h-4 mr-2" />Run {selectedTool?.label}</>}
        </Button>
      </div>

      {result && (
        <Card className="border-lime-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-lime-500/10 text-lime-400">{selectedTool?.label}</Badge>
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied'); }}>
                <Copy className="w-3 h-3 mr-1" /> Copy
              </Button>
            </div>
            <ReactMarkdown className="text-sm prose prose-sm prose-invert max-w-none">{result}</ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
}