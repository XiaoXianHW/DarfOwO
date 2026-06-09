import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { DevicesPage } from './pages/DevicesPage.tsx';
import { MusicPage } from './pages/MusicPage.tsx';
import { SongDetailPage } from './pages/SongDetailPage.tsx';
import { StatusPage } from './pages/StatusPage.tsx';
import { StatusDetailPage } from './pages/StatusDetailPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/music/:id" element={<SongDetailPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/status/:metricId" element={<StatusDetailPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
