import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, AlertTriangle, CheckCircle2, Bot, User, Zap, Instagram, TrendingUp, Copy, Send, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CLASS_CONFIG = {
  general_positive: { label: 'Fan ❤️', color: 'bg-green-500/10 text-green-400' },
  general_negative: { label: 'Negative', color: 'bg-slate-500/10 text-slate-400' },
  important_fan: { label: 'Important Fan ⭐', color: 'bg-yellow-500/10 text-yellow-400' },
  business_opportunity: { label: '💼 Business', color: 'bg-blue-500/10 text-blue-400' },
  collaboration: { label: '🎵 Collab', color: 'bg-purple-500/10 text-purple-400' },
  media_press: { label: '📰 Press', color: 'bg-orange-500/10 text-orange-400' },
  troll_ignore: { label: 'Ignore', color: 'bg-zinc-500/10 text-zinc-500' },
  requires_gannon: { label: '🔔 Needs You', color: 'bg-red-500/10 text-red-400' },
};

export default function SocialMonitor() {
  const [loading, setLoading] = useState(false);
  const [triage, setTriage] = useState([]);
  const [platform, setPlatform] = useState('instagram');
  const [manualComments, setManualComments] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [ran, setRan] = useState(false);

  const { data: recentTriage = [] } = useQuery({
    queryKey: ['social-triage-history'],
    queryFn: () => base44.entities.KnowledgeVault.filter({ category: 'social_archive' }, '-created_date', 10),
  });

  const runTriage = async (simulate = true) => {
    setLoading(true);
    setTriage([]);
    try {
      let commentsPayload = [];
      if (!simulate && manualComments) {
        commentsPayload = manualComments.split('\n')
          .filter(l => l.trim())
          .map((text, i) => ({ id: `manual_${i}`, author: '@user', text: text.trim(), likes: 0 }));
      }
      const res = await base44.functions.invoke('socialCommentMonitor', {
        platform,
        simulate: simulate || commentsPayload.length === 0,
        comments: commentsPayload,
      });
      setTriage(res.data?.triage || []);
      setRan(true);
      toast.success(`Triaged ${res.data?.total || 0} comments — ${res.data?.escalated || 0} escalated to you`);
    } catch (err) {
      toast.error('Triage failed: ' + err.message);
    }
    setLoading(false);
  };

  const copyResponse = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Response copied to clipboard');
  };

  const escalated = triage.filter(t => t.escalate_to_gannon);
  const autoHandled = triage.filter(t => !t.escalate_to_gannon && t.classification !== 'troll_ignore');
  const ignored = triage.filter(t => t.classification === 'troll_ignore');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Social Comment Monitor</h1>
          <p className="text-muted-foreground text-sm">AI triage — auto-handles general comments, escalates what matters</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['instagram', 'tiktok', 'facebook', 'youtube'].map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${platform === p ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-300">Live Social Connection Required</p>
            <p className="text-xs text-muted-foreground mt-1">
              To monitor real comments, your Instagram/TikTok business accounts need to be connected via OAuth. 
              Until then, use the <strong className="text-foreground">Demo Mode</strong> below to see exactly how the AI triage works, 
              or paste comments manually. Contact your team to set up the Meta Business API credentials.
            </p>
          </div>
          <Badge className="bg-yellow-500/10 text-yellow-400 shrink-0">Demo Ready</Badge>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => runTriage(true)} disabled={loading} className="gradient-gold-button">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analysing...</> : <><Bot className="w-4 h-4 mr-2" /> Run Demo Triage</>}
        </Button>
        <Button variant="outline" onClick={() => setShowManual(!showManual)}>
          <MessageSquare className="w-4 h-4 mr-2" /> Paste Real Comments
        </Button>
      </div>

      {showManual && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">Paste one comment per line from your social platforms:</p>
            <Textarea
              placeholder="Paste comments here, one per line..."
              value={manualComments}
              onChange={e => setManualComments(e.target.value)}
              rows={5}
            />
            <Button onClick={() => runTriage(false)} disabled={loading || !manualComments} size="sm" className="gradient-gold-button">
              {loading ? 'Analysing...' : 'Triage These Comments'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {ran && triage.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-red-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{escalated.length}</p>
              <p className="text-xs text-muted-foreground">Needs Gannon</p>
            </CardContent>
          </Card>
          <Card className="border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{autoHandled.length}</p>
              <p className="text-xs text-muted-foreground">Bot Can Handle</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-zinc-400">{ignored.length}</p>
              <p className="text-xs text-muted-foreground">Ignored (Trolls)</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Escalated — Needs Gannon */}
      {escalated.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" /> Needs Your Attention ({escalated.length})
          </h2>
          <div className="space-y-3">
            {escalated.map((item, i) => (
              <Card key={i} className="border-red-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">{item.author}</span>
                        <Badge className={`text-xs ${CLASS_CONFIG[item.classification]?.color || 'bg-secondary text-secondary-foreground'}`}>
                          {CLASS_CONFIG[item.classification]?.label || item.classification}
                        </Badge>
                        <Badge className={`text-xs ${item.priority === 'high' || item.priority === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mb-2">"{item.text}"</p>
                      <p className="text-xs text-muted-foreground italic">{item.reason}</p>
                      {item.auto_response && (
                        <div className="mt-3 bg-secondary/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Suggested response:</p>
                          <p className="text-xs text-foreground">{item.auto_response}</p>
                          <Button size="sm" variant="ghost" className="mt-2 h-6 text-xs" onClick={() => copyResponse(item.auto_response)}>
                            <Copy className="w-3 h-3 mr-1" /> Copy
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Auto-handled */}
      {autoHandled.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Bot className="w-4 h-4 text-green-400" /> Bot Can Handle ({autoHandled.length})
          </h2>
          <div className="space-y-2">
            {autoHandled.map((item, i) => (
              <Card key={i} className="border-green-500/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{item.author}</span>
                        <Badge className={`text-xs ${CLASS_CONFIG[item.classification]?.color || 'bg-secondary text-secondary-foreground'}`}>
                          {CLASS_CONFIG[item.classification]?.label || item.classification}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">"{item.text}"</p>
                      {item.auto_response && (
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-green-400 flex-1">→ "{item.auto_response}"</p>
                          <Button size="sm" variant="ghost" className="h-6 text-xs shrink-0" onClick={() => copyResponse(item.auto_response)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Triage History */}
      {recentTriage.length > 0 && !ran && (
        <div>
          <h2 className="text-base font-semibold mb-3">Previous Triage Sessions</h2>
          <div className="space-y-2">
            {recentTriage.map(item => (
              <div key={item.id} className="border border-border rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.summary}</p>
                </div>
                <Badge className="bg-secondary text-secondary-foreground text-xs">archived</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {!ran && triage.length === 0 && recentTriage.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <Instagram className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Click "Run Demo Triage" to see the AI in action</p>
        </div>
      )}
    </div>
  );
}