import { create } from 'zustand';

const toEmbed = (url) => (
  typeof url === 'string' && url.trim()
    ? url.trim().replace('open.spotify.com/', 'open.spotify.com/embed/')
    : ''
);

// The shared player never invents a track. Public callers must pass an approved
// Release URL, and stopping clears all stale metadata.
export const usePlayerStore = create((set) => ({
  track: null,
  title: '',
  artwork: '',
  active: false,
  playTrack: (rawUrl, meta = {}) => {
    const track = toEmbed(rawUrl);
    if (!track) return;

    set({
      track,
      title: meta.title || '',
      artwork: meta.artwork || '',
      active: true,
    });
  },
  stop: () => set({
    track: null,
    title: '',
    artwork: '',
    active: false,
  }),
}));
