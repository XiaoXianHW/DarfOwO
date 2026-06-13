import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { DevicesPage } from './pages/DevicesPage.tsx';
import { MusicPage } from './pages/MusicPage.tsx';
import { CollectionPage } from './pages/CollectionPage.tsx';
import { SongDetailPage } from './pages/SongDetailPage.tsx';
import { StatusPage } from './pages/StatusPage.tsx';
import { StatusDetailPage } from './pages/StatusDetailPage.tsx';
import { PlayerProvider } from './components/music/PlayerProvider.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PlayerProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/music/artist/:id" element={<CollectionPage kind="artist" />} />
        <Route path="/music/album/:id" element={<CollectionPage kind="album" />} />
        <Route path="/music/:id" element={<SongDetailPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/status/:metricId" element={<StatusDetailPage />} />
      </Routes>
      </PlayerProvider>
    </BrowserRouter>
  </StrictMode>,
);
