import React, { useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';

const PLATFORMS = [
  {
    label: 'X / Twitter',
    icon: '𝕏',
    share: (url, text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    label: 'Facebook',
    icon: 'f',
    share: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: 'WhatsApp',
    icon: '📲',
    share: (url, text) => `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
  },
];

export default function ShareButtons({ url, text, className = '' }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const shareText = text || 'Check this out';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Share2 className="w-3.5 h-3.5" />
        <span className="font-body text-[10px] tracking-[0.2em] uppercase">Share</span>
      </div>
      {PLATFORMS.map(p => (
        <a
          key={p.label}
          href={p.share(shareUrl, shareText)}
          target="_blank"
          rel="noopener noreferrer"
          title={p.label}
          className="w-8 h-8 rounded-full bg-secondary/60 border border-border/40 flex items-center justify-center hover:border-primary/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all font-body text-xs"
        >
          {p.icon}
        </a>
      ))}
      <button
        onClick={copyLink}
        title="Copy link"
        className="w-8 h-8 rounded-full bg-secondary/60 border border-border/40 flex items-center justify-center hover:border-primary/40 hover:bg-secondary text-muted-foreground hover:text-primary transition-all"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Link2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}