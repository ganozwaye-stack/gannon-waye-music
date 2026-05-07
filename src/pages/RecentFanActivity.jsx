import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MessageCircle, Camera, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function RecentFanActivity() {
  const { data: posts } = useQuery({
    queryKey: ['fanPosts'],
    queryFn: () => base44.entities.FanPost.filter({ status: 'approved' }, '-created_date', 20),
    initialData: [],
  });

  const { data: media } = useQuery({
    queryKey: ['fanMedia'],
    queryFn: () => base44.entities.FanMedia.list('-created_date'),
    initialData: [],
  });

  // Merge and sort by created_date
  const allActivity = [
    ...posts.map(p => ({ ...p, _type: 'post' })),
    ...media.map(m => ({ ...m, _type: 'media' })),
  ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 30);

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Live Feed</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Supporter Activity</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Real supporters, real stories, real connection. This is the movement building in real time.
          </p>
        </motion.div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-card border border-border/40 rounded-2xl p-5 text-center">
            <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-display text-2xl text-foreground">{posts.length}</p>
            <p className="font-body text-xs text-muted-foreground tracking-wider uppercase mt-1">Community Posts</p>
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-5 text-center">
            <Camera className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-display text-2xl text-foreground">{media.length}</p>
            <p className="font-body text-xs text-muted-foreground tracking-wider uppercase mt-1">Supporter Media</p>
          </div>
        </div>

        {/* Activity feed */}
        {allActivity.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">No activity yet — be the first to join!</p>
            <Link to="/community" className="mt-4 inline-block">
              <Button className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase mt-4">
                Join the Community
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {allActivity.map((item, i) => (
              <motion.div
                key={`${item._type}-${item.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border/40 rounded-2xl p-5 flex gap-4"
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item._type === 'post'
                    ? <MessageCircle className="w-4 h-4 text-primary" />
                    : <Camera className="w-4 h-4 text-primary" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <p className="font-body text-sm font-medium text-foreground">
                      {item._type === 'post' ? (item.author_name || 'A supporter') : item.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground flex-shrink-0">
                      {item.created_date ? format(new Date(item.created_date), 'MMM d, yyyy') : ''}
                    </p>
                  </div>

                  {item._type === 'post' && (
                    <p className="font-body text-sm text-foreground/70 leading-relaxed line-clamp-3">{item.content}</p>
                  )}

                  {item._type === 'media' && (
                    <div className="flex items-start gap-3 mt-1">
                      {item.file_type === 'video' ? (
                        <video src={item.file_url} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <img src={item.file_url} alt={item.caption || 'Fan photo'} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                      )}
                      {item.caption && (
                        <p className="font-body text-sm text-foreground/70 leading-relaxed line-clamp-3">{item.caption}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/community">
            <Button className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase w-full sm:w-auto">
              <Heart className="w-4 h-4" /> Join the Community
            </Button>
          </Link>
          <Link to="/back-this">
            <Button variant="outline" className="rounded-full font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10 w-full sm:w-auto">
              Support the Music
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}