import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Music, Search, Clock, CheckCircle2, AlertCircle, Loader2, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  uploaded:        { label: 'Uploaded',         color: 'bg-blue-500/10 text-blue-400',   icon: Clock },
  analysing:       { label: 'Analysing',         color: 'bg-yellow-500/10 text-yellow-400', icon: Loader2 },
  ready_to_master: { label: 'Ready',             color: 'bg-primary/10 text-primary',     icon: Zap },
  mastering:       { label: 'Mastering',         color: 'bg-orange-500/10 text-orange-400', icon: Loader2 },
  mastered:        { label: 'Mastered',          color: 'bg-green-500/10 text-green-400', icon: CheckCircle2 },
  exported:        { label: 'Exported',          color: 'bg-green-700/10 text-green-300', icon: CheckCircle2 },
  failed:          { label: 'Failed',            color: 'bg-red-500/10 text-red-400',     icon: AlertCircle },
};

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
        <h1 className="font-display text-3xl text-foreground">Mastering Projects</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">{projects.length} total projects</p>
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
        {filtered.map((project, i) => {
          const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.uploaded;
          const Icon = cfg.icon;
          return (
            <motion.div key={project.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="bg-card border border-border/40 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
                <Music className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm text-foreground truncate">{project.title}</p>
                <p className="font-body text-xs text-muted-foreground">{project.artist_name || project.artist_email}</p>
              </div>
              <div className="text-right flex-shrink-0 space-y-1">
                <Badge className={`${cfg.color} border-0 text-xs flex items-center gap-1`}>
                  <Icon className="w-3 h-3" /> {cfg.label}
                </Badge>
                {project.mastering_profile && (
                  <p className="font-body text-[10px] text-muted-foreground">{project.mastering_profile.replace(/_/g, ' ')}</p>
                )}
              </div>
              {project.streaming_score != null && (
                <div className="text-right flex-shrink-0">
                  <p className="font-display text-lg text-primary">{project.streaming_score}</p>
                  <p className="font-body text-[10px] text-muted-foreground">stream score</p>
                </div>
              )}
            </motion.div>
          );
        })}

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