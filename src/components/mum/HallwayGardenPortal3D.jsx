import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Footprints, Pause, Play, RotateCcw } from 'lucide-react';
import { GardenRooms } from './GardenWalkEntrance';

const HALLWAY_VIDEO = '/__private_mum_video/hallway-garden-source.mov';
const GARDEN_PHOTO = '/images/mum/mum_garden.jpg';
const SONIA_AVATAR = '/images/mum/memory-lane/ML037_FS082.jpg';
const SONIA_SKY = '/images/mum/sonia_sky_angel_hero.png';
const GANNON_AND_MUM = '/images/mum/mum_gannon_young.jpg';
const SONIA_FRIENDSHIP_MEMORY = '/images/mum/mum_bar.png';
const SONIA_AND_PA = '/images/mum/foyer/sonia-and-pa-sky.png';
const SINGLE_ARTWORK = '/images/music/without-you-here-cover.png';

const STOPS = [
  {
    id: 'threshold',
    label: 'Hallway becomes garden',
    detail: 'The real corridor is still there, but the walls breathe outward into leaves, sky, and light.',
    position: new THREE.Vector3(0, 1.62, 7.4),
    lookAt: new THREE.Vector3(0, 1.45, 0.5),
  },
  {
    id: 'sonia',
    label: 'Sonia in the light',
    detail: 'Her portrait sits in the garden path, not as a public talking clone, just as a presence.',
    position: new THREE.Vector3(-1.65, 1.66, 3.05),
    lookAt: new THREE.Vector3(-2.2, 1.48, 0.1),
  },
  {
    id: 'family',
    label: 'Family wall',
    detail: 'The corridor walls hold real family memories while the floor turns into an outdoor path.',
    position: new THREE.Vector3(1.9, 1.72, 0.75),
    lookAt: new THREE.Vector3(2.35, 1.35, -1.7),
  },
  {
    id: 'song',
    label: 'The song opens',
    detail: 'The path leads toward Without You Here and the Golden Gates beyond it.',
    position: new THREE.Vector3(0.15, 1.76, -3.15),
    lookAt: new THREE.Vector3(0, 1.55, -7.2),
  },
  {
    id: 'gates',
    label: 'Golden Gates',
    detail: "At the end, the hallway is no longer indoor. It has become Sonia's Garden.",
    position: new THREE.Vector3(0, 1.9, -7.4),
    lookAt: new THREE.Vector3(0, 2.05, -11.2),
  },
];

function createVideoElement(onReady, onError) {
  const video = document.createElement('video');
  video.src = HALLWAY_VIDEO;
  video.crossOrigin = 'anonymous';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.addEventListener('loadeddata', onReady, { once: true });
  video.addEventListener('error', onError, { once: true });
  video.load();
  return video;
}

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

function createFrame({ texture, position, rotationY = 0, width = 1.35, height = 1.8, glowColor = 0xf5d06e }) {
  const group = new THREE.Group();
  const frame = new THREE.Mesh(
    new THREE.ShapeGeometry(makeRoundedRectShape(width + 0.18, height + 0.18, 0.08)),
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0x312004,
      emissiveIntensity: 0.22,
      metalness: 0.2,
      roughness: 0.46,
    }),
  );
  frame.position.z = -0.02;

  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
  );
  photo.position.z = 0.012;

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(width + 0.52, height + 0.52),
    new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  glow.position.z = -0.06;

  group.add(glow, frame, photo);
  group.position.copy(position);
  group.rotation.y = rotationY;
  return group;
}

function createLeafCluster(seed, color) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.86,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < 11; i += 1) {
    const angle = seed + i * 0.58;
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.78), material);
    leaf.position.set(Math.cos(angle) * 0.25, 0.2 + i * 0.045, Math.sin(angle) * 0.25);
    leaf.rotation.set(0.85 + (i % 2) * 0.3, angle, -0.44 + i * 0.07);
    group.add(leaf);
  }

  return group;
}

