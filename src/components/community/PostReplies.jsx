import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

function getLikerSession() {
  let s = localStorage.getItem('_fan_session');
  if (!s) { s = Math.random().toString(36).slice(2); localStorage.setItem('_fan_session', s); }
  return s;
}

export default function PostReplies({ postId }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ author_name: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const session = getLikerSession();

  const { data: replies = [] } = useQuery({
    queryKey: ['replies', postId],
    queryFn: () => base44.entities.CommunityReply.filter({ post_id: postId, status: 'approved' }, 'created_date', 50),
    enabled: open,
  });

  const { data: postLikes = [] } = useQuery({
    queryKey: ['likes', 'post', postId],
    queryFn: () => base44.entities.CommunityLike.filter({ target_type: 'post', target_id: postId }),
  });

  const likedPost = postLikes.some(l => l.liker_session === session);

  const likePost = useMutation({
    mutationFn: async () => {
      if (likedPost) return;
      return base44.entities.CommunityLike.create({ target_type: 'post', target_id: postId, liker_session: session });
    },
    onMutate: () => {
      // Optimistic update — immediately show liked state
      queryClient.setQueryData(['likes', 'post', postId], (old = []) => [
        ...old,
        { target_type: 'post', target_id: postId, liker_session: session, id: 'optimistic' }
      ]);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['likes', 'post', postId] }),
    onError: () => queryClient.invalidateQueries({ queryKey: ['likes', 'post', postId] }),
  });

  const submitReply = async (e) => {
    e.preventDefault();
    if (!form.content.trim() || !form.author_name.trim()) {
      toast.error('Name and message required');
      return;
    }
    setSubmitting(true);
    try {
      await base44.functions.invoke('communityReplyHandler', {
        post_id: postId,
        author_name: form.author_name,
        content: form.content,
      });
      setForm({ author_name: '', content: '' });
      queryClient.invalidateQueries({ queryKey: ['replies', postId] });
      toast.success('Reply submitted for review ✓');
    } catch (err) {
      toast.error('Failed to submit reply');
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-3 pl-11">
      {/* Like + Reply controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => likePost.mutate()}
          disabled={likedPost}
          className={`flex items-center gap-1 text-xs transition-colors ${likedPost ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${likedPost ? 'fill-red-400' : ''}`} />
          {postLikes.length > 0 && <span>{postLikes.length}</span>}
        </button>

        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {replies.length > 0 ? `${replies.length} repl${replies.length === 1 ? 'y' : 'ies'}` : 'Reply'}
          {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3">
          {/* Existing replies */}
          {replies.map(reply => (
            <ReplyItem key={reply.id} reply={reply} session={session} />
          ))}

          {/* Reply form */}
          <form onSubmit={submitReply} className="bg-secondary/30 rounded-xl p-3 space-y-2 border border-border/40">
            <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Leave a reply</p>
            <Input
              placeholder="Your name"
              value={form.author_name}
              onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
              className="bg-background/50 text-sm h-8"
            />
            <Textarea
              placeholder="Write your reply..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="bg-background/50 text-sm min-h-[60px] resize-none"
            />
            <Button type="submit" size="sm" disabled={submitting} className="gradient-gold-button border-0 h-7 text-xs">
              <Send className="w-3 h-3 mr-1" />{submitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

function ReplyItem({ reply, session }) {
  const queryClient = useQueryClient();

  const { data: likes = [] } = useQuery({
    queryKey: ['likes', 'reply', reply.id],
    queryFn: () => base44.entities.CommunityLike.filter({ target_type: 'reply', target_id: reply.id }),
  });

  const liked = likes.some(l => l.liker_session === session);

  const likeReply = useMutation({
    mutationFn: async () => {
      if (liked) return;
      return base44.entities.CommunityLike.create({ target_type: 'reply', target_id: reply.id, liker_session: session });
    },
    onMutate: () => {
      queryClient.setQueryData(['likes', 'reply', reply.id], (old = []) => [
        ...old,
        { target_type: 'reply', target_id: reply.id, liker_session: session, id: 'optimistic' }
      ]);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['likes', 'reply', reply.id] }),
    onError: () => queryClient.invalidateQueries({ queryKey: ['likes', 'reply', reply.id] }),
  });

  return (
    <div className="flex items-start gap-2 py-2 border-l-2 border-primary/20 pl-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="font-display text-xs text-primary">{reply.author_name?.[0]?.toUpperCase() || '?'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{reply.author_name}</span>
          {reply.is_admin_reply && <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Gannon</span>}
          <span className="text-xs text-muted-foreground">{reply.created_date ? format(new Date(reply.created_date), 'MMM d') : ''}</span>
        </div>
        <p className="text-xs text-foreground/70 mt-0.5 leading-relaxed">{reply.content}</p>
        <button
          onClick={() => likeReply.mutate()}
          disabled={liked}
          className={`flex items-center gap-1 mt-1 text-xs transition-colors ${liked ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}
        >
          <Heart className={`w-3 h-3 ${liked ? 'fill-red-400' : ''}`} />
          {likes.length > 0 && <span>{likes.length}</span>}
        </button>
      </div>
    </div>
  );
}