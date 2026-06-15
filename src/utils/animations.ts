import type { SideType, ClipPaths, AvatarAnimation } from '../types';

export const getClips = (isMobile: boolean, hoveredSide: SideType): ClipPaths => {
  if (isMobile) {
    if (!hoveredSide) {
      // Default: top half = side1 (理性), bottom half = side2 (感性)
      return {
        clip1: `polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)`,
        clip2: `polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)`,
        divider: `polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)`
      };
    } else if (hoveredSide === 'side1') {
      return {
        clip1: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`,
        clip2: `polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)`,
        divider: `polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)`
      };
    } else {
      return {
        clip1: `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`,
        clip2: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`,
        divider: `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`
      };
    }
  } else {
    let top = 50, bottom = 50;
    if (hoveredSide === 'side1') { top = 85; bottom = 75; }
    if (hoveredSide === 'side2') { top = 15; bottom = 25; }
    return {
      clip1: `polygon(0% 0%, ${top}% 0%, ${bottom}% 100%, 0% 100%)`,
      clip2: `polygon(${top}% 0%, 100% 0%, 100% 100%, ${bottom}% 100%)`,
      divider: `polygon(calc(${top}% - 1px) 0%, calc(${top}% + 1px) 0%, calc(${bottom}% + 1px) 100%, calc(${bottom}% - 1px) 100%)`
    };
  }
};

export const getAvatarAnim = (isMobile: boolean, hoveredSide: SideType): AvatarAnimation => {
  if (!hoveredSide) {
    return {
      top: isMobile ? '15%' : '12%',
      left: '50%',
      x: '-50%',
      y: '-50%',
      scale: isMobile ? 0.5 : 0.6,
      rotate: 0,
    };
  }
  if (hoveredSide === 'side1') {
    return {
      top: isMobile ? '85%' : '50%',
      left: isMobile ? '50%' : '80%',
      x: '-50%',
      y: '-50%',
      scale: isMobile ? 0.6 : 1,
      rotate: 3,
    };
  }
  return {
    top: isMobile ? '15%' : '50%',
    left: isMobile ? '50%' : '20%',
    x: '-50%',
    y: '-50%',
    scale: isMobile ? 0.6 : 1,
    rotate: -3,
  };
};
