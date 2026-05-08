import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music2, Download, Search, CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  uploaded:         { label: 'Uploaded',        color: 'text-blue-400',   bg: 'bg-blue-400/10',  Icon: Clock },
  analysing:        { label: 'Analysing',        color: 'text-yellow-400', bg: 'bg-yellow-400/10',Icon: Zap },
  ready_to_master:  { label: 'Ready',            color: 'text-primary',    bg: 'bg-primary/10',   Icon: Music2 },
  mastering:        { label: 'Mastering',        color: 'text-yellow-400', bg: 'bg-yellow-400/10',Icon: Zap },
  mastered:         { label: 'Mastered',         color: 'text-green-400',  bg: 'bg-green-400/10', Icon: CheckCircle2 },
  exported:         { label: 'Exported',         color: 'text-green-500',  bg: 'bg-green-500/10', Icon: Download },
  failed:           { label: 'Failed',           color: 'text-red-400',    bg: 'bg-red-400/10',   Icon: AlertCircle },
};

export default function MasteringAdmin() {
  const [search, setSearch] = useState('');

  const { data: projects = [] } = useQuery({
    queryKey: ['masteringProjects'],
    queryFn: () => base44.entities.MasteringProject.list('-created_date', 50),
  });

  const filtered = projects.filter(p =>
    !search ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.artist_email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: projects.length,
    mastered: projects.filter(p => p.status === 'mastered' || p.status === 'exported').length,
    pending: projects.filter(p => ['uploaded', 'analysing', 'ready_to_master', 'mastering'].includes(p.status)).length,
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
          { label: 'Total', value: stats.total, color: 'text-foreground' },
          { label: 'Mastered', value: stats.mastered, color: 'text-green-400' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
          { label: 'Failed', value: stats.failed, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/40 rounded-xl p-4">
            <p className={`font-display text-3xl ${s.color}`}>{s.value}</p>
            <p className="font-body text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or email…" className="pl-9" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((proj, i) => {
          const cfg = STATUS_CONFIG[proj.status] || STATUS_CONFIG.uploaded;
          const Icon = cfg.Icon;
          return (
            <motion.div key={proj.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="bg-card border border-border/40 rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display text-sm text-foreground truncate">{proj.title}</p>
                  <Badge variant="outline" className="text-[10px] flex-shrink-0">{proj.file_format?.toUpperCase()}</Badge>
                </div>
                <p className="font-body text-xs text-muted-foreground">{proj.artist_email} · {proj.file_size_mb}MB</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-body text-xs font-medium ${cfg.color}`}>{cfg.label}</p>
                <p className="font-body text-[10px] text-muted-foreground mt-0.5">
                  {proj.mastering_score ? `Score: ${proj.mastering_score}` : '—'}
                </p>
              </div>
              {proj.mastering_profile && (
                <Badge variant="outline" className="text-[10px] flex-shrink-0 hidden sm:flex">
                  {proj.mastering_profile.replace(/_/g, ' ')}
                </Badge>
              )}
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-body text-sm">
            No mastering projects yet.
          </div>
        )}
      </div>
    </div>
  );
}