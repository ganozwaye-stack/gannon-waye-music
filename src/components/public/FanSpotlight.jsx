import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';

export default function FanSpotlight() {
  const { data: posts = [] } = useQuery({
    queryKey: ['spotlight-posts'],
    queryFn: () => base44.entities.FanPost.filter({ status: 'approved', is_featured: true }, '-created_date', 3),
  });

  // Fallback to recent approved posts if no featured
  const { data: recent = [] } = useQuery({
    queryKey: ['recent-posts-spotlight'],
    queryFn: () => base44.entities.FanPost.filter({ status: 'approved' }, '-created_date', 3),
    enabled: posts.length === 0,
  });

  const display = posts.length > 0 ? posts : recent;
  if (display.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Fan Spotlight</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Voices From the Community</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {display.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-primary/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors"
            >
              <Star className="w-4 h-4 text-primary/60" />
              <p className="font-body text-foreground/70 leading-relaxed text-sm flex-1 italic">
                "{post.content?.length > 180 ? post.content.slice(0, 180) + '…' : post.content}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-display text-sm text-primary">
                    {post.author_name?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-foreground">{post.author_name || 'A Fan'}</p>
                  {post.reviewer_location && (
                    <p className="font-body text-xs text-muted-foreground">{post.reviewer_location}</p>
                  )}
                </div>
                {post.love_count > 0 && (
                  <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="w-3 h-3 text-primary/60" /> {post.love_count}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}