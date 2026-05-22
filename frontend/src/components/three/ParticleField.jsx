import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated particle field background for 3D scenes
 * Creates a star-like particle system that reacts to mouse movement
 */
export default function ParticleField({ count = 800, mouse }) {
  const meshRef = useRef();
  const lightRef = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);

    const colorPalette = [
      new THREE.Color('#6C63FF'),
      new THREE.Color('#00D9FF'),
      new THREE.Color('#FF6B9D'),
      new THREE.Color('#8B83FF'),
      new THREE.Color('#FFFFFF'),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 0.5;
      speeds[i] = Math.random() * 0.5 + 0.1;
    }

    return { positions, colors, sizes, speeds };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const positions = meshRef.current.geometry.attributes.position.array;
    const mx = mouse?.x || 0;
    const my = mouse?.y || 0;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const speed = particles.speeds[i];

      // Gentle floating motion
      positions[i3 + 1] += Math.sin(time * speed + i) * 0.002;
      positions[i3] += Math.cos(time * speed * 0.5 + i) * 0.001;

      // Mouse influence
      positions[i3] += mx * 0.0003;
      positions[i3 + 1] += my * 0.0003;

      // Wrap around
      if (positions[i3 + 1] > 10) positions[i3 + 1] = -10;
      if (positions[i3 + 1] < -10) positions[i3 + 1] = 10;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.02;
    meshRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });

  return (
    <group>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particles.positions}
            count={count}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={particles.colors}
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
