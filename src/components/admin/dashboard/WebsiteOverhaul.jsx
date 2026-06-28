import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';

const CATEGORY_LABELS = {
  public_music_brand: 'Public Music Brand',
  release_pages: 'Release Pages',
  lyrics_archive: 'Lyrics Archive',
  mums_garden: "Mum's Garden",
  merch_store: 'Merch Store',
  press_pitch: 'Press & Pitch',
  subscribe_fan_list: 'Subscribe & Fan List',
  email_system: 'Email System',
  social_posting: 'Social Posting',
  manychat: 'ManyChat',
  metricool: 'Metricool',
  content_studio: 'Content Studio',
  google_drive: 'Google Drive',
  legal_privacy: 'Legal & Privacy',
  performance_mobile: 'Performance & Mobile',
  accessibility: 'Accessibility',
  other: 'Other',
};

const PRIORITY_DOT = { critical: 'bg-red-500', high: 'bg-amber-500', medium: 'bg-blue-500', low: 'bg-muted-foreground' };
const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export default function WebsiteOverhaul() {
  const { data: tasks = [] } = useQuery({
    queryKey: ['websiteOverhaulTasks'],
    queryFn: () => base44.entities.WebsiteOverhaulTask.filter({ status: { $ne: 'complete' } }, 'sort_order'),
  });

  const sorted = [...tasks].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3));
  const byCategory = sorted.reduce((acc, t) => {
    const cat = t.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Website Overhaul Master List</h2>
        <span className="font-body text-xs text-muted-foreground ml-auto">{sorted.length} unfinished</span>
      </div>

      {sorted.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-6 text-center">All caught up. Every page is in place. 🤍</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(byCategory).map(([cat, items]) => (
            <div key={cat}>
              <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground/60 mb-2">
                {CATEGORY_LABELS[cat] || cat}
              </p>
              <div className="space-y-1.5">
                {items.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-lg bg-secondary/20 px-3 py-2">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[t.priority] || PRIORITY_DOT.low}`} />
                    <span className="font-body text-xs text-foreground/80 flex-1">{t.title}</span>
                    {t.status === 'blocked' && <span className="font-body text-[10px] text-red-400">Blocked</span>}
                    {t.related_page && (
                      <Link to={t.related_page} className="shrink-0">
                        <ArrowRight className="w-3 h-3 text-primary/60 hover:text-primary" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}