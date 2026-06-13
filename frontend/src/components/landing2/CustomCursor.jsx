import { useEffect, useRef, useState } from 'react';

/**
 * Magnetic custom cursor — a precise dot + a lagging ring that
 * grows over interactive elements. Desktop (fine pointer) only.
 */
export default function CustomCursor() {
  const dot = useRef();
  const ring = useRef();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let hovering = false;
    let raf;

    const onMove = (e) => { pos.x = e.clientX; pos.y = e.clientY; };
    const onOver = (e) => {
      if (e.target.closest && e.target.closest('a, button, .l2-tilt, [data-cursor]')) hovering = true;
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest('a, button, .l2-tilt, [data-cursor]')) hovering = false;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${hovering ? 1.9 : 1})`;
        ring.current.style.opacity = hovering ? '1' : '0.5';
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ring} className="l2-cursor-ring" />
      <div ref={dot} className="l2-cursor-dot" />
    </>
  );
}
