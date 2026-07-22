import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Upload, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const RESOURCE_TEMPLATES = [
  { title: 'Coaching Welcome Manual', type: 'welcome_manual', desc: 'Sent to every new coaching client — sets expectations, explains the process, outlines boundaries of coaching vs therapy', priority: 'high' },
  { title: 'Intake Worksheet', type: 'prep_sheet', desc: 'Completed before first session — goals, challenges, history, what support they want', priority: 'high' },
  { title: 'Values Worksheet', type: 'values_worksheet', desc: 'Identifies the client\'s core values and where they are currently honouring or violating them', priority: 'high' },
  { title: 'Boundary Script Sheet', type: 'boundary_scripts', desc: 'Ready-to-use language for common boundary situations — with people, at work, in family', priority: 'high' },
  { title: 'Weekly Check In', type: 'self_worth_checkin', desc: 'A brief weekly self-assessment — mood, energy, boundaries held, wins, struggles', priority: 'medium' },
  { title: 'Reflection Journal', type: 'reflection_page', desc: 'Structured journaling prompts for between sessions', priority: 'medium' },
  { title: 'Goal Tracker', type: 'goal_tracker', desc: 'Tracks the client\'s stated goals, progress markers, and milestones across the coaching programme', priority: 'medium' },
  { title: 'Session Summary Template', type: 'post_session', desc: 'Filled after each session — key themes, breakthroughs, agreed actions', priority: 'medium' },
  { title: 'Post Session Action Plan', type: 'post_session', desc: 'A focused 1-page action plan from each session — what they will do before next time', priority: 'medium' },
  { title: 'Testimonial Request Form', type: 'testimonial_form', desc: 'Sent at end of programme — structured prompts to gather a usable testimonial', priority: 'low' },
];

function ResourceRow({ resource, template }) {
  const qc = useQueryClient();

  const toggle = useMutation({
    mutationFn: () => base44.entities.CoachingResource.update(resource.id, { is_published: !resource.is_published }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client-resources'] });
      toast.success(resource.is_published ? 'Resource hidden from clients' : 'Resource now visible to clients');
    },
  });

  return (
    <div className="flex items-start gap-3 p-4 border border-border/40 rounded-xl bg-card/40">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-body text-sm font-semibold text-foreground">{resource.title || template?.title}</p>
          <div className="flex gap-1.5 shrink-0">
            {resource.is_published
              ? <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-[9px]">Visible</Badge>
              : <Badge className="bg-secondary text-muted-foreground text-[9px]">Hidden</Badge>
            }
          </div>
        </div>
        <p className="font-body text-xs text-muted-foreground leading-relaxed">{resource.description || template?.desc}</p>
        {resource.file_url
          ? <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-[9px] mt-2">File uploaded</Badge>
          : <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-[9px] mt-2">No file uploaded yet</Badge>
        }
      </div>
      <div className="flex gap-2 shrink-0">
        <Button size="sm" variant="outline" className="gap-1 text-xs h-7 px-2" onClick={() => toggle.mutate()} disabled={toggle.isPending}>
          {resource.is_published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {resource.is_published ? 'Hide' : 'Show'}
        </Button>
      </div>
    </div>
  );
}

function TemplateRow({ template }) {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: () => base44.entities.CoachingResource.create({
      title: template.title,
      resource_type: template.type,
      description: template.desc,
      is_client_only: true,
      is_published: false,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client-resources'] });
      toast.success(`${template.title} added to library`);
    },
  });

  const priorityColor = { high: 'text-red-400 bg-red-500/10 border-red-500/20', medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', low: 'text-muted-foreground bg-secondary border-border' }[template.priority];

  return (
    <div className="flex items-start gap-3 p-4 border border-dashed border-border/40 rounded-xl bg-card/20 opacity-70">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-body text-sm font-semibold text-foreground/70">{template.title}</p>
          <Badge className={`text-[9px] border shrink-0 ${priorityColor}`}>{template.priority}</Badge>
        </div>
        <p className="font-body text-xs text-muted-foreground leading-relaxed">{template.desc}</p>
      </div>
      <Button size="sm" variant="outline" className="gap-1 text-xs h-7 px-2 shrink-0" onClick={() => create.mutate()} disabled={create.isPending}>
        <Upload className="w-3 h-3" /> Add
      </Button>
    </div>
  );
}

export default function ClientResourceLibrary() {
  const qc = useQueryClient();

  const { data: resources = [], refetch } = useQuery({
    queryKey: ['client-resources'],
    queryFn: () => base44.entities.CoachingResource.list(),
  });

  const existingTypes = resources.map(r => r.resource_type);
  const pending = RESOURCE_TEMPLATES.filter(t => !existingTypes.includes(t.type));

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <div className="mb-6">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Content Engine</p>
        <h1 className="font-display text-3xl text-foreground">Client Resource Library</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Session materials for active coaching clients — only visible when published</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center">
          <p className="font-display text-2xl text-foreground">{resources.length}</p>
          <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-1">In Library</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center">
          <p className="font-display text-2xl text-green-400">{resources.filter(r => r.is_published).length}</p>
          <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Published</p>
        </div>
        <div className="bg-card/50 border border-border/40 rounded-xl p-4 text-center">
          <p className="font-display text-2xl text-yellow-400">{resources.filter(r => !r.file_url).length}</p>
          <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Missing Files</p>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-xs font-semibold text-yellow-400 mb-1">To activate client resources:</p>
            <ol className="space-y-1">
              {['Click "Add" to create each resource record', 'Upload the PDF file URL to each resource', 'Toggle "Show" to make visible to clients at /coaching/client-resources'].map((a, i) => (
                <li key={i} className="font-body text-xs text-foreground/70 flex items-start gap-1.5">
                  <span className="text-yellow-400/60 shrink-0">{i + 1}.</span>{a}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-foreground">Library Resources</h2>
        <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => refetch()}>
          <RefreshCw className="w-3 h-3" /> Refresh
        </Button>
      </div>

      {resources.length > 0 && (
        <div className="space-y-3 mb-6">
          {resources.map(r => {
            const template = RESOURCE_TEMPLATES.find(t => t.type === r.resource_type);
            return <ResourceRow key={r.id} resource={r} template={template} />;
          })}
        </div>
      )}

      {pending.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3 mt-6">
            <p className="font-body text-xs uppercase tracking-wider text-muted-foreground">Resources to Add ({pending.length})</p>
          </div>
          <div className="space-y-3">
            {pending.map(t => <TemplateRow key={t.type} template={t} />)}
          </div>
        </>
      )}

      {resources.length === 0 && pending.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <BookOpen className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">All resources are already in the library</p>
        </div>
      )}
    </div>
  );
}