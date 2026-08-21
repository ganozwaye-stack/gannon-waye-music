import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const getSession = () => {
  let s = localStorage.getItem('gw_session');
  if (!s) {
    s = 's_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('gw_session', s);
  }
  return s;
};

export default function FanWallPost({ post, index }) {
  const qc = useQueryClient();
  const [showReply, setShowReply] = useState(false);
  const [replyName, setReplyName] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const session = getSession();

  const { data: likes = [] } = useQuery({
    queryKey: ['postLikes', post.id],
    queryFn: () => base44.entities.CommunityLike.filter({ target_type: 'post', target_id: post.id }),
    initialData: [],
  });

  const { data: replies = [] } = useQuery({
    queryKey: ['postReplies', post.id],
    queryFn: () => base44.entities.CommunityReply.filter({ post_id: post.id, status: 'approved' }, 'created_date'),
    initialData: [],
  });

  const hasLiked = likes.some(l => l.liker_session === session);

  const handleLike = async () => {
    if (hasLiked) return;
    try {
      await base44.entities.CommunityLike.create({
        target_type: 'post',
        target_id: post.id,
        liker_name: post.author_name || 'Fan',
        liker_session: session,
      });
      qc.invalidateQueries({ queryKey: ['postLikes', post.id] });
    } catch {}
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyName.trim() || !replyText.trim()) return;
    setSending(true);
    try {
      await base44.entities.CommunityReply.create({
        post_id: post.id,
        author_name: replyName.trim(),
        content: replyText.trim(),
        status: 'pending',
      });
      setSent(true);
      setReplyText('');
    } catch {}
    setSending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index || 0) * 0.05 }}
      className="break-inside-avoid bg-card/60 border border-border/30 rounded-2xl p-5 hover:border-primary/20 transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="font-display text-xs text-primary">{post.author_name?.[0]?.toUpperCase() || '?'}</span>
        </div>
        <p className="font-body text-sm font-medium text-foreground">{post.author_name || 'Anonymous'}</p>
      </div>
      <p className="font-body text-sm text-foreground/70 leading-relaxed">{post.content}</p>

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={handleLike}
          disabled={hasLiked}
          className={`flex items-center gap-1.5 transition-all ${hasLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-primary' : ''}`} />
          <span className="font-body text-xs">{likes.length || 0}</span>
          <span className="font-body text-[10px] uppercase tracking-wider">{hasLiked ? 'Liked' : 'Like'}</span>
        </button>
        <button
          onClick={() => setShowReply(s => !s)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-body text-[10px] uppercase tracking-wider">Reply</span>
        </button>
      </div>

      {replies.length > 0 && (
        <div className="mt-4 pl-4 border-l border-primary/20 space-y-2">
          {replies.map(r => (
            <div key={r.id} className="bg-secondary/30 rounded-xl p-3">
              <p className="font-body text-xs font-medium text-primary mb-1">{r.author_name || 'Fan'}</p>
              <p className="font-body text-xs text-foreground/70 leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showReply && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleReply}
            className="mt-4 space-y-2 overflow-hidden"
          >
            {sent ? (
              <p className="font-body text-xs text-primary/80 italic">Thank you — your reply will appear once Gannon approves it. 🤍</p>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Your name"
                  value={replyName}
                  onChange={e => setReplyName(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                />
                <textarea
                  placeholder="Write a reply…"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={2}
                  className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 resize-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-2 rounded-full gradient-gold-button font-body text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />} Send Reply
                </button>
              </>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}