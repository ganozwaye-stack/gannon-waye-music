import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Package, BookOpen, MessageCircle, Heart, Loader2, LogIn, Trash2 } from 'lucide-react';

export default function FanDashboard() {
  const qc = useQueryClient();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        setUser(u);
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  const email = user?.email;

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['myOrders', email],
    queryFn: () => base44.entities.MerchOrder.filter({ customer_email: email }, '-created_date', 50),
    enabled: !!email,
  });

  const { data: savedLyrics = [], isLoading: savedLoading } = useQuery({
    queryKey: ['savedLyrics'],
    queryFn: () => base44.entities.SavedLyric.list('-created_date'),
    enabled: !!user,
  });

  const { data: myPosts = [] } = useQuery({
    queryKey: ['myFanPosts', email],
    queryFn: () => base44.entities.FanPost.filter({ author_email: email }, '-created_date', 20),
    enabled: !!email,
  });

  const unsave = async (id) => {
    await base44.entities.SavedLyric.delete(id);
    qc.invalidateQueries({ queryKey: ['savedLyrics'] });
    qc.invalidateQueries({ queryKey: ['savedLyric'] });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="font-display text-3xl text-foreground mb-3">Your Fan Profile</h1>
          <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
            Sign in to track your orders, save your favourite lyrics, and follow your contributions to the community wall.
          </p>
          <Button
            onClick={() => base44.auth.redirectToLogin('/fan-profile')}
            className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase px-8 py-5"
          >
            <LogIn className="w-4 h-4 mr-2" /> Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  const firstName = (user.full_name || user.email || 'friend').split(' ')[0];

  return (
    <div className="min-h-screen py-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Fan Hub</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground">Welcome, {firstName}</h1>
          <p className="font-body text-sm text-muted-foreground mt-3">{user.email}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <StatCard icon={<Package className="w-5 h-5" />} label="Orders" value={orders.length} />
          <StatCard icon={<Heart className="w-5 h-5" />} label="Saved Lyrics" value={savedLyrics.length} />
          <StatCard icon={<MessageCircle className="w-5 h-5" />} label="Wall Posts" value={myPosts.length} />
        </div>

        {/* Orders */}
        <Section icon={<Package className="w-4 h-4" />} title="Order History" cta={{ label: 'All Orders', to: '/orders' }}>
          {ordersLoading ? (
            <Skeleton />
          ) : orders.length === 0 ? (
            <Empty text="No orders yet. Browse the store to claim your copy." cta={{ label: 'Visit Store', to: '/store' }} />
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="bg-card border border-border/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-body text-sm text-foreground font-medium">
                      {(o.items || []).map((i) => `${i.product_name}${i.size ? ` (${i.size})` : ''} ×${i.quantity}`).join(', ') || 'Order'}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {new Date(o.created_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-[9px] tracking-widest uppercase px-2 py-1 rounded-full border border-border/40 text-muted-foreground">
                      {o.status || o.payment_status || 'pending'}
                    </span>
                    <span className="font-display text-lg text-primary">${(o.total_amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Saved Lyrics */}
        <Section icon={<BookOpen className="w-4 h-4" />} title="Saved Lyrics" cta={{ label: 'Browse Lyrics', to: '/lyrics' }}>
          {savedLoading ? (
            <Skeleton />
          ) : savedLyrics.length === 0 ? (
            <Empty text="No saved lyrics yet. Open a song on the Lyrics page and tap the heart to keep it." cta={{ label: 'Go to Lyrics', to: '/lyrics' }} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedLyrics.map((s) => (
                <div key={s.id} className="bg-card border border-border/40 rounded-xl p-4 flex items-center justify-between gap-3">
                  <Link to="/lyrics" className="min-w-0">
                    <p className="font-display text-base text-foreground italic truncate">{s.lyric_title || 'Untitled'}</p>
                    {s.release_title && <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">{s.release_title}</p>}
                  </Link>
                  <button type="button" onClick={() => unsave(s.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Community */}
        <Section icon={<MessageCircle className="w-4 h-4" />} title="Community Wall" cta={{ label: 'Open Wall', to: '/community' }}>
          {myPosts.length === 0 ? (
            <Empty text="You haven't posted on the wall yet. Share your story — every voice is welcome here." cta={{ label: 'Share Your Story', to: '/community' }} />
          ) : (
            <div className="space-y-3">
              {myPosts.map((p) => (
                <div key={p.id} className="bg-card border border-border/40 rounded-xl p-4">
                  <p className="font-body text-sm text-foreground/80 line-clamp-3">{p.content}</p>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest mt-2">
                    {p.status === 'approved' ? 'Published' : 'Awaiting approval'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">{icon}</div>
      <div>
        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">{label}</p>
        <p className="font-display text-2xl text-foreground">{value}</p>
      </div>
    </div>
  );
}

function Section({ icon, title, cta, children }) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <h2 className="font-body text-xs tracking-[0.2em] uppercase gradient-gold-glow">{title}</h2>
        </div>
        {cta && (
          <Link to={cta.to}>
            <Button variant="ghost" size="sm" className="font-body text-xs tracking-wider uppercase text-muted-foreground hover:text-primary">
              {cta.label} →
            </Button>
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Skeleton() {
  return <div className="h-20 rounded-xl bg-card border border-border/40 animate-pulse" />;
}

function Empty({ text, cta }) {
  return (
    <div className="bg-card border border-dashed border-border/40 rounded-2xl p-8 text-center">
      <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">{text}</p>
      {cta && (
        <Link to={cta.to} className="inline-block mt-5">
          <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
            {cta.label} →
          </Button>
        </Link>
      )}
    </div>
  );
}