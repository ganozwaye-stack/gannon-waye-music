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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fanPosts'] });
      setNewPost({ author_name: '', author_email: '', content: '' });
      toast({ title: 'Posted!', description: 'Your message is live.' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.content.trim() || !newPost.author_name.trim()) {
      toast({ title: 'Please fill in your name and message', variant: 'destructive' });
      return;
    }
    createPost.mutate(newPost);
  };

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">Connect</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground">Community</h1>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">
            Join the conversation. Share your thoughts, connect with fellow fans, and be part of the journey.
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
            <Button type="submit" className="rounded-full gap-2 font-body tracking-wider uppercase" disabled={createPost.isPending}>
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