import React, { useRef, useEffect } from 'react';

const LAYER_CONFIGS = [
  { count: 10, speed: 0.08, size: [1, 1.5], opacity: [0.15, 0.3] },
  { count: 12, speed: 0.14, size: [1.5, 2.5], opacity: [0.2, 0.4] },
  { count: 10, speed: 0.22, size: [2, 3], opacity: [0.25, 0.5] },
];

function rand(min, max) { return min + Math.random() * (max - min); }

export default function ParticleCanvas({ revealBurst = false, className = '' }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ particles: [], mouse: { x: -9999, y: -9999 }, burst: false, opacity: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    state.particles = [];
    LAYER_CONFIGS.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        state.particles.push({
          x: rand(0, canvas.width),
          y: rand(0, canvas.height),
          vx: rand(0.1, 0.3) * (Math.random() > 0.5 ? 1 : -1),
          vy: rand(-0.1, 0.1),
          size: rand(layer.size[0], layer.size[1]),
          opacity: rand(layer.opacity[0], layer.opacity[1]),
          layer: li,
          speed: layer.speed,
          baseOpacity: rand(layer.opacity[0], layer.opacity[1]),
        });
      }
    });

    // Fade in
    const fadeIn = setInterval(() => {
      state.opacity = Math.min(1, state.opacity + 0.02);
      if (state.opacity >= 1) clearInterval(fadeIn);
    }, 16);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      state.particles.forEach(p => {
        // Mouse repulsion
        const dx = p.x - state.mouse.x;
        const dy = p.y - state.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (1 - dist / 120) * 0.2;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Burst mode
        if (state.burst) {
          const cx = canvas.width / 2, cy = canvas.height / 2;
          const bdx = p.x - cx, bdy = p.y - cy;
          const bd = Math.sqrt(bdx * bdx + bdy * bdy);
          p.vx += (bdx / Math.max(bd, 1)) * 2.5;
          p.vy += (bdy / Math.max(bd, 1)) * 2.5;
        }

        // Damp velocity
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx + p.speed;
        p.y += p.vy;

        // Wrap
        if (p.x > canvas.width + 4) p.x = -4;
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.y > canvas.height + 4) p.y = -4;
        if (p.y < -4) p.y = canvas.height + 4;

        // Gold glow particle
        ctx.save();
        ctx.globalAlpha = p.opacity * state.opacity;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        grd.addColorStop(0, 'rgba(245,208,110,1)');
        grd.addColorStop(0.5, 'rgba(201,168,76,0.6)');
        grd.addColorStop(1, 'rgba(201,168,76,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(fadeIn);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Handle burst trigger
  useEffect(() => {
    if (revealBurst) {
      stateRef.current.burst = true;
      setTimeout(() => { stateRef.current.burst = false; }, 800);
    }
  }, [revealBurst]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}