import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useCallback } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import FloatingBooks from './FloatingBooks';
import ParticleField from './ParticleField';

/**
 * Main 3D canvas for the Hero section
 * Combines floating books, particle field, and post-processing effects
 */
export default function HeroCanvas() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    });
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} color="#6C63FF" />
          <directionalLight position={[-5, 3, 3]} intensity={0.3} color="#00D9FF" />
          <pointLight position={[0, 0, 5]} intensity={0.5} color="#ffffff" />

          {/* 3D Elements */}
          <FloatingBooks mouse={mouse} />
          <ParticleField count={600} mouse={mouse} />

          {/* Post-Processing Effects */}
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
              radius={0.8}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0005, 0.0005]}
            />
            <Vignette
              offset={0.3}
              darkness={0.6}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
