import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Lightbulb, TrendingUp, Loader2 } from 'lucide-react';

const SCORE_COLOR = (n) => (n >= 75 ? 'text-green-400' : n >= 50 ? 'text-primary' : 'text-muted-foreground');

export default function DeegoProspects() {
  const { data: ideas = [], isLoading } = useQuery({
    queryKey: ['deego-prospects'],
    queryFn: async () => {
      const all = await base44.entities.IdeaOpportunity.list('-created_date', 30);
      return all.filter((i) => ['new', 'reviewing'].includes(i.status)).slice(0, 6);
    },
    staleTime: 60_000,
  });

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg text-foreground">Future Prospects &amp; Ideas</h2>
        </div>
        <Link to="/admin/ideas-engine" className="font-body text-[11px] text-primary hover:underline">All ideas →</Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : ideas.length === 0 ? (
        <p className="font-body text-xs text-muted-foreground text-center py-6">No prospects queued. Deego will surface them as they're scouted.</p>
      ) : (
        <div className="space-y-2.5">
          {ideas.map((i) => (
            <Link
              key={i.id}
              to="/admin/ideas-engine"
              className="block rounded-xl bg-secondary/20 border border-border/30 p-3 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-body text-sm text-foreground font-medium truncate">{i.title}</p>
                  <p className="font-body text-[11px] text-muted-foreground mt-0.5">{i.category}{i.target_customer ? ` · ${i.target_customer}` : ''}</p>
                </div>
                {i.opportunity_score > 0 && (
                  <span className={`flex items-center gap-1 font-body text-xs font-semibold ${SCORE_COLOR(i.opportunity_score)} flex-shrink-0`}>
                    <TrendingUp className="w-3 h-3" />{i.opportunity_score}
                  </span>
                )}
              </div>
              {i.recommended_next_step && (
                <p className="font-body text-[11px] text-foreground/55 mt-1.5 line-clamp-2">{i.recommended_next_step}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}