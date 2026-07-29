import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, Hand, MoveHorizontal, MousePointer2 } from 'lucide-react';
import GardenImmersionBackground from './GardenImmersionBackground';

const GARDEN_PHOTO = '/images/mum/mum_garden.jpg';
const GARDEN_TEXTURES = {
  upperCanopy: '/images/mum/garden-textures/real-upper-canopy.png',
  leftMonstera: '/images/mum/garden-textures/real-monstera-left-cutout.png',
  rightMonstera: '/images/mum/garden-textures/real-monstera-right-cutout.png',
  hangingFern: '/images/mum/garden-textures/real-hanging-fern-cutout.png',
  suburbanTreeline: '/images/mum/garden-textures/real-suburban-treeline.jpg',
  fernGullyCanopy: '/images/mum/garden-textures/melbourne-fern-gully-canopy.jpg',
  fernGullyCanopySoft: '/images/mum/garden-textures/fern-gully-canopy-soft.png',
  fernGullyFernBank: '/images/mum/garden-textures/fern-gully-fern-bank-soft.png',
  fernGullyTrunkPalm: '/images/mum/garden-textures/fern-gully-trunk-palm-left.png',
  fernGullyTrunkGrey: '/images/mum/garden-textures/fern-gully-trunk-grey.png',
  fernGullyTrunkDark: '/images/mum/garden-textures/fern-gully-trunk-dark.png',
  mumPlantWall: '/images/mum/garden-textures/mum-real-plant-wall-soft.png',
  mumDarkCorner: '/images/mum/garden-textures/mum-real-dark-garden-corner-soft.png',
};

const MEMORY_PHOTOS = [
  {
    id: 'garden-chair',
    src: '/images/mum/mum_garden.jpg',
    label: 'Coffee in the garden',
    caption: "Sonia in her real garden: robe, mug, chair, plants, and the coffee habit everyone knew. Any drive with the kids could turn into a Macca's coffee run for an extra-extra-hot cappuccino. If they said it was a health and safety risk, Mum would tell them to take extra care then.",
    source: 'Original family garden photo',
    position: [-2.6, 2.15, 1.2],
    rotationY: 0.54,
    size: [1.35, 1.75],
  },
  {
    id: 'sonia-pa',
    src: '/images/mum/memory-lane/ML058_FS116.jpg',
    label: 'Sonia and Pa',
    caption: 'A family archive photo kept as a memory in the garden, not rebuilt or beautified.',
    source: 'Original family memory photo',
    position: [2.38, 2.04, -9.5],
    rotationY: -0.48,
    size: [1.28, 1.52],
  },
  {
    id: 'young-gannon',
    src: '/images/mum/mum_gannon_young.jpg',
    label: 'Mum and Gannon',
    caption: 'A real family image placed as a hanging memory along the path.',
    source: 'Original family memory photo',
    position: [-2.55, 1.95, -17.5],
    rotationY: 0.46,
    size: [1.28, 1.58],
  },
  {
    id: 'her-children',
    src: '/images/mum/favourite-things/mums-children.png',
    label: 'Her children',
    caption: 'The family image is kept intact as a physical memory in the garden.',
    source: 'Approved family feature image',
    position: [2.2, 1.9, -25.5],
    rotationY: -0.42,
    size: [1.62, 1.22],
  },
];

