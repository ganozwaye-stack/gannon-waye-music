import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  BookOpen, Video, Plus, ChevronDown, ChevronRight,
  Play, FileText, Loader2, Upload, Eye, EyeOff, Edit, Trash2, Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CATEGORY_CONFIG = {
  getting_started: { label: 'Getting Started', icon: '🚀', color: 'text-green-400' },
  music_business:  { label: 'Music Business',  icon: '🎵', color: 'text-blue-400' },
  store_ops:       { label: 'Store Ops',        icon: '🛒', color: 'text-yellow-400' },
  social_media:    { label: 'Social Media',     icon: '📱', color: 'text-purple-400' },
  fan_engagement:  { label: 'Fan Engagement',   icon: '❤️', color: 'text-pink-400' },
  analytics:       { label: 'Analytics',        icon: '📊', color: 'text-cyan-400' },
  merch:           { label: 'Merch',            icon: '🎽', color: 'text-orange-400' },
  other:           { label: 'Other',            icon: '📂', color: 'text-muted-foreground' },
};

const TYPE_CONFIG = {
  video:       { label: 'Video',        icon: Video,    color: 'text-red-400' },
  text_image:  { label: 'Written',      icon: FileText, color: 'text-blue-400' },
  practice:    { label: 'Practice',     icon: BookOpen, color: 'text-yellow-400' },
  mixed:       { label: 'Mixed',        icon: Play,     color: 'text-green-400' },
};

const EMPTY_MODULE = {
  title: '', subtitle: '', category: 'getting_started', module_type: 'mixed',
  content_text: '', video_url: '', practice_prompt: '', duration_minutes: 10,
  is_published: false, tags: [],
};

