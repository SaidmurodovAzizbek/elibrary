import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './GlassCard.css';

/**
 * Premium glass card with 3D tilt effect on hover
 * Reacts to cursor position for a holographic look
 */
export default function GlassCard({ 
  children, 
  className = '', 
  glowColor = 'var(--clr-primary)',
  tiltStrength = 10,
  glareEnabled = true,
  style = {},
  onClick,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setTilt({
      x: (y - 0.5) * -tiltStrength,
      y: (x - 0.5) * tiltStrength,
    });
    setGlarePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card ${className} ${isHovering ? 'glass-card--hovering' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        '--glow-color': glowColor,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Glare overlay */}
      {glareEnabled && isHovering && (
        <div
          className="glass-card__glare"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Glow border effect */}
      <div className="glass-card__glow" />

      {/* Content */}
      <div className="glass-card__content">
        {children}
      </div>
    </motion.div>
  );
}