const JOURNEY_STOPS = [
  { label: 'Real garden', note: "Start with Sonia's real garden photo and the feeling of arriving." },
  { label: 'Family memories', note: 'The exact photos sit gently along the path, like memory cards in the garden.' },
  { label: 'Quiet memorial', note: 'The walk settles into the song, warm light, and a simple place to remember her.' },
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function createLabelTexture(text, subtitle) {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1d1204';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 18;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);
  ctx.fillStyle = '#f6d87c';
  ctx.font = '700 98px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, 174);
  ctx.fillStyle = 'rgba(255, 247, 223, 0.78)';
  ctx.font = '500 42px Arial, sans-serif';
  ctx.fillText(subtitle, canvas.width / 2, 250);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createTextTexture(text, width = 768, height = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(21, 15, 8, 0.86)';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(245, 208, 110, 0.82)';
  ctx.lineWidth = 8;
  ctx.strokeRect(18, 18, width - 36, height - 36);
  ctx.fillStyle = '#fff7df';
  ctx.font = '700 58px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, width / 2, height / 2 + 20);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createFlowerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 128, 128);

  const petals = [
    [64, 38, 17, 28, -0.05],
    [88, 58, 15, 26, 0.82],
    [78, 88, 17, 28, 1.86],
    [47, 88, 16, 27, -1.88],
    [38, 58, 15, 27, -0.74],
  ];
  petals.forEach(([x, y, rx, ry, rotate], index) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate);
    const gradient = ctx.createRadialGradient(-3, -5, 1, 0, 0, Math.max(rx, ry));
    gradient.addColorStop(0, index % 2 ? '#e06f22' : '#c85518');
    gradient.addColorStop(1, 'rgba(104, 32, 8, 0.35)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.fillStyle = '#5c2a0b';
  ctx.beginPath();
  ctx.arc(64, 64, 14, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createBarkTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  const base = ctx.createLinearGradient(0, 0, canvas.width, 0);
  base.addColorStop(0, '#2a241b');
  base.addColorStop(0.28, '#5e594c');
  base.addColorStop(0.52, '#3c3529');
  base.addColorStop(0.78, '#70685a');
  base.addColorStop(1, '#241e18');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 260; i += 1) {
    const x = Math.abs(Math.sin(i * 17.832) * canvas.width);
    const y = Math.abs(Math.cos(i * 9.317) * canvas.height);
    const w = 1 + (i % 8);
    const h = 46 + (i % 17) * 9;
    ctx.strokeStyle = i % 3 === 0 ? 'rgba(22,18,12,0.34)' : 'rgba(188,176,146,0.12)';
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + Math.sin(i) * 18, y + h * 0.34, x - Math.cos(i) * 14, y + h * 0.72, x + Math.sin(i * 0.4) * 10, y + h);
    ctx.stroke();
  }

  for (let i = 0; i < 32; i += 1) {
    const y = 14 + i * 25 + Math.sin(i) * 7;
    ctx.strokeStyle = 'rgba(18, 14, 9, 0.18)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(90, y + Math.sin(i) * 8, 210, y - Math.cos(i * 1.3) * 10, canvas.width, y + Math.sin(i * 0.7) * 6);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.35, 2.8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLeafMassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const clusters = [
    [190, 260, 210, 160, '#2d5130'],
    [350, 210, 250, 170, '#456f44'],
    [520, 265, 230, 155, '#1f3f26'],
    [385, 340, 280, 130, '#6b805d'],
    [250, 145, 180, 120, '#244427'],
  ];

  clusters.forEach(([x, y, rx, ry, color], index) => {
    const gradient = ctx.createRadialGradient(x - rx * 0.28, y - ry * 0.35, 16, x, y, Math.max(rx, ry));
    gradient.addColorStop(0, index % 2 ? 'rgba(177, 203, 153, 0.78)' : 'rgba(124, 166, 113, 0.76)');
    gradient.addColorStop(0.48, color.replace(')', ', 0.72)').replace('rgb', 'rgba'));
    gradient.addColorStop(1, 'rgba(10, 24, 12, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.sin(index) * 0.18, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = 0; i < 460; i += 1) {
    const x = Math.abs(Math.sin(i * 12.9898) * canvas.width);
    const y = Math.abs(Math.sin(i * 78.233) * canvas.height);
    const rx = 6 + (i % 9);
    const ry = 2.4 + (i % 5) * 0.8;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(i * 0.43) * Math.PI);
    ctx.fillStyle = i % 4 === 0 ? 'rgba(184, 211, 154, 0.34)' : 'rgba(31, 72, 34, 0.42)';
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createBroadLeafTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createRadialGradient(160, 170, 18, 190, 235, 215);
  gradient.addColorStop(0, 'rgba(177, 213, 170, 0.98)');
  gradient.addColorStop(0.38, 'rgba(70, 126, 79, 0.94)');
  gradient.addColorStop(1, 'rgba(19, 60, 30, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(192, 44);
  ctx.bezierCurveTo(334, 68, 362, 226, 220, 466);
  ctx.bezierCurveTo(56, 282, 58, 92, 192, 44);
  ctx.fill();

  ctx.strokeStyle = 'rgba(220, 237, 199, 0.5)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(192, 58);
  ctx.bezierCurveTo(180, 160, 184, 304, 208, 450);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(232, 246, 214, 0.25)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 11; i += 1) {
    const y = 118 + i * 26;
    ctx.beginPath();
    ctx.moveTo(190, y);
    ctx.bezierCurveTo(130 - i * 2, y + 12, 94, y + 32, 58 + i * 4, y + 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(198, y + 2);
    ctx.bezierCurveTo(254 + i * 2, y + 16, 292, y + 35, 330 - i * 5, y + 52);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSurfaceTexture({ base, fleck, crack }) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 900; i += 1) {
    const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const y = (Math.sin(i * 78.233) * 24634.6345) % 1;
    const a = 0.035 + ((i % 7) * 0.006);
    ctx.fillStyle = fleck.replace('ALPHA', String(a));
    ctx.fillRect(Math.abs(x) * 512, Math.abs(y) * 512, 1 + (i % 3), 1 + (i % 2));
  }

  ctx.strokeStyle = crack;
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 18; i += 1) {
    const y = 18 + i * 29 + Math.sin(i * 1.8) * 8;
    ctx.beginPath();
    ctx.moveTo(20 + Math.sin(i) * 18, y);
    ctx.bezierCurveTo(150, y + Math.sin(i * 2.1) * 16, 320, y - Math.cos(i) * 12, 492, y + Math.sin(i * 1.3) * 8);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createIrregularSlabGeometry(width, depth, seed) {
  const wobble = (value, amount) => Math.sin(seed * 19.17 + value * 11.31) * amount;
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + wobble(1, 0.07), -depth / 2 + wobble(2, 0.05));
  shape.lineTo(width / 2 + wobble(3, 0.06), -depth / 2 + wobble(4, 0.05));
  shape.lineTo(width / 2 + wobble(5, 0.06), depth / 2 + wobble(6, 0.05));
  shape.lineTo(-width / 2 + wobble(7, 0.07), depth / 2 + wobble(8, 0.05));
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

function loadRealTexture(textureLoader, src) {
  const texture = textureLoader.load(src);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function addRealPhotoPlane(scene, texture, {
  width,
  height,
  position,
  rotation = [0, 0, 0],
  opacity = 0.78,
  motion = 0.018,
  alphaTest = 0.025,
  name,
}) {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity,
      alphaTest,
      toneMapped: false,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  plane.name = name || 'real garden foliage';
  plane.position.set(...position);
  plane.rotation.set(...rotation);
  plane.userData.realFoliage = true;
  plane.userData.basePosition = plane.position.clone();
  plane.userData.baseRotation = plane.rotation.clone();
  plane.userData.motion = motion;
  scene.add(plane);
  return plane;
}

function cylinderBetween(start, end, radiusTop, radiusBottom, material, radialSegments = 12) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const midpoint = new THREE.Vector3().addVectors(startVector, endVector).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(endVector, startVector);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, length, radialSegments, 3);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(midpoint);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function addButtressRoot(group, angle, length, material, y = 0.15) {
  const root = cylinderBetween(
    [Math.cos(angle) * 0.18, y + 0.12, Math.sin(angle) * 0.18],
    [Math.cos(angle) * length, y - 0.08, Math.sin(angle) * length],
    0.035,
    0.16,
    material,
    8,
  );
  root.scale.z = 0.72;
  group.add(root);
}

function addCanopyCluster(group, leafTexture, {
  position,
  scale = [4.2, 2.2, 1],
  rotation = [0, 0, 0],
  opacity = 0.28,
  name = 'realistic shaded canopy mass',
}) {
  const material = new THREE.MeshBasicMaterial({
    map: leafTexture,
    transparent: true,
    opacity,
    alphaTest: 0.04,
    toneMapped: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const canopy = new THREE.Mesh(new THREE.PlaneGeometry(scale[0], scale[1]), material);
  canopy.name = name;
  canopy.position.set(...position);
  canopy.rotation.set(...rotation);
  canopy.userData.realFoliage = true;
  canopy.userData.basePosition = canopy.position.clone();
  canopy.userData.baseRotation = canopy.rotation.clone();
  canopy.userData.motion = 0.014;
  group.add(canopy);
}

function addTallGardenTree(scene, {
  x,
  z,
  height,
  radius = 0.22,
  lean = 0,
  leafTexture,
  kind = 'fern-gully',
}) {
  const group = new THREE.Group();
  group.position.set(x, 0.2, z);
  group.rotation.z = lean;
  group.userData.realTree = true;
  group.userData.baseRotation = group.rotation.clone();
  group.userData.motion = 0.0015;

  addCanopyCluster(group, leafTexture, {
    position: [-0.55, height * 0.46, -0.55],
    scale: kind === 'ficus' ? [5.8 + radius, 3.0] : [4.4 + radius, 2.45],
    rotation: [-0.08, 0.12, -0.08],
    opacity: kind === 'ficus' ? 0.25 : 0.22,
  });
  addCanopyCluster(group, leafTexture, {
    position: [0.78, height * 0.42, -1.1],
    scale: kind === 'ficus' ? [4.8, 2.55] : [3.8, 2.05],
    rotation: [-0.06, -0.28, 0.08],
    opacity: kind === 'ficus' ? 0.22 : 0.18,
  });
  addCanopyCluster(group, leafTexture, {
    position: [0.1, height * 0.5, 0.45],
    scale: kind === 'ficus' ? [4.4, 2.32] : [3.4, 1.92],
    rotation: [-0.18, 0.42, 0.02],
    opacity: kind === 'ficus' ? 0.18 : 0.16,
  });

  scene.add(group);
  return group;
}

function addElephantEarCluster(scene, leafTexture, { x, z, side = 1, count = 5, scale = 1 }) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const material = new THREE.MeshBasicMaterial({
    map: leafTexture,
    transparent: true,
    opacity: 0.82,
    alphaTest: 0.05,
    toneMapped: false,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  for (let i = 0; i < count; i += 1) {
    const stem = cylinderBetween(
      [0, 0.06, 0],
      [side * (0.34 + i * 0.08), 0.74 + i * 0.08, -0.14 + i * 0.08],
      0.018,
      0.026,
      new THREE.MeshStandardMaterial({ color: 0x314d2b, roughness: 0.88 }),
      7,
    );
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.86 * scale, 1.14 * scale), material);
    leaf.position.set(side * (0.42 + i * 0.11), 0.92 + i * 0.08, -0.22 + i * 0.12);
    leaf.rotation.set(0.08 + i * 0.02, side > 0 ? -0.72 + i * 0.08 : 0.72 - i * 0.08, side * (-0.15 + i * 0.04));
    leaf.userData.realFoliage = true;
    leaf.userData.basePosition = leaf.position.clone();
    leaf.userData.baseRotation = leaf.rotation.clone();
    leaf.userData.motion = 0.022;
    group.add(stem, leaf);
  }
  scene.add(group);
  return group;
}

function addSpiderPlant(scene, { x, z, side = 1, scale = 1 }) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const material = new THREE.MeshStandardMaterial({ color: 0xadc396, roughness: 0.82, side: THREE.DoubleSide });
  const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0xeef0d2, roughness: 0.78, side: THREE.DoubleSide });
  for (let i = 0; i < 22; i += 1) {
    const angle = -1.2 + i * 0.11;
    const length = (0.72 + (i % 5) * 0.08) * scale;
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.06 * scale, length), i % 3 === 0 ? stripeMaterial : material);
    leaf.position.set(side * Math.sin(angle) * 0.34, 0.34 + Math.cos(angle) * 0.1, Math.cos(angle) * 0.3);
    leaf.rotation.set(1.02 + Math.sin(i) * 0.18, side * (0.42 + angle * 0.1), angle * 0.36);
    leaf.userData.realFoliage = true;
    leaf.userData.basePosition = leaf.position.clone();
    leaf.userData.baseRotation = leaf.rotation.clone();
    leaf.userData.motion = 0.018;
    group.add(leaf);
  }
  scene.add(group);
  return group;
}

function addOrangeFloweringVine(scene, flowerTexture, { x, z, side = 1, length = 10, height = 2.2 }) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const vineMaterial = new THREE.MeshStandardMaterial({ color: 0x263b17, roughness: 0.9 });
  const flowerMaterial = new THREE.SpriteMaterial({
    map: flowerTexture,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    toneMapped: false,
  });

  for (let strand = 0; strand < 8; strand += 1) {
    const zOffset = -length / 2 + strand * (length / 7);
    const points = [];
    for (let step = 0; step <= 8; step += 1) {
      const t = step / 8;
      points.push(new THREE.Vector3(
        side * (Math.sin(t * Math.PI * 2 + strand) * 0.12),
        0.28 + height * t + Math.sin(step + strand) * 0.06,
        zOffset + Math.sin(t * Math.PI + strand) * 0.18,
      ));
    }
    const vine = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 22, 0.012, 7, false), vineMaterial);
    group.add(vine);
  }

  for (let i = 0; i < 76; i += 1) {
    const flower = new THREE.Sprite(flowerMaterial.clone());
    flower.position.set(
      side * (0.06 + Math.sin(i * 1.8) * 0.18),
      0.58 + (i % 19) * (height / 22) + Math.sin(i) * 0.05,
      -length / 2 + (i / 75) * length + Math.sin(i * 0.74) * 0.22,
    );
    const scale = 0.07 + (i % 5) * 0.012;
    flower.scale.set(scale, scale, scale);
    flower.userData.realFoliage = true;
    flower.userData.basePosition = flower.position.clone();
    flower.userData.baseRotation = flower.rotation.clone();
    flower.userData.motion = 0.012;
    group.add(flower);
  }

  group.rotation.y = side > 0 ? -0.08 : 0.08;
  scene.add(group);
  return group;
}

