import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Send, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function Community() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState({ author_name: '', author_email: '', content: '' });

  const { data: posts } = useQuery({
    queryKey: ['fanPosts'],
    queryFn: () => base44.entities.FanPost.list('-created_date', 50),
    initialData: [],
  });

  const createPost = useMutation({
    mutationFn: (data) => base44.entities.FanPost.create(data),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['fanPosts'] });
      const prev = queryClient.getQueryData(['fanPosts']);
      queryClient.setQueryData(['fanPosts'], (old) => [
        { ...newPost, id: Date.now(), created_date: new Date().toISOString() },
        ...(old || []),
      ]);
      return { prev };
    },
    onError: (err, newPost, ctx) => {
      queryClient.setQueryData(['fanPosts'], ctx.prev);
      toast({ title: 'Error posting message', variant: 'destructive' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fanPosts'] });
      setNewPost({ author_name: '', author_email: '', content: '' });
      toast({ title: 'Posted!', description: 'Your message is live.' });
    },
  });

  const PROFANITY_LIST = [
    'fuck','shit','cunt','bitch','asshole','bastard','damn','dick','pussy','cock',
    'ass','piss','bollocks','wanker','twat','arsehole','motherfucker','faggot','slut','whore'
  ];

  const containsProfanity = (text) => {
    const lower = text.toLowerCase();
    return PROFANITY_LIST.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(lower);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.content.trim() || !newPost.author_name.trim()) {
      toast({ title: 'Please fill in your name and message', variant: 'destructive' });
      return;
    }
    if (containsProfanity(newPost.content) || containsProfanity(newPost.author_name)) {
      toast({ title: 'Please keep it respectful 🙏', description: 'This is a safe space, no profanity allowed.', variant: 'destructive' });
      return;
    }
    createPost.mutate(newPost);
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Connect</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6">Community</h1>
          <p className="font-body text-foreground/60 mt-4 max-w-lg mx-auto leading-relaxed">
            This is a safe space for everyone. Whether you're here for the music, the message, or because something in 
            a lyric hit a little too close to home, you belong here. No judgement, just connection.
          </p>
          <p className="font-body text-muted-foreground text-sm mt-3 max-w-md mx-auto">
            You are not alone. Share your thoughts, your story, or just say hello.
          </p>
        </motion.div>

        {/* Crisis support note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center"
        >
          <p className="font-body text-xs tracking-widest uppercase text-primary mb-1">If you need support right now</p>
          <p className="font-body text-sm text-foreground/60">
            Australia: <a href="tel:1800737732" className="text-primary hover:underline">1800RESPECT (1800 737 732)</a> · 
            Lifeline: <a href="tel:131114" className="text-primary hover:underline">13 11 14</a>
          </p>
        </motion.div>

        {/* Post Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/40 rounded-2xl p-6 mb-10"
        >
          <h3 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" /> Leave a Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Name *</Label>
                <Input
                  value={newPost.author_name}
                  onChange={e => setNewPost({ ...newPost, author_name: e.target.value })}
                  placeholder="Your name"
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Email (optional)</Label>
                <Input
                  type="email"
                  value={newPost.author_email}
                  onChange={e => setNewPost({ ...newPost, author_email: e.target.value })}
                  placeholder="your@email.com"
                  className="bg-secondary/50"
                />
              </div>
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Message *</Label>
              <Textarea
                value={newPost.content}
                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Share your thoughts..."
                className="bg-secondary/50 min-h-[100px]"
              />
            </div>
            <Button type="submit" className="rounded-full gap-2 font-body tracking-wider uppercase gradient-gold-button border-0" disabled={createPost.isPending}>
              <Send className="w-4 h-4" /> {createPost.isPending ? 'Posting...' : 'Post'}
            </Button>
          </form>
        </motion.div>

        {/* Fan Wall */}
        <div className="mb-6 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">
            {posts.length} message{posts.length !== 1 ? 's' : ''} from the community
          </h3>
        </div>

        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border/40 rounded-xl p-5 hover:border-primary/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-display text-sm text-primary">
                      {post.author_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{post.author_name || 'Anonymous'}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy') : ''}
                    </p>
                  </div>
                </div>
              </div>
              <p className="font-body text-foreground/80 leading-relaxed text-sm pl-11">{post.content}</p>
            </motion.div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-16">
              <MessageCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-body text-muted-foreground">Be the first to leave a message.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}