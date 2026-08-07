import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * GoldenEmbers — an immersive Three.js particle field of rising golden
 * embers/pollen. Renders behind hero content to give the page depth and a
 * cinematic "world" feel. Responds to mouse movement with gentle parallax.
 * Fails gracefully (silent) if WebGL is unavailable so the page still loads.
 */
export default function GoldenEmbers({ density = 1, intensity = 1 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cleanup = () => {};
    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x05060a, 0.06);

      const camera = new THREE.PerspectiveCamera(
        60,
        mount.clientWidth / mount.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 9);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      mount.appendChild(canvas);

      // Soft glowing sprite — radial gradient, no external asset needed
      const makeSprite = () => {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, 'rgba(255,232,150,1)');
        g.addColorStop(0.25, 'rgba(245,208,110,0.85)');
        g.addColorStop(0.6, 'rgba(201,168,76,0.25)');
        g.addColorStop(1, 'rgba(201,168,76,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
      };
      const sprite = makeSprite();

      const COUNT = Math.max(200, Math.floor(700 * density));
      const positions = new Float32Array(COUNT * 3);
      const speeds = new Float32Array(COUNT);
      const drifts = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 34;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3;
        speeds[i] = 0.15 + Math.random() * 0.7;
        drifts[i] = Math.random() * Math.PI * 2;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.42,
        map: sprite,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        opacity: 0.85 * intensity,
        color: new THREE.Color(0xffe6a0),
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      // Mouse parallax
      let mouseX = 0;
      let mouseY = 0;
      let rotX = 0;
      let rotY = 0;
      const onMouse = (e) => {
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener('mousemove', onMouse, { passive: true });

      const onResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(mount);

      const clock = new THREE.Clock();
      let raf;
      const tick = () => {
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;
        const pos = geo.attributes.position.array;
        for (let i = 0; i < COUNT; i++) {
          pos[i * 3 + 1] += speeds[i] * dt; // rise
          if (pos[i * 3 + 1] > 11) pos[i * 3 + 1] = -11; // wrap
          pos[i * 3] += Math.sin(t * 0.3 + drifts[i]) * 0.004; // drift
        }
        geo.attributes.position.needsUpdate = true;

        rotX += (mouseY * 0.35 - rotX) * 0.04;
        rotY += (mouseX * 0.35 - rotY) * 0.04;
        points.rotation.x = rotX;
        points.rotation.y = rotY;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouse);
        ro.disconnect();
        geo.dispose();
        mat.dispose();
        sprite.dispose();
        renderer.dispose();
        if (canvas.parentNode === mount) mount.removeChild(canvas);
      };
    } catch (err) {
      // WebGL not available — page still works without the 3D layer
      console.warn('GoldenEmbers: WebGL unavailable, skipping 3D layer.', err);
    }

    return cleanup;
  }, [density, intensity]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden
      style={{ pointerEvents: 'none' }}
    />
  );
}