function addRealGardenLayers(scene, textureLoader) {
  const upperCanopy = loadRealTexture(textureLoader, GARDEN_TEXTURES.upperCanopy);
  const leftMonstera = loadRealTexture(textureLoader, GARDEN_TEXTURES.leftMonstera);
  const rightMonstera = loadRealTexture(textureLoader, GARDEN_TEXTURES.rightMonstera);
  const hangingFern = loadRealTexture(textureLoader, GARDEN_TEXTURES.hangingFern);
  const suburbanTreeline = loadRealTexture(textureLoader, GARDEN_TEXTURES.suburbanTreeline);
  const fernGullyCanopy = loadRealTexture(textureLoader, GARDEN_TEXTURES.fernGullyCanopySoft);
  const fernGullyFernBank = loadRealTexture(textureLoader, GARDEN_TEXTURES.fernGullyFernBank);
  const fernGullyTrunkPalm = loadRealTexture(textureLoader, GARDEN_TEXTURES.fernGullyTrunkPalm);
  const fernGullyTrunkGrey = loadRealTexture(textureLoader, GARDEN_TEXTURES.fernGullyTrunkGrey);
  const fernGullyTrunkDark = loadRealTexture(textureLoader, GARDEN_TEXTURES.fernGullyTrunkDark);
  const mumPlantWall = loadRealTexture(textureLoader, GARDEN_TEXTURES.mumPlantWall);
  const mumDarkCorner = loadRealTexture(textureLoader, GARDEN_TEXTURES.mumDarkCorner);

  addRealPhotoPlane(scene, suburbanTreeline, {
    width: 16,
    height: 4.4,
    position: [0, 2.95, -53],
    opacity: 0.11,
    motion: 0.004,
    alphaTest: 0,
    name: 'real suburban treeline',
  });

  [
    {
      width: 13.5,
      height: 4.6,
      position: [0, 4.25, -48],
      rotation: [0, 0, 0],
      opacity: 0.1,
      name: 'distant Melbourne Fern Gully tree depth',
    },
    {
      width: 15,
      height: 4.9,
      position: [-6.9, 4.1, -20],
      rotation: [0, 1.12, 0],
      opacity: 0.08,
      name: 'left layered Fern Gully tree reference',
    },
    {
      width: 15,
      height: 4.9,
      position: [6.9, 4.05, -21],
      rotation: [0, -1.12, 0],
      opacity: 0.08,
      name: 'right layered Fern Gully tree reference',
    },
    {
      width: 13.5,
      height: 4.4,
      position: [0, 7.2, 2.5],
      rotation: [-1.08, 0, 0],
      opacity: 0.06,
      name: 'overhead real canopy reference',
    },
  ].forEach((panel) => addRealPhotoPlane(scene, fernGullyCanopy, {
    ...panel,
    motion: 0.006,
    alphaTest: 0,
  }));

  [
    { texture: fernGullyFernBank, width: 6.8, height: 2.1, position: [-4.6, 1.26, 8.8], rotation: [0, 0.82, 0], opacity: 0.16 },
    { texture: fernGullyFernBank, width: 7.2, height: 2.25, position: [4.75, 1.28, 1.2], rotation: [0, -0.82, 0], opacity: 0.14 },
    { texture: fernGullyFernBank, width: 7.4, height: 2.2, position: [-4.85, 1.25, -12.8], rotation: [0, 0.88, 0], opacity: 0.12 },
    { texture: fernGullyFernBank, width: 7.4, height: 2.2, position: [4.85, 1.25, -21.8], rotation: [0, -0.88, 0], opacity: 0.1 },
  ].forEach((layer, index) => addRealPhotoPlane(scene, layer.texture, {
    ...layer,
    motion: 0.008 + index * 0.002,
    alphaTest: 0.03,
    name: 'real Fern Gully fern bank',
  }));

  [
    { texture: fernGullyTrunkPalm, width: 0.92, height: 6.2, position: [-5.05, 3.08, 11.6], rotation: [0, 0.5, 0], opacity: 0.78 },
    { texture: fernGullyTrunkGrey, width: 0.74, height: 6.4, position: [4.95, 3.18, 6.8], rotation: [0, -0.55, 0], opacity: 0.76 },
    { texture: fernGullyTrunkDark, width: 0.74, height: 6.1, position: [-5.18, 3.02, -2.2], rotation: [0, 0.58, 0], opacity: 0.72 },
    { texture: fernGullyTrunkGrey, width: 0.64, height: 5.8, position: [5.25, 2.92, -12.8], rotation: [0, -0.66, 0], opacity: 0.68 },
    { texture: fernGullyTrunkPalm, width: 0.66, height: 5.9, position: [-5.2, 2.96, -24.4], rotation: [0, 0.66, 0], opacity: 0.64 },
  ].forEach((trunk, index) => addRealPhotoPlane(scene, trunk.texture, {
    ...trunk,
    motion: 0.004 + index * 0.001,
    alphaTest: 0.04,
    name: 'photo real Fern Gully tree trunk',
  }));

  [
    { width: 5.4, height: 1.75, position: [-4.75, 4.55, 10.7], rotation: [-0.16, 0.68, -0.04], opacity: 0.18 },
    { width: 5.2, height: 1.7, position: [4.75, 4.5, 2.2], rotation: [-0.12, -0.68, 0.03], opacity: 0.16 },
    { width: 5.6, height: 1.85, position: [-4.7, 4.2, -14.2], rotation: [-0.06, 0.7, -0.02], opacity: 0.14 },
  ].forEach((layer, index) => addRealPhotoPlane(scene, upperCanopy, {
    ...layer,
    motion: 0.012 + index * 0.004,
    alphaTest: 0.025,
    name: 'real upper canopy',
  }));

  [
    { texture: mumPlantWall, width: 5.8, height: 1.82, position: [-2.95, 2.18, 7.7], rotation: [0, 0.64, -0.02], opacity: 0.34 },
    { texture: mumPlantWall, width: 5.6, height: 1.76, position: [2.95, 2.12, -3.3], rotation: [0, -0.64, 0.02], opacity: 0.28 },
    { texture: mumDarkCorner, width: 2.25, height: 1.85, position: [3.08, 2.25, 9.8], rotation: [0, -0.72, 0.01], opacity: 0.32 },
    { texture: mumDarkCorner, width: 2.25, height: 1.85, position: [-3.08, 2.22, -15.6], rotation: [0, 0.72, -0.01], opacity: 0.24 },
  ].forEach((layer, index) => addRealPhotoPlane(scene, layer.texture, {
    ...layer,
    motion: 0.012 + index * 0.003,
    alphaTest: 0.035,
    name: "Sonia's real backyard plant layer",
  }));

  [
    { texture: leftMonstera, width: 1.28, height: 3.2, position: [-2.05, 2.02, 11.3], rotation: [0, 0.82, -0.03], opacity: 0.76 },
    { texture: rightMonstera, width: 1.75, height: 2.85, position: [2.28, 1.92, 6.1], rotation: [0, -0.78, 0.02], opacity: 0.74 },
    { texture: hangingFern, width: 2.05, height: 1.62, position: [-2.55, 2.72, -1.0], rotation: [0, 0.86, -0.02], opacity: 0.68 },
    { texture: rightMonstera, width: 1.95, height: 3.1, position: [2.45, 2.0, -7.9], rotation: [0, -0.78, 0.02], opacity: 0.68 },
    { texture: leftMonstera, width: 1.35, height: 3.4, position: [-2.45, 1.98, -19.4], rotation: [0, 0.68, 0.02], opacity: 0.62 },
    { texture: hangingFern, width: 2.25, height: 1.8, position: [2.6, 2.6, -24.8], rotation: [0, -0.72, 0.03], opacity: 0.58 },
    { texture: rightMonstera, width: 1.72, height: 2.75, position: [2.3, 1.86, -35.3], rotation: [0, -0.58, -0.02], opacity: 0.56 },
  ].forEach((layer, index) => addRealPhotoPlane(scene, layer.texture, {
    ...layer,
    motion: 0.018 + index * 0.002,
    alphaTest: 0.04,
    name: 'real close garden foliage',
  }));
}

