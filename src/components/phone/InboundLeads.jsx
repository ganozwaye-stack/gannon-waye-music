import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, ChevronDown, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STAGES = ['new_lead','contacted','clarity_session_requested','call_booked','proposal_sent','paid_client','active_client','follow_up','closed_lost'];
const ENQUIRY_TYPES = ['coaching','merch_support','press','booking','ganozmix','general','other'];
const SOURCES = ['coaching_page','contact_page','press_page','store_support','ganozmix_page','inbound_call','missed_call','manual_entry','referral','other'];

const STAGE_COLORS = {
  new_lead: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  contacted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  clarity_session_requested: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  call_booked: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  proposal_sent: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  paid_client: 'bg-green-500/15 text-green-400 border-green-500/30',
  active_client: 'bg-green-600/15 text-green-300 border-green-500/30',
  follow_up: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  closed_lost: 'bg-secondary text-muted-foreground border-border/30',
};

export default function InboundLeads({ leads }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', enquiry_type: 'coaching', lead_source: 'manual_entry', crm_stage: 'new_lead', notes: '' });
  const [expandedId, setExpandedId] = useState(null);
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: (data) => base44.entities.SalesCallLead.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['salesCallLeads'] }); setShowForm(false); setForm({ full_name: '', phone: '', email: '', enquiry_type: 'coaching', lead_source: 'manual_entry', crm_stage: 'new_lead', notes: '' }); },
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SalesCallLead.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salesCallLeads'] }),
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-foreground font-semibold">
          {leads.length} Lead{leads.length !== 1 ? 's' : ''}
          <span className="text-muted-foreground font-normal ml-2">— {leads.filter(l=>l.crm_stage==='new_lead').length} new</span>
        </p>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Lead
        </Button>
      </div>

      {showForm && (
        <div className="bg-card/70 border border-primary/20 rounded-2xl p-5 space-y-4">
          <p className="font-body text-xs font-semibold text-primary uppercase tracking-wider">New Lead</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[{k:'full_name',p:'Full Name *'},{k:'phone',p:'Phone'},{k:'email',p:'Email'}].map(f => (
              <input key={f.k} placeholder={f.p} value={form[f.k]} onChange={e=>set(f.k,e.target.value)}
                className="bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {k:'enquiry_type',opts:ENQUIRY_TYPES},
              {k:'lead_source',opts:SOURCES},
              {k:'crm_stage',opts:STAGES},
            ].map(f => (
              <select key={f.k} value={form[f.k]} onChange={e=>set(f.k,e.target.value)}
                className="bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none capitalize">
                {f.opts.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
              </select>
            ))}
          </div>
          <textarea placeholder="Notes..." value={form.notes} onChange={e=>set('notes',e.target.value)}
            className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none min-h-[60px]" />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => create.mutate(form)} disabled={!form.full_name || create.isPending} className="gap-1.5 text-xs">
              <Save className="w-3 h-3" /> {create.isPending ? 'Saving...' : 'Save Lead'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
          </div>
        </div>
      )}

      {leads.length === 0 && !showForm && (
        <div className="text-center py-12 text-muted-foreground font-body text-sm">
          No leads yet. Add your first lead manually or wait for provider to go live.
        </div>
      )}

      <div className="space-y-2">
        {leads.map(lead => (
          <div key={lead.id} className="bg-card/50 border border-border/40 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-body text-sm font-semibold text-foreground">{lead.full_name}</p>
                  <span className={`font-body text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${STAGE_COLORS[lead.crm_stage] || ''}`}>
                    {lead.crm_stage?.replace(/_/g,' ')}
                  </span>
                  <span className="font-body text-[9px] text-muted-foreground/50 uppercase">{lead.enquiry_type?.replace(/_/g,' ')}</span>
                </div>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{lead.phone || lead.email || 'No contact details'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${expandedId === lead.id ? 'rotate-180' : ''}`} />
            </div>

            {expandedId === lead.id && (
              <div className="border-t border-border/30 p-4 space-y-3 bg-secondary/20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {label:'CRM Stage',key:'crm_stage',opts:STAGES},
                    {label:'Enquiry Type',key:'enquiry_type',opts:ENQUIRY_TYPES},
                  ].map(f => (
                    <div key={f.key}>
                      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{f.label}</p>
                      <select value={lead[f.key] || ''} onChange={e => update.mutate({ id: lead.id, data: { [f.key]: e.target.value } })}
                        className="w-full bg-secondary/50 border border-border/60 rounded-lg px-2 py-1.5 font-body text-xs text-foreground focus:outline-none capitalize">
                        {f.opts.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Next Action Date</p>
                    <input type="date" value={lead.next_action_date || ''} onChange={e => update.mutate({ id: lead.id, data: { next_action_date: e.target.value } })}
                      className="w-full bg-secondary/50 border border-border/60 rounded-lg px-2 py-1.5 font-body text-xs text-foreground focus:outline-none" />
                  </div>
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Priority</p>
                    <select value={lead.priority || 'medium'} onChange={e => update.mutate({ id: lead.id, data: { priority: e.target.value } })}
                      className="w-full bg-secondary/50 border border-border/60 rounded-lg px-2 py-1.5 font-body text-xs text-foreground focus:outline-none capitalize">
                      {['low','medium','high'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Notes</p>
                  <textarea defaultValue={lead.notes || ''} onBlur={e => update.mutate({ id: lead.id, data: { notes: e.target.value } })}
                    className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 font-body text-xs text-foreground focus:outline-none min-h-[60px]"
                    placeholder="Add notes..." />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}