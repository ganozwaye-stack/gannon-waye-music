import { create } from 'zustand';

const toEmbed = (url) => (
  typeof url === 'string' && url.trim()
    ? url.trim().replace('open.spotify.com/', 'open.spotify.com/embed/')
    : ''
);

const toItem = (rawUrl, meta = {}) => {
  const track = toEmbed(rawUrl);
  if (!track) return null;
  return {
    track,
    title: meta.title || '',
    artwork: meta.artwork || '',
    lyrics: meta.lyrics || '',
  };
};

const EMPTY = { track: null, title: '', artwork: '', lyrics: '', active: false };

// Mirrors the current queue item onto the flat fields older callers still read.
const withCurrent = (queue, index) => {
  const current = queue[index];
  return current
    ? { queue, index, ...current, active: true }
    : { queue, index: -1, ...EMPTY };
};

// The shared player never invents a track. Public callers must pass an approved
// Release URL. Tracks can be queued so several songs play back to back, and
// stopping clears every piece of stale metadata.
export const usePlayerStore = create((set, get) => ({
  queue: [],
  index: -1,
  ...EMPTY,

  playTrack: (rawUrl, meta = {}) => {
    const item = toItem(rawUrl, meta);
    if (!item) return;
    set(withCurrent([item], 0));
  },

  playQueue: (entries = []) => {
    const queue = entries.map((entry) => toItem(entry.url, entry)).filter(Boolean);
    if (!queue.length) return;
    set(withCurrent(queue, 0));
  },

  addToQueue: (rawUrl, meta = {}) => {
    const item = toItem(rawUrl, meta);
    if (!item) return;
    const { queue, index } = get();
    if (queue.some((entry) => entry.track === item.track)) return;
    const nextQueue = [...queue, item];
    set(withCurrent(nextQueue, index < 0 ? 0 : index));
  },

  playAt: (i) => {
    const { queue } = get();
    if (i < 0 || i >= queue.length) return;
    set(withCurrent(queue, i));
  },

  next: () => {
    const { queue, index } = get();
    if (index + 1 < queue.length) set(withCurrent(queue, index + 1));
  },

  prev: () => {
    const { queue, index } = get();
    if (index > 0) set(withCurrent(queue, index - 1));
  },

  removeAt: (i) => {
    const { queue, index } = get();
    const nextQueue = queue.filter((_, position) => position !== i);
    let nextIndex = index;
    if (i < index) nextIndex = index - 1;
    else if (i === index) nextIndex = Math.min(index, nextQueue.length - 1);
    set(withCurrent(nextQueue, nextIndex));
  },

  stop: () => set({ queue: [], index: -1, ...EMPTY }),
}));