function buildGardenScene({ scene, memoryMeshesRef, onReady }) {
  const loadingManager = new THREE.LoadingManager(() => onReady?.());
  const textureLoader = new THREE.TextureLoader(loadingManager);
  textureLoader.setCrossOrigin('anonymous');
  const groundTexture = createSurfaceTexture({
    base: '#202a18',
    fleck: 'rgba(99, 126, 62, ALPHA)',
    crack: 'rgba(11, 16, 9, 0.16)',
  });
  groundTexture.repeat.set(5, 15);
  const concreteTexture = createSurfaceTexture({
    base: '#9a9282',
    fleck: 'rgba(255, 247, 223, ALPHA)',
    crack: 'rgba(58, 53, 45, 0.28)',
  });
  concreteTexture.repeat.set(1.4, 2.6);
  const soilTexture = createSurfaceTexture({
    base: '#18140d',
    fleck: 'rgba(91, 74, 46, ALPHA)',
    crack: 'rgba(3, 4, 2, 0.22)',
  });
  soilTexture.repeat.set(3, 12);
  const barkTexture = createBarkTexture();
  const leafMassTexture = createLeafMassTexture();
  const broadLeafTexture = createBroadLeafTexture();
  const flowerTexture = createFlowerTexture();

  const materials = {
    ground: new THREE.MeshStandardMaterial({ color: 0x26311c, roughness: 0.96, map: groundTexture }),
    path: new THREE.MeshStandardMaterial({ color: 0xb7ad98, roughness: 0.98, map: concreteTexture }),
    pathDark: new THREE.MeshStandardMaterial({ color: 0x4d4b43, roughness: 0.98, map: concreteTexture }),
    soil: new THREE.MeshStandardMaterial({ color: 0x1b160f, roughness: 0.98, map: soilTexture }),
    orange: new THREE.MeshStandardMaterial({ color: 0xa64214, roughness: 0.78, emissive: 0x2c0800, emissiveIntensity: 0.08 }),
    orangeDark: new THREE.MeshStandardMaterial({ color: 0x7b3115, roughness: 0.9 }),
    vine: new THREE.MeshStandardMaterial({ color: 0x20320f, roughness: 0.9 }),
    concrete: new THREE.MeshStandardMaterial({ color: 0x8a867c, roughness: 0.9 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x77746c, roughness: 0.95 }),
    warmGlow: new THREE.MeshBasicMaterial({ color: 0xf5d06e, transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending }),
    fog: new THREE.MeshBasicMaterial({ color: 0xded8c8, transparent: true, opacity: 0.075, depthWrite: false }),
    bark: new THREE.MeshStandardMaterial({ color: 0x635b4f, roughness: 0.98, map: barkTexture }),
  };

  scene.background = null;
  scene.fog = new THREE.FogExp2(0x172514, 0.018);

  const hemi = new THREE.HemisphereLight(0xffedc2, 0x182513, 1.45);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffd78a, 5.2);
  sun.position.set(-6, 10, 5);
  scene.add(sun);

  const lowWarmth = new THREE.PointLight(0xf4a842, 3.8, 22, 1.25);
  lowWarmth.position.set(-3.2, 1.1, -31.5);
  scene.add(lowWarmth);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(28, 72, 12, 36), materials.ground);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.07, -16);
  scene.add(ground);

  addRealGardenLayers(scene, textureLoader);

  [
    { x: -5.45, z: 12.5, height: 8.7, radius: 0.31, lean: -0.035, kind: 'ficus' },
    { x: 5.45, z: 8.2, height: 8.2, radius: 0.24, lean: 0.028, kind: 'ficus' },
    { x: -5.65, z: 0.6, height: 7.7, radius: 0.24, lean: 0.045, kind: 'fern-gully' },
    { x: 5.65, z: -5.6, height: 7.95, radius: 0.25, lean: -0.03, kind: 'fern-gully' },
    { x: -5.2, z: -15.3, height: 7.25, radius: 0.28, lean: -0.02, kind: 'ficus' },
    { x: 5.4, z: -22.5, height: 7.4, radius: 0.23, lean: 0.04, kind: 'fern-gully' },
    { x: -5.75, z: -34.2, height: 6.9, radius: 0.22, lean: 0.02, kind: 'fern-gully' },
  ].forEach((tree) => addTallGardenTree(scene, {
    ...tree,
    barkMaterial: materials.bark,
    leafTexture: leafMassTexture,
  }));

  [
    { x: -2.85, z: 10.2, side: 1, count: 6, scale: 1.12 },
    { x: 2.65, z: 5.8, side: -1, count: 5, scale: 1.08 },
    { x: -3.2, z: -4.8, side: 1, count: 5, scale: 0.95 },
    { x: 3.15, z: -13.5, side: -1, count: 6, scale: 1.0 },
    { x: -3.35, z: -25.8, side: 1, count: 5, scale: 0.9 },
  ].forEach((plant) => addElephantEarCluster(scene, broadLeafTexture, plant));

  [
    { x: -2.15, z: 2.1, side: 1, scale: 1.05 },
    { x: 2.1, z: -2.6, side: -1, scale: 0.96 },
    { x: -2.6, z: -11.6, side: 1, scale: 0.9 },
    { x: 2.7, z: -20.4, side: -1, scale: 0.86 },
  ].forEach((plant) => addSpiderPlant(scene, plant));

  [
    { x: -3.95, z: 7.3, side: 1, length: 11, height: 2.5 },
    { x: 4.05, z: -6.4, side: -1, length: 12, height: 2.35 },
    { x: -4.15, z: -23.6, side: 1, length: 8.2, height: 2.2 },
  ].forEach((vine) => addOrangeFloweringVine(scene, flowerTexture, vine));

  const leftBed = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 72, 4, 16), materials.soil);
  leftBed.rotation.x = -Math.PI / 2;
  leftBed.position.set(-4.6, -0.03, -16);
  scene.add(leftBed);

  const rightBed = new THREE.Mesh(new THREE.PlaneGeometry(5.7, 72, 4, 16), materials.soil);
  rightBed.rotation.x = -Math.PI / 2;
  rightBed.position.set(4.7, -0.028, -16);
  scene.add(rightBed);

  const showConstructedMarkers = false;
  if (showConstructedMarkers) {
    const leftFence = new THREE.Group();
    leftFence.position.set(-6.15, 1.0, -17);
    for (let i = 0; i < 15; i += 1) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 1.75 + (i % 4) * 0.045, 3.9),
        new THREE.MeshStandardMaterial({ color: i % 2 ? 0x5d624c : 0x68705a, roughness: 0.92 }),
      );
      panel.position.set(Math.sin(i * 1.7) * 0.04, 0, 26 - i * 3.9);
      panel.rotation.y = 0.04;
      leftFence.add(panel);
    }
    scene.add(leftFence);

    const rightFence = leftFence.clone();
    rightFence.position.x = 6.25;
    rightFence.rotation.y = Math.PI;
    scene.add(rightFence);
  }

  for (let i = 0; i < 18; i += 1) {
    const z = 15 - i * 3.55;
    const width = 2.22 + (i % 4) * 0.16;
    const depth = 1.72 + (i % 3) * 0.18;
    const slab = new THREE.Mesh(createIrregularSlabGeometry(width, depth, i + 1), materials.path);
    slab.rotation.x = -Math.PI / 2;
    slab.position.set((i % 3 - 1) * 0.06, 0.018, z);
    slab.rotation.y = (i % 2 === 0 ? -0.018 : 0.018);
    scene.add(slab);

    const crack = new THREE.Mesh(new THREE.BoxGeometry(width * (0.46 + (i % 3) * 0.08), 0.008, 0.018), materials.pathDark);
    crack.position.set(0.02 + Math.sin(i) * 0.12, 0.032, z + 0.1 + Math.cos(i * 0.7) * 0.18);
    crack.rotation.y = 0.14 - (i % 5) * 0.07;
    scene.add(crack);
  }

  const drivewayRight = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.035, 13), materials.pathDark);
  drivewayRight.position.set(5.5, 0.012, -30.5);
  drivewayRight.rotation.y = -0.1;
  scene.add(drivewayRight);

  const drivewayLeft = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.035, 12), materials.path);
  drivewayLeft.position.set(-5.1, 0.014, -30.8);
  drivewayLeft.rotation.y = 0.12;
  scene.add(drivewayLeft);

  const streetPlane = new THREE.Mesh(new THREE.BoxGeometry(12, 0.025, 6), materials.pathDark);
  streetPlane.position.set(7.6, 0.018, -38.8);
  streetPlane.rotation.y = -0.34;
  scene.add(streetPlane);

  const table = new THREE.Group();
  table.position.set(-2.4, 0, -7.2);
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.05, 0.16, 48), materials.concrete);
  tableTop.position.y = 0.84;
  table.add(tableTop);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 0.84, 24), materials.concrete);
  pedestal.position.y = 0.39;
  table.add(pedestal);
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.22, 18), new THREE.MeshStandardMaterial({ color: 0xfff7df, roughness: 0.6 }));
  mug.position.set(0.18, 1.0, 0.12);
  table.add(mug);
  scene.add(table);

  if (showConstructedMarkers) {
    const arch = new THREE.Group();
    arch.position.set(0, 0, -31);
    const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.11, 4.15, 10), materials.orangeDark);
    leftPost.position.set(-2.05, 2.05, 0);
    const rightPost = leftPost.clone();
    rightPost.position.x = 2.05;
    const topBar = new THREE.Mesh(new THREE.TorusGeometry(2.08, 0.062, 10, 56, Math.PI), materials.orangeDark);
    topBar.position.set(0, 4.18, 0);
    topBar.rotation.z = Math.PI;
    arch.add(leftPost, rightPost, topBar);

    for (let strand = 0; strand < 9; strand += 1) {
      const side = strand % 3;
      const offset = (strand - 4) * 0.035;
      const points = [];
      for (let step = 0; step <= 18; step += 1) {
        const t = step / 18;
        const angle = Math.PI * t;
        const x = Math.cos(angle) * (2.0 + offset);
        const y = 3.18 + Math.sin(angle) * (0.9 + offset);
        const postLean = side === 0 ? -2.02 : side === 1 ? 2.02 : x;
        points.push(new THREE.Vector3(
          side === 2 ? x : lerp(postLean, x, t),
          side === 2 ? y : lerp(0.78 + t * 3.3, y, t),
          Math.sin(step * 0.9 + strand) * 0.09,
        ));
      }
      const vine = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 46, 0.012, 7, false), materials.vine);
      arch.add(vine);
    }

    for (let i = 0; i < 132; i += 1) {
      const flower = new THREE.Sprite(new THREE.SpriteMaterial({
        map: flowerTexture,
        transparent: true,
        opacity: 0.82 + (i % 5) * 0.025,
        depthWrite: false,
        toneMapped: false,
      }));
      const t = i / 89;
      const angle = Math.PI * t;
      const onTop = i > 25 && i < 65;
      flower.position.set(
        onTop ? Math.cos(angle) * 2.05 : (i % 2 === 0 ? -2.05 : 2.05) + Math.sin(i) * 0.1,
        onTop ? 4.02 + Math.sin(angle) * 0.74 : 0.8 + (i % 27) * 0.115,
        Math.sin(i * 1.8) * 0.18,
      );
      const scale = 0.105 + (i % 4) * 0.026;
      flower.scale.set(scale, scale, scale);
      arch.add(flower);
    }

    const signTexture = createLabelTexture("Onya & Gay's Archway", 'street right - garden left');
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.55, 0.82),
      new THREE.MeshBasicMaterial({ map: signTexture, transparent: true, toneMapped: false }),
    );
    sign.position.set(0, 3.44, -0.13);
    arch.add(sign);
    scene.add(arch);

    const streetSignTexture = createTextTexture('Street');
    const streetSign = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.42), new THREE.MeshBasicMaterial({ map: streetSignTexture, transparent: true, toneMapped: false }));
    streetSign.position.set(5.1, 1.15, -35.2);
    streetSign.rotation.y = -0.65;
    scene.add(streetSign);

    const gardenSignTexture = createTextTexture('Garden');
    const gardenSign = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.42), new THREE.MeshBasicMaterial({ map: gardenSignTexture, transparent: true, toneMapped: false }));
    gardenSign.position.set(-5.0, 1.15, -35);
    gardenSign.rotation.y = 0.65;
    scene.add(gardenSign);
  }

  const memorial = new THREE.Group();
  memorial.position.set(-1.05, 0, -43.2);
  const stone = new THREE.Mesh(new THREE.BoxGeometry(2.35, 1.35, 0.26), materials.stone);
  stone.position.set(0, 0.92, 0);
  stone.rotation.x = -0.06;
  memorial.add(stone);
  const stoneText = createTextTexture('Sonia', 768, 256);
  const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.62, 0.54), new THREE.MeshBasicMaterial({ map: stoneText, transparent: true, toneMapped: false }));
  textPlane.position.set(0, 1.03, 0.145);
  memorial.add(textPlane);
  const candleMaterial = new THREE.MeshStandardMaterial({ color: 0xf2d681, emissive: 0xf5b43a, emissiveIntensity: 0.38, roughness: 0.45 });
  for (let i = 0; i < 5; i += 1) {
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.32, 16), candleMaterial);
    candle.position.set(-0.82 + i * 0.41, 0.18, 0.42 + (i % 2) * 0.08);
    memorial.add(candle);
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), materials.warmGlow);
    glow.position.set(candle.position.x, 0.44, candle.position.z);
    memorial.add(glow);
  }
  scene.add(memorial);

  for (let i = 0; i < 8; i += 1) {
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 10.5), new THREE.MeshBasicMaterial({
      color: 0xffdf9a,
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    }));
    beam.position.set(-4.5 + i * 1.3, 4.2, 5 - i * 5.3);
    beam.rotation.set(0.38, 0.18, -0.35 + i * 0.04);
    scene.add(beam);
  }

  for (let i = 0; i < 9; i += 1) {
    const fog = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 1.2), materials.fog.clone());
    fog.position.set(-0.5 + (i % 3) * 0.5, 0.22, 10 - i * 6.2);
    fog.rotation.x = -Math.PI / 2;
    fog.userData.fogBand = true;
    fog.userData.speed = 0.15 + (i % 4) * 0.03;
    scene.add(fog);
  }

  MEMORY_PHOTOS.forEach((memory) => {
    const texture = textureLoader.load(memory.src);
    texture.colorSpace = THREE.SRGBColorSpace;
    const frame = new THREE.Group();
    frame.position.set(...memory.position);
    frame.rotation.y = memory.rotationY;
    frame.userData.memory = memory;
    frame.userData.baseY = memory.position[1];
    frame.userData.baseRot = memory.rotationY;

    const [w, h] = memory.size;
    const border = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.18, h + 0.18, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x6b4312, roughness: 0.58, metalness: 0.08 }),
    );
    border.position.z = -0.035;
    border.userData.memory = memory;
    const photo = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
    );
    photo.position.z = 0.018;
    photo.userData.memory = memory;
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.42, h + 0.42), materials.warmGlow.clone());
    glow.position.z = -0.08;
    glow.userData.memory = memory;
    glow.userData.memoryGlow = true;

    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.75, 8), new THREE.MeshBasicMaterial({ color: 0xd4af37 }));
    cord.position.set(0, h / 2 + 0.33, -0.02);
    cord.rotation.z = 0.04;
    frame.add(cord, glow, border, photo);
    scene.add(frame);
    memoryMeshesRef.current.push(frame, border, photo, glow);
  });

  return { materials };
}

