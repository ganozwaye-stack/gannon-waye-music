import { useEffect, useRef } from 'react';

// Live fire licking up from the outline of the Set Free heart. The canvas is
// 1.5x the heart plate (placed at inset -25%) so flames rise past its edges.
// The outline is the classic parametric heart, fitted to the artwork's heart.
const rand = (a, b) => a + Math.random() * (b - a);

const makeSprite = (rgb) => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, `rgba(${rgb},1)`);
  g.addColorStop(0.4, `rgba(${rgb},0.45)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return c;
};

export default function HeartFlames({ rate = 300, alpha = 0.55 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sprites = [makeSprite('255,238,180'), makeSprite('245,208,110'), makeSprite('201,144,40')];
    let size = 0, W = 0, o = 0, k = 0, s = 1, raf;
    let parts = [];

    const resize = () => {
      size = canvas.clientWidth;
      canvas.width = size * dpr; canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      W = size / 1.5; o = W * 0.25; k = (0.7 * W) / 32; s = W / 400;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const point = (t) => {
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      return { x: o + W * 0.5 + x * k, y: o + W * 0.4425 - y * k };
    };

    const spawn = () => {
      const t = rand(0, Math.PI * 2);
      const p = point(t), a = point(t - 0.01), b = point(t + 0.01);
      let nx = b.y - a.y, ny = -(b.x - a.x);
      const len = Math.hypot(nx, ny) || 1; nx /= len; ny /= len;
      if (nx * (p.x - (o + W / 2)) + ny * (p.y - (o + W / 2)) < 0) { nx = -nx; ny = -ny; }
      const spark = Math.random() < 0.08;
      const out = rand(8, 36) * s;
      parts.push({
        x: p.x + rand(-4, 4) * s, y: p.y + rand(-4, 4) * s,
        vx: nx * out + rand(-10, 10) * s, vy: ny * out - rand(35, 100) * s,
        life: 0, max: spark ? rand(1.2, 2.2) : rand(0.45, 1.1),
        r: spark ? rand(2, 4) * s : rand(8, 20) * s, spark, ph: rand(0, 6.28),
      });
    };

    let last = performance.now(), acc = 0;
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      acc += rate * dt;
      while (acc > 1) { spawn(); acc -= 1; }
      ctx.clearRect(0, 0, size, size);
      ctx.globalCompositeOperation = 'lighter';
      parts = parts.filter((q) => q.life < q.max);
      for (const q of parts) {
        q.life += dt;
        q.vy -= 70 * s * dt;
        q.x += (q.vx + Math.sin(now / 180 + q.ph) * 14 * s) * dt;
        q.y += q.vy * dt;
        const f = q.life / q.max;
        const img = q.spark ? sprites[0] : f < 0.1 ? sprites[0] : f < 0.5 ? sprites[1] : sprites[2];
        const r = q.spark ? q.r : q.r * (1 - f * 0.55);
        ctx.globalAlpha = (1 - f) * alpha;
        ctx.drawImage(img, q.x - r, q.y - r, r * 2, r * 2);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [rate, alpha]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" />;
}