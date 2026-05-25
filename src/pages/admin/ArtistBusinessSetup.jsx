import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ArrowLeft, Building2, CreditCard, Globe, Shield, Music, Users, FileText,
  TrendingUp, Calendar, ChevronRight, CheckCircle2, Circle, AlertTriangle, Copy
} from 'lucide-react';
import { toast } from 'sonner';

const SECTIONS = [
  {
    id: 'entity', label: 'Business Entity', icon: Building2, priority: 'Critical',
    items: [
      { label: 'Determine business structure (Sole Trader / Pty Ltd / Partnership)', done: false, note: 'Consult accountant — affects tax, liability, contracts' },
      { label: 'Register ABN (Australian Business Number)', done: false, note: 'Required for invoicing, distribution deals, sync licensing' },
      { label: 'Register business name if needed', done: false, note: 'Gannon Waye Music or legal entity name' },
      { label: 'Open dedicated business bank account', done: false, note: 'Separate personal and business finances' },
      { label: 'Set up PayPal Business account', done: false, note: 'For international payments and platforms that prefer PayPal' },
      { label: 'Set up accounting software (QuickBooks / Xero / Wave)', done: false, note: 'Track income, expenses, profit/loss by category' },
      { label: 'Create Dropbox / Google Drive accounting folder system', done: false, note: 'Invoices, receipts, contracts, bank statements' },
    ]
  },
  {
    id: 'social', label: 'Social Media Security', icon: Shield, priority: 'High',
    items: [
      { label: 'Enable 2FA on all social accounts', done: false, note: 'TikTok, Instagram, YouTube, Facebook, Twitter/X' },
      { label: 'Use a unique strong password for each platform', done: false, note: 'Use a password manager — do not reuse passwords' },
      { label: 'Add backup email and phone to each account', done: false, note: 'Ensures account recovery if primary is compromised' },
      { label: 'Review connected apps / third-party access on each platform', done: false, note: 'Remove any apps you no longer use' },
      { label: 'Document login credentials securely offline', done: false, note: 'Physical backup in secure location or encrypted vault' },
      { label: 'Set up account monitoring / breach alerts', done: false, note: 'haveibeenpwned.com for email monitoring' },
    ]
  },
  {
    id: 'website', label: 'Website + Mailing List', icon: Globe, priority: 'Active',
    items: [
      { label: 'gannonwaye.com is live and secured (HTTPS)', done: true, note: 'Confirmed — active and SSL secured' },
      { label: 'Email signup / mailing list capture is working', done: true, note: 'EmailSubscriber entity + welcome automation' },
      { label: 'Squeeze page or landing page tested', done: false, note: 'Dedicated high-conversion page for new visitors' },
      { label: 'Fan profile and order history working', done: true, note: 'Fan Profile + Order History pages exist' },
      { label: 'Privacy policy live and linked', done: true, note: '/privacy-policy route exists' },
      { label: 'Terms of service live and linked', done: true, note: '/terms-of-service route exists' },
      { label: 'Custom domain email set up for business comms', done: false, note: 'e.g. hello@gannonwaye.com for professional credibility' },
    ]
  },
  {
    id: 'income', label: 'Income Streams', icon: TrendingUp, priority: 'Build',
    items: [
      { label: 'Merch store operational', done: true, note: 'Stripe checkout + MerchOrder entity working' },
      { label: 'Supporter / back-this contribution active', done: true, note: '/back-this page and SupportContribution entity' },
      { label: 'Mastering services listed and bookable', done: true, note: '/mastering page + MasteringProject entity' },
      { label: 'Booking enquiries working', done: true, note: 'BookingEnquiry entity + admin notifications' },
      { label: 'Digital products pipeline (samples, stems, presets)', done: false, note: 'Not yet built — agent research flagged opportunity' },
      { label: 'Sync licensing research pipeline', done: false, note: 'See /admin/sync-licensing-command' },
      { label: 'Publishing deal readiness assessment', done: false, note: 'See /admin/publishing-deal-readiness' },
      { label: 'Coaching income stream (STAGED — NOT LIVE)', done: false, note: 'See /admin/coaching-command — locked until approval' },
    ]
  },
  {
    id: 'team', label: 'Team + Management', icon: Users, priority: 'Plan',
    items: [
      { label: 'Manager search / evaluation in progress', done: false, note: 'See Good Manager Scorecard section below' },
      { label: 'Booking agent research', done: false, note: 'Research agents specialising in independent artists' },
      { label: 'Publicist / PR strategy assessed', done: false, note: 'What level of PR coverage is the current goal?' },
      { label: 'Session musician / collaborator list building', done: false, note: 'See /admin/session-opportunity-command' },
      { label: 'Sync licensing agent or music supervisor contact list', done: false, note: 'See /admin/music-supervisor-pitching' },
      { label: 'Legal / contracts reviewed by music industry lawyer', done: false, note: 'RECOMMENDED before any management, publishing, or label deal' },
    ]
  },
  {
    id: 'creative', label: 'Creative Tools Stack', icon: Music, priority: 'Review',
    items: [
      { label: 'DAW / recording software confirmed', done: false, note: 'What DAW is currently used? Document for workflow' },
      { label: 'Mastering chain / tools documented', done: false, note: 'Internal + external mastering workflow' },
      { label: 'Video production setup confirmed', done: false, note: 'Camera, mic, lighting for content creation' },
      { label: 'Editing software stack confirmed', done: false, note: 'Video editing tools for TikTok/Instagram/YouTube' },
      { label: 'Graphic design tools confirmed', done: false, note: 'Canva, Photoshop, Figma for artwork/merch/social' },
      { label: 'Sample pack / stem export workflow', done: false, note: 'For digital product future income stream' },
    ]
  },
  {
    id: 'june4', label: 'June 4 Recording Plan', icon: Calendar, priority: 'Urgent',
    items: [
      { label: 'Session date confirmed: June 4', done: false, note: 'Confirm studio / home studio / location' },
      { label: 'Song/material list prepared', done: false, note: 'Which songs / parts are being recorded?' },
      { label: 'Recording setup tested before session', done: false, note: 'Check DAW, microphone, interface, monitors' },
      { label: 'Backup recording method confirmed', done: false, note: 'Redundancy for critical sessions' },
      { label: 'Session notes / reference tracks prepared', done: false, note: 'Direction notes for producer/engineer if applicable' },
      { label: 'Post-session workflow confirmed', done: false, note: 'Where do files go? Backup, mix, master pipeline' },
      { label: 'Release timeline set from June 4 session', done: false, note: 'Link session output to release calendar' },
    ]
  },
];

