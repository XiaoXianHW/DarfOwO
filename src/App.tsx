import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useResponsive } from './hooks/useResponsive';
import { getClips, getAvatarAnim } from './utils/animations';
import { Background } from './components/Background';
import { SideCard } from './components/SideCard';
import { Avatar } from './components/Avatar';
import { MobileLayout } from './components/MobileLayout';
import { Footer } from './components/Footer';
import { TopControls } from './components/TopControls';
import { MusicWidget } from './components/music/MusicWidget';
import { Tagline } from './components/Tagline';
import { ProfileOverlay } from './components/ProfileOverlay';
import type { SideType } from './types';

export default function App() {
  const [hoveredSide, setHoveredSide] = useState<SideType>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isMobile = useResponsive();

  const { clip1, clip2, divider } = getClips(isMobile, hoveredSide);
  const avatarAnim = getAvatarAnim(isMobile, hoveredSide);

  return (
    <main 
      className="relative w-screen h-screen overflow-hidden bg-[#111111]"
      style={{ fontFamily: 'MiSans, Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <Background 
        clip1={clip1} 
        clip2={clip2} 
        divider={divider} 
        hoveredSide={hoveredSide} 
        isMobile={isMobile}
      />

      {!isMobile && (
        <div className="absolute inset-0 z-10">
          <SideCard 
            side="side2" 
            clipPath={clip2} 
            hoveredSide={hoveredSide} 
            isMobile={isMobile}
            onHover={setHoveredSide}
          />
          <SideCard 
            side="side1" 
            clipPath={clip1} 
            hoveredSide={hoveredSide} 
            isMobile={isMobile}
            onHover={setHoveredSide}
          />
          <Avatar 
            hoveredSide={hoveredSide} 
            isProfileOpen={isProfileOpen} 
            avatarAnim={avatarAnim}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        </div>
      )}

      {isMobile && (
        <MobileLayout 
          hoveredSide={hoveredSide} 
          onSetHoveredSide={setHoveredSide}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      <Footer />
      {!isMobile && <TopControls />}
      <div className="fixed top-6 right-6 z-[80]">
        <MusicWidget />
      </div>
      <Tagline hoveredSide={hoveredSide} />

      <AnimatePresence>
        {isProfileOpen && (
          <ProfileOverlay 
            onClose={() => setIsProfileOpen(false)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
