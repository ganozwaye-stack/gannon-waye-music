import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Film, Plus, X, RefreshCw, Play, AlertCircle, CheckCircle2, Clock, Loader2, Bot, ExternalLink } from 'lucide-react';

const STATUS_STYLES = {
  queued: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-green-500/20 text-green-400',
  failed: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-secondary text-muted-foreground',
};

const STATUS_ICONS = {
  queued: Clock,
  processing: Loader2,
  completed: CheckCircle2,
  failed: AlertCircle,
  cancelled: X,
};

const EMPTY_FORM = {
  title: '',
  script: '',
  avatar_id: '',
  voice_id: '',
  resolution: '1080p',
  aspect_ratio: '9:16',
  engine: 'avatar_iv',
  related_release: '',
  agent_generated_by: '',
};

export default function ProductionTracker() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [generating, setGenerating] = useState(false);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['ContentProductionJob'],
    queryFn: () => base44.entities.ContentProductionJob.list('-created_date', 100),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ContentProductionJob.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ContentProductionJob'] }),
  });

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  const stats = {
    total: jobs.length,
    queued: jobs.filter(j => j.status === 'queued').length,
    processing: jobs.filter(j => j.status === 'processing').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  };

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const response = await base44.functions.invoke('generateHeyGenVideo', form);
      if (response.data?.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['ContentProductionJob'] });
        setShowForm(false);
        setForm(EMPTY_FORM);
      } else {
        alert(response.data?.error || 'Failed to generate video');
      }
    } catch (err) {
      alert(err.message || 'Failed to generate video');
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Admin · Private</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Production Tracker</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Track AI video generation, content production jobs, and automated agent output from research to publish.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New HeyGen Video'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground', icon: Film },
          { label: 'Queued', value: stats.queued, color: 'text-blue-400', icon: Clock },
          { label: 'Processing', value: stats.processing, color: 'text-yellow-400', icon: Loader2 },
          { label: 'Completed', value: stats.completed, color: 'text-green-400', icon: CheckCircle2 },
          { label: 'Failed', value: stats.failed, color: 'text-red-400', icon: AlertCircle },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              <span className="text-xl font-semibold text-foreground">{s.value}</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'queued', 'processing', 'completed', 'failed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
              filter === f ? 'bg-primary text-primary-foreground' : 'border border-border/40 text-muted-foreground hover:border-primary/40'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['ContentProductionJob'] })}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 text-xs"
        >
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleGenerate} className="p-5 rounded-xl border border-border/40 bg-card space-y-3">
          <h3 className="font-display text-lg text-foreground">Generate HeyGen Avatar Video</h3>
          <p className="text-xs text-muted-foreground">
            Enter your Digital Twin avatar ID and voice ID (from your HeyGen dashboard). The video will be generated and you'll be notified via webhook when ready.
          </p>
          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Title</label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Thank You — Behind the Song" className="bg-secondary/50" required />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Script (what the avatar says)</label>
            <Textarea value={form.script} onChange={e => set('script', e.target.value)} placeholder="Write the script for your AI avatar..." className="bg-secondary/50" rows={4} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">HeyGen Avatar ID</label>
              <Input value={form.avatar_id} onChange={e => set('avatar_id', e.target.value)} placeholder="Digital Twin look ID" className="bg-secondary/50 font-mono text-xs" required />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">HeyGen Voice ID</label>
              <Input value={form.voice_id} onChange={e => set('voice_id', e.target.value)} placeholder="Voice ID" className="bg-secondary/50 font-mono text-xs" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Engine</label>
              <select value={form.engine} onChange={e => set('engine', e.target.value)} className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 text-sm">
                <option value="avatar_iv">Avatar IV (Standard)</option>
                <option value="avatar_v">Avatar V (Higher Quality)</option>
                <option value="avatar_iii">Avatar III</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Resolution</label>
              <select value={form.resolution} onChange={e => set('resolution', e.target.value)} className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 text-sm">
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="4k">4K</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Aspect Ratio</label>
              <select value={form.aspect_ratio} onChange={e => set('aspect_ratio', e.target.value)} className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 text-sm">
                <option value="9:16">9:16 (Vertical/Reels)</option>
                <option value="16:9">16:9 (Horizontal)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Related Release</label>
              <Input value={form.related_release} onChange={e => set('related_release', e.target.value)} placeholder="Song title (optional)" className="bg-secondary/50" />
            </div>
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Agent Source (optional)</label>
            <Input value={form.agent_generated_by} onChange={e => set('agent_generated_by', e.target.value)} placeholder="e.g. literature_researcher" className="bg-secondary/50" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={generating} className="gap-2">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
              {generating ? 'Starting generation...' : 'Start Video Generation'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
          <p className="text-[10px] text-muted-foreground/60">
            Webhook URL: https://api.base44.app/api/v2/apps/{'{app_id}'}/webhook/heygen — register this in your HeyGen dashboard.
          </p>
        </form>
      )}

      {/* Jobs list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Film className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No production jobs yet. Click "New HeyGen Video" to start.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(job => {
            const StatusIcon = STATUS_ICONS[job.status] || Clock;
            return (
              <div key={job.id} className="p-4 rounded-xl border border-border/40 bg-card space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <StatusIcon className={`w-3.5 h-3.5 ${job.status === 'processing' ? 'animate-spin' : ''}`} />
                      <span className="font-body text-sm font-semibold text-foreground">{job.title}</span>
                      <Badge className={`text-[9px] border-0 ${STATUS_STYLES[job.status] || ''}`}>{job.status}</Badge>
                      {job.agent_generated && (
                        <Badge className="text-[9px] border-0 bg-purple-500/20 text-purple-400 flex items-center gap-1">
                          <Bot className="w-2.5 h-2.5" /> {job.agent_generated_by || 'agent'}
                        </Badge>
                      )}
                      {job.heygen_engine && <Badge className="text-[9px] border-0 bg-secondary text-muted-foreground">{job.heygen_engine}</Badge>}
                    </div>
                    {job.script && <p className="font-body text-xs text-muted-foreground/70 line-clamp-2">{job.script}</p>}
                    {job.error_message && <p className="font-body text-xs text-red-400/80 mt-1">⚠ {job.error_message}</p>}
                    {job.research_sources && job.research_sources.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <span className="text-[10px] text-muted-foreground/50">Sources:</span>
                        {job.research_sources.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[10px] text-blue-400/60 bg-blue-500/5 rounded px-1.5 py-0.5">{s}</span>
                        ))}
                      </div>
                    )}
                    {job.video_url && job.status === 'completed' && (
                      <div className="flex items-center gap-2 mt-2">
                        <a href={job.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <Play className="w-3 h-3" /> Download Video
                        </a>
                        {job.video_share_url && (
                          <a href={job.video_share_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                            <ExternalLink className="w-3 h-3" /> Share Link
                          </a>
                        )}
                      </div>
                    )}
                    {job.video_url && job.status === 'completed' && (
                      <video src={job.video_url} controls className="mt-2 w-full max-w-xs rounded-lg border border-border/40" />
                    )}
                  </div>
                  <button onClick={() => deleteMutation.mutate(job.id)} className="p-1.5 rounded hover:bg-secondary shrink-0">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}