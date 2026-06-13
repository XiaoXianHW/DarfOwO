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

  // Optional same-origin reverse-proxy for the XiaoXian music server
  // (music-server/). Set MUSIC_SERVER_URL to proxy the library / audio / cover
  // endpoints, so the frontend can fetch them same-origin with VITE_MUSIC_API
  // left empty. In production, configure an equivalent reverse proxy (or point
  // VITE_MUSIC_API at the music server's own domain instead).
  const musicProxy = env.MUSIC_SERVER_URL
    ? {
        '/api/library': { target: env.MUSIC_SERVER_URL, changeOrigin: true },
        '/api/audio': { target: env.MUSIC_SERVER_URL, changeOrigin: true },
        '/api/cover': { target: env.MUSIC_SERVER_URL, changeOrigin: true },
        '/api/rescan': { target: env.MUSIC_SERVER_URL, changeOrigin: true },
      }
    : {};

  const proxy = { ...miFitnessProxy, ...musicProxy };

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
      proxy,
    },
    preview: {
      proxy,
    },
  };
});
