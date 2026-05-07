import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MessageCircle, Camera, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function RecentActivityStrip() {
  const { data: posts = [] } = useQuery({
    queryKey: ['fanPosts'],
    queryFn: () => base44.entities.FanPost.filter({ status: 'approved' }, '-created_date', 10),
    initialData: [],
  });

  const { data: media = [] } = useQuery({
    queryKey: ['fanMedia'],
    queryFn: () => base44.entities.FanMedia.list('-created_date'),
    initialData: [],
  });

  const allActivity = [
    ...posts.map(p => ({ ...p, _type: 'post' })),
    ...media.map(m => ({ ...m, _type: 'media' })),
  ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 6);

  if (allActivity.length === 0) return null;

  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">Live Feed</p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground">Community Activity</h2>
          </div>
          <Link
            to="/fan-activity"
            className="flex items-center gap-1.5 font-body text-xs tracking-wider uppercase text-primary hover:text-primary/70 transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allActivity.map((item, i) => (
            <motion.div
              key={`${item._type}-${item.id}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border/40 rounded-2xl p-4 hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item._type === 'post'
                    ? <MessageCircle className="w-3.5 h-3.5 text-primary" />
                    : <Camera className="w-3.5 h-3.5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs font-medium text-foreground truncate">
                    {item._type === 'post' ? (item.author_name || 'A fan') : item.name}
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground">
                    {item.created_date ? format(new Date(item.created_date), 'MMM d') : ''}
                  </p>
                </div>
              </div>

              {item._type === 'post' && (
                <p className="font-body text-sm text-foreground/70 leading-relaxed line-clamp-3">{item.content}</p>
              )}

              {item._type === 'media' && (
                <div className="flex gap-3 items-start">
                  {item.file_type === 'video' ? (
                    <video src={item.file_url} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <img src={item.file_url} alt={item.caption || 'Fan photo'} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  )}
                  {item.caption && (
                    <p className="font-body text-sm text-foreground/70 line-clamp-3">{item.caption}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/community">
            <button className="gradient-gold-button rounded-full px-8 py-3 font-body text-sm tracking-wider uppercase inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Leave a Message
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}