import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  // Reverse-proxy for the Mi Fitness (DarfAPI) health endpoints.
  // The API has no CORS support and requires a bearer token, so the browser
  // calls the same-origin path /api/mifitness/* and this proxy injects the
  // secret key server-side. The key therefore never reaches the client bundle.
  const miFitnessProxy = {
    '/api/mifitness': {
      target: env.MIFITNESS_API_BASE || 'https://api.xiaoxian.org',
      changeOrigin: true,
      rewrite: (p: string) => p.replace(/^\/api\/mifitness/, '/api/v1/mi-fitness'),
      headers: env.MIFITNESS_API_KEY
        ? {Authorization: `Bearer ${env.MIFITNESS_API_KEY}`}
        : {},
    },
  };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: miFitnessProxy,
    },
    preview: {
      proxy: miFitnessProxy,
    },
  };
});
