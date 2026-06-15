import { useCallback, useEffect, useRef, useState } from 'react';

// Circular invert-blend cursor ported from DarfOwO. Tracks the pointer with a
// rAF loop and grows a ring outline when hovering interactive elements.
// Disabled on touch / small screens, where the native cursor stays.
export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => {
      const touch = 'ontouchstart' in window || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setEnabled(!touch && window.innerWidth >= 1280);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Cheap, allocation-free hover test: a single ancestor walk (no
  // getComputedStyle, which would force a synchronous style recalc on every
  // pointer move and stutter badly over heavy DOM like the charts page).
  const isInteractive = useCallback((el: Element | null): boolean => {
    return !!el && el.closest('a, button, input, textarea, select, [role="button"], [data-clickable]') !== null;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let current: EventTarget | null = null;

    const onMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      cursor.style.opacity = '1';
      if (e.target !== current) {
        current = e.target;
        cursor.classList.toggle('hover', isInteractive(e.target as Element));
      }
    };
    const onLeave = () => { cursor.style.opacity = '0'; };
    const onEnter = () => { cursor.style.opacity = '1'; };

    const animate = () => {
      cursor.style.left = `${positionRef.current.x}px`;
      cursor.style.top = `${positionRef.current.y}px`;
      frameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled, isInteractive]);

  if (!enabled) return null;
  return <div id="custom-cursor" ref={cursorRef} />;
};
