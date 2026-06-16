import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function SubmitForm({ onClose, onSuccess }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ author_name: '', content: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.author_name.trim() || !form.content.trim()) {
      toast({ title: 'Please fill in your name and message', variant: 'destructive' });
      return;
    }
    setLoading(true);
    await base44.entities.FanPost.create({ author_name: form.author_name, content: form.content, status: 'pending' });
    setLoading(false);
    toast({ title: 'Your story has been submitted! 🤍', description: 'It will appear after approval.' });
    onSuccess?.();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-primary/30 rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-foreground">Share Your Story</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Your Name *</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.author_name}
              onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
              className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
            />
          </div>
          <div>
            <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Your Message *</label>
            <textarea
              placeholder="What does this music mean to you?"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={5}
              className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full gradient-gold-button font-body text-sm tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Submit My Story'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function FanWall() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: posts = [] } = useQuery({
    queryKey: ['fanWallPosts', refreshKey],
    queryFn: () => base44.entities.FanPost.filter({ status: 'approved' }, '-created_date', 30),
    initialData: [],
  });

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Community</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4">Fan Wall</h1>
          <p className="font-body text-foreground/60 max-w-xl mx-auto mb-8">
            Every story shared here is a reminder that no one is alone.
          </p>
          <button onClick={() => setShowForm(true)} className="gradient-gold-button rounded-full px-8 py-3 font-body text-sm tracking-wider uppercase inline-flex items-center gap-2">
            <Heart className="w-4 h-4" /> Share Your Moment
          </button>
        </motion.div>

        {posts.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="break-inside-avoid bg-card/60 border border-border/30 rounded-2xl p-5 hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <span className="font-display text-xs text-primary">{post.author_name?.[0]?.toUpperCase() || '?'}</span>
                  </div>
                  <p className="font-body text-sm font-medium text-foreground">{post.author_name || 'Anonymous'}</p>
                </div>
                <p className="font-body text-sm text-foreground/70 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-1 mt-3 text-primary/50">
                  <Heart className="w-3 h-3 fill-primary/30" />
                  <span className="font-body text-[10px]">Shared with love</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground mb-4">No stories yet. Be the first to share yours.</p>
            <button onClick={() => setShowForm(true)} className="gradient-gold-button rounded-full px-8 py-3 font-body text-sm tracking-wider uppercase">
              Share Your Story
            </button>
          </div>
        )}

        <div className="text-center mt-16">
          <button onClick={() => navigate('/')} className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && <SubmitForm onClose={() => setShowForm(false)} onSuccess={() => setRefreshKey(k => k + 1)} />}
      </AnimatePresence>
    </div>
  );
}