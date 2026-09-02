import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  server: {
    proxy: {
      '^/api/apps/public/prod/public-settings/by-id/': {
        target: 'http://localhost:5173',
        bypass: (req, res) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            id: '69eb7905ca6eb4180010f794',
            name: 'Gannon Waye Music',
            settings: {}
          }));
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