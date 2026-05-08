import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Music, Search, Clock, CheckCircle2, AlertCircle, Loader2, Zap, Download, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const STATUS_CONFIG = {
  uploaded:        { label: 'Uploaded',   color: 'bg-blue-500/10 text-blue-400',     icon: Clock },
  analysing:       { label: 'Analysing',  color: 'bg-yellow-500/10 text-yellow-400', icon: Loader2 },
  ready_to_master: { label: 'Ready',      color: 'bg-primary/10 text-primary',        icon: Zap },
  mastering:       { label: 'Mastering',  color: 'bg-orange-500/10 text-orange-400', icon: Loader2 },
  mastered:        { label: 'Mastered',   color: 'bg-green-500/10 text-green-400',   icon: CheckCircle2 },
  exported:        { label: 'Exported',   color: 'bg-green-700/10 text-green-300',   icon: CheckCircle2 },
  failed:          { label: 'Failed',     color: 'bg-red-500/10 text-red-400',       icon: AlertCircle },
};

function ProjectRow({ project }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(project.notes || '');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.MasteringProject.update(project.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masteringProjects'] });
      toast({ title: 'Notes saved' });
    },
  });

  const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.uploaded;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/40 rounded-xl overflow-hidden"
    >
      {/* Summary row */}
      <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
          <Music className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm text-foreground truncate">{project.title}</p>
          <p className="font-body text-xs text-muted-foreground">
            {project.artist_name ? `${project.artist_name} · ` : ''}{project.artist_email}
          </p>
        </div>
        <Badge className={`${cfg.color} border-0 text-xs flex items-center gap-1 flex-shrink-0`}>
          <Icon className="w-3 h-3" /> {cfg.label}
        </Badge>
        {project.mastering_profile && (
          <p className="font-body text-[10px] text-muted-foreground hidden md:block">{project.mastering_profile.replace(/_/g, ' ')}</p>
        )}
        {project.streaming_score != null && (
          <div className="text-right flex-shrink-0 hidden md:block">
            <p className="font-display text-lg text-primary">{project.streaming_score}</p>
            <p className="font-body text-[10px] text-muted-foreground">stream score</p>
          </div>
        )}
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border/40 p-4 space-y-4 bg-secondary/20">
          {/* Analysis data */}
          {project.analysis && !project.analysis.decode_failed && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-body">
              <div className="bg-card rounded-lg p-3">
                <p className="text-muted-foreground">Input Loudness</p>
                <p className="text-foreground font-medium mt-0.5">{project.analysis.lufs ?? '—'} LUFS</p>
              </div>
              <div className="bg-card rounded-lg p-3">
                <p className="text-muted-foreground">Input Peak</p>
                <p className={`font-medium mt-0.5 ${project.analysis.peak_db >= 0 ? 'text-red-400' : 'text-foreground'}`}>
                  {project.analysis.peak_db ?? '—'} dBTP
                </p>
              </div>
              <div className="bg-card rounded-lg p-3">
                <p className="text-muted-foreground">Dynamic Range</p>
                <p className="text-foreground font-medium mt-0.5">{project.analysis.dynamic_range ?? '—'} dB</p>
              </div>
              <div className="bg-card rounded-lg p-3">
                <p className="text-muted-foreground">Stereo Width</p>
                <p className="text-foreground font-medium mt-0.5">{project.analysis.stereo_width ?? '—'}%</p>
              </div>
              {project.analysis.clipping_detected && (
                <div className="col-span-2 md:col-span-4 flex items-center gap-2 text-red-400 text-xs">
                  <AlertCircle className="w-3 h-3" /> Clipping detected in source file
                </div>
              )}
            </div>
          )}

          {/* Settings applied */}
          {project.settings && (
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">DSP Settings Applied</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(project.settings).map(([k, v]) => (
                  <span key={k} className="font-body text-[10px] bg-secondary/50 rounded px-2 py-1 text-muted-foreground">
                    {k.replace(/_/g, ' ')}: {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          <div className="flex flex-wrap gap-3">
            {project.file_url && (
              <a href={project.file_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-2 text-xs rounded-full">
                  <Download className="w-3 h-3" /> Original File
                </Button>
              </a>
            )}
            {project.mastered_file_url && (
              <a href={project.mastered_file_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gap-2 text-xs rounded-full gradient-gold-button border-0">
                  <Download className="w-3 h-3" /> Mastered File
                </Button>
              </a>
            )}
          </div>

          {/* Engineer notes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Engineer Notes</p>
            </div>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this project, recommended revisions, feedback to artist..."
              className="bg-card border-border/40 text-sm min-h-[80px]"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="font-body text-[10px] text-muted-foreground">
                Submitted: {project.created_date ? new Date(project.created_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </p>
              <Button
                size="sm"
                onClick={() => saveMutation.mutate({ notes })}
                disabled={saveMutation.isPending}
                className="rounded-full text-xs"
              >
                {saveMutation.isPending ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </div>

          {/* Status update */}
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-body text-xs text-muted-foreground">Mark as:</p>
            {['ready_to_master', 'mastered', 'exported', 'failed'].map(s => (
              <button
                key={s}
                onClick={() => saveMutation.mutate({ status: s })}
                className={`font-body text-xs px-3 py-1 rounded-full border transition-all ${
                  project.status === s
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/40 text-muted-foreground hover:border-primary/30'
                }`}
              >
                {STATUS_CONFIG[s]?.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function MasteringAdmin() {
  const [search, setSearch] = useState('');

  const { data: projects = [] } = useQuery({
    queryKey: ['masteringProjects'],
    queryFn: () => base44.entities.MasteringProject.list('-created_date'),
  });

  const filtered = projects.filter(p =>
    !search ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.artist_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.artist_email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: projects.length,
    pending: projects.filter(p => ['uploaded', 'analysing', 'ready_to_master', 'mastering'].includes(p.status)).length,
    mastered: projects.filter(p => p.status === 'mastered' || p.status === 'exported').length,
    failed: projects.filter(p => p.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">Mastering Queue</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Engineer review panel · {projects.length} total projects</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-primary' },
          { label: 'In Progress', value: stats.pending, color: 'text-yellow-400' },
          { label: 'Mastered', value: stats.mastered, color: 'text-green-400' },
          { label: 'Failed', value: stats.failed, color: 'text-red-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border/40 rounded-xl p-4">
            <p className={`font-display text-2xl ${s.color}`}>{s.value}</p>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by title, artist, or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary/50" />
      </div>

      <div className="space-y-3">
        {filtered.map(project => <ProjectRow key={project.id} project={project} />)}
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-card border border-border/40 rounded-2xl">
            <Music className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="font-body text-muted-foreground">No mastering projects yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}