function ModuleForm({ initial = EMPTY_MODULE, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-4 bg-card border border-primary/20 rounded-2xl p-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider block mb-1">Title *</label>
          <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Module title" />
        </div>
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider block mb-1">Subtitle</label>
          <Input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Short description" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider block mb-1">Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
            {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider block mb-1">Type</label>
          <select value={form.module_type} onChange={e => set('module_type', e.target.value)}
            className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground">
            {Object.entries(TYPE_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider block mb-1">Duration (mins)</label>
          <Input type="number" value={form.duration_minutes} onChange={e => set('duration_minutes', Number(e.target.value))} min={1} />
        </div>
      </div>

      {(form.module_type === 'video' || form.module_type === 'mixed') && (
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider block mb-1">
            Video URL <span className="text-muted-foreground/50">(YouTube embed e.g. https://www.youtube.com/embed/VIDEO_ID)</span>
          </label>
          <Input value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://www.youtube.com/embed/..." />
        </div>
      )}

      {(form.module_type === 'text_image' || form.module_type === 'mixed') && (
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider block mb-1">Written Content (Markdown supported)</label>
          <Textarea
            value={form.content_text}
            onChange={e => set('content_text', e.target.value)}
            placeholder="Write your step-by-step guide here. Use **bold**, ## headings, - bullet points..."
            className="min-h-[160px] font-mono text-sm"
          />
        </div>
      )}

      {(form.module_type === 'practice' || form.module_type === 'mixed') && (
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider block mb-1">Practice Exercise / Task</label>
          <Textarea value={form.practice_prompt} onChange={e => set('practice_prompt', e.target.value)}
            placeholder="What should the student do after reading this?" className="min-h-[80px]" />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_published}
            onChange={e => set('is_published', e.target.checked)}
            className="w-4 h-4 accent-primary" />
          <span className="font-body text-sm text-foreground">Publish (visible to students)</span>
        </label>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => onSave(form)} disabled={saving || !form.title.trim()} className="gradient-gold-button border-0 rounded-full">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Module'}
        </Button>
        <Button variant="ghost" onClick={onCancel} className="rounded-full">Cancel</Button>
      </div>
    </div>
  );
}

function ModuleCard({ module, onEdit, onDelete, onTogglePublish }) {
  const [expanded, setExpanded] = useState(false);
  const catCfg = CATEGORY_CONFIG[module.category] || CATEGORY_CONFIG.other;
  const typeCfg = TYPE_CONFIG[module.module_type] || TYPE_CONFIG.mixed;
  const TypeIcon = typeCfg.icon;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${module.is_published ? 'border-border/40' : 'border-border/20 opacity-70'}`}>
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <TypeIcon className={`w-4 h-4 ${typeCfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-sm text-foreground">{module.title}</p>
            <Badge className="text-[9px] bg-secondary/50 text-muted-foreground border-border/30">{catCfg.icon} {catCfg.label}</Badge>
            {!module.is_published && <Badge className="text-[9px] bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Draft</Badge>}
          </div>
          {module.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{module.subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{module.duration_minutes}m</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border/20 pt-3 space-y-3">
          {module.video_url && (
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe src={module.video_url} title={module.title} className="w-full h-full" allowFullScreen />
            </div>
          )}
          {module.content_text && (
            <div className="bg-secondary/30 rounded-lg p-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-body">
              {module.content_text}
            </div>
          )}
          {module.practice_prompt && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Practice Exercise</p>
              <p className="text-sm text-foreground/80">{module.practice_prompt}</p>
            </div>
          )}
          <div className="flex gap-2 flex-wrap pt-1">
            <Button size="sm" variant="outline" onClick={() => onEdit(module)} className="text-xs gap-1 rounded-full">
              <Edit className="w-3 h-3" />Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onTogglePublish(module)} className="text-xs gap-1 rounded-full">
              {module.is_published ? <><EyeOff className="w-3 h-3" />Unpublish</> : <><Eye className="w-3 h-3" />Publish</>}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(module.id)} className="text-xs gap-1 rounded-full text-destructive hover:text-destructive">
              <Trash2 className="w-3 h-3" />Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrainingCentre() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [catFilter, setCatFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['trainingModules'],
    queryFn: () => base44.entities.TrainingModule.list('order_position', 200),
  });

  const createMut = useMutation({
    mutationFn: (d) => base44.entities.TrainingModule.create(d),
    onSuccess: () => { queryClient.invalidateQueries(['trainingModules']); setShowForm(false); toast({ title: 'Module created!' }); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TrainingModule.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['trainingModules']); setEditing(null); toast({ title: 'Module updated!' }); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.TrainingModule.delete(id),
    onSuccess: () => { queryClient.invalidateQueries(['trainingModules']); toast({ title: 'Module deleted' }); },
  });

  const filtered = modules.filter(m => {
    if (catFilter !== 'all' && m.category !== catFilter) return false;
    if (typeFilter !== 'all' && m.module_type !== typeFilter) return false;
    return true;
  });

  const publishedCount = modules.filter(m => m.is_published).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Training Centre</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {modules.length} modules · {publishedCount} published · Upload videos, guides, and step-by-step lessons
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); }} className="gradient-gold-button border-0 rounded-full gap-2">
          <Plus className="w-4 h-4" /> New Module
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Modules', value: modules.length, color: 'text-foreground' },
          { label: 'Published', value: publishedCount, color: 'text-green-400' },
          { label: 'Drafts', value: modules.length - publishedCount, color: 'text-yellow-400' },
          { label: 'Total Duration', value: `${modules.reduce((s, m) => s + (m.duration_minutes || 0), 0)}m`, color: 'text-primary' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New module form */}
      {showForm && !editing && (
        <ModuleForm
          onSave={(d) => createMut.mutate({ ...d, order_position: modules.length })}
          onCancel={() => setShowForm(false)}
          saving={createMut.isPending}
        />
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant={catFilter === 'all' ? 'default' : 'ghost'} onClick={() => setCatFilter('all')} className="text-xs h-8 rounded-full">All Categories</Button>
        {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
          <Button key={k} size="sm" variant={catFilter === k ? 'secondary' : 'ghost'} onClick={() => setCatFilter(k)} className="text-xs h-8 rounded-full">
            {v.icon} {v.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant={typeFilter === 'all' ? 'default' : 'ghost'} onClick={() => setTypeFilter('all')} className="text-xs h-8 rounded-full">All Types</Button>
        {Object.entries(TYPE_CONFIG).map(([k, v]) => (
          <Button key={k} size="sm" variant={typeFilter === k ? 'secondary' : 'ghost'} onClick={() => setTypeFilter(k)} className="text-xs h-8 rounded-full">
            {v.label}
          </Button>
        ))}
      </div>

      {/* Modules */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <BookOpen className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground mb-3">No modules yet.</p>
          <Button onClick={() => setShowForm(true)} className="gradient-gold-button border-0 rounded-full gap-2">
            <Plus className="w-4 h-4" /> Create First Module
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(module => (
            editing?.id === module.id ? (
              <ModuleForm
                key={module.id}
                initial={editing}
                onSave={(d) => updateMut.mutate({ id: module.id, data: d })}
                onCancel={() => setEditing(null)}
                saving={updateMut.isPending}
              />
            ) : (
              <ModuleCard
                key={module.id}
                module={module}
                onEdit={setEditing}
                onDelete={(id) => deleteMut.mutate(id)}
                onTogglePublish={(m) => updateMut.mutate({ id: m.id, data: { is_published: !m.is_published } })}
              />
            )
          ))}
        </div>
      )}

      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Upload className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-300 text-sm">Video Upload Tip</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload your training videos to YouTube (unlisted), then paste the embed URL here (format: https://www.youtube.com/embed/VIDEO_ID).
              For future direct uploads, use the Quick Upload tool at{' '}
              <Link to="/admin/quick-upload" className="text-primary underline">/admin/quick-upload</Link>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}