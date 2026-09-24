import { useEffect, useRef } from 'react';

// Twinkling stars, drifting coloured space dust and the odd shooting star,
// drawn on one canvas over the galaxy wallpaper.
const rand = (a, b) => a + Math.random() * (b - a);
const DUST_COLOURS = ['120,170,255', '255,90,70', '240,200,110'];

export default function SpaceField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf;
    let stars = [], dust = [], meteors = [];

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 2600);
      stars = Array.from({ length: n }, () => ({ x: rand(0, w), y: rand(0, h), r: rand(0.3, 1.5), tw: rand(0.6, 2.6), ph: rand(0, 6.28), z: rand(0.25, 1) }));
      dust = Array.from({ length: Math.round(n / 7) }, () => ({ x: rand(0, w), y: rand(0, h), r: rand(1.5, 5), vx: rand(-7, 7), vy: rand(-9, -2), a: rand(0.1, 0.35), c: DUST_COLOURS[Math.floor(Math.random() * 3)] }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let last = performance.now();
    let nextMeteor = last + 1800;
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#fff';
      for (const s of stars) {
        s.x -= s.z * 4 * dt;
        if (s.x < 0) s.x += w;
        ctx.globalAlpha = (0.3 + 0.7 * Math.abs(Math.sin(t * s.tw + s.ph))) * s.z;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      }

      for (const d of dust) {
        d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.y < -10) d.y = h + 10;
        if (d.x < -10) d.x = w + 10; else if (d.x > w + 10) d.x = -10;
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3);
        g.addColorStop(0, `rgba(${d.c},${d.a})`);
        g.addColorStop(1, `rgba(${d.c},0)`);
        ctx.globalAlpha = 1; ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r * 3, 0, 6.283); ctx.fill();
      }

      if (now > nextMeteor) {
        meteors.push({ x: rand(w * 0.35, w * 1.05), y: rand(-20, h * 0.35), vx: -rand(520, 820), vy: rand(160, 300), life: 0, max: rand(0.7, 1.2) });
        nextMeteor = now + rand(2600, 6500);
      }
      meteors = meteors.filter((m) => m.life < m.max);
      for (const m of meteors) {
        m.life += dt; m.x += m.vx * dt; m.y += m.vy * dt;
        const fade = 1 - m.life / m.max;
        const tx = m.x - m.vx * 0.16, ty = m.y - m.vy * 0.16;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, `rgba(255,245,215,${0.95 * fade})`);
        g.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" />;
}