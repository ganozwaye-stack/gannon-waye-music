import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createReadStream, existsSync, rmSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const spaRouterPath = fileURLToPath(new URL('./src/lib/SpaRouter.jsx', import.meta.url));
const repoRoot = fileURLToPath(new URL('.', import.meta.url));

const PRIVATE_PUBLIC_PATHS = [
  '/__private_mum_video',
  '/audio/mum',
  '/video/mum',
  '/images/mum/garden-textures/melbourne-fern-gully-2017.jpg',
  '/images/mum/garden-textures/mum-real-paver-corner-soft.png',
  '/images/mum/garden-textures/real-backyard-pavers.jpg',
  '/images/mum/garden-textures/real-concrete-pavers.png',
  '/images/mum/garden-textures/real-hanging-fern.png',
  '/images/mum/garden-textures/real-monstera-left.png',
  '/images/mum/garden-textures/real-monstera-right.png',
  '/images/mum/memory-lane/_memory_lane_manifest.json',
  '/images/mum/memory-lane/ML006_FS011.jpg',
  '/images/mum/memory-lane/ML031_FS070.jpg',
  '/images/mum/memory-lane/ML053_FS108.jpg',
  '/images/mum/memory-lane/ML063_FS124.jpg',
  '/images/mum/mum_garden_real_concrete_path_wide.jpg',
  '/images/mum/mum_garden_real_foliage_soft.jpg',
  '/images/mum/mum_garden_real_foliage_wide.jpg',
];

const PRIVATE_HALLWAY_VIDEO_SOURCE = process.env.MUM_HALLWAY_VIDEO_SOURCE?.trim();

function isPrivatePublicPath(pathname) {
  return PRIVATE_PUBLIC_PATHS.some(privatePath =>
    pathname === privatePath || pathname.startsWith(`${privatePath}/`)
  );
}

function privateMemorialMediaGuard() {
  return {
    name: 'private-memorial-media-guard',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = new URL(req.url || '/', 'http://localhost').pathname;
        if (!isPrivatePublicPath(pathname)) {
          next();
          return;
        }

        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
        res.end('Not found');
      });
    },
    closeBundle() {
      for (const privatePath of PRIVATE_PUBLIC_PATHS) {
        rmSync(resolve(repoRoot, 'dist', privatePath.replace(/^\//, '')), { recursive: true, force: true });
      }
    },
  };
}

function privateHallwayVideoDevServer() {
  return {
    name: 'private-hallway-video-dev-server',
    configureServer(server) {
      server.middlewares.use('/__private_mum_video/hallway-garden-source.mov', (req, res, next) => {
        if (!PRIVATE_HALLWAY_VIDEO_SOURCE || !existsSync(PRIVATE_HALLWAY_VIDEO_SOURCE)) {
          next();
          return;
        }

        const stat = statSync(PRIVATE_HALLWAY_VIDEO_SOURCE);
        const range = req.headers.range;
        if (range) {
          const [, startRaw, endRaw] = /bytes=(\d*)-(\d*)/.exec(range) || [];
          const start = startRaw ? Number(startRaw) : 0;
          const end = endRaw ? Number(endRaw) : stat.size - 1;
          if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= stat.size) {
            res.statusCode = 416;
            res.setHeader('Content-Range', `bytes */${stat.size}`);
            res.end();
            return;
          }

          res.statusCode = 206;
          res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Content-Length', String(end - start + 1));
          res.setHeader('Content-Type', 'video/quicktime');
          res.setHeader('Cache-Control', 'no-store, private');
          res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
          createReadStream(PRIVATE_HALLWAY_VIDEO_SOURCE, { start, end }).pipe(res);
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'video/quicktime');
        res.setHeader('Content-Length', String(stat.size));
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'no-store, private');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
        createReadStream(PRIVATE_HALLWAY_VIDEO_SOURCE).pipe(res);
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  resolve: {
    alias: {
      'react-router-dom': spaRouterPath,
    },
  },
  server: {
    proxy: {
      '^/api/apps/public/prod/public-settings/by-id/': {
        target: 'http://localhost:5173',
        bypass: (req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            id: '6a1d91c28109c1a7274f350a',
            name: 'Gannon Waye Music',
            settings: {}
          }));
          return false;
        }
      },
      '^/api/apps/.*/analytics/track/batch': {
        target: 'http://localhost:5173',
        bypass: (req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, tracked: false, local_preview: true }));
          return false;
        }
      },
      '^/api/apps/.*/entities/User/me': {
        target: 'http://localhost:5173',
        bypass: (req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(null));
          return false;
        }
      },
      '^/api/v2/apps/.*?/functions/recoverStripeOrders': {
        target: 'http://localhost:5173',
        bypass: (req, res) => {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Admin access required' }));
          return false;
        }
      },
      '^/api/v2/apps/.*?/functions/stripeWebhook': {
        target: 'http://localhost:5173',
        bypass: (req, res) => {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Webhook signature failed' }));
          return false;
        }
      }
    }
  },
  plugins: [
    privateHallwayVideoDevServer(),
    privateMemorialMediaGuard(),
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ]
});
