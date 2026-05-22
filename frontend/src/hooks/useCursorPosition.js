import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to track cursor position with smooth interpolation
 * Used for cursor follower, magnetic effects, and 3D tilt
 */
export function useCursorPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [normalized, setNormalized] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setNormalized({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return { position, normalized };
}

/**
 * Hook for element-relative cursor position (for 3D tilt effects)
 */
export function useElementCursor(ref) {
  const [relative, setRelative] = useState({ x: 0, y: 0, isHovering: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      setRelative({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        isHovering: true
      });
    };

    const handleLeave = () => {
      setRelative({ x: 0, y: 0, isHovering: false });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [ref]);

  return relative;
}

export default useCursorPosition;