function cameraPoint(progress) {
  const stops = [
    { p: 0, pos: [0, 2.35, 13.8], target: [0, 2.08, 4.2] },
    { p: 0.28, pos: [0, 2.08, 7.4], target: [0, 1.92, -2.8] },
    { p: 0.56, pos: [0, 1.82, -5.8], target: [0, 1.72, -16.2] },
    { p: 0.8, pos: [0, 1.72, -20.6], target: [0, 1.62, -31.6] },
    { p: 1, pos: [0, 1.68, -34.8], target: [-0.72, 1.16, -43.0] },
  ];

  const nextIndex = stops.findIndex((stop) => progress <= stop.p);
  const endIndex = nextIndex === -1 ? stops.length - 1 : nextIndex;
  const startIndex = Math.max(0, endIndex - 1);
  const start = stops[startIndex];
  const end = stops[endIndex];
  const local = start === end ? 0 : smoothstep(clamp((progress - start.p) / (end.p - start.p)));

  return {
    pos: new THREE.Vector3(
      lerp(start.pos[0], end.pos[0], local),
      lerp(start.pos[1], end.pos[1], local),
      lerp(start.pos[2], end.pos[2], local),
    ),
    target: new THREE.Vector3(
      lerp(start.target[0], end.target[0], local),
      lerp(start.target[1], end.target[1], local),
      lerp(start.target[2], end.target[2], local),
    ),
  };
}

