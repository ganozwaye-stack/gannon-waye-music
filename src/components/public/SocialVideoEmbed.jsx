import React, { useState, useRef } from 'react';
import { Play, ExternalLink, Volume2, VolumeX } from 'lucide-react';

const isMp4 = (url) => url && (url.endsWith('.mp4') || url.includes('.mp4?'));

function getEmbedInfo(url, platform) {
  if (!url) return null;

  if (platform === 'instagram') {
    const match = url.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
    if (match) {
      return { type: 'iframe', src: `https://www.instagram.com/p/${match[1]}/embed/` };
    }
  }

  if (platform === 'tiktok') {
    const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (match) {
      return { type: 'iframe', src: `https://www.tiktok.com/embed/v2/${match[1]}` };
    }
  }

  return null;
}

// Native MP4 preview card with hover-to-play + unmute toggle
function Mp4PreviewCard({ video, platformLabel, platformColor }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) { videoRef.current.play().catch(() => {}); setPlaying(true); }
  };
  const handleMouseLeave = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; setPlaying(false); }
  };
  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(m => !m);
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-border/40 hover:border-primary/40 transition-all bg-black group"
      style={{ aspectRatio: video.platform === 'tiktok' ? '9/16' : '1/1' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={video.url || video.file_url}
        muted
        playsInline
        loop
        preload="metadata"
        className="w-full h-full object-cover"
      />
      {/* Platform badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`font-body text-[10px] tracking-widest uppercase px-2 py-1 rounded-full bg-background/70 ${platformColor}`}>
          {platformLabel}
        </span>
      </div>
      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-background/70 flex items-center justify-center text-foreground/80 hover:text-primary transition-colors"
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      {video.title && (
        <div className="absolute bottom-3 left-3 right-12 z-10">
          <p className="font-body text-xs text-white/80 truncate">{video.title}</p>
        </div>
      )}
    </div>
  );
}

export default function SocialVideoEmbed({ video, compact = false }) {
  const [loaded, setLoaded] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const embedInfo = getEmbedInfo(video.url, video.platform);

  const platformColor = video.platform === 'instagram' ? 'text-pink-400' : 'text-foreground';
  const platformLabel = video.platform === 'instagram' ? 'Instagram Reel' : 'TikTok';

  // Native MP4 — autoplay muted loop
  if (isMp4(video.url || video.file_url)) {
    return <Mp4PreviewCard video={video} platformLabel={platformLabel} platformColor={platformColor} />;
  }

  if (!embedInfo) {
    // Fallback: just show a link card
    return (
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-3 bg-secondary/60 rounded-2xl border border-border/40 hover:border-primary/40 transition-all p-8 text-center h-full"
      >
        <ExternalLink className={`w-8 h-8 ${platformColor}`} />
        <p className="font-body text-sm text-foreground/70">{video.title || platformLabel}</p>
        <span className={`font-body text-xs tracking-widest uppercase ${platformColor}`}>{platformLabel}</span>
      </a>
    );
  }

  if (!showEmbed) {
    return (
      <div
        className="relative rounded-2xl overflow-hidden border border-border/40 hover:border-primary/40 transition-all cursor-pointer group bg-secondary/60"
        style={{ aspectRatio: video.platform === 'tiktok' ? '9/16' : '1/1' }}
        onClick={() => setShowEmbed(true)}
      >
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.title || platformLabel} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <span className={`font-body text-xs tracking-[0.2em] uppercase ${platformColor}`}>{platformLabel}</span>
              {video.title && <p className="font-body text-sm text-foreground/60 px-4">{video.title}</p>}
            </div>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 group-hover:bg-background/20 transition-all">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`font-body text-[10px] tracking-widest uppercase px-2 py-1 rounded-full bg-background/70 ${platformColor}`}>
            {platformLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-border/40 bg-secondary/60"
      style={{ aspectRatio: video.platform === 'tiktok' ? '9/16' : '1/1' }}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      <iframe
        src={embedInfo.src}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        scrolling="no"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
      />
    </div>
  );
}