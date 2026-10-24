import { Instagram, Facebook, Youtube, Linkedin, Twitter, Music2 } from 'lucide-react';

// Channel definitions for the Social Studio. Only channels with real,
// confirmed connections can ever publish; the rest are plan-only cards.
export const PLATFORMS = [
  {
    key: 'instagram',
    label: 'Instagram',
    Icon: Instagram,
    connected: true,
    canPublish: true,
    state: 'Connected',
    note: 'Publishing is live through the Instagram Business connector, including reels and short-form video. A post is only marked published once Instagram confirms it.',
  },
  {
    key: 'facebook_pages',
    label: 'Facebook Pages',
    Icon: Facebook,
    connected: true,
    canPublish: false,
    state: 'Read-only',
    note: 'Connected with read scopes only. Page publishing needs the pages_manage_posts permission, which has not been granted, so nothing is sent until that is connected.',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    Icon: Music2,
    connected: false,
    canPublish: false,
    state: 'Not connected',
    note: 'Authorization is not set up yet. Planned posts stay on the calendar as plan-only; nothing is published until the channel is connected.',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    Icon: Youtube,
    connected: false,
    canPublish: false,
    state: 'Not connected',
    note: 'Authorization is not set up yet. Planned posts stay on the calendar as plan-only; nothing is published until the channel is connected.',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    Icon: Linkedin,
    connected: false,
    canPublish: false,
    state: 'Not connected',
    note: 'Authorization is not set up yet. Planned posts stay on the calendar as plan-only; nothing is published until the channel is connected.',
  },
  {
    key: 'x',
    label: 'X (Twitter)',
    Icon: Twitter,
    connected: false,
    canPublish: false,
    state: 'Not connected',
    note: 'Authorization is not set up yet. Planned posts stay on the calendar as plan-only; nothing is published until the channel is connected.',
  },
];

export const POST_TYPES = [
  { value: 'post', label: 'Image post' },
  { value: 'reel', label: 'Reel / short-form' },
  { value: 'video', label: 'Video' },
  { value: 'story', label: 'Story' },
  { value: 'text', label: 'Text only' },
];

export const TEMPLATE_CATEGORIES = ['release', 'promo', 'memorial', 'community', 'other'];

export const POST_STATUS_LABELS = {
  draft: 'Draft',
  ready: 'Ready',
  scheduled: 'Scheduled',
  processing: 'Processing',
  published: 'Published',
  failed: 'Failed',
};

export const APPROVAL_LABELS = {
  pending_approval: 'Pending approval',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const statusClass = (s) => ({
  draft: 'bg-secondary text-secondary-foreground',
  ready: 'bg-secondary text-secondary-foreground border border-border',
  scheduled: 'bg-primary/20 text-primary',
  processing: 'bg-primary/10 text-primary border border-primary/40',
  published: 'bg-primary text-primary-foreground',
  failed: 'bg-destructive text-destructive-foreground',
}[s] || 'bg-secondary text-secondary-foreground');

export const resultClass = (s) => ({
  published: 'text-primary',
  failed: 'text-destructive',
  processing: 'text-primary',
  skipped: 'text-muted-foreground',
}[s] || 'text-muted-foreground');

export const resultLabel = (s) => ({
  published: 'Published',
  failed: 'Failed',
  processing: 'Processing',
  skipped: 'Skipped (channel not connected)',
}[s] || s);