import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  // Reverse-proxy for the Mi Fitness (DarfAPI) health endpoints.
  // The API has no CORS support and requires a bearer token, so the browser
  // calls the same-origin path /api/mifitness/* and this proxy injects the
  // secret key AND the uid / sessionId server-side. None of those values reach
  // the client bundle or show up in the browser's network requests.
  const MIFITNESS_UID = env.MIFITNESS_UID || '2706034380';
  const MIFITNESS_SESSION_ID = env.MIFITNESS_SESSION_ID || '5fd053625cc1d165b3d8f3fd';

  const miFitnessProxy = {
    '/api/mifitness': {
      target: env.MIFITNESS_API_BASE || 'https://api.xiaoxian.org',
      changeOrigin: true,
      rewrite: (p: string) => {
        const [pathname, query = ''] = p
          .replace(/^\/api\/mifitness/, '/api/v1/mi-fitness')
          .split('?');
        const search = new URLSearchParams(query);
        search.set('uid', MIFITNESS_UID);
        if (MIFITNESS_SESSION_ID) search.set('sessionId', MIFITNESS_SESSION_ID);
        return `${pathname}?${search.toString()}`;
      },
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