function createFlower(x, z, color) {
  const group = new THREE.Group();
  const petalMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.72 });
  const centreMaterial = new THREE.MeshBasicMaterial({ color: 0xf5d06e });
  for (let i = 0; i < 6; i += 1) {
    const petal = new THREE.Mesh(new THREE.CircleGeometry(0.045, 10), petalMaterial);
    const angle = (Math.PI * 2 * i) / 6;
    petal.position.set(Math.cos(angle) * 0.055, Math.sin(angle) * 0.055, 0);
    group.add(petal);
  }
  group.add(new THREE.Mesh(new THREE.CircleGeometry(0.035, 10), centreMaterial));
  group.position.set(x, 0.08, z);
  group.rotation.x = -Math.PI / 2;
  return group;
}

function createFallbackPoster({ onJump }) {
  return (
    <section id="hallway-garden-3d" className="relative min-h-screen overflow-hidden bg-[#020502] text-[#fff7df]">
      <img
        src={GARDEN_PHOTO}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[50%_45%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,2,0.92),rgba(2,5,2,0.34),rgba(2,5,2,0.88)),linear-gradient(0deg,#020502,rgba(2,5,2,0.22)_55%,#020502)]" />
      <div className="relative z-10 flex min-h-screen items-end px-5 py-12 md:px-10">
        <div className="max-w-3xl border-l border-[#f5d06e]/42 bg-black/30 p-6 backdrop-blur-md">
          <p className="font-body text-[10px] uppercase tracking-[0.48em] text-[#d4af37]/70">Garden threshold</p>
          <h2 className="mt-4 font-display text-5xl leading-[0.92] text-[#fff7df] md:text-7xl">
            The hallway opens into her garden.
          </h2>
          <p className="mt-5 max-w-xl font-body text-sm leading-7 text-[#fff7df]/70">
            The path softens into leaves, light, family frames, and the Golden Gates beyond it.
          </p>
          <button
            type="button"
            onClick={onJump}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f5d06e] px-5 py-3 font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#071007]"
          >
            Continue <Footprints className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HallwayGardenPortal3D({ onOpenMemory, onFinish }) {
  const mountRef = useRef(null);
  const targetRef = useRef(STOPS[0]);
  const activeStopRef = useRef(0);
  const autoWalkRef = useRef(true);
  const dragRef = useRef({ active: false, x: 0, yaw: 0 });
  const yawRef = useRef(0);
  const frameTimeRef = useRef(0);
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
    scene.background = new THREE.Color(0x061007);
    scene.fog = new THREE.FogExp2(0x061007, 0.052);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 90);
    camera.position.copy(STOPS[0].position);
    camera.lookAt(STOPS[0].lookAt);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setWebglError('WebGL is not available for the hallway garden.');
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    mount.appendChild(renderer.domElement);

    const disposables = [];
    const textures = new Set();
    const addDisposable = (item) => {
      disposables.push(item);
      return item;
    };
    const addTexture = (texture) => {
      textures.add(texture);
      return texture;
    };

    const video = createVideoElement(
      () => setReady(true),
      () => setReady(true),
    );

    const videoTexture = addTexture(new THREE.VideoTexture(video));
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.wrapS = THREE.RepeatWrapping;
    videoTexture.wrapT = THREE.RepeatWrapping;
    videoTexture.repeat.set(1.35, 1);
    videoTexture.offset.set(0.08, 0);
    video.play().catch(() => {
      setReady(true);
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    const loadTexture = (src) => {
      const texture = addTexture(textureLoader.load(src));
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const gardenTexture = loadTexture(GARDEN_PHOTO);
    const soniaTexture = loadTexture(SONIA_AVATAR);
    const skyTexture = loadTexture(SONIA_SKY);
    const gannonTexture = loadTexture(GANNON_AND_MUM);
    const familyTexture = loadTexture(SONIA_FRIENDSHIP_MEMORY);
    const paTexture = loadTexture(SONIA_AND_PA);
    const singleTexture = loadTexture(SINGLE_ARTWORK);

    scene.add(new THREE.HemisphereLight(0xd7f1ff, 0x12210f, 1.45));
    const sun = addDisposable(new THREE.DirectionalLight(0xffe6a9, 3.2));
    sun.position.set(-5, 9, 7);
    scene.add(sun);
    const goldLight = addDisposable(new THREE.PointLight(0xf5d06e, 3.5, 9, 1.7));
    goldLight.position.set(0, 1.25, -5.2);
    scene.add(goldLight);

    const hallwayMaterial = addDisposable(new THREE.MeshStandardMaterial({
      map: videoTexture,
      color: 0xb9d794,
      roughness: 0.72,
      metalness: 0,
      transparent: true,
      opacity: 0.76,
      side: THREE.DoubleSide,
    }));

    const floorMaterial = addDisposable(new THREE.MeshStandardMaterial({
      map: videoTexture,
      color: 0x9fbf74,
      roughness: 0.88,
      metalness: 0,
      transparent: true,
      opacity: 0.84,
      side: THREE.DoubleSide,
    }));

    const gardenVeilMaterial = addDisposable(new THREE.MeshBasicMaterial({
      map: gardenTexture,
      color: 0xa9d582,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      toneMapped: false,
    }));

    const floor = addDisposable(new THREE.Mesh(new THREE.PlaneGeometry(5.1, 18.8, 10, 28), floorMaterial));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.08, -0.1);
    scene.add(floor);

    const path = addDisposable(new THREE.Mesh(
      new THREE.PlaneGeometry(2.15, 17.4, 8, 26),
      addDisposable(new THREE.MeshStandardMaterial({
        color: 0x65552d,
        roughness: 0.96,
        metalness: 0,
        transparent: true,
        opacity: 0.42,
      })),
    ));
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, -0.045, -0.2);
    scene.add(path);

    const leftWall = addDisposable(new THREE.Mesh(new THREE.PlaneGeometry(18.8, 4.4, 24, 4), hallwayMaterial));
    leftWall.position.set(-2.65, 1.95, -0.1);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = addDisposable(new THREE.Mesh(new THREE.PlaneGeometry(18.8, 4.4, 24, 4), hallwayMaterial));
    rightWall.position.set(2.65, 1.95, -0.1);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    const ceiling = addDisposable(new THREE.Mesh(
      new THREE.PlaneGeometry(5.1, 18.8, 10, 20),
      addDisposable(new THREE.MeshBasicMaterial({
        map: gardenTexture,
        color: 0x5f8c55,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
      })),
    ));
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 4.12, -0.1);
    scene.add(ceiling);

    const leftVeil = addDisposable(new THREE.Mesh(new THREE.PlaneGeometry(18.6, 4.8), gardenVeilMaterial));
    leftVeil.position.set(-2.72, 2.05, -0.1);
    leftVeil.rotation.y = Math.PI / 2;
    scene.add(leftVeil);

    const rightVeil = addDisposable(new THREE.Mesh(new THREE.PlaneGeometry(18.6, 4.8), gardenVeilMaterial));
    rightVeil.position.set(2.72, 2.05, -0.1);
    rightVeil.rotation.y = -Math.PI / 2;
    scene.add(rightVeil);

    const skyEnd = addDisposable(new THREE.Mesh(
      new THREE.PlaneGeometry(7.8, 5.3),
      addDisposable(new THREE.MeshBasicMaterial({
        map: skyTexture,
        transparent: true,
        opacity: 0.52,
        toneMapped: false,
        side: THREE.DoubleSide,
      })),
    ));
    skyEnd.position.set(0, 2.35, -9.35);
    scene.add(skyEnd);

    scene.add(createFrame({ texture: soniaTexture, position: new THREE.Vector3(-2.42, 1.55, 0.3), rotationY: 0.58, width: 1.25, height: 2.1, glowColor: 0xffe7b1 }));
    scene.add(createFrame({ texture: gannonTexture, position: new THREE.Vector3(-2.46, 1.35, -3.0), rotationY: 0.42, width: 1.24, height: 1.62 }));
    scene.add(createFrame({ texture: familyTexture, position: new THREE.Vector3(2.44, 1.36, -1.75), rotationY: -0.58, width: 1.58, height: 1.18 }));
    scene.add(createFrame({ texture: paTexture, position: new THREE.Vector3(2.46, 1.45, 2.15), rotationY: -0.52, width: 1.28, height: 1.48 }));
    scene.add(createFrame({ texture: singleTexture, position: new THREE.Vector3(0, 1.82, -6.7), rotationY: 0, width: 1.7, height: 2.15, glowColor: 0xf5d06e }));

    const archMaterial = addDisposable(new THREE.MeshBasicMaterial({ color: 0xf5d06e, transparent: true, opacity: 0.44 }));
    const arch = addDisposable(new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.028, 10, 96), archMaterial));
    arch.position.set(0, 1.2, -8.15);
    arch.rotation.x = Math.PI / 2;
    scene.add(arch);

    const leafColors = [0x173b1c, 0x244f24, 0x416723, 0x2f4a20, 0x66853a];
    for (let i = 0; i < 64; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const cluster = createLeafCluster(i * 0.51, leafColors[i % leafColors.length]);
      cluster.position.set(side * (2.1 + (i % 5) * 0.22), 0.16 + (i % 7) * 0.22, 7.4 - i * 0.24);
      cluster.scale.setScalar(0.8 + (i % 4) * 0.17);
      cluster.rotation.y = side * (0.55 + (i % 6) * 0.08);
      scene.add(cluster);
    }

    const flowerColors = [0xf5d06e, 0xff9c6b, 0xf3d7e9, 0xffd27a];
    for (let i = 0; i < 46; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      scene.add(createFlower(side * (1.15 + (i % 5) * 0.22), 6.5 - i * 0.32, flowerColors[i % flowerColors.length]));
    }

    const goldMaterial = addDisposable(new THREE.MeshBasicMaterial({
      color: 0xf5d06e,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    const goldDust = [];
    for (let i = 0; i < 70; i += 1) {
      const mote = addDisposable(new THREE.Mesh(new THREE.SphereGeometry(0.015 + (i % 3) * 0.006, 8, 8), goldMaterial));
      mote.position.set(
        -2.2 + (i % 14) * 0.34,
        0.55 + (i % 9) * 0.28,
        7.1 - Math.floor(i / 5) * 0.7,
      );
      goldDust.push(mote);
      scene.add(mote);
    }

    const clock = new THREE.Clock();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const target = targetRef.current;
      camera.position.lerp(target.position, reducedMotion ? 0.06 : 0.032);

      const lookAt = target.lookAt.clone();
      if (!dragRef.current.active) yawRef.current *= 0.94;
      lookAt.x += yawRef.current;
      camera.lookAt(lookAt);

      arch.rotation.z = elapsed * 0.08;
      goldLight.intensity = 2.9 + Math.sin(elapsed * 2.2) * 0.5;
      goldDust.forEach((mote, index) => {
        mote.position.y += Math.sin(elapsed * 0.8 + index) * 0.0009;
        mote.material.opacity = 0.28 + Math.sin(elapsed + index * 0.4) * 0.12;
      });

      if (autoWalkRef.current && !reducedMotion && elapsed - frameTimeRef.current > 7.2) {
        frameTimeRef.current = elapsed;
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
      yawRef.current = THREE.MathUtils.clamp(dragRef.current.yaw - delta * 3.2, -1.35, 1.35);
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
      video.pause();
      video.removeAttribute('src');
      video.load();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        const materials = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
        materials.forEach((material) => material.dispose());
      });
      textures.forEach((texture) => texture.dispose());
      disposables.forEach((item) => {
        if (item.dispose && !item.isMaterial) item.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [goToStop]);

  const currentStop = STOPS[activeStop];

  if (webglError) {
    return (
      <section id="garden-walk" className="relative overflow-hidden bg-[#020502] text-[#fff7df]">
        {createFallbackPoster({ onJump: onFinish })}
        <GardenRooms onOpenMemory={onOpenMemory} onFinish={onFinish} />
      </section>
    );
  }

  return (
    <section id="garden-walk" className="relative overflow-hidden bg-[#020502] text-[#fff7df]">
      <div id="hallway-garden-3d" className="relative min-h-screen overflow-hidden bg-[#020502]">
        <div className="absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#020502] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#020502] to-transparent" />
        <div
          ref={mountRef}
          className="absolute inset-0"
          role="img"
          aria-label="A first-person 3D hallway transformed into Sonia's outdoor garden with moving video-textured walls, foliage, memory frames, and golden gates."
        />

        {!ready && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#020502]">
            <div className="h-10 w-10 rounded-full border border-[#f5d06e]/30 border-t-[#f5d06e]" />
          </div>
        )}

        <div className="pointer-events-none relative z-20 flex min-h-screen flex-col justify-between px-5 py-8 text-[#fff7df] md:px-10 md:py-10">
          <div className="max-w-3xl">
            <p className="font-body text-[10px] uppercase tracking-[0.5em] text-[#d4af37]/72 [text-shadow:0_4px_22px_rgba(0,0,0,0.76)]">
              From sky to backyard
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.92] text-[#fff7df] [text-shadow:0_8px_34px_rgba(0,0,0,0.78)] md:text-7xl">
              Walk into Mum's garden.
            </h1>
            <p className="mt-5 max-w-xl font-body text-sm leading-7 text-[#fff7df]/72 md:text-base">
              Sonia first: her real garden, the single artwork, family memories, coffee, favourite details, and the song all sit on the same path.
            </p>
          </div>

          <div className="pointer-events-auto flex flex-col gap-4 pb-28 sm:pb-0 md:flex-row md:items-end md:justify-between">
            <div className="max-w-md border-l border-[#f5d06e]/42 bg-[#020502]/48 py-4 pl-5 pr-4 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-md">
              <p className="font-body text-[9px] uppercase tracking-[0.36em] text-[#d4af37]/62">
                {activeStop + 1} / {STOPS.length}
              </p>
              <h2 className="mt-2 font-display text-3xl leading-tight text-[#fff7df]">
                {currentStop.label}
              </h2>
              <p className="mt-2 font-body text-sm leading-6 text-[#fff7df]/64">
                {currentStop.detail}
              </p>
            </div>
          </div>

          <div className="pointer-events-auto absolute bottom-28 right-5 z-30 flex flex-wrap items-center justify-end gap-2 sm:bottom-auto sm:top-28 md:right-10 md:top-32">
            <button
              type="button"
              onClick={() => { setAutoWalk(false); goToStop(activeStop - 1); }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5d06e]/26 bg-[#020502]/72 text-[#fff7df] shadow-[0_18px_38px_rgba(0,0,0,0.34)] backdrop-blur-md transition hover:border-[#f5d06e]/60 hover:text-[#f5d06e]"
              aria-label="Previous garden stop"
              title="Previous stop"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => { setAutoWalk(false); goToStop(activeStop + 1); }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5d06e]/26 bg-[#020502]/72 text-[#fff7df] shadow-[0_18px_38px_rgba(0,0,0,0.34)] backdrop-blur-md transition hover:border-[#f5d06e]/60 hover:text-[#f5d06e]"
              aria-label="Next garden stop"
              title="Next stop"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setAutoWalk((value) => !value)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5d06e]/26 bg-[#020502]/72 text-[#fff7df] shadow-[0_18px_38px_rgba(0,0,0,0.34)] backdrop-blur-md transition hover:border-[#f5d06e]/60 hover:text-[#f5d06e]"
              aria-label={autoWalk ? 'Pause garden walk' : 'Play garden walk'}
              title={autoWalk ? 'Pause walk' : 'Play walk'}
            >
              {autoWalk ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => { setAutoWalk(false); goToStop(0); }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5d06e]/26 bg-[#020502]/72 text-[#fff7df] shadow-[0_18px_38px_rgba(0,0,0,0.34)] backdrop-blur-md transition hover:border-[#f5d06e]/60 hover:text-[#f5d06e]"
              aria-label="Return to hallway threshold"
              title="Return to threshold"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                const payload = {
                  src: SONIA_AVATAR,
                  label: 'Sonia portrait',
                  caption: 'Private avatar source portrait held as a memorial presence. Not a public speaking clone.',
                  source: 'Private review portrait',
                };
                if (onOpenMemory) onOpenMemory(payload);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f5d06e]/36 bg-[#f5d06e]/18 text-[#fff7df] shadow-[0_18px_38px_rgba(0,0,0,0.34)] backdrop-blur-md transition hover:border-[#f5d06e]/70 hover:text-[#f5d06e]"
              aria-label="Open Sonia portrait"
              title="Open Sonia portrait"
            >
              <Footprints className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <GardenRooms onOpenMemory={onOpenMemory} onFinish={onFinish} />
    </section>
  );
}
