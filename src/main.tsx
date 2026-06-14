import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { PlayerProvider } from './components/music/PlayerProvider.tsx';
import { FloatingLyric } from './components/music/FloatingLyric.tsx';
import { loadLibrary } from './data/musicLibrary.ts';
import './index.css';

// Sub-pages are split into their own chunks (the status pages pull in the heavy
// Recharts bundle, the song page is large) so the landing route ships less JS.
const DevicesPage = lazy(() => import('./pages/DevicesPage.tsx').then((m) => ({ default: m.DevicesPage })));
const FriendsPage = lazy(() => import('./pages/FriendsPage.tsx').then((m) => ({ default: m.FriendsPage })));
const MusicPage = lazy(() => import('./pages/MusicPage.tsx').then((m) => ({ default: m.MusicPage })));
const CollectionPage = lazy(() => import('./pages/CollectionPage.tsx').then((m) => ({ default: m.CollectionPage })));
const SongDetailPage = lazy(() => import('./pages/SongDetailPage.tsx').then((m) => ({ default: m.SongDetailPage })));
const StatusPage = lazy(() => import('./pages/StatusPage.tsx').then((m) => ({ default: m.StatusPage })));
const StatusDetailPage = lazy(() => import('./pages/StatusDetailPage.tsx').then((m) => ({ default: m.StatusDetailPage })));

function RouteFallback() {
  return <div className="fixed inset-0 bg-[#0a0a0a]" aria-hidden />;
}

function mount() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <PlayerProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/music/artist/:id" element={<CollectionPage kind="artist" />} />
              <Route path="/music/album/:id" element={<CollectionPage kind="album" />} />
              <Route path="/music/:id" element={<SongDetailPage />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/status/:metricId" element={<StatusDetailPage />} />
            </Routes>
          </Suspense>
          <FloatingLyric />
        </PlayerProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}

// 先从音乐服务加载真实歌单（失败则回退到内置数据），再挂载应用。
loadLibrary().finally(mount);
