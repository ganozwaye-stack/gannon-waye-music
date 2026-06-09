import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Play, PenTool, Image, Plus, Edit2, Trash2, Eye, EyeOff,
  ChevronDown, ChevronUp, Video, FileText, Dumbbell, Layers, Sparkles,
  CheckCircle, Clock, Tag, ArrowUp, ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const CATEGORIES = [
  { id: 'getting_started', label: 'Getting Started', icon: '🚀' },
  { id: 'music_business', label: 'Music Business', icon: '🎵' },
  { id: 'store_ops', label: 'Store Operations', icon: '🛍️' },
  { id: 'social_media', label: 'Social Media', icon: '📱' },
  { id: 'fan_engagement', label: 'Fan Engagement', icon: '❤️' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'merch', label: 'Merch', icon: '👕' },
  { id: 'other', label: 'Other', icon: '📌' },
];

const MODULE_TYPES = [
  { id: 'video', label: 'Video', icon: Video, color: 'text-red-400' },
  { id: 'text_image', label: 'Text + Image', icon: Image, color: 'text-blue-400' },
  { id: 'practice', label: 'Practice Exercise', icon: Dumbbell, color: 'text-green-400' },
  { id: 'mixed', label: 'Mixed', icon: Layers, color: 'text-purple-400' },
];

const EMPTY_MODULE = {
  title: '',
  subtitle: '',
  category: 'getting_started',
  module_type: 'mixed',
  order_position: 0,
  content_text: '',
  video_url: '',
  images: [],
  practice_prompt: '',
  practice_answer_guide: '',
  duration_minutes: 10,
  is_published: false,
  tags: [],
  agent_notes: '',
};

