import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, Inbox, BookOpen, Calendar, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const HUMAN_ACTIONS = [
  'Set pricing for Self Worth Reset Session before publishing /coaching/self-worth-reset',
  'Set pricing for Boundaries & Self Respect Mentoring before publishing /coaching/boundaries',
  'Set pricing for Creative Confidence Mentoring before publishing /coaching/creative-confidence',
  'Set pricing for Boundaries After Breakdown Workbook',
  'Set pricing for Creative Confidence Starter Manual',
  'Upload PDF files for all workbooks before enabling downloads',
  'Upload resource files (welcome manual, worksheets, etc.) to /admin/coaching-client-resources',
  'Review and publish coaching pages once prices are set',
  'Connect a calendar booking tool (Calendly, TidyCal, etc.) and update intake form CTA link',
  'Confirm 1800RESPECT donation is still active (referenced site-wide)',
];

const NAV_ITEMS = [
  { label: 'Coaching Leads', path: '/admin/coaching-leads', icon: Inbox, desc: 'Enquiries and workbook requests' },
  { label: 'Coaching Intakes', path: '/admin/coaching-intakes', icon: Inbox, desc: 'Full intake form submissions' },
  { label: 'Coaching Clients', path: '/admin/coaching-clients', icon: Users, desc: 'Active and past coaching clients' },
  { label: 'Coaching Sessions', path: '/admin/coaching-sessions', icon: Calendar, desc: 'Session log and notes' },
];

const PUBLIC_PAGES = [
  { label: '/coaching', path: '/coaching', ready: true },
  { label: '/coaching/self-worth-reset', path: '/coaching/self-worth-reset', ready: false, note: 'Price pending' },
  { label: '/coaching/boundaries', path: '/coaching/boundaries', ready: false, note: 'Price pending' },
  { label: '/coaching/creative-confidence', path: '/coaching/creative-confidence', ready: false, note: 'Price pending' },
  { label: '/coaching/workbooks', path: '/coaching/workbooks', ready: true },
  { label: '/coaching/intake', path: '/coaching/intake', ready: true },
  { label: '/coaching/client-resources', path: '/coaching/client-resources', ready: false, note: 'Resources not yet uploaded' },
];

export default function CoachingHub() {
  const { data: leads = [] } = useQuery({
    queryKey: ['coaching-leads'],
    queryFn: () => base44.entities.CoachingLead.list(),
  });
  const { data: intakes = [] } = useQuery({
    queryKey: ['coaching-intakes'],
    queryFn: () => base44.entities.CoachingIntake.list(),
  });
  const { data: clients = [] } = useQuery({
    queryKey: ['coaching-clients'],
    queryFn: () => base44.entities.CoachingClient.list(),
  });

  const newLeads = leads.filter(l => l.status === 'new').length;
  const newIntakes = intakes.filter(i => i.status === 'submitted').length;
  const activeClients = clients.filter(c => c.status === 'active').length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin</p>
        <h1 className="font-display text-3xl text-foreground">Coaching Hub</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Gannon Waye Coaching — life coaching, mindset mentoring, self worth work</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'New Leads', value: newLeads, color: newLeads > 0 ? 'text-yellow-400' : 'text-foreground' },
          { label: 'New Intakes', value: newIntakes, color: newIntakes > 0 ? 'text-yellow-400' : 'text-foreground' },
          { label: 'Active Clients', value: activeClients, color: 'text-green-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-card/50 border border-border/40 rounded-xl p-4 text-center">
            <p className={`font-display text-3xl ${stat.color}`}>{stat.value}</p>
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Human actions required */}
      <div className="mb-8">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
          <p className="font-body text-xs font-semibold text-yellow-400 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4" /> Human Actions Required ({HUMAN_ACTIONS.length})
          </p>
          <ol className="space-y-2">
            {HUMAN_ACTIONS.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-body text-[10px] text-yellow-500/60 shrink-0 mt-0.5">{i + 1}.</span>
                <p className="font-body text-xs text-foreground/70">{action}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Nav tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="flex gap-4 p-4 bg-card/50 border border-border/40 hover:border-primary/40 rounded-xl transition-all group">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary/70" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Public page status */}
      <div>
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Public Page Status</p>
        <div className="space-y-2">
          {PUBLIC_PAGES.map(page => (
            <div key={page.path} className="flex items-center justify-between p-3 bg-card/40 border border-border/30 rounded-lg">
              <div className="flex items-center gap-2">
                {page.ready
                  ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  : <AlertCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                }
                <span className="font-body text-xs text-foreground/70 font-mono">{page.label}</span>
                {page.note && <span className="font-body text-[9px] text-yellow-400/70">— {page.note}</span>}
              </div>
              <a href={page.path} target="_blank" rel="noopener noreferrer" className="text-muted-foreground/40 hover:text-primary/60 transition-colors">
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}