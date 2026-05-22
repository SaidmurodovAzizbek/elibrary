import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP scroll-triggered animations
 * @param {Object} options - Animation configuration
 * @param {string} options.animation - Animation type: 'fadeUp', 'fadeIn', 'fadeLeft', 'fadeRight', 'scaleIn', 'rotateIn'
 * @param {number} options.delay - Animation delay in seconds
 * @param {number} options.duration - Animation duration in seconds
 * @param {string} options.start - ScrollTrigger start position
 * @param {boolean} options.stagger - Enable stagger for child elements
 * @param {number} options.staggerAmount - Stagger amount in seconds
 */
export function useScrollAnimation({
  animation = 'fadeUp',
  delay = 0,
  duration = 1,
  start = 'top 85%',
  stagger = false,
  staggerAmount = 0.1,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? el.children : el;

    const animations = {
      fadeUp: { from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0 } },
      fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      fadeLeft: { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } },
      fadeRight: { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } },
      scaleIn: { from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1 } },
      rotateIn: { from: { opacity: 0, rotation: 10, y: 40 }, to: { opacity: 1, rotation: 0, y: 0 } },
    };

    const anim = animations[animation] || animations.fadeUp;

    gsap.set(targets, anim.from);

    const tl = gsap.to(targets, {
      ...anim.to,
      duration,
      delay,
      ease: 'power3.out',
      stagger: stagger ? staggerAmount : 0,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [animation, delay, duration, start, stagger, staggerAmount]);

  return ref;
}

/**
 * Hook for parallax scrolling effect
 */
export function useParallax(speed = 0.5) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tl = gsap.to(el, {
      y: () => speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      tl.kill();
    };
  }, [speed]);

  return ref;
}

export default useScrollAnimation;
