import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Film, Filter, ChevronDown, ChevronRight, ImageIcon } from 'lucide-react';
import { SectionCard, RowItem, LoadingState, EmptyState, StatusBadge } from '@/components/admin-v3/shared/SharedComponents';
import { CONTENT_STAGES, mapContentStage } from '@/lib/adminV3Adapters';

export default function ContentPublishing() {
  const [stageFilter, setStageFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  const { data: calendarPosts = [], isLoading } = useQuery({
    queryKey: ['v3-ws-calendar'],
    queryFn: () => base44.entities.ContentCalendarPost.list('-created_date', 100),
    staleTime: 30_000,
  });
  const { data: pipelineItems = [] } = useQuery({
    queryKey: ['v3-ws-pipeline'],
    queryFn: () => base44.entities.ContentPipelineItem.list('-created_date', 100),
    staleTime: 30_000,
  });
  const { data: contentPosts = [] } = useQuery({
    queryKey: ['v3-ws-content-posts'],
    queryFn: () => base44.entities.ContentPost.list('-created_date', 50),
    staleTime: 30_000,
  });
  const { data: studioRecords = [] } = useQuery({
    queryKey: ['v3-ws-studio-records'],
    queryFn: () => base44.entities.ContentStudioRecord.list('-created_date', 50),
    staleTime: 30_000,
  });
  const { data: socialAssets = [] } = useQuery({
    queryKey: ['v3-ws-social-assets'],
    queryFn: () => base44.entities.SocialAsset.list('-created_date', 50),
    staleTime: 60_000,
  });
  const { data: manychatDrafts = [] } = useQuery({
    queryKey: ['v3-ws-manychat'],
    queryFn: () => base44.entities.ManyChatKeywordDraft.list('-sort_order', 50),
    staleTime: 30_000,
  });

  // ── Unified content items ──
  const unified = useMemo(() => {
    const items = [
      ...calendarPosts.map(c => ({ ...c, _source: 'ContentCalendarPost', _stage: mapContentStage(c) })),
      ...pipelineItems.map(c => ({ ...c, _source: 'ContentPipelineItem', _stage: mapContentStage(c) })),
      ...contentPosts.map(c => ({ ...c, _source: 'ContentPost', _stage: mapContentStage(c) })),
      ...studioRecords.map(c => ({ ...c, _source: 'ContentStudioRecord', _stage: mapContentStage(c) })),
    ];
    return items;
  }, [calendarPosts, pipelineItems, contentPosts, studioRecords]);

  const platforms = useMemo(() => {
    const set = new Set();
    unified.forEach(i => { if (i.platform) set.add(i.platform); });
    return ['all', ...Array.from(set)];
  }, [unified]);

  const filtered = useMemo(() => {
    let result = unified;
    if (stageFilter !== 'all') result = result.filter(i => i._stage === stageFilter);
    if (platformFilter !== 'all') result = result.filter(i => i.platform === platformFilter);
    return result;
  }, [unified, stageFilter, platformFilter]);

  // ── Count by stage ──
  const stageCounts = useMemo(() => {
    const counts = {};
    CONTENT_STAGES.forEach(s => counts[s] = 0);
    unified.forEach(i => { counts[i._stage] = (counts[i._stage] || 0) + 1; });
    return counts;
  }, [unified]);

  return (
    <div className="space-y-6">
      {/* ── Pipeline overview ── */}
      <div className="border border-border/40 rounded-xl bg-card/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Film className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-medium text-foreground">Content Pipeline</h2>
          <span className="text-[10px] text-muted-foreground/50 ml-2">{unified.length} items across {CONTENT_STAGES.length} stages</span>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {CONTENT_STAGES.map(stage => (
            <button key={stage} onClick={() => setStageFilter(stageFilter === stage ? 'all' : stage)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-colors border ${
                stageFilter === stage ? 'bg-primary/15 text-primary border-primary/30' : 'text-muted-foreground border-border/30 hover:bg-secondary/30'
              }`}>
              {stage} <span className="opacity-50">({stageCounts[stage] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} className="bg-secondary/30 border border-border/40 rounded-lg px-3 py-1.5 text-xs text-foreground">
            {platforms.map(p => <option key={p} value={p}>{p === 'all' ? 'All platforms' : p}</option>)}
          </select>
          {stageFilter !== 'all' && (
            <button onClick={() => setStageFilter('all')} className="text-[10px] text-primary hover:underline">Clear stage filter</button>
          )}
        </div>
      </div>

      {/* ── Content list ── */}
      <SectionCard title={`Content Items${stageFilter !== 'all' ? ` · ${stageFilter}` : ''}`} count={filtered.length} actionLabel="Content studio" actionPath="/admin/content-studio">
        {isLoading ? <LoadingState /> : filtered.length === 0 ? <EmptyState message="No content items in this view." /> : filtered.slice(0, 20).map(item => (
          <ContentRow key={`${item._source}-${item.id}`} item={item} />
        ))}
        {filtered.length > 20 && <p className="text-[10px] text-muted-foreground/50 italic px-3 py-2">Showing first 20 of {filtered.length} items</p>}
      </SectionCard>

      {/* ── Social Assets ── */}
      <SectionCard title="Social Assets" count={socialAssets.length} actionLabel="Asset library" actionPath="/admin/social-asset-library">
        {socialAssets.length === 0 ? <EmptyState message="No social assets." /> : socialAssets.slice(0, 10).map(a => (
          <RowItem key={a.id} title={a.title || a.file_name || 'Asset'} subtitle={`${a.platform || 'Unknown'} · ${a.status || 'raw'}`} status={a.status || 'raw'} statusLevel={a.status === 'approved' ? 'green' : 'grey'} path="/admin/social-asset-library" />
        ))}
      </SectionCard>

      {/* ── ManyChat Drafts ── */}
      <SectionCard title="ManyChat Keyword Drafts" count={manychatDrafts.length} actionLabel="Manage" actionPath="/admin/manychat-drafts">
        {manychatDrafts.length === 0 ? <EmptyState message="No ManyChat drafts." /> : manychatDrafts.slice(0, 10).map(d => (
          <RowItem key={d.id} title={`Keyword: ${d.keyword}`} subtitle={d.song || 'General'} status={d.status} statusLevel={d.status === 'active' ? 'green' : d.status === 'approved' ? 'green' : 'grey'} path="/admin/manychat-drafts" />
        ))}
      </SectionCard>
    </div>
  );
}

function ContentRow({ item }) {
  const [expanded, setExpanded] = useState(false);
  const hasVisual = item.image_url || item.asset_url || item.visual_asset_url;
  return (
    <div className="border-b border-border/20 last:border-0">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30 w-full text-left">
        <span className={`text-[9px] px-1.5 py-0.5 rounded border whitespace-nowrap ${
          item._stage === 'Published' ? 'text-green-400 border-green-500/30' :
          item._stage === 'Waiting for Gannon' ? 'text-orange-400 border-orange-500/30' :
          'text-muted-foreground border-border/30'
        }`}>{item._stage}</span>
        <span className="text-sm text-foreground/80 flex-1 truncate">{item.title || 'Untitled'}</span>
        <span className="text-[9px] text-muted-foreground/40">{item._source.replace('Content', '').replace('CalendarPost', 'Calendar').replace('PipelineItem', 'Pipeline')}</span>
        {!hasVisual && <ImageIcon className="w-3 h-3 text-orange-400" />}
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="px-6 pb-3 space-y-1.5">
          {item.description && <p className="text-[11px] text-muted-foreground">{item.description}</p>}
          {item.caption && <p className="text-[11px] text-muted-foreground/70"><span className="text-muted-foreground/50">Caption:</span> {item.caption}</p>}
          {item.hook && <p className="text-[11px] text-muted-foreground/70"><span className="text-muted-foreground/50">Hook:</span> {item.hook}</p>}
          {item.hashtags && <p className="text-[11px] text-muted-foreground/70"><span className="text-muted-foreground/50">Hashtags:</span> {item.hashtags}</p>}
          {item.platform && <p className="text-[11px] text-muted-foreground/70"><span className="text-muted-foreground/50">Platform:</span> {item.platform}</p>}
          {item.destination_link && <a href={item.destination_link} target="_blank" rel="noreferrer" className="text-[11px] text-primary hover:underline block">Destination link ↗</a>}
          <p className="text-[10px] text-muted-foreground/50">
            <span className="text-muted-foreground/40">Visual:</span> {hasVisual ? '✓ Asset exists' : '✗ No visual asset'}
            {' · '}
            <span className="text-muted-foreground/40">Source:</span> {item._source}
          </p>
        </div>
      )}
    </div>
  );
}