const MANAGER_SCORECARD = [
  'Genuine belief in the artist and the music',
  'Track record with independent artists at similar level',
  'Understands digital-first and social-first music strategy',
  'Clear on what they will actually do (not just titles)',
  'Transparent on commission structure (industry standard: 15-20%)',
  'No conflict of interest with competing artists',
  'Clear communication and availability',
  'Brings real relationships (bookers, labels, supervisors, press)',
  'Does not require you to sign over creative control',
  'Contract reviewed by independent music industry lawyer before signing',
];

export default function ArtistBusinessSetup() {
  const [selected, setSelected] = useState(null);
  const [expandedSection, setExpandedSection] = useState('entity');
  const copy = (text) => { navigator.clipboard.writeText(text); toast.success('Copied'); };

  const totalItems = SECTIONS.flatMap(s => s.items).length;
  const doneItems = SECTIONS.flatMap(s => s.items).filter(i => i.done).length;

  const priorityColor = (p) => ({
    'Critical': 'bg-red-500/20 text-red-300',
    'High': 'bg-yellow-500/20 text-yellow-300',
    'Active': 'bg-green-500/20 text-green-300',
    'Build': 'bg-blue-500/20 text-blue-300',
    'Plan': 'bg-purple-500/20 text-purple-300',
    'Review': 'bg-cyan-500/20 text-cyan-300',
    'Urgent': 'bg-orange-500/20 text-orange-300',
  }[p] || 'bg-secondary text-muted-foreground');

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Artist Business Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">Business formation, security, income streams, team, and management</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">Overall Setup Progress</p>
              <p className="text-sm text-muted-foreground">{doneItems}/{totalItems} items</p>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${(doneItems / totalItems) * 100}%` }} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-primary">{Math.round((doneItems / totalItems) * 100)}%</p>
            <p className="text-xs text-muted-foreground">complete</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/20 bg-yellow-500/3">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-200/80">
            <strong>Disclaimer:</strong> This system provides operational checklists and information only. It does not provide legal, tax, financial, or professional advice. Always consult qualified professionals (accountant, lawyer, financial adviser) before making business formation, contract, or financial decisions.
          </p>
        </CardContent>
      </Card>

      {/* Section nav */}
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map(s => (
          <Button key={s.id} size="sm" variant={expandedSection === s.id ? 'default' : 'outline'} onClick={() => setExpandedSection(s.id)} className="gap-2">
            <s.icon className="w-3 h-3" />{s.label}
            <Badge className={`text-xs ml-1 ${priorityColor(s.priority)}`}>{s.priority}</Badge>
          </Button>
        ))}
      </div>

      {SECTIONS.filter(s => s.id === expandedSection).map(section => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <section.icon className="w-5 h-5 text-primary" />
              {section.label}
              <Badge className={`text-xs ${priorityColor(section.priority)}`}>{section.priority}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.items.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 border rounded-xl p-4 ${item.done ? 'border-green-500/20 bg-green-500/3' : 'border-border'}`}>
                <div className="mt-0.5 shrink-0">
                  {item.done ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${item.done ? 'text-green-300' : 'text-foreground'}`}>{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Good Manager Scorecard */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Good Manager Scorecard</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {MANAGER_SCORECARD.map((point, i) => (
            <div key={i} className="flex items-start gap-3 text-sm py-1.5 border-b border-border/30 last:border-0">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p>{point}</p>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => copy(MANAGER_SCORECARD.join('\n'))} className="mt-3 gap-1">
            <Copy className="w-3 h-3" />Copy scorecard
          </Button>
        </CardContent>
      </Card>

      {/* Related admin pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { to: '/admin/artist-management-command', label: 'Management Command', desc: 'Track management deal checklist and negotiations' },
          { to: '/admin/income-stream-planner', label: 'Income Stream Planner', desc: 'All income streams mapped and planned' },
          { to: '/admin/social-platform-security', label: 'Platform Security', desc: 'Account security checklist per platform' },
          { to: '/admin/june-4-recording-plan', label: 'June 4 Recording Plan', desc: 'Session preparation and post-session workflow' },
          { to: '/admin/negotiation-rights-tracker', label: 'Rights Tracker', desc: 'Contracts, splits, publishing rights' },
          { to: '/admin/creative-tools-stack', label: 'Creative Tools Stack', desc: 'DAW, video, design, and content tools' },
        ].map(({ to, label, desc }) => (
          <Link key={to} to={to}>
            <Card className="hover:border-primary/40 cursor-pointer h-full">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {selected && (
        <Dialog open onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{selected.label}</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">{selected.note}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}