function progressToStop(progress) {
  if (progress < 0.34) return 0;
  if (progress < 0.72) return 1;
  return 2;
}

export default function GardenWalkEntrance({ onOpenMemory, onFinish }) {
  const sectionRef = useRef(null);
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const memoryMeshesRef = useRef([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const progressRef = useRef(0);
  const hoveredRef = useRef(null);
  const [activeStop, setActiveStop] = useState(0);
  const [nearMemory, setNearMemory] = useState(null);
  const [ready, setReady] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const openMemory = useCallback((memory) => {
    if (!memory || !onOpenMemory) return;
    onOpenMemory({
      src: memory.src,
      label: memory.label,
      caption: memory.caption,
      source: memory.source,
    });
  }, [onOpenMemory]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setFromMedia = () => setReducedMotion(media.matches);
    setFromMedia();
    media.addEventListener?.('change', setFromMedia);
    return () => media.removeEventListener?.('change', setFromMedia);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const mount = mountRef.current;
    if (!section || !mount) return undefined;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 110);
    cameraRef.current = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebglError(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', "A continuous first person WebGL walk through Sonia's Australian suburban garden memorial.");
    mount.appendChild(renderer.domElement);

    buildGardenScene({
      scene,
      memoryMeshesRef,
      onReady: () => setReady(true),
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clock = new THREE.Clock();
    let raf = 0;

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const maxTravel = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / maxTravel);
      progressRef.current = reducedMotion ? Math.min(progress, 0.96) : progress;
      const nextStop = progressToStop(progressRef.current);
      setActiveStop((current) => (current === nextStop ? current : nextStop));
    };

    const setPointer = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointerRef.current = {
        x: clamp(pointer.x, -1, 1),
        y: clamp(pointer.y, -1, 1),
        active: true,
      };
    };

    const handlePointerMove = (event) => {
      setPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(memoryMeshesRef.current, true);
      hoveredRef.current = hits.find((hit) => hit.object.userData.memory)?.object.userData.memory || null;
      renderer.domElement.style.cursor = hoveredRef.current ? 'pointer' : 'grab';
    };

    const handlePointerLeave = () => {
      hoveredRef.current = null;
      pointerRef.current.active = false;
      renderer.domElement.style.cursor = 'grab';
    };

    const handlePointerDown = (event) => {
      setPointer(event);
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handlePointerUp = (event) => {
      setPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(memoryMeshesRef.current, true);
      const memory = hits.find((hit) => hit.object.userData.memory)?.object.userData.memory;
      if (memory) openMemory(memory);
      renderer.domElement.style.cursor = hoveredRef.current ? 'pointer' : 'grab';
    };

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      updateProgress();

      const { pos, target } = cameraPoint(progressRef.current);
      const pointerInfluence = reducedMotion ? 0 : 0.34;
      target.x += pointerRef.current.x * pointerInfluence;
      target.y += pointerRef.current.y * 0.16;
      camera.position.lerp(pos, reducedMotion ? 0.16 : 0.055);
      camera.lookAt(target);

      let closestMemory = null;
      let closestDistance = 999;
      memoryMeshesRef.current.forEach((object) => {
        const memory = object.userData.memory;
        if (!memory || object.parent?.userData.memory) return;
        const distance = object.position.distanceTo(camera.position);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestMemory = memory;
        }
        const approach = clamp((6.2 - distance) / 4.2);
        const hover = hoveredRef.current?.id === memory.id ? 0.09 : 0;
        object.position.y = object.userData.baseY + (reducedMotion ? 0 : Math.sin(elapsed * 0.75 + object.position.z) * 0.035);
        object.rotation.y = object.userData.baseRot + (reducedMotion ? 0 : Math.sin(elapsed * 0.55 + object.position.x) * 0.025);
        object.rotation.z = reducedMotion ? 0 : Math.sin(elapsed * 0.62 + object.position.z) * 0.018;
        object.scale.setScalar(1 + approach * 0.08 + hover);
        object.traverse((child) => {
          if (child.userData.memoryGlow && child.material) {
            child.material.opacity = 0.11 + approach * 0.20 + hover;
          }
        });
      });

      scene.traverse((object) => {
        if (object.userData.fogBand) {
          object.position.x += Math.sin(elapsed * object.userData.speed + object.position.z) * 0.0025;
        }
        if (object.userData.realFoliage && object.userData.basePosition && object.userData.baseRotation) {
          const drift = object.userData.motion || 0.012;
          object.position.x = object.userData.basePosition.x + (reducedMotion ? 0 : Math.sin(elapsed * 0.24 + object.userData.basePosition.z) * drift);
          object.position.y = object.userData.basePosition.y + (reducedMotion ? 0 : Math.cos(elapsed * 0.18 + object.userData.basePosition.x) * drift * 0.55);
          object.rotation.z = object.userData.baseRotation.z + (reducedMotion ? 0 : Math.sin(elapsed * 0.16 + object.userData.basePosition.z) * 0.006);
        }
        if (object.userData.realTree && object.userData.baseRotation) {
          const sway = object.userData.motion || 0.003;
          object.rotation.z = object.userData.baseRotation.z + (reducedMotion ? 0 : Math.sin(elapsed * 0.11 + object.position.z) * sway);
          object.rotation.x = object.userData.baseRotation.x + (reducedMotion ? 0 : Math.cos(elapsed * 0.09 + object.position.x) * sway * 0.42);
        }
      });

      setNearMemory((current) => {
        const next = closestDistance < 5.4 ? closestMemory : null;
        return current?.id === next?.id ? current : next;
      });

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };

    resize();
    updateProgress();
    renderer.domElement.style.cursor = 'grab';
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', updateProgress, { passive: true });
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    raf = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateProgress);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        const materials = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
        materials.forEach((material) => {
          if (material.map) material.map.dispose();
          material.dispose();
        });
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [openMemory, reducedMotion]);

  if (webglError) {
    return (
      <section id="garden-walk" className="relative min-h-screen overflow-hidden bg-[#020502] text-[#fff7df]">
        <img src={GARDEN_PHOTO} alt="Sonia in her garden." className="absolute inset-0 h-full w-full object-cover object-[50%_28%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,2,0.88),rgba(2,5,2,0.30)_52%,rgba(2,5,2,0.86))]" />
        <div className="relative z-10 flex min-h-screen items-center px-5 md:px-10">
          <div className="max-w-2xl border-l border-[#d4af37]/50 pl-6">
            <p className="font-body text-[10px] uppercase tracking-[0.42em] text-[#d4af37]/70">Mum's Garden</p>
            <h1 className="mt-5 font-display text-5xl leading-none text-[#fff7df] md:text-7xl">The real garden comes first.</h1>
            <p className="mt-6 font-body text-base leading-8 text-[#fff7df]/72">
              WebGL is unavailable on this device, so the garden opens on Sonia's original garden photo and the exact family memories below.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="garden-walk" className="relative h-[520vh] bg-[#020502] text-[#fff7df]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#061006]" />
        <img
          src={GARDEN_TEXTURES.upperCanopy}
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-0 h-[56%] w-full object-cover object-top opacity-14"
          style={{ filter: 'brightness(0.6) contrast(1.08) saturate(0.96)' }}
        />
        <img
          src={GARDEN_TEXTURES.suburbanTreeline}
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[12%] z-0 h-[28%] w-full object-cover object-center opacity-10"
          style={{ filter: 'brightness(0.5) contrast(1.05) saturate(0.86)' }}
        />
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_76%_42%,transparent,rgba(2,5,2,0.34)_38%,rgba(2,5,2,0.70)_78%),linear-gradient(180deg,rgba(2,5,2,0.16),rgba(2,5,2,0.06)_38%,rgba(2,5,2,0.50))]" />
        <div ref={mountRef} className="absolute inset-0 z-[2]" />
        <GardenImmersionBackground reducedMotion={reducedMotion} />

        {!ready && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#020502]">
            <div className="h-10 w-10 border border-[#d4af37]/25 border-t-[#f5d06e]" />
          </div>
        )}

        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-20 p-5 transition-opacity duration-1000 md:p-8 ${
            activeStop === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="max-w-2xl">
            <p className="font-body text-[10px] uppercase tracking-[0.48em] text-[#f5d06e]/72 [text-shadow:0_3px_18px_rgba(0,0,0,0.78)]">
              From sky to backyard
            </p>
            <h1 className="mt-4 max-w-xl font-display text-5xl leading-[0.92] text-[#fff7df] [text-shadow:0_8px_32px_rgba(0,0,0,0.72)] md:text-7xl">
              Walk into Mum's real garden.
            </h1>
            <p className="mt-5 max-w-lg font-body text-sm leading-7 text-[#fff7df]/70 md:text-base">
              Scroll forward from the tall trees, through the concrete path, past the hanging family photos, under Onya & Gay's Archway, and into the stone memorial.
            </p>
          </div>
        </div>

        <div className="pointer-events-auto absolute bottom-5 left-5 right-5 z-20 grid gap-4 md:bottom-8 md:left-8 md:right-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="border-l border-[#d4af37]/44 bg-[#071007]/52 px-4 py-3 backdrop-blur-md">
            <p className="font-body text-[9px] uppercase tracking-[0.28em] text-[#d4af37]/62">
              {String(activeStop + 1).padStart(2, '0')} / {JOURNEY_STOPS.length} - {JOURNEY_STOPS[activeStop].label}
            </p>
            <p className="mt-2 font-body text-sm leading-6 text-[#fff7df]/70">{JOURNEY_STOPS[activeStop].note}</p>
            {nearMemory && (
              <button
                type="button"
                onClick={() => openMemory(nearMemory)}
                className="mt-3 inline-flex items-center gap-2 bg-[#f5d06e] px-4 py-2 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#071007] transition hover:bg-[#ffe691]"
              >
                <MousePointer2 className="h-3.5 w-3.5" />
                Open {nearMemory.label}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <div className="flex items-center gap-2 border border-[#d4af37]/18 bg-[#071007]/52 px-3 py-2 font-body text-[9px] uppercase tracking-[0.18em] text-[#fff7df]/62 backdrop-blur-md">
              <MoveHorizontal className="h-3.5 w-3.5 text-[#f5d06e]/72" />
              Scroll / drag
            </div>
            <div className="flex items-center gap-2 border border-[#d4af37]/18 bg-[#071007]/52 px-3 py-2 font-body text-[9px] uppercase tracking-[0.18em] text-[#fff7df]/62 backdrop-blur-md">
              <Hand className="h-3.5 w-3.5 text-[#f5d06e]/72" />
              Touch photos
            </div>
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex items-center gap-2 bg-[#f5d06e] px-4 py-2 font-body text-[9px] font-bold uppercase tracking-[0.2em] text-[#071007] transition hover:bg-[#ffe691]"
            >
              Continue
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
