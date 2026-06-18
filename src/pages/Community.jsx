import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Send, Users, MessageCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VoiceTextarea from '@/components/ui/VoiceTextarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import BePartOfThisCTA from '@/components/public/BePartOfThisCTA';
import PostReplies from '@/components/community/PostReplies';
import FanSpotlight from '@/components/public/FanSpotlight';
import InstagramFeed from '@/components/public/InstagramFeed';

const PROFANITY_LIST = [
  'fuck','shit','cunt','bitch','asshole','bastard','damn','dick','pussy','cock',
  'ass','piss','bollocks','wanker','twat','arsehole','motherfucker','faggot','slut','whore'
];

const containsProfanity = (text) =>
  PROFANITY_LIST.some(word => new RegExp(`\\b${word}\\b`, 'i').test(text));

export default function Community() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState({ author_name: '', author_email: '', content: '' });

  const { data: posts } = useQuery({
    queryKey: ['fanPosts'],
    queryFn: () => base44.entities.FanPost.filter({ status: 'approved' }, '-created_date', 50),
    initialData: [],
  });

  // Real-time subscription — new approved posts appear instantly
  useEffect(() => {
    const unsub = base44.entities.FanPost.subscribe((event) => {
      if (event.type === 'create' || event.type === 'update') {
        queryClient.invalidateQueries({ queryKey: ['fanPosts'] });
      }
    });
    return unsub;
  }, [queryClient]);

  const createPost = useMutation({
    mutationFn: (data) => base44.entities.FanPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fanPosts'] });
      setNewPost({ author_name: '', author_email: '', content: '' });
      toast({ title: 'Message received! 🤍', description: 'Your message is pending review and will appear shortly.' });
    },
    onError: () => {
      toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim() || !newPost.author_name.trim()) {
      toast({ title: 'Please fill in your name and message', variant: 'destructive' });
      return;
    }
    if (containsProfanity(newPost.content) || containsProfanity(newPost.author_name)) {
      toast({ title: 'Please keep it respectful 🙏', description: 'This is a safe space.', variant: 'destructive' });
      return;
    }

    // Check if email is blocked (if email provided)
    if (newPost.author_email?.trim()) {
      const blocked = await base44.entities.FanPost.filter({ author_email: newPost.author_email.trim().toLowerCase(), is_blocked: true });
      if (blocked && blocked.length > 0) {
        toast({ title: 'Access restricted', description: 'This account has been blocked from posting.', variant: 'destructive' });
        return;
      }
    }

    const userAgent = navigator.userAgent || 'unavailable';
    createPost.mutate({
      ...newPost,
      status: 'pending',
      moderation_status: 'unreviewed',
      ip_address: 'unavailable', // Base44 frontend does not expose client IP
      user_agent: userAgent.substring(0, 500),
    });
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Connect</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6">Community</h1>
          <p className="font-body text-foreground/60 mt-4 max-w-lg mx-auto leading-relaxed">
            This is a space built on support, respect, and honesty. Whether you're here for the music, the message, or because something hit a little too close to home — you belong here. You are not alone.
          </p>
          <div className="flex justify-center gap-4 mt-5 flex-wrap">
            <a href="https://www.tiktok.com/@gannonwaye" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-primary hover:underline tracking-widest uppercase">TikTok @gannonwaye</a>
            <a href="https://www.instagram.com/ganozwaye" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-primary hover:underline tracking-widest uppercase">Instagram @ganozwaye</a>
          </div>
        </motion.div>

        {/* No abuse policy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 bg-destructive/10 border border-destructive/30 rounded-2xl p-5 text-center"
        >
          <p className="font-body text-xs tracking-widest uppercase text-destructive mb-2">🚫 Zero Tolerance Policy</p>
          <p className="font-body text-sm text-foreground/80 leading-relaxed">
            <strong>NO ABUSE. NO BULLYING. NO SWEARING. NO HARASSMENT.</strong>
          </p>
          <p className="font-body text-xs text-foreground/60 mt-2 leading-relaxed">
            This is a safe space for everyone. Any abusive, hateful, or threatening behaviour will result in immediate and permanent removal from this community. Your IP address will be recorded and access blocked. All messages are moderated before appearing publicly.
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
            <MessageCircle className="w-5 h-5 text-primary" /> Share With the Community
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-xs tracking-wider uppercase mb-1 block">Name *</Label>
                <Input
                  value={newPost.author_name}
                  onChange={e => setNewPost({ ...newPost, author_name: e.target.value })}
                  placeholder="Your name"
                  className="bg-secondary/50 text-base"
                  autoComplete="name"
                />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase mb-1 block">Email (optional)</Label>
                <Input
                  type="email"
                  value={newPost.author_email}
                  onChange={e => setNewPost({ ...newPost, author_email: e.target.value })}
                  placeholder="your@email.com"
                  className="bg-secondary/50 text-base"
                  inputMode="email"
                />
              </div>
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase mb-1 block">Message *</Label>
              <VoiceTextarea
                value={newPost.content}
                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Share your thoughts, your story, or just say hi..."
                className="bg-secondary/50 min-h-[100px] text-base"
              />
            </div>
            <Button
              type="submit"
              className="rounded-full gap-2 font-body tracking-wider uppercase gradient-gold-button border-0 py-5"
              disabled={createPost.isPending}
            >
              <Send className="w-4 h-4" /> {createPost.isPending ? 'Posting...' : 'Post Message'}
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
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
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
              <PostReplies postId={post.id} />
              <div className="flex gap-3 mt-3 pl-11">
                <Link to="/this-is-my-life" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                  Hear The Story →
                </Link>
                <Link to="/back-this" className="font-body text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  <Heart className="w-3 h-3" /> Support This
                </Link>
              </div>
            </motion.div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-16">
              <MessageCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-body text-muted-foreground">Be the first to leave a message.</p>
            </div>
          )}
        </div>

        <BePartOfThisCTA context="This community exists because of people who care. If you want to go deeper, you can support the project." />
      </div>
      <FanSpotlight />
      <InstagramFeed />
    </div>
  );
}