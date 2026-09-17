import { useEffect, useRef } from 'react';

// Spotify's IFrame API lets us hear when a track finishes so the queue can
// move on by itself. If the API script cannot load, we fall back to a plain
// embed and the listener simply skips forward with the Next button.
const API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';
const API_TIMEOUT_MS = 6000;

let apiPromise = null;

function loadIframeApi() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'));
    const timer = setTimeout(() => reject(new Error('Spotify IFrame API timed out')), API_TIMEOUT_MS);
    window.onSpotifyIframeApiReady = (api) => {
      clearTimeout(timer);
      resolve(api);
    };
    const script = document.createElement('script');
    script.src = API_SRC;
    script.async = true;
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error('Spotify IFrame API failed to load'));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

// https://open.spotify.com/embed/track/ID?x -> spotify:track:ID
function toSpotifyUri(embedUrl) {
  const match = /open\.spotify\.com\/embed\/([a-z]+)\/([A-Za-z0-9]+)/.exec(embedUrl || '');
  return match ? `spotify:${match[1]}:${match[2]}` : null;
}

export default function SpotifyEmbed({ src, title, onEnded, height = 80 }) {
  const hostRef = useRef(null);
  const controllerRef = useRef(null);
  const fallbackRef = useRef(false);
  const endedRef = useRef(false);
  const lastPositionRef = useRef(0);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const uri = toSpotifyUri(src);

  // Mount the controller once, then swap tracks with loadUri.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !uri) return undefined;
    let cancelled = false;

    const mountFallback = () => {
      if (cancelled || fallbackRef.current) return;
      fallbackRef.current = true;
      host.innerHTML = '';
      const frame = document.createElement('iframe');
      frame.src = src;
      frame.title = title || 'Spotify player';
      frame.height = String(height);
      frame.style.width = '100%';
      frame.style.border = '0';
      frame.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
      frame.setAttribute('loading', 'lazy');
      host.appendChild(frame);
    };

    loadIframeApi().then((api) => {
      if (cancelled || controllerRef.current) return;
      const mount = document.createElement('div');
      host.innerHTML = '';
      host.appendChild(mount);
      api.createController(mount, { uri, width: '100%', height }, (controller) => {
        if (cancelled) return;
        controllerRef.current = controller;
        controller.addListener('playback_update', (event) => {
          const { isPaused, position = 0, duration = 0 } = event?.data || {};
          if (!duration) return;
          const nearEnd = position >= duration - 1500;
          const wrapped = position === 0 && lastPositionRef.current > duration - 5000;
          if (isPaused && (nearEnd || wrapped) && !endedRef.current) {
            endedRef.current = true;
            onEndedRef.current?.();
          }
          if (!isPaused) endedRef.current = false;
          lastPositionRef.current = position;
        });
      });
    }).catch(mountFallback);

    return () => {
      cancelled = true;
      if (controllerRef.current) {
        try { controllerRef.current.destroy(); } catch {}
        controllerRef.current = null;
      }
      host.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track changes: reuse the live controller, or refresh the fallback iframe.
  useEffect(() => {
    if (!uri) return;
    endedRef.current = false;
    lastPositionRef.current = 0;
    const controller = controllerRef.current;
    if (controller) {
      controller.loadUri(uri);
      try { controller.play(); } catch {}
    } else if (fallbackRef.current && hostRef.current) {
      const frame = hostRef.current.querySelector('iframe');
      if (frame) frame.src = src;
    }
  }, [uri, src]);

  if (!uri) return null;
  return <div ref={hostRef} style={{ minHeight: height }} className="w-full" />;
}
