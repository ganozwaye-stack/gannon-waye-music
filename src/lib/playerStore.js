import { create } from 'zustand';

// Convert a Spotify web URL to its embed URL for in-page playback (no redirect).
const toEmbed = (url) => (url ? url.replace('open.spotify.com/', 'open.spotify.com/embed/') : '');

// Site-wide persistent player. The bottom support bar hosts the Spotify embed,
// so audio keeps playing across page navigation because the bar lives outside Routes.
export const usePlayerStore = create((set) => ({
  track: null,          // Spotify embed URL currently loaded
  title: 'Without You Here',
  artwork: '',
  active: false,        // whether the bar player is open
  playTrack: (rawUrl, meta = {}) =>
    set({
      track: toEmbed(rawUrl),
      title: meta.title || 'Without You Here',
      artwork: meta.artwork || '',
      active: true,
    }),
  stop: () => set({ active: false }),
}));