import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useMemo, useEffect } from 'react';
import { Float, Sparkles, RoundedBox, Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

/* ─── Central premium hero book ──────────────────────── */
function PremiumBook() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <group ref={ref}>
      {/* Cover */}
      <RoundedBox args={[2.3, 3.1, 0.5]} radius={0.07} smoothness={6}>
        <meshPhysicalMaterial
          color="#6C63FF"
          roughness={0.25}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.2}
          envMapIntensity={1.2}
        />
      </RoundedBox>

      {/* Pages */}
      <mesh position={[0.1, 0, 0]}>
        <boxGeometry args={[2.2, 2.9, 0.44]} />
        <meshStandardMaterial color="#f5f3ea" roughness={0.85} />
      </mesh>

      {/* Spine */}
      <mesh position={[-1.18, 0, 0]}>
        <boxGeometry args={[0.1, 3.1, 0.52]} />
        <meshStandardMaterial color={new THREE.Color('#6C63FF').multiplyScalar(0.55)} roughness={0.4} />
      </mesh>

      {/* Glowing emblem on cover */}
      <mesh position={[0, 0.5, 0.26]}>
        <planeGeometry args={[1.5, 0.18]} />
        <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.1, 0.26]}>
        <planeGeometry args={[1.0, 0.09]} />
        <meshStandardMaterial color="#FF6B9D" emissive="#FF6B9D" emissiveIntensity={1.8} toneMapped={false} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, -0.35, 0.26]}>
        <planeGeometry args={[0.7, 0.07]} />
        <meshStandardMaterial color="#FF6B9D" emissive="#FF6B9D" emissiveIntensity={1.4} toneMapped={false} transparent opacity={0.7} />
      </mesh>

      {/* Glow light inside */}
      <pointLight position={[0, 0, 1]} color="#8B83FF" intensity={2} distance={5} />
    </group>
  );
}

/* ─── Constellation of smaller books orbiting ────────── */
function OrbitingBooks({ count = 9, radius = 4.2 }) {
  const group = useRef();

  const books = useMemo(() => {
    const colors = ['#6C63FF', '#00D9FF', '#FF6B9D', '#00E676', '#FFD740', '#B388FF', '#84FFFF', '#FF8A65', '#40C4FF'];
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        position: [Math.cos(angle) * radius, Math.sin(angle * 1.7) * 1.6, Math.sin(angle) * radius - 1],
        color: colors[i % colors.length],
        rot: [Math.random() * 0.6, angle, Math.random() * 0.4],
        speed: 0.3 + Math.random() * 0.4,
        scale: 0.8 + Math.random() * 0.5,
      };
    });
  }, [count, radius]);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.06;
  });

  return (
    <group ref={group}>
      {books.map((b, i) => (
        <Float key={i} speed={b.speed * 2.2} rotationIntensity={0.7} floatIntensity={1.4}>
          <group position={b.position} rotation={b.rot} scale={b.scale}>
            <RoundedBox args={[0.75, 1.05, 0.18]} radius={0.03} smoothness={4}>
              <meshPhysicalMaterial color={b.color} roughness={0.3} metalness={0.2} clearcoat={0.8} envMapIntensity={1} />
            </RoundedBox>
            <mesh position={[-0.38, 0, 0]}>
              <boxGeometry args={[0.05, 1.05, 0.18]} />
              <meshStandardMaterial color={new THREE.Color(b.color).multiplyScalar(0.55)} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

/* ─── Deep starfield ─────────────────────────────────── */
function Starfield({ count = 1400 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 14 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.012;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Scene content with mouse parallax ──────────────── */
function SceneContent({ mouse }) {
  const group = useRef();

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.current.x * 0.35, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -mouse.current.y * 0.22, 0.05);
  });

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.45} floatIntensity={1.6}>
        <PremiumBook />
      </Float>
      <OrbitingBooks />
      <Sparkles count={90} scale={[14, 10, 10]} size={4} speed={0.4} color="#B388FF" opacity={0.8} />
      <Starfield />
    </group>
  );
}

/* ─── Main exported canvas ───────────────────────────── */
export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="l2-canvas">
      <Canvas
        camera={{ position: [0, 0, 9.5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.3} color="#ffffff" />
          <directionalLight position={[-5, 2, -3]} intensity={0.7} color="#00D9FF" />
          <pointLight position={[0, 0, 5]} intensity={1.4} color="#6C63FF" distance={14} />

          <SceneContent mouse={mouse} />

          <Environment resolution={128}>
            <Lightformer intensity={2.4} position={[0, 3, 4]} scale={[8, 4, 1]} color="#6C63FF" />
            <Lightformer intensity={1.8} position={[-5, 0, 2]} scale={[4, 6, 1]} color="#00D9FF" />
            <Lightformer intensity={1.8} position={[5, 0, 2]} scale={[4, 6, 1]} color="#FF6B9D" />
            <Lightformer intensity={1.2} position={[0, -4, 2]} scale={[8, 3, 1]} color="#8B83FF" />
          </Environment>

          <EffectComposer>
            <Bloom intensity={1.3} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur radius={0.75} />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0006, 0.0006]} />
            <Vignette offset={0.3} darkness={0.75} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
