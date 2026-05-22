import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A single 3D floating book with cover texture
 */
function Book({ position, rotation, speed, color, title, index }) {
  const meshRef = useRef();
  const initialPos = useMemo(() => [...position], [position]);
  const initialRot = useMemo(() => [...rotation], [rotation]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const offset = index * 1.5;

    // Floating animation
    meshRef.current.position.y = initialPos[1] + Math.sin(time * speed + offset) * 0.5;
    meshRef.current.position.x = initialPos[0] + Math.cos(time * speed * 0.7 + offset) * 0.2;

    // Gentle rotation
    meshRef.current.rotation.y = initialRot[1] + Math.sin(time * speed * 0.3 + offset) * 0.15;
    meshRef.current.rotation.x = initialRot[0] + Math.cos(time * speed * 0.2 + offset) * 0.08;
    meshRef.current.rotation.z = Math.sin(time * speed * 0.4 + offset) * 0.05;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Book body */}
      <RoundedBox args={[1.2, 1.7, 0.15]} radius={0.02} smoothness={4}>
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </RoundedBox>

      {/* Book spine */}
      <mesh position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.05, 1.7, 0.15]} />
        <meshStandardMaterial
          color={new THREE.Color(color).multiplyScalar(0.7)}
          roughness={0.5}
        />
      </mesh>

      {/* Book cover decoration - a subtle line */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[0.8, 0.01]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Glow effect */}
      <pointLight
        position={[0, 0, 0.5]}
        color={color}
        intensity={0.3}
        distance={2}
      />
    </group>
  );
}

/**
 * Scene with multiple floating books
 * Creates an immersive 3D book constellation
 */
export default function FloatingBooks({ mouse }) {
  const groupRef = useRef();

  const books = useMemo(() => [
    { position: [-3, 1, -2], rotation: [0.2, 0.5, 0], speed: 0.5, color: '#6C63FF', title: 'Code' },
    { position: [3.5, -0.5, -3], rotation: [-0.1, -0.3, 0.1], speed: 0.4, color: '#00D9FF', title: 'AI' },
    { position: [-1.5, -1.5, -1], rotation: [0.15, 0.8, -0.1], speed: 0.6, color: '#FF6B9D', title: 'Design' },
    { position: [2, 2, -4], rotation: [-0.2, -0.6, 0], speed: 0.35, color: '#00E676', title: 'Science' },
    { position: [-4, 0, -5], rotation: [0.3, 0.2, 0.1], speed: 0.45, color: '#FFD740', title: 'History' },
    { position: [1, -2, -2.5], rotation: [-0.1, 1, 0], speed: 0.55, color: '#B388FF', title: 'Math' },
    { position: [4.5, 1.5, -6], rotation: [0.1, -0.4, -0.05], speed: 0.3, color: '#84FFFF', title: 'Physics' },
    { position: [-2.5, 2.5, -4.5], rotation: [-0.15, 0.6, 0.08], speed: 0.42, color: '#FF8A65', title: 'Art' },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const mx = mouse?.x || 0;
    const my = mouse?.y || 0;
    
    // Subtle group rotation following mouse
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mx * 0.15,
      0.02
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -my * 0.1,
      0.02
    );
  });

  return (
    <group ref={groupRef}>
      {books.map((book, i) => (
        <Book key={i} {...book} index={i} />
      ))}
    </group>
  );
}
