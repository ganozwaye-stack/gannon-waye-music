import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, Video, Search, ExternalLink, FileText, Mail, Music, ShoppingBag, Users, DollarSign, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SECTIONS = [
  {
    title: 'Quick Start',
    icon: BookOpen,
    items: [
      { label: 'Training Manual', path: '/docs/TRAINING_SYSTEM.md', desc: 'Complete platform guide with search' },
      { label: 'Social Media Calendar', path: '/docs/SOCIAL_MEDIA_CALENDAR.md', desc: '21 pre-written posts ready to schedule' },
      { label: 'Legal Compliance', path: '/docs/LEGAL_COMPLIANCE_UPGRADE.md', desc: 'All legal docs & compliance checklist' },
    ]
  },
  {
    title: 'Music Management',
    icon: Music,
    items: [
      { label: 'My Releases', path: '/admin/releases', desc: 'Add/edit songs, albums, EPs' },
      { label: 'Release Countdown', path: '/admin/release-countdown', desc: 'Set dates, toggle reveals' },
      { label: 'Lyrics Page', path: '/admin/lyrics', desc: 'Manage song lyrics' },
    ]
  },
  {
    title: 'Merchandise',
    icon: ShoppingBag,
    items: [
      { label: 'Products', path: '/admin/merch', desc: 'Add/edit products, multi-image gallery' },
      { label: 'Product Financials', path: '/admin/merch-financials', desc: 'View profit margins, edit costs' },
      { label: 'Orders', path: '/admin/orders', desc: 'Fulfill orders, send receipts' },
      { label: 'Thank You Cards', path: '/admin/thank-you-cards', desc: 'Add cards to orders' },
    ]
  },
  {
    title: 'Community & CRM',
    icon: Users,
    items: [
      { label: 'Subscribers', path: '/admin/subscribers', desc: 'Email list, supporter profiles' },
      { label: 'Gift Verification', path: '/admin/gift-verification', desc: 'Track hoodie gift claims' },
      { label: 'Fan Management', path: '/admin/fans', desc: 'Moderate community posts' },
      { label: 'Newsletter', path: '/admin/newsletter', desc: 'Send emails to subscribers' },
    ]
  },
  {
    title: 'Finance',
    icon: DollarSign,
    items: [
      { label: 'Financial Dashboard', path: '/admin/financials', desc: 'Revenue, profit, GST tracking' },
      { label: 'Charity Tracking', path: '/admin/charity-tracking', desc: 'Track 10% donations to 1800RESPECT' },
      { label: 'Product Insights', path: '/admin/product-insights', desc: 'AI marketing strategies' },
      { label: 'Supporters', path: '/admin/supporters', desc: 'View all supporters' },
    ]
  },
  {
    title: 'Marketing',
    icon: Heart,
    items: [
      { label: 'Promo Codes', path: '/admin/promo-codes', desc: 'Create discount codes' },
      { label: 'Birthday Discounts', path: '/admin/birthdays', desc: 'Auto birthday campaigns' },
      { label: 'Social Media Posts', path: '/docs/SOCIAL_MEDIA_CALENDAR.md', desc: 'Buffer/Hootsuite ready posts' },
      { label: 'Impact Dashboard', path: '/impact', desc: 'Public charity impact page' },
    ]
  },
];

const QUICK_LINKS = [
  { label: 'Main Dashboard', path: '/admin', icon: DollarSign },
  { label: 'Site Health', path: '/admin/site-health', icon: Search },
  { label: 'Site Settings', path: '/admin/settings', icon: FileText },
  { label: 'View Site', path: '/', icon: ExternalLink },
];

export default function TrainingHub() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSections = SECTIONS.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Platform Training Hub</h1>
          <p className="font-body text-foreground/60 leading-relaxed max-w-2xl mx-auto">
            Everything you need to manage the Gannon Waye platform. Use search to find specific features.
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for features, docs, or tasks... (e.g., 'merch', 'social media', 'charity')"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-12 py-6 text-lg bg-card border-border/40"
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {QUICK_LINKS.map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.path} to={link.path}>
                <Button variant="outline" className="w-full gap-2 rounded-xl py-6">
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {filteredSections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-2xl text-foreground">{section.title}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map(item => (
                    <Link key={item.path} to={item.path}>
                      <div className="bg-card border border-border/40 rounded-xl p-5 hover:border-primary/40 transition-colors group">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-display text-base text-foreground group-hover:text-primary transition-colors">{item.label}</h3>
                          {item.path.startsWith('/docs') ? (
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Documentation Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl text-foreground">Documentation Library</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-2xl p-6">
              <h3 className="font-display text-xl text-foreground mb-3">📖 Training Manual</h3>
              <p className="font-body text-sm text-muted-foreground mb-4">Complete 9-section guide covering every feature of the platform.</p>
              <Link to="/docs/TRAINING_SYSTEM.md">
                <Button className="w-full gap-2">
                  <BookOpen className="w-4 h-4" /> Open Training Manual
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-display text-xl text-blue-900 mb-3">📅 Social Media Calendar</h3>
              <p className="font-body text-sm text-blue-800 mb-4">21 pre-written posts for Buffer/Hootsuite. Ready to schedule in 2 hours.</p>
              <Link to="/docs/SOCIAL_MEDIA_CALENDAR.md">
                <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4" /> View Social Calendar
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Video Guide Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 bg-card border border-border/40 rounded-2xl p-8 text-center"
        >
          <Video className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-display text-2xl text-foreground mb-2">Video Guides Coming Soon</h3>
          <p className="font-body text-sm text-muted-foreground mb-6">Screen-recorded walkthroughs of each section will be added here.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/40">
            <p className="font-body text-xs text-foreground/70">For now, use the Training Manual for step-by-step instructions</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}