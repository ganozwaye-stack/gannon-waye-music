import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Loader2, Star, AlertTriangle, CheckCircle2, Sparkles, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

const AUDIT_AREAS = [
  { id: 'public_pages', label: 'Public Pages', desc: 'Home, Store, Music, Community, Contact' },
  { id: 'checkout_flow', label: 'Checkout & Payments', desc: 'Store checkout, cart, confirmation' },
  { id: 'admin_dashboards', label: 'Admin Dashboards', desc: 'All /admin/* pages' },
  { id: 'mastering_tool', label: 'Mastering Tool', desc: '/mastering — upload, profile, output' },
  { id: 'mobile_experience', label: 'Mobile Experience', desc: 'Responsive design, touch UX, navigation' },
  { id: 'trust_signals', label: 'Trust & Social Proof', desc: 'Reviews, testimonials, guarantees' },
  { id: 'cta_clarity', label: 'CTAs & Conversion', desc: 'Button copy, placement, urgency' },
  { id: 'luxury_feel', label: 'Luxury & Premium Feel', desc: 'Typography, spacing, motion, polish' },
];

const PRIORITY_COLORS = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

const FULL_AUDIT_PROMPT = `You are a world-class premium UX auditor specializing in luxury digital experiences for music artists, creators, and premium brands. You have expertise in editorial design, cinematic UI, Apple-level clarity, and high-converting ecommerce.

Audit the following system: A music artist's platform (Gannon Waye) that includes:
- Public website: Home, Music, Store, Community, Videos, Contact, Bookings, Mastering
- Admin OS: Command Centre, Agent Registry, Approval Queue, Knowledge Vault, Ideas Engine, Executive Feed, Ecommerce Intelligence
- Products: CD singles, apparel, accessories
- Features: Fan community, supporter system, mastering tool, booking enquiries

Generate a comprehensive premium UX audit covering:
1. Basic/weak screens that need cinematic upgrade
2. Conversion flow issues (dead ends, weak CTAs, abandoned paths)
3. Missing trust signals and social proof
4. Mobile experience gaps
5. Luxury feel improvements (typography, spacing, motion, editorial quality)
6. Onboarding clarity issues
7. Missing emotional connection moments
8. Admin UX clarity and workflow efficiency

For each issue found, provide:
- ISSUE: Clear name
- AREA: Which page/section
- WHY IT MATTERS: Business/UX impact
- PREMIUM FIX: Specific cinematic/luxury solution
- PRIORITY: critical/high/medium/low
- ESTIMATED IMPACT: Revenue/retention/trust improvement
- REQUIRES APPROVAL: yes/no (yes only if it touches public pricing, payment, legal content)

Format as a numbered list. Be specific and actionable. Aim for 15-20 high-quality audit items.`;

export default function PremiumUX() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  const runAudit = async () => {
    setLoading(true);
    setAuditResult('');
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: FULL_AUDIT_PROMPT,
        add_context_from_internet: false,
        model: 'claude_sonnet_4_6',
      });
      setAuditResult(result);
      // Save to vault
      await base44.entities.KnowledgeVault.create({
        title: `Premium UX Audit — ${new Date().toLocaleDateString('en-AU')}`,
        category: 'research',
        content: result,
        summary: 'AI-generated premium UX audit covering all platform areas',
        source: 'Premium UX Audit Agent',
        access_level: 'admin_only',
        tags: ['ux-audit', 'premium', 'design'],
      });
      toast({ title: 'Audit saved to Knowledge Vault' });
    } catch (err) {
      toast({ title: 'Audit failed', description: err?.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const copyAudit = () => {
    navigator.clipboard.writeText(auditResult);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Premium UX Audit</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">AI-powered luxury experience audit across all platform areas</p>
        </div>
        <Button onClick={runAudit} disabled={loading} className="gradient-gold-button border-0">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Auditing...</> : <><Sparkles className="w-4 h-4 mr-2" />Run Full Audit</>}
        </Button>
      </div>

      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Do-Not-Spend-Or-Lose Rule: ACTIVE</strong> — UX fixes are suggestions only. Anything touching public pricing, payment flows, or legal content requires approval before implementation.</p>
      </div>

      {/* Coverage areas */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Audit Coverage</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {AUDIT_AREAS.map(area => (
            <div key={area.id} className="border border-border rounded-lg p-3">
              <p className="text-sm font-medium">{area.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{area.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Design direction */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4 text-primary" />Design Direction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {['Cinematic', 'Editorial', 'Luxury Dark', 'Apple Clarity', 'Smooth Motion'].map(d => (
              <div key={d} className="border border-primary/20 bg-primary/5 rounded-lg p-2 text-center">
                <p className="text-xs text-primary font-medium">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">All fixes should achieve Krea/Magnific-level polish. No clutter. Every element intentional.</p>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Running deep UX audit across all platform areas...</p>
            <p className="text-xs text-muted-foreground mt-1">Using Claude Sonnet for higher quality analysis</p>
          </CardContent>
        </Card>
      )}

      {auditResult && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" />Audit Results</CardTitle>
              <Button size="sm" variant="ghost" onClick={copyAudit}><Copy className="w-4 h-4 mr-1" />Copy</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{auditResult}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {!auditResult && !loading && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No audit run yet.</p>
          <p className="text-sm text-muted-foreground">Click "Run Full Audit" to generate a comprehensive premium UX analysis.</p>
        </div>
      )}
    </div>
  );
}