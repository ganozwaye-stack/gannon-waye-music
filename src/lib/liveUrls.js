// Public destinations and iframe sources are different contracts. A provider's
// dashboard or share page is not a player, even when its hostname is trusted.
export function safePublicUrl(value, allowedHosts) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return '';
    if (!allowedHosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))) return '';
    return url.toString();
  } catch {
    return '';
  }
}

export const ALLOWED_EMBED_HOSTS = ['youtube.com', 'youtube-nocookie.com', 'vimeo.com', 'streamyard.com', 'restream.io', 'facebook.com'];

export function safeEmbedUrl(value) {
  const safe = safePublicUrl(value, ALLOWED_EMBED_HOSTS);
  if (!safe) return '';
  const url = new URL(safe);
  const host = url.hostname.replace(/^www\./, '');
  if (['youtube.com', 'youtube-nocookie.com'].includes(host)) {
    return /^\/(embed\/[\w-]+|live_chat|live_chat_replay)\/?$/.test(url.pathname) ? safe : '';
  }
  if (host === 'player.vimeo.com') return /^\/video\/\d+\/?$/.test(url.pathname) ? safe : '';
  if (host === 'streamyard.com') return /^\/watch\/[\w-]+\/?$/.test(url.pathname) ? safe : '';
  if (host === 'player.restream.io') return safe;
  if (host === 'chat.restream.io' && url.pathname === '/embed') return safe;
  if (host === 'facebook.com' && url.pathname === '/plugins/video.php') {
    const href = safePublicUrl(url.searchParams.get('href'), ['facebook.com']);
    if (!href) return '';
    const video = new URL(href);
    const isVideo = /^\/[^/]+\/videos\/\d+\/?$/.test(video.pathname)
      || (['/watch', '/watch/', '/video.php'].includes(video.pathname) && /^\d+$/.test(video.searchParams.get('v') || ''));
    return isVideo ? safe : '';
  }
  return '';
}