function ModuleForm({ module, onSave, onCancel, isNew }) {
  const [form, setForm] = useState(module || EMPTY_MODULE);
  const [imageInput, setImageInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addImage = () => {
    if (imageInput.trim()) {
      set('images', [...(form.images || []), imageInput.trim()]);
      setImageInput('');
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      set('tags', [...(form.tags || []), tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Title *</label>
          <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Module title" />
        </div>
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Subtitle</label>
          <Input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Brief description" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Module Type</label>
          <select value={form.module_type} onChange={e => set('module_type', e.target.value)} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
            {MODULE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Duration (mins)</label>
          <Input type="number" value={form.duration_minutes} onChange={e => set('duration_minutes', Number(e.target.value))} />
        </div>
      </div>

      {/* Video URL */}
      {(form.module_type === 'video' || form.module_type === 'mixed') && (
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Video URL (YouTube embed)</label>
          <Input value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://www.youtube.com/embed/VIDEO_ID" />
          <p className="font-body text-[10px] text-muted-foreground/50 mt-1">Use YouTube embed URL format: https://www.youtube.com/embed/VIDEO_ID</p>
        </div>
      )}

      {/* Content Text */}
      <div>
        <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Content / Lesson Text</label>
        <Textarea
          value={form.content_text}
          onChange={e => set('content_text', e.target.value)}
          placeholder="Write the lesson content here. Supports markdown formatting."
          className="min-h-[160px] font-body text-sm"
        />
      </div>

      {/* Images */}
      {(form.module_type === 'text_image' || form.module_type === 'mixed') && (
        <div>
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Images</label>
          <div className="flex gap-2">
            <Input value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="Paste image URL" onKeyDown={e => e.key === 'Enter' && addImage()} />
            <Button variant="outline" onClick={addImage} size="sm"><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(form.images || []).map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-border" />
                <button onClick={() => set('images', form.images.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice */}
      {(form.module_type === 'practice' || form.module_type === 'mixed') && (
        <div className="space-y-3 p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
          <label className="font-body text-xs text-green-400 uppercase tracking-wider block">Practice Exercise</label>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Exercise Prompt / Task</label>
            <Textarea value={form.practice_prompt} onChange={e => set('practice_prompt', e.target.value)} placeholder="What should the student do? e.g. 'Write 3 Instagram captions for your latest release'" className="min-h-[80px] text-sm" />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Answer / Completion Guide (shown after attempt)</label>
            <Textarea value={form.practice_answer_guide} onChange={e => set('practice_answer_guide', e.target.value)} placeholder="Example answers or guidance for completing the exercise" className="min-h-[80px] text-sm" />
          </div>
        </div>
      )}

      {/* Tags */}
      <div>
        <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Tags</label>
        <div className="flex gap-2">
          <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add a tag" onKeyDown={e => e.key === 'Enter' && addTag()} />
          <Button variant="outline" onClick={addTag} size="sm"><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(form.tags || []).map((tag, i) => (
            <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => set('tags', form.tags.filter((_, j) => j !== i))}>
              {tag} ×
            </Badge>
          ))}
        </div>
      </div>

      {/* Agent Notes */}
      <div>
        <label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Agent Notes (internal)</label>
        <Input value={form.agent_notes} onChange={e => set('agent_notes', e.target.value)} placeholder="Notes for AI agents managing this module" />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} className="rounded" />
          <span className="font-body text-sm text-foreground">Publish this module</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} className="gradient-gold-button">
          {isNew ? 'Create Module' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

function ModuleCard({ module, onEdit, onDelete, onTogglePublish, onMoveUp, onMoveDown }) {
  const [expanded, setExpanded] = useState(false);
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  const typeInfo = MODULE_TYPES.find(t => t.id === module.module_type);
  const catInfo = CATEGORIES.find(c => c.id === module.category);
  const TypeIcon = typeInfo?.icon || Layers;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${module.is_published ? 'border-primary/20 bg-card/60' : 'border-border/30 bg-card/30'} overflow-hidden`}
    >
      <div className="p-4 flex items-start gap-4">
        <div className="flex flex-col gap-1">
          <button onClick={onMoveUp} className="text-muted-foreground hover:text-foreground p-0.5"><ArrowUp className="w-3.5 h-3.5" /></button>
          <button onClick={onMoveDown} className="text-muted-foreground hover:text-foreground p-0.5"><ArrowDown className="w-3.5 h-3.5" /></button>
        </div>

        <div className={`p-2 rounded-lg bg-secondary/50 flex-shrink-0 ${typeInfo?.color}`}>
          <TypeIcon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-display text-sm text-foreground">{module.title}</h3>
              {module.subtitle && <p className="font-body text-xs text-muted-foreground/60 mt-0.5">{module.subtitle}</p>}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="font-body text-[9px] tracking-wider uppercase text-muted-foreground/40">{catInfo?.icon} {catInfo?.label}</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="font-body text-[9px] text-muted-foreground/40 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {module.duration_minutes} min</span>
                {module.is_published
                  ? <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-[9px]">Published</Badge>
                  : <Badge variant="secondary" className="text-[9px]">Draft</Badge>
                }
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button onClick={() => onTogglePublish(module)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                {module.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => onEdit(module)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(module.id)} className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">
              {module.video_url && (
                <div>
                  <p className="font-body text-xs text-muted-foreground/50 uppercase tracking-wider mb-2">Video</p>
                  <div className="aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe src={module.video_url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                </div>
              )}

              {module.content_text && (
                <div>
                  <p className="font-body text-xs text-muted-foreground/50 uppercase tracking-wider mb-2">Content</p>
                  <div className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap bg-secondary/30 rounded-xl p-4">
                    {module.content_text}
                  </div>
                </div>
              )}

              {module.images?.length > 0 && (
                <div>
                  <p className="font-body text-xs text-muted-foreground/50 uppercase tracking-wider mb-2">Images</p>
                  <div className="grid grid-cols-3 gap-2">
                    {module.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="rounded-lg object-cover aspect-video w-full border border-border/30" />
                    ))}
                  </div>
                </div>
              )}

              {module.practice_prompt && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                  <p className="font-body text-xs text-green-400 uppercase tracking-wider mb-2">Practice Exercise</p>
                  <p className="font-body text-sm text-foreground/80">{module.practice_prompt}</p>
                  {module.practice_answer_guide && (
                    <div className="mt-3">
                      <button onClick={() => setShowPracticeAnswer(!showPracticeAnswer)} className="font-body text-xs text-primary/70 hover:text-primary transition-colors">
                        {showPracticeAnswer ? '▼ Hide answer guide' : '▶ Show answer guide'}
                      </button>
                      {showPracticeAnswer && (
                        <div className="mt-2 font-body text-sm text-muted-foreground bg-secondary/40 rounded-lg p-3">
                          {module.practice_answer_guide}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {module.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {module.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]"><Tag className="w-2.5 h-2.5 mr-1" />{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EducationHub() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState('all');
  const [editingModule, setEditingModule] = useState(null);
  const [creating, setCreating] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['trainingModules'],
    queryFn: () => base44.entities.TrainingModule.list('-order_position'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.TrainingModule.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['trainingModules']); setCreating(false); toast({ title: 'Module created!' }); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TrainingModule.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['trainingModules']); setEditingModule(null); toast({ title: 'Module updated!' }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TrainingModule.delete(id),
    onSuccess: () => { queryClient.invalidateQueries(['trainingModules']); toast({ title: 'Module deleted' }); },
  });

  const handleTogglePublish = (module) => {
    updateMutation.mutate({ id: module.id, data: { is_published: !module.is_published } });
  };

  const handleMoveUp = (module, index) => {
    if (index === 0) return;
    const prev = filtered[index - 1];
    updateMutation.mutate({ id: module.id, data: { order_position: (prev.order_position || 0) - 1 } });
  };

  const handleMoveDown = (module, index) => {
    if (index === filtered.length - 1) return;
    const next = filtered[index + 1];
    updateMutation.mutate({ id: module.id, data: { order_position: (next.order_position || 0) + 1 } });
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a training module creator for a music artist business platform (Gannon Waye Music). 
Create a detailed training module based on this topic: "${aiPrompt}"
The module should be practical, step-by-step, and focused on what the artist needs to know to run their music business.
Return ONLY a JSON object with these fields:
{
  "title": "string",
  "subtitle": "string", 
  "category": "one of: getting_started, music_business, store_ops, social_media, fan_engagement, analytics, merch, other",
  "module_type": "one of: video, text_image, practice, mixed",
  "content_text": "detailed step-by-step lesson content in plain text",
  "practice_prompt": "a practical exercise for the student",
  "practice_answer_guide": "guidance for completing the exercise",
  "duration_minutes": number,
  "tags": ["array", "of", "relevant", "tags"],
  "agent_notes": "notes for AI agents managing this content"
}`,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            subtitle: { type: 'string' },
            category: { type: 'string' },
            module_type: { type: 'string' },
            content_text: { type: 'string' },
            practice_prompt: { type: 'string' },
            practice_answer_guide: { type: 'string' },
            duration_minutes: { type: 'number' },
            tags: { type: 'array', items: { type: 'string' } },
            agent_notes: { type: 'string' },
          }
        }
      });
      setEditingModule({ ...result, is_published: false, images: [], video_url: '' });
      setCreating(false);
      setAiPrompt('');
      toast({ title: 'Module generated! Review and save.' });
    } catch (err) {
      toast({ title: 'AI generation failed', description: err.message, variant: 'destructive' });
    }
    setAiGenerating(false);
  };

  const filtered = activeCategory === 'all'
    ? modules
    : modules.filter(m => m.category === activeCategory);

  const stats = {
    total: modules.length,
    published: modules.filter(m => m.is_published).length,
    videos: modules.filter(m => m.module_type === 'video' || m.module_type === 'mixed').length,
    practice: modules.filter(m => m.module_type === 'practice' || m.module_type === 'mixed').length,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Education Hub</h1>
          <p className="font-body text-sm text-muted-foreground/60">AI-managed training modules with video, text, images, and practice</p>
        </div>
        <Button onClick={() => { setCreating(true); setEditingModule(null); }} className="gradient-gold-button gap-2">
          <Plus className="w-4 h-4" /> New Module
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Modules', value: stats.total, icon: BookOpen, color: 'text-primary' },
          { label: 'Published', value: stats.published, icon: Eye, color: 'text-green-400' },
          { label: 'With Video', value: stats.videos, icon: Video, color: 'text-red-400' },
          { label: 'Has Practice', value: stats.practice, icon: Dumbbell, color: 'text-purple-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-card/40 border border-border/30 rounded-xl p-4 flex items-center gap-3">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <div>
              <p className="font-display text-2xl text-foreground">{stat.value}</p>
              <p className="font-body text-[10px] text-muted-foreground/50 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Generator */}
      <div className="bg-card/40 border border-primary/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-body text-sm font-semibold text-foreground">Generate Module with AI</h3>
        </div>
        <div className="flex gap-3">
          <Input
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder='e.g. "How to run a successful merch drop" or "Setting up Stripe for music sales"'
            onKeyDown={e => e.key === 'Enter' && generateWithAI()}
            className="flex-1"
          />
          <Button onClick={generateWithAI} disabled={aiGenerating} className="gradient-gold-button shrink-0">
            {aiGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
        <p className="font-body text-[10px] text-muted-foreground/40 mt-2">AI will create a full structured module — you can review and edit before saving</p>
      </div>

      {/* Create / Edit form */}
      <AnimatePresence>
        {(creating || editingModule) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card/60 border border-primary/20 rounded-2xl p-6"
          >
            <h2 className="font-display text-xl text-foreground mb-5">
              {creating ? 'New Training Module' : `Editing: ${editingModule?.title || 'Module'}`}
            </h2>
            <ModuleForm
              module={editingModule}
              isNew={creating}
              onSave={(data) => {
                if (creating) createMutation.mutate(data);
                else updateMutation.mutate({ id: editingModule.id, data });
              }}
              onCancel={() => { setCreating(false); setEditingModule(null); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-1.5 rounded-full font-body text-xs tracking-wider uppercase border transition-all ${activeCategory === 'all' ? 'border-primary bg-primary/15 text-primary' : 'border-border/30 text-muted-foreground/60 hover:border-primary/30'}`}
        >
          All ({modules.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = modules.filter(m => m.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full font-body text-xs tracking-wider uppercase border transition-all ${activeCategory === cat.id ? 'border-primary bg-primary/15 text-primary' : 'border-border/30 text-muted-foreground/60 hover:border-primary/30'}`}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Module list */}
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground/40 font-body">Loading modules...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-body text-muted-foreground/40">No modules yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              onEdit={m => { setEditingModule(m); setCreating(false); }}
              onDelete={(id) => deleteMutation.mutate(id)}
              onTogglePublish={handleTogglePublish}
              onMoveUp={() => handleMoveUp(module, index)}
              onMoveDown={() => handleMoveDown(module, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}