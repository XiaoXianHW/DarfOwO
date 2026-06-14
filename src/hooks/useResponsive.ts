import { useEffect, useState } from 'react';

const QUERY = '(max-width: 767px)';

// Tracks the mobile breakpoint via matchMedia, which only fires when the
// threshold is actually crossed (a plain resize listener re-runs on every
// pixel of width change).
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
};
