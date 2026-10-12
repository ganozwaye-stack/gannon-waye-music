import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

const PLATFORMS = {tiktok: 'TikTok', instagram_reels: 'Instagram Reels', instagram_feed: 'Instagram Feed', instagram_stories: 'Instagram Stories', facebook: 'Facebook'};
const STATUS_LABELS = {draft:'Draft',pending_approval:'Needs approval',approved:'Approved copy',visual_required:'Media needed',scheduled:'Recorded scheduled',posted:'Recorded posted',rejected:'Rejected'};
const NATIVE_URLS = {tiktok:'https://www.tiktok.com/',instagram_reels:'https://www.instagram.com/',instagram_feed:'https://www.instagram.com/',instagram_stories:'https://www.instagram.com/',facebook:'https://www.facebook.com/'};

export default function ScheduleQueueTab() {
  const [status,setStatus]=useState('all');
  const [platform,setPlatform]=useState('all');
  const [copyState,setCopyState]=useState('');
  const {data:posts=[],isLoading,isError}=useQuery({
    queryKey:['schedule-queue'],
    queryFn:()=>base44.entities.ContentCalendarPost.filter({},'scheduled_date',200),
  });
  const currentPosts=posts.filter(post=>Object.hasOwn(PLATFORMS,post.platform));
  const archivedCount=posts.length-currentPosts.length;
  const visible=currentPosts.filter(post=>(status==='all'||post.status===status)&&(platform==='all'||post.platform===platform));
  async function copy(post) {
    try {
      await navigator.clipboard.writeText([post.caption,post.hashtags,post.cta].filter(Boolean).join('\n\n'));
      setCopyState('Copied draft '+post.id);
    } catch {
      setCopyState('Copy failed. Select the caption below and copy it manually.');
    }
  }
  return (
    <section className="space-y-5 pb-10" data-testid="native-social-queue">
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 font-body text-sm space-y-2">
        <h2 className="text-lg font-semibold text-primary">Instagram, Facebook and TikTok drafts</h2>
        <p>Review the caption and approved media, then finish posting in the platform's own app. Automatic scheduling and verified posting receipts are being prepared.</p>
        <p className="text-muted-foreground">The cancelled scheduler is retired from this queue. Historical scheduled and posted labels are records only; they do not prove a post is live. This screen cannot mark a post as published.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="font-body text-sm">Platform
          <select aria-label="Platform" value={platform} onChange={event=>setPlatform(event.target.value)} className="ml-2 rounded border border-border bg-background p-2">
            <option value="all">All three platforms</option>
            {Object.entries(PLATFORMS).map(([key,label])=><option key={key} value={key}>{label}</option>)}
          </select>
        </label>
        <label className="font-body text-sm">Review status
          <select aria-label="Review status" value={status} onChange={event=>setStatus(event.target.value)} className="ml-2 rounded border border-border bg-background p-2">
            <option value="all">All records</option>
            {Object.entries(STATUS_LABELS).map(([key,label])=><option key={key} value={key}>{label}</option>)}
          </select>
        </label>
      </div>
      <p role="status" className="font-body text-sm text-muted-foreground">{copyState}</p>
      {isLoading ? <p>Loading drafts...</p> : isError ? <p role="alert">Drafts could not be loaded. Retry after checking the connection.</p> : visible.length===0 ? <p>No drafts match this view.</p> : visible.map(post=>(
        <article key={post.id} data-testid="native-social-draft" className="rounded-xl border border-border/50 bg-card/60 p-4 space-y-3 min-w-0">
          <div className="flex flex-wrap justify-between gap-2 font-body text-sm">
            <h3 className="font-semibold">{PLATFORMS[post.platform]} · {post.scheduled_date||'No planned date'}</h3>
            <span>{STATUS_LABELS[post.status]||'Unrecognised status'}</span>
          </div>
          {post.hook && <p className="font-body text-sm">{post.hook}</p>}
          <p className="whitespace-pre-wrap break-words font-body text-sm">{post.caption||'Caption needed'}</p>
          {post.hashtags && <p className="break-words font-body text-xs text-muted-foreground">{post.hashtags}</p>}
          <p className="font-body text-xs text-muted-foreground">{post.media_status==='approved_public' ? 'Media recorded as approved. Check the exact file before native posting.' : 'Media requires review before native posting.'}</p>
          {['scheduled','posted'].includes(post.status) && <p className="font-body text-xs text-primary">Provider receipt unavailable in this record. Live publication has not been verified.</p>}
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" size="sm" disabled={!post.caption} onClick={()=>copy(post)}>Copy native draft</Button>
            <a href={NATIVE_URLS[post.platform]} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-primary underline underline-offset-4">Open {PLATFORMS[post.platform].split(' ')[0]}</a>
          </div>
        </article>
      ))}
      <p className="font-body text-xs text-muted-foreground">Showing up to 200 existing records. {archivedCount>0 && <span>{archivedCount} records for other platforms remain stored outside this three-platform view.</span>}</p>
    </section>
  );
}
