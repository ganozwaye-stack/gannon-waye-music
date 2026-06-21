import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { EyeOff, Eye } from 'lucide-react';

const CTA_COPY_MAP = {
  'Coaching Enquiry Page': ['Ask about coaching', 'Speak with Gannon', 'Book a coaching call'],
  'Contact Page': ['Speak with Gannon', 'Call us', 'Business enquiry'],
  'Press Page': ['Press and booking enquiry', 'Media enquiry', 'Speak with Gannon'],
  'Store Support': ['Store support', 'Order help', 'Speak with us'],
  'GanozMix Direct Contact': ['Business enquiry', 'Systems enquiry', 'Work with Gannon'],
};

export default function LeadSources() {
  const qc = useQueryClient();

  const { data: sources = [] } = useQuery({
    queryKey: ['phoneLeadSources'],
    queryFn: () => base44.entities.PhoneLeadSource.list(),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PhoneLeadSource.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['phoneLeadSources'] }),
  });

  return (
    <div className="space-y-5">
      <div className="bg-card/40 border border-border/30 rounded-xl p-4">
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          These are the locations on your site where a phone CTA will appear once you approve. All are hidden until you turn them on after the number goes live.
          You can customise the CTA copy per page.
        </p>
      </div>

      <div className="space-y-3">
        {sources.map(source => (
          <div key={source.id} className="bg-card/60 border border-border/40 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{source.source_name}</p>
                <p className="font-body text-xs text-muted-foreground font-mono">{source.page_url}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  {source.is_live
                    ? <Eye className="w-3.5 h-3.5 text-green-400" />
                    : <EyeOff className="w-3.5 h-3.5 text-yellow-400" />
                  }
                  <span className={`font-body text-[10px] uppercase tracking-wider ${source.is_live ? 'text-green-400' : 'text-yellow-400'}`}>
                    {source.is_live ? 'Live' : 'Hidden'}
                  </span>
                </div>
                <button
                  onClick={() => update.mutate({ id: source.id, data: { is_live: !source.is_live } })}
                  className={`font-body text-[10px] px-3 py-1 rounded-full border transition-all ${
                    source.is_live
                      ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                      : 'border-green-500/40 text-green-400 hover:bg-green-500/10'
                  }`}
                >
                  {source.is_live ? 'Hide' : 'Go Live'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Current CTA Copy</p>
              <div className="flex flex-wrap gap-2">
                {(CTA_COPY_MAP[source.source_name] || [source.cta_copy]).map(copy => (
                  <button
                    key={copy}
                    onClick={() => update.mutate({ id: source.id, data: { cta_copy: copy } })}
                    className={`font-body text-xs px-3 py-1.5 rounded-full border transition-all ${
                      source.cta_copy === copy
                        ? 'bg-primary/15 text-primary border-primary/40'
                        : 'text-muted-foreground border-border/40 hover:border-primary/20 hover:text-foreground'
                    }`}
                  >
                    {copy}
                  </button>
                ))}
              </div>
              <p className="font-body text-[10px] text-muted-foreground/40">Selected: "{source.cta_copy}"</p>
            </div>

            {source.lead_count > 0 && (
              <p className="font-body text-xs text-primary/60 mt-3">{source.lead_count} lead{source.lead_count !== 1 ? 's' : ''} attributed to this source</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}