import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Footprints, Pause, Play, RotateCcw } from 'lucide-react';

const GARDEN_PHOTO = '/images/mum/mum_garden.jpg';
const FAMILY_CHILDREN_PHOTO = '/images/mum/favourite-things/mums-children.png';
const SONIA_SKY_PHOTO = '/images/mum/sonia_sky_angel_hero.png';
const SONIA_AND_PA_PHOTO = '/images/mum/foyer/sonia-and-pa-sky.png';
const GANNON_AND_MUM_PHOTO = '/images/mum/mum_gannon_young.jpg';

const STOPS = [
  {
    id: 'gate',
    label: 'Garden gate',
    detail: 'The first quiet step in.',
    position: new THREE.Vector3(0, 1.65, 7.5),
    lookAt: new THREE.Vector3(0, 1.35, 0.5),
  },
  {
    id: 'sonia',
    label: 'Her chair in the garden',
    detail: 'The real robe, mug, plants, and everyday presence.',
    position: new THREE.Vector3(-2.75, 1.7, 3.25),
    lookAt: new THREE.Vector3(-1.35, 1.32, 0.25),
  },
  {
    id: 'children',
    label: 'Her children',
    detail: 'The family image held at the centre.',
    position: new THREE.Vector3(2.55, 1.75, 1.05),
    lookAt: new THREE.Vector3(1.35, 1.25, -1.45),
  },
  {
    id: 'song',
    label: 'The song path',
    detail: 'Where the garden leads into Without You Here.',
    position: new THREE.Vector3(0.35, 1.7, -2.8),
    lookAt: new THREE.Vector3(0, 1.45, -6.5),
  },
  {
    id: 'sky',
    label: 'Sky opening',
    detail: 'Love lifted above the garden.',
    position: new THREE.Vector3(0, 2.1, -6.7),
    lookAt: new THREE.Vector3(0, 2.4, -11),
  },
];

function makeRoundedRectShape(width, height, radius) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function createFrame({ texture, position, rotationY = 0, width = 1.45, height = 1.85 }) {
  const group = new THREE.Group();
  const frameShape = makeRoundedRectShape(width + 0.18, height + 0.18, 0.08);
  const frameGeometry = new THREE.ShapeGeometry(frameShape);
  const frame = new THREE.Mesh(
    frameGeometry,
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.42,
      metalness: 0.22,
      emissive: 0x3a2508,
      emissiveIntensity: 0.24,
    }),
  );
  frame.position.z = -0.015;

  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
  );
  photo.position.z = 0.01;

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(width + 0.34, height + 0.34),
    new THREE.MeshBasicMaterial({
      color: 0xf5d06e,
      transparent: true,
      opacity: 0.075,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  glow.position.z = -0.04;

  group.add(glow, frame, photo);
  group.position.copy(position);
  group.rotation.y = rotationY;
  return group;
}

function createLeafCluster(seed, color) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.84,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < 9; i += 1) {
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.86), material);
    const angle = seed + i * 0.68;
    leaf.position.set(Math.cos(angle) * 0.28, 0.25 + i * 0.045, Math.sin(angle) * 0.28);
    leaf.rotation.set(0.9 + (i % 2) * 0.3, angle, -0.45 + i * 0.08);
    group.add(leaf);
  }

  return group;
}

