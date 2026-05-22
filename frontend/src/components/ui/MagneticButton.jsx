import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './MagneticButton.css';

/**
 * Magnetic button that attracts to cursor when nearby
 * Creates a premium interactive feel
 */
export default function MagneticButton({
  children,
  className = '',
  variant = 'primary', // primary | secondary | ghost | outline
  size = 'md', // sm | md | lg
  icon,
  onClick,
  href,
  strength = 30,
  ...props
}) {
  const btnRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setPosition({
      x: (e.clientX - centerX) * (strength / 100),
      y: (e.clientY - centerY) * (strength / 100),
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={btnRef}
      className={`magnetic-btn magnetic-btn--${variant} magnetic-btn--${size} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      href={href}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 15, mass: 0.5 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span className="magnetic-btn__bg" />
      <span className="magnetic-btn__content">
        {icon && <span className="magnetic-btn__icon">{icon}</span>}
        {children}
      </span>
      <span className="magnetic-btn__shine" />
    </Component>
  );
}
