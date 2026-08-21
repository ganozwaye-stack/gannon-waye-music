import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, CheckCircle2, Clock, Loader2, DollarSign, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LANE_LABEL = {
  grant: 'Grant',
  producer_collab: 'Producer Collab',
  label_outreach: 'Label Outreach',
  music_promo: 'Music Promo',
  web_build: 'Web Build',
  merch: 'Merch',
  booking: 'Booking',
  operations: 'Operations',
};

const LANE_ROUTES = {
  grant: '/admin/research-hub',
  producer_collab: '/admin/producer-directory',
  label_outreach: '/admin/distributors',
  music_promo: '/admin/release-promo-command',
  web_build: '/admin/website-ops',
  merch: '/admin/merch',
  booking: '/admin/communications-hub',
  operations: '/admin/operation-registry',
};

const RISK_STYLE = {
  low: 'text-green-400',
  medium: 'text-amber-400',
  high: 'text-red-400',
};

export default function DeegoRecommendations() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: actions = [], isLoading } = useQuery({
    queryKey: ['deego-recommendations'],
    queryFn: async () => base44.entities.AgentAction.filter({ status: 'needs_gannon_approval' }, '-created_date', 20),
    staleTime: 30_000,
  });

  const actMut = useMutation({
    mutationFn: async ({ id, status }) => base44.entities.AgentAction.update(id, { status }),
    onSuccess: () => qc.invalidateQueries(['deego-recommendations']),
  });

  const approve = (a) => {
    actMut.mutate({ id: a.id, status: 'approved' });
    toast({ title: 'Approved — Deego will proceed' });
  };
  const defer = (a) => {
    actMut.mutate({ id: a.id, status: 'draft' });
    toast({ title: 'Deferred back to draft' });
  };

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg text-foreground">Deego's Recommendations</h2>
        </div>
        <span className="font-body text-[11px] text-muted-foreground">{actions.length} awaiting your call</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : actions.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="font-body text-xs text-muted-foreground">Deego has no open recommendations right now. Everything's handled.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((a) => (
            <div key={a.id} className="rounded-xl bg-secondary/30 border border-border/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => navigate(LANE_ROUTES[a.lane] || '/admin/agent-task-log')}
                    className="text-left group/title"
                  >
                    <p className="font-body text-sm text-foreground font-semibold group-hover/title:text-primary transition-colors inline-flex items-center gap-1">
                      {a.title} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                    </p>
                  </button>
                  <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                    {LANE_LABEL[a.lane] || a.lane}{a.target_name ? ` · ${a.target_name}` : ''}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => approve(a)}
                  disabled={actMut.isPending}
                  className="gradient-gold-button border-0 shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </Button>
              </div>

              {a.draft_message && (
                <p className="font-body text-xs text-foreground/55 leading-relaxed line-clamp-3 mt-3">{a.draft_message}</p>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  {a.estimated_value_aud > 0 && (
                    <span className="flex items-center gap-1 font-body text-[11px] text-primary">
                      <DollarSign className="w-3 h-3" />${a.estimated_value_aud.toLocaleString()}
                    </span>
                  )}
                  {a.risk_level && (
                    <span className={`font-body text-[10px] uppercase tracking-wider ${RISK_STYLE[a.risk_level]}`}>
                      {a.risk_level} risk
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => defer(a)}
                  disabled={actMut.isPending}
                  className="text-muted-foreground hover:text-foreground h-7 px-2"
                >
                  <Clock className="w-3.5 h-3.5" /> Defer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}