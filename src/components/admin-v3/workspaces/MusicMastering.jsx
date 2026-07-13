import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Music, Disc3, Mic2, FileText, Star, ChevronRight, ChevronDown } from 'lucide-react';
import { SectionCard, RowItem, LoadingState, EmptyState, StatusBadge, StatusDot } from '@/components/admin-v3/shared/SharedComponents';
import { calcReleaseReadiness } from '@/lib/adminV3Metrics';

export default function MusicMastering() {
  const [selectedRelease, setSelectedRelease] = useState(null);

  const { data: releases = [], isLoading } = useQuery({
    queryKey: ['v3-ws-releases'],
    queryFn: () => base44.entities.Release.list('-updated_date', 50),
    staleTime: 30_000,
  });
  const { data: lyrics = [] } = useQuery({
    queryKey: ['v3-ws-lyrics'],
    queryFn: () => base44.entities.Lyric.list('-sort_order', 50),
    staleTime: 30_000,
  });
  const { data: mastering = [] } = useQuery({
    queryKey: ['v3-ws-mastering'],
    queryFn: () => base44.entities.MasteringProject.list('-updated_date', 50),
    staleTime: 30_000,
  });
  const { data: actionPlans = [] } = useQuery({
    queryKey: ['v3-ws-action-plans'],
    queryFn: () => base44.entities.ReleaseActionPlan.list('-updated_date', 100),
    staleTime: 30_000,
  });
  const { data: videos = [] } = useQuery({
    queryKey: ['v3-ws-featured-videos'],
    queryFn: () => base44.entities.FeaturedVideo.list('-updated_date', 20),
    staleTime: 60_000,
  });

  const releaseStatusLevel = (status) => {
    if (status === 'released' || status === 'ready') return 'green';
    if (status === 'mastering' || status === 'mixing' || status === 'recording') return 'orange';
    return 'grey';
  };

  const lyricStatusLevel = (lyric) => {
    if (lyric.is_published) return 'green';
    if (lyric.contains_sensitive_content || lyric.contains_explicit_language) return 'red';
    if (lyric.needs_review || lyric.version_status === 'needs_source') return 'orange';
    return 'grey';
  };

  return (
    <div className="space-y-6">
      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Releases</p><p className="text-xl font-semibold text-foreground">{releases.length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Lyrics</p><p className="text-xl font-semibold text-foreground">{lyrics.length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Mastering Projects</p><p className="text-xl font-semibold text-foreground">{mastering.length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Action Plan Steps</p><p className="text-xl font-semibold text-foreground">{actionPlans.length}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Release List ── */}
        <div className="lg:col-span-1">
          <SectionCard title="Releases" actionLabel="Manage" actionPath="/admin/releases">
            {isLoading ? <LoadingState /> : releases.length === 0 ? <EmptyState message="No releases found." /> : releases.map(r => {
              const readiness = calcReleaseReadiness(r, actionPlans);
              return (
                <button key={r.id} onClick={() => setSelectedRelease(r)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${selectedRelease?.id === r.id ? 'bg-secondary/40' : 'hover:bg-secondary/30'}`}>
                  <StatusDot level={releaseStatusLevel(r.status)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 truncate">{r.title}</p>
                    <p className="text-[10px] text-muted-foreground/50 capitalize">{r.type} · {r.status?.replace('_', ' ')}</p>
                  </div>
                  {readiness.canCalculate && <span className="text-[10px] text-muted-foreground">{readiness.percentage}%</span>}
                </button>
              );
            })}
          </SectionCard>
        </div>

        {/* ── Release Detail ── */}
        <div className="lg:col-span-2">
          {selectedRelease ? (
            <SectionCard title={selectedRelease.title} actionLabel="Open full page" actionPath="/admin/releases">
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-4">
                  {selectedRelease.artwork_url && (
                    <img src={selectedRelease.artwork_url} alt={selectedRelease.title} className="w-24 h-24 rounded-lg object-cover border border-border/40" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-foreground/80">{selectedRelease.description || 'No description'}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <StatusBadge label={selectedRelease.status} level={releaseStatusLevel(selectedRelease.status)} />
                      <StatusBadge label={selectedRelease.type} level="grey" />
                      {selectedRelease.release_date && <StatusBadge label={new Date(selectedRelease.release_date).toLocaleDateString('en-AU')} level="blue" />}
                    </div>
                  </div>
                </div>

                {/* Readiness */}
                {(() => {
                  const readiness = calcReleaseReadiness(selectedRelease, actionPlans);
                  return (
                    <div className="border border-border/30 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Release Readiness</p>
                      {readiness.canCalculate ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-foreground">{readiness.completed}/{readiness.total} steps complete</span>
                            <span className="text-sm font-semibold text-primary">{readiness.percentage}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary/40 overflow-hidden">
                            <div className="h-full rounded-full bg-primary/60" style={{ width: `${readiness.percentage}%` }} />
                          </div>
                          {readiness.missingSteps.length > 0 && (
                            <div className="mt-2">
                              <p className="text-[10px] text-muted-foreground/60 mb-1">Missing steps:</p>
                              {readiness.missingSteps.slice(0, 5).map((s, i) => <p key={i} className="text-[10px] text-muted-foreground">· {s}</p>)}
                            </div>
                          )}
                          <p className="text-[9px] text-muted-foreground/40 italic mt-2">Formula: {readiness.formula || 'ReleaseActionPlan steps with status=complete ÷ total steps'}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-muted-foreground">{readiness.missingRequirements}</p>
                          <p className="text-[9px] text-muted-foreground/40 italic mt-1">Showing actual release status only — no checklist available to calculate readiness.</p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Links */}
                <div className="grid grid-cols-2 gap-2">
                  {selectedRelease.spotify_link && <a href={selectedRelease.spotify_link} target="_blank" rel="noreferrer" className="text-xs text-green-400 hover:underline">Spotify ↗</a>}
                  {selectedRelease.apple_music_link && <a href={selectedRelease.apple_music_link} target="_blank" rel="noreferrer" className="text-xs text-pink-400 hover:underline">Apple Music ↗</a>}
                  {selectedRelease.youtube_link && <a href={selectedRelease.youtube_link} target="_blank" rel="noreferrer" className="text-xs text-red-400 hover:underline">YouTube ↗</a>}
                </div>

                {/* Matching mastering projects */}
                {mastering.filter(m => m.release_title === selectedRelease.title || m.title === selectedRelease.title).length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Matching Mastering Projects</p>
                    {mastering.filter(m => m.release_title === selectedRelease.title || m.title === selectedRelease.title).map(m => (
                      <div key={m.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-card/20 border border-border/20 mb-1">
                        <Mic2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-foreground/70 flex-1 truncate">{m.title || m.release_title || 'Mastering project'}</span>
                        <StatusBadge label={m.status || 'unknown'} level={m.status === 'completed' ? 'green' : m.status === 'in_progress' ? 'orange' : 'grey'} />
                      </div>
                    ))}
                  </div>
                )}

                <Link to="/admin/mastering" className="text-xs text-primary hover:underline flex items-center gap-1">Mastering room <ChevronRight className="w-3 h-3" /></Link>
              </div>
            </SectionCard>
          ) : (
            <SectionCard title="Release Detail">
              <EmptyState message="Select a release from the left to view its workspace." icon={Disc3} />
            </SectionCard>
          )}
        </div>
      </div>

      {/* ── Lyrics ── */}
      <SectionCard title="Lyrics — Publishing Status" count={lyrics.length} actionLabel="Lyrics archive" actionPath="/admin/lyrics-archive">
        {lyrics.length === 0 ? <EmptyState message="No lyrics stored." /> : lyrics.slice(0, 10).map(lyric => (
          <RowItem key={lyric.id}
            title={lyric.title}
            subtitle={`Source: ${lyric.source || '—'} · ${lyric.version_status || 'unverified'}`}
            status={lyric.is_published ? 'Published' : lyric.needs_review ? 'Needs Review' : 'Private'}
            statusLevel={lyricStatusLevel(lyric)}
            path="/admin/lyrics-archive"
          />
        ))}
      </SectionCard>

      {/* ── Featured Videos ── */}
      {videos.length > 0 && (
        <SectionCard title="Featured Videos" count={videos.length} actionLabel="Video management" actionPath="/admin/videos">
          {videos.slice(0, 5).map(v => (
            <RowItem key={v.id} title={v.title || 'Untitled video'} subtitle={v.platform || 'Video'} status={v.is_published ? 'Live' : 'Draft'} statusLevel={v.is_published ? 'green' : 'grey'} path="/admin/videos" />
          ))}
        </SectionCard>
      )}
    </div>
  );
}