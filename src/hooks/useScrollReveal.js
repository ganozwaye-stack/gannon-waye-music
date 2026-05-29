import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic scroll-reveal hook using GSAP ScrollTrigger.
 * Fades + translates target elements into view as they enter the viewport.
 *
 * @param {string} selector - CSS selector for elements to animate
 * @param {object} opts - Optional overrides
 */
export function useScrollReveal(selector, opts = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray(selector, containerRef.current);
      if (!els.length) return;

      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: opts.y ?? 40, scale: opts.scale ?? 1 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: opts.duration ?? 1,
            delay: (opts.stagger ?? 0.12) * i,
            ease: opts.ease ?? 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: opts.start ?? 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selector]);

  return containerRef;
}

/**
 * Parallax scroll effect using GSAP ScrollTrigger scrub.
 */
export function useParallaxScroll(selector, yRange = [-30, 30], opts = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray(selector, containerRef.current);
      els.forEach((el) => {
        gsap.fromTo(
          el,
          { y: yRange[0] },
          {
            y: yRange[1],
            ease: 'none',
            scrollTrigger: {
              trigger: opts.trigger || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: opts.scrub ?? 1.5,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selector]);

  return containerRef;
}