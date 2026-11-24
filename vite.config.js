import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Local dev middleware so Vercel Serverless Functions (/api/chat, /api/github)
 * work seamlessly inside `npm run dev` without requiring a remote deploy.
 */
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const route = req.url.split('?')[0];
        const allowedRoutes = {
          '/api/chat': './api/chat.js',
          '/api/github': './api/github.js',
          '/api/cv': './api/cv.js',
          '/api/certificates': './api/certificates.js',
          '/api/admin/upload': './api/admin/upload.js'
        };

        const targetModule = allowedRoutes[route];
        if (!targetModule) {
          return next();
        }

        try {
          // Parse JSON body for POST/PUT/PATCH requests
          let rawBody = '';
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            rawBody = await new Promise((resolve, reject) => {
              let data = '';
              req.on('data', (chunk) => {
                data += chunk;
              });
              req.on('end', () => resolve(data));
              req.on('error', reject);
            });
            try {
              req.body = rawBody ? JSON.parse(rawBody) : {};
            } catch {
              req.body = {};
            }
          } else {
            req.body = {};
          }

          // Enhance Node http.ServerResponse with Vercel-compatible helpers
          const vercelRes = res;
          vercelRes.status = (code) => {
            res.statusCode = code;
            return vercelRes;
          };
          vercelRes.json = (payload) => {
            if (!res.headersSent) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
            }
            res.end(JSON.stringify(payload));
            return vercelRes;
          };

          const modUrl = path.resolve(__dirname, targetModule);
          const handlerModule = await server.ssrLoadModule(modUrl);
          await handlerModule.default(req, vercelRes);
        } catch (error) {
          console.error(`[API Dev Middleware Error] ${route}:`, error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: 'Internal server error in local API dev server' }));
          }
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  server: {
    port: 3000,
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion']
        }
      }
    }
  }
});