function GardenWalkthroughFallback({ onOpenFamily }) {
  return (
    <section id="garden-walkthrough" className="relative overflow-hidden bg-[#020502] px-5 py-24 text-[#fff7df] md:px-10 md:py-32">
      <div className="absolute inset-0">
        <img
          src={GARDEN_PHOTO}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-[50%_28%]"
          style={{ filter: 'brightness(0.58) saturate(1.08) contrast(1.06)' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,2,0.94),rgba(2,5,2,0.42)_48%,rgba(2,5,2,0.86)),linear-gradient(0deg,rgba(2,5,2,0.96),rgba(2,5,2,0.24)_52%,rgba(2,5,2,0.72))]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <p className="font-body text-[10px] uppercase tracking-[0.55em] text-[#d4af37]/70">Walkthrough</p>
        <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[0.92] text-[#fff7df] [text-shadow:0_8px_34px_rgba(0,0,0,0.78)] md:text-7xl">
          Walk from the gate to her chair.
        </h2>
        <p className="mt-5 max-w-2xl font-body text-sm leading-7 text-[#fff7df]/70 md:text-base">
          This device is showing the still garden path: the same real chair, mug, family memories, sky, and song, held without heavy motion.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {STOPS.map((stop, index) => (
            <a
              key={stop.id}
              href={stop.id === 'song' ? '#lyrics' : stop.id === 'children' ? '#photos' : '#world'}
              className="min-h-[180px] rounded-[1.4rem] border border-[#d4af37]/16 bg-[#071007]/72 p-5 shadow-[0_22px_72px_rgba(0,0,0,0.34)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#d4af37]/36"
            >
              <p className="font-body text-[9px] uppercase tracking-[0.34em] text-[#d4af37]/58">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-4 font-display text-2xl leading-tight text-[#fff7df]">{stop.label}</h3>
              <p className="mt-3 font-body text-xs leading-6 text-[#fff7df]/58">{stop.detail}</p>
            </a>
          ))}
        </div>

        {onOpenFamily && (
          <button
            type="button"
            onClick={onOpenFamily}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#f5d06e] px-6 py-3 font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#071007] transition hover:-translate-y-0.5"
          >
            <Footprints className="h-4 w-4" />
            Open family memory
          </button>
        )}
      </div>
    </section>
  );
}

export default function GardenWalkthrough3D({ onOpenFamily }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const targetRef = useRef(STOPS[0]);
  const frameRef = useRef(0);
  const dragRef = useRef({ active: false, x: 0, yaw: 0 });
  const yawRef = useRef(0);
  const activeStopRef = useRef(0);
  const autoWalkRef = useRef(true);
  const [activeStop, setActiveStop] = useState(0);
  const [autoWalk, setAutoWalk] = useState(true);
  const [ready, setReady] = useState(false);
  const [webglError, setWebglError] = useState('');

  const goToStop = useCallback((index) => {
    const nextIndex = (index + STOPS.length) % STOPS.length;
    targetRef.current = STOPS[nextIndex];
    activeStopRef.current = nextIndex;
    setActiveStop(nextIndex);
  }, []);

  useEffect(() => {
    autoWalkRef.current = autoWalk;
  }, [autoWalk]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071007);
    scene.fog = new THREE.FogExp2(0x071007, 0.065);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 0.1, 80);
    camera.position.copy(STOPS[0].position);
    camera.lookAt(STOPS[0].lookAt);
    cameraRef.current = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setWebglError('Garden walkthrough needs the still fallback on this device.');
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight(0xcfe9ff, 0x18240f, 1.25);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffdf9a, 2.8);
    sun.position.set(-5, 8, 6);
    scene.add(sun);

    const lanternLight = new THREE.PointLight(0xf5d06e, 2.4, 7, 1.8);
    lanternLight.position.set(0, 1.25, -3.8);
    scene.add(lanternLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    const groundTexture = textureLoader.load(
      GARDEN_PHOTO,
      () => setReady(true),
      undefined,
      () => setWebglError('Garden photo could not be loaded into the walkthrough.'),
    );
    groundTexture.colorSpace = THREE.SRGBColorSpace;
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(2.6, 2.6);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 28, 20, 28),
      new THREE.MeshStandardMaterial({
        map: groundTexture,
        color: 0x9ca765,
        roughness: 0.92,
        metalness: 0,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.08;
    scene.add(ground);

    const path = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 16, 4, 18),
      new THREE.MeshStandardMaterial({
        color: 0x6f5f35,
        roughness: 0.96,
        metalness: 0,
        transparent: true,
        opacity: 0.74,
      }),
    );
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, -0.055, 0);
    scene.add(path);

    const canopyMaterial = new THREE.MeshBasicMaterial({
      color: 0x173014,
      transparent: true,
      opacity: 0.54,
      side: THREE.BackSide,
    });
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(18, 32, 18), canopyMaterial);
    canopy.position.y = 1.4;
    scene.add(canopy);

    const frameTextures = [SONIA_SKY_PHOTO, GARDEN_PHOTO, GANNON_AND_MUM_PHOTO, FAMILY_CHILDREN_PHOTO, SONIA_AND_PA_PHOTO].map((src) => {
      const texture = textureLoader.load(src);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });

    scene.add(createFrame({ texture: frameTextures[0], position: new THREE.Vector3(-3.1, 1.7, 1.05), rotationY: 0.55 }));
    scene.add(createFrame({ texture: frameTextures[1], position: new THREE.Vector3(-1.35, 1.32, 0.2), rotationY: 0.38, width: 1.45, height: 2.35 }));
    scene.add(createFrame({ texture: frameTextures[2], position: new THREE.Vector3(-2.2, 1.38, -2.6), rotationY: 0.28, width: 1.25, height: 1.62 }));
    scene.add(createFrame({ texture: frameTextures[3], position: new THREE.Vector3(2.75, 1.42, -1.7), rotationY: -0.58, width: 1.58, height: 1.18 }));
    scene.add(createFrame({ texture: frameTextures[4], position: new THREE.Vector3(0, 2.18, -9.4), rotationY: 0, width: 2.28, height: 1.28 }));

    const gardenMemoryGlow = new THREE.PointLight(0xffd87a, 2.2, 4.2, 1.65);
    gardenMemoryGlow.position.set(-1.75, 1.55, 0.7);
    scene.add(gardenMemoryGlow);

    const backGarden = new THREE.Mesh(
      new THREE.PlaneGeometry(8.5, 5.1),
      new THREE.MeshBasicMaterial({
        map: frameTextures[1],
        transparent: true,
        opacity: 0.2,
        toneMapped: false,
      }),
    );
    backGarden.position.set(0, 2.15, 5.4);
    backGarden.rotation.y = Math.PI;
    scene.add(backGarden);

    const leafColors = [0x173b1c, 0x244e23, 0x47651f, 0x314820];
    for (let i = 0; i < 42; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const cluster = createLeafCluster(i * 0.53, leafColors[i % leafColors.length]);
      cluster.position.set(side * (2.2 + (i % 5) * 0.58), 0.12 + (i % 4) * 0.08, 7.4 - i * 0.34);
      cluster.scale.setScalar(0.9 + (i % 4) * 0.18);
      cluster.rotation.y = side * (0.5 + (i % 7) * 0.08);
      scene.add(cluster);
    }

    const lanternMaterial = new THREE.MeshBasicMaterial({ color: 0xf5d06e, transparent: true, opacity: 0.62 });
    const lanternGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5d06e,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    for (let i = 0; i < 14; i += 1) {
      const z = 6.4 - i * 0.88;
      const x = (i % 2 === 0 ? -1.2 : 1.2) + (i % 3) * 0.08;
      const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), lanternMaterial);
      lantern.position.set(x, 0.18, z);
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), lanternGlowMaterial);
      glow.position.copy(lantern.position);
      scene.add(glow, lantern);
    }

    const songGate = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.018, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0xf5d06e, transparent: true, opacity: 0.38 }),
    );
    songGate.position.set(0, 1.15, -5.9);
    songGate.rotation.x = Math.PI / 2;
    scene.add(songGate);

    const clock = new THREE.Clock();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const target = targetRef.current;
      camera.position.lerp(target.position, reducedMotion ? 0.05 : 0.035);

      const look = target.lookAt.clone();
      if (!dragRef.current.active) {
        yawRef.current *= 0.94;
      }
      look.x += yawRef.current;
      camera.lookAt(look);

      songGate.rotation.z = elapsed * 0.08;
      lanternLight.intensity = 2 + Math.sin(elapsed * 2.1) * 0.35;

      if (autoWalkRef.current && !reducedMotion && elapsed - frameRef.current > 7.5) {
        frameRef.current = elapsed;
        goToStop(activeStopRef.current + 1);
      }

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const handlePointerDown = (event) => {
      dragRef.current = { active: true, x: event.clientX, yaw: yawRef.current };
      renderer.domElement.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
      if (!dragRef.current.active) return;
      const delta = (event.clientX - dragRef.current.x) / Math.max(280, mount.clientWidth);
      yawRef.current = THREE.MathUtils.clamp(dragRef.current.yaw - delta * 3.4, -1.3, 1.3);
    };

    const handlePointerUp = () => {
      dragRef.current.active = false;
    };

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        setAutoWalk(false);
        goToStop(activeStopRef.current + 1);
      }
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        setAutoWalk(false);
        goToStop(activeStopRef.current - 1);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKeyDown);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointercancel', handlePointerUp);
    animate();

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointercancel', handlePointerUp);
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        }
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [goToStop]);

  const currentStop = STOPS[activeStop];

  if (webglError) {
    return <GardenWalkthroughFallback onOpenFamily={onOpenFamily} />;
  }

  return (
    <section id="garden-walkthrough" className="relative min-h-screen overflow-hidden bg-[#020502]">
      <div className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-[#020502] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#020502] to-transparent" />

      <div
        ref={mountRef}
        className="absolute inset-0"
        role="img"
        aria-label="A first person garden walkthrough with Sonia's photos, family memories, lanterns, and a path toward the song."
      />

      {!ready && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#020502]">
          <div className="h-10 w-10 rounded-full border border-[#f5d06e]/30 border-t-[#f5d06e]" />
        </div>
      )}

      <div className="pointer-events-none relative z-20 flex min-h-screen flex-col justify-between px-5 py-8 md:px-10 md:py-10">
        <div className="max-w-3xl">
          <p className="font-body text-[10px] uppercase tracking-[0.55em] text-[#d4af37]/70">
            Walkthrough
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[0.92] text-[#fff7df] [text-shadow:0_8px_34px_rgba(0,0,0,0.78)] md:text-7xl">
            Walk from the gate to her chair.
          </h2>
          <p className="mt-5 max-w-xl font-body text-sm leading-7 text-[#fff7df]/70 md:text-base">
            A quiet first-person path built around the real garden photo, family memories, lanterns, and the emotional route into Without You Here.
          </p>
        </div>

        <div className="pointer-events-auto flex flex-col gap-4 pb-28 sm:pb-0 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md border-l border-[#f5d06e]/42 bg-[#020502]/42 py-4 pl-5 pr-4 backdrop-blur-md">
            <p className="font-body text-[9px] uppercase tracking-[0.38em] text-[#d4af37]/62">
              {activeStop + 1} / {STOPS.length}
            </p>
            <h3 className="mt-2 font-display text-3xl leading-tight text-[#fff7df]">
              {currentStop.label}
            </h3>
            <p className="mt-2 font-body text-sm leading-6 text-[#fff7df]/62">
              {currentStop.detail}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => { setAutoWalk(false); goToStop(activeStop - 1); }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5d06e]/26 bg-[#020502]/58 text-[#fff7df] backdrop-blur-md transition hover:border-[#f5d06e]/60 hover:text-[#f5d06e]"
              aria-label="Previous garden stop"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => { setAutoWalk(false); goToStop(activeStop + 1); }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5d06e]/26 bg-[#020502]/58 text-[#fff7df] backdrop-blur-md transition hover:border-[#f5d06e]/60 hover:text-[#f5d06e]"
              aria-label="Next garden stop"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setAutoWalk((value) => !value)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5d06e]/26 bg-[#020502]/58 text-[#fff7df] backdrop-blur-md transition hover:border-[#f5d06e]/60 hover:text-[#f5d06e]"
              aria-label={autoWalk ? 'Pause garden walk' : 'Play garden walk'}
            >
              {autoWalk ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => { setAutoWalk(false); goToStop(0); }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5d06e]/26 bg-[#020502]/58 text-[#fff7df] backdrop-blur-md transition hover:border-[#f5d06e]/60 hover:text-[#f5d06e]"
              aria-label="Return to garden gate"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            {onOpenFamily && (
              <button
                type="button"
                onClick={onOpenFamily}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5d06e]/36 bg-[#f5d06e]/18 text-[#fff7df] backdrop-blur-md transition hover:border-[#f5d06e]/70 hover:text-[#f5d06e]"
                aria-label="Open family memory"
              >
                <Footprints className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
