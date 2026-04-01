import { useState } from 'react';
import type { MouseEvent } from 'react';
import { AnimatePresence } from 'motion/react';
import { useResponsive } from './hooks/useResponsive';
import { useHeartRate } from './hooks/useHeartRate';
import { getClips, getAvatarAnim } from './utils/animations';
import { Background } from './components/Background';
import { SideCard } from './components/SideCard';
import { Avatar } from './components/Avatar';
import { MobileLayout } from './components/MobileLayout';
import { Footer } from './components/Footer';
import { TopControls } from './components/TopControls';
import { Tagline } from './components/Tagline';
import { ProfileOverlay } from './components/ProfileOverlay';
import type { SideType, MousePosition } from './types';

export default function App() {
  const [hoveredSide, setHoveredSide] = useState<SideType>(null);
  const [is3D, setIs3D] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  
  const isMobile = useResponsive();
  const heartRate = useHeartRate(isProfileOpen);

  const handleMouseMove = (e: MouseEvent) => {
    if (!is3D || isMobile) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -((clientY / window.innerHeight) * 2 - 1);
    setMousePos({ x, y });
  };

  const { clip1, clip2, divider } = getClips(isMobile, hoveredSide);
  const avatarAnim = getAvatarAnim(isMobile, hoveredSide);

  return (
    <main 
      className="relative w-screen h-screen overflow-hidden bg-[#111111]"
      style={{ fontFamily: 'MiSans, Inter, ui-sans-serif, system-ui, sans-serif' }}
      onMouseMove={handleMouseMove}
    >
      <Background 
        clip1={clip1} 
        clip2={clip2} 
        divider={divider} 
        hoveredSide={hoveredSide} 
        isMobile={isMobile}
        is3D={is3D}
      />

      {!isMobile && (
        <div className="absolute inset-0 z-10" style={{ perspective: '2000px', perspectiveOrigin: '50% 50%' }}>
          <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
            <SideCard 
              side="side2" 
              clipPath={clip2} 
              hoveredSide={hoveredSide} 
              isMobile={isMobile}
              is3D={is3D}
              mousePos={mousePos}
              onHover={setHoveredSide}
            />
            <SideCard 
              side="side1" 
              clipPath={clip1} 
              hoveredSide={hoveredSide} 
              isMobile={isMobile}
              is3D={is3D}
              mousePos={mousePos}
              onHover={setHoveredSide}
            />
            <Avatar 
              hoveredSide={hoveredSide} 
              isProfileOpen={isProfileOpen} 
              avatarAnim={avatarAnim}
              is3D={is3D}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          </div>
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
      {!isMobile && <TopControls is3D={is3D} onToggle3D={() => setIs3D(!is3D)} />}
      <Tagline hoveredSide={hoveredSide} />

      <AnimatePresence>
        {isProfileOpen && (
          <ProfileOverlay 
            heartRate={heartRate} 
            onClose={() => setIsProfileOpen(false)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
