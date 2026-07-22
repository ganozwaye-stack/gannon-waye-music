import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUS_COLORS = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  booked: 'bg-green-500/20 text-green-400 border-green-500/30',
  declined: 'bg-red-500/20 text-red-400 border-red-500/30',
  unresponsive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  archived: 'bg-secondary text-muted-foreground border-border/30',
};

export default function CoachingLeads() {
  const qc = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: leads = [] } = useQuery({
    queryKey: ['coaching-leads'],
    queryFn: () => base44.entities.CoachingLead.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CoachingLead.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coaching-leads'] }),
  });

  const filtered = filterStatus === 'all' ? leads : leads.filter(l => l.status === filterStatus);
  const newCount = leads.filter(l => l.status === 'new').length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin</p>
          <h1 className="font-display text-2xl text-foreground">Coaching Leads</h1>
          {newCount > 0 && <p className="font-body text-xs text-yellow-400 mt-1">{newCount} new lead{newCount !== 1 ? 's' : ''} awaiting response</p>}
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 bg-card/50 border-border/60 text-sm">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="unresponsive">Unresponsive</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-body text-sm">No leads found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(lead => (
            <div key={lead.id} className="bg-card/50 border border-border/40 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{lead.full_name}</p>
                  <p className="font-body text-xs text-muted-foreground">{lead.email}</p>
                  {lead.source_offer && <p className="font-body text-[10px] text-primary/60 mt-0.5">{lead.source_offer}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-body text-[9px] tracking-widest uppercase border rounded-full px-2.5 py-1 ${STATUS_COLORS[lead.status] || ''}`}>
                    {lead.status}
                  </span>
                  <Select value={lead.status} onValueChange={v => updateMutation.mutate({ id: lead.id, data: { status: v } })}>
                    <SelectTrigger className="w-32 h-7 text-xs bg-secondary/50 border-border/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['new', 'contacted', 'booked', 'declined', 'unresponsive', 'archived'].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {lead.goal && (
                <div>
                  <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Goal</p>
                  <p className="font-body text-xs text-foreground/70">{lead.goal}</p>
                </div>
              )}
              {lead.current_challenge && (
                <div>
                  <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Challenge</p>
                  <p className="font-body text-xs text-foreground/70">{lead.current_challenge}</p>
                </div>
              )}
              {lead.workbook_requested && (
                <p className="font-body text-xs text-primary/60">Workbook: {lead.workbook_requested}</p>
              )}
              <p className="font-body text-[10px] text-muted-foreground/40">
                {new Date(lead.created_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}