import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Users, DollarSign, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export default function ImpactPage() {
  const { data: contributions } = useQuery({
    queryKey: ['supportContributions'],
    queryFn: () => base44.entities.SupportContribution.list('-created_date', 100),
    initialData: [],
  });

  // Calculate stats
  const stats = {
    totalSupporters: new Set(contributions.map(c => c.supporter_email)).size,
    totalRaised: contributions.reduce((sum, c) => sum + c.amount, 0),
  };

  const monthlyBreakdown = contributions.reduce((acc, c) => {
    const month = new Date(c.created_date).toLocaleString('en-AU', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = { amount: 0, count: 0 };
    acc[month].amount += c.amount;
    acc[month].count += 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link to="/back-this" className="inline-flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-3 h-3" /> Back to Support
          </Link>
          <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Community Impact</h1>
          <p className="font-body text-foreground/60 leading-relaxed max-w-2xl mx-auto">
            Your support helps fund independent music. Separate, verified support resources remain available for anyone affected by domestic or family violence.
          </p>
        </motion.div>

        {/* Independent support and external crisis resources */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-10"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl text-foreground mb-3">Independent Music and Support Resources</h2>
              <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">
                Contributions support Gannon Waye's independent music creation, releases, and related artist activities.
              </p>
              <p className="font-body text-sm text-foreground/70 leading-relaxed mb-4">
                No portion is represented as a charitable donation unless a separate verified campaign expressly says so. If you need domestic and family violence support, 1800RESPECT is an independent national service.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.1800respect.org.au" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-gold-button font-body text-xs">
                  Learn About 1800RESPECT →
                </a>
                <a href="https://www.1800respect.org.au/get-help/lgbtiqa-plus" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 text-primary font-body text-xs hover:bg-primary/10 transition-colors">
                  LGBTQIA+ Support
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Supporters', value: stats.totalSupporters, icon: Users, color: 'text-primary' },
            { label: 'Recorded Support', value: `$${stats.totalRaised.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-card border border-border/40">
                  <CardContent className="p-5">
                    <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                    <p className="font-display text-2xl text-foreground">{stat.value}</p>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/40 rounded-2xl p-8 mb-10"
        >
          <h3 className="font-display text-2xl text-foreground mb-6">How Your Support Creates Impact</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'You Choose', desc: 'Choose whether independent music is something you want to support.' },
              { step: '2', title: 'Music Is Funded', desc: 'Recorded contributions support releases and related artist activities.' },
              { step: '3', title: 'Resources Stay Visible', desc: 'Independent crisis-support resources remain available without implying a charitable transfer.' },
            ].map(item => (
              <div key={item.step} className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-3">
                  <span className="font-display text-lg text-primary">{item.step}</span>
                </div>
                <h4 className="font-display text-lg text-foreground mb-2">{item.title}</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/40 rounded-2xl p-8"
        >
          <h3 className="font-display text-2xl text-foreground mb-6">Monthly Impact Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(monthlyBreakdown).map(([month, data], i) => {
              return (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl"
                >
                  <div>
                    <p className="font-display text-base text-foreground">{month}</p>
                    <p className="font-body text-xs text-muted-foreground">{data.count} supporter{data.count > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-primary">${data.amount.toFixed(2)}</p>
                    <p className="font-body text-xs text-primary/60">Recorded support</p>
                  </div>
                </motion.div>
              );
            })}
            {Object.keys(monthlyBreakdown).length === 0 && (
              <p className="text-center font-body text-sm text-muted-foreground py-8">
                No contributions yet. Be the first to make an impact! 🤍
              </p>
            )}
          </div>
        </motion.div>

        {/* Transparency Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <p className="font-body text-xs text-primary/80">Recorded contributions are shown without representing any charitable transfer.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}