import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

// ─── Scene data ────────────────────────────────────────────────────────────────
const NODE_DATA: { pos: [number, number, number]; radius: number; color: string; phase: number }[] = [
  { pos: [ 0.0,  0.0,  0.0],  radius: 0.13, color: '#3B82F6', phase: 0.0 },  // hub
  { pos: [ 1.2,  0.3,  0.4],  radius: 0.09, color: '#60A5FA', phase: 1.1 },
  { pos: [-1.1,  0.2,  0.3],  radius: 0.09, color: '#8B5CF6', phase: 2.3 },
  { pos: [ 0.5, -0.9, -0.3],  radius: 0.08, color: '#3B82F6', phase: 0.7 },
  { pos: [-0.6, -0.8,  0.5],  radius: 0.08, color: '#60A5FA', phase: 3.1 },
  { pos: [ 0.9,  0.9, -0.5],  radius: 0.10, color: '#A78BFA', phase: 1.8 },
  { pos: [-0.8,  0.8, -0.4],  radius: 0.08, color: '#3B82F6', phase: 2.9 },
  { pos: [ 0.1,  0.3,  1.3],  radius: 0.08, color: '#60A5FA', phase: 0.4 },
];

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 7],
  [1, 5], [1, 7], [2, 6], [2, 5],
  [3, 4], [5, 6], [4, 7],
];

// Edges that carry animated signal pulses
const PULSE_EDGES: { edge: [number, number]; speed: number; offset: number }[] = [
  { edge: [0, 1], speed: 0.55, offset: 0.0 },
  { edge: [0, 2], speed: 0.40, offset: 0.5 },
  { edge: [1, 5], speed: 0.65, offset: 0.2 },
  { edge: [3, 4], speed: 0.45, offset: 0.8 },
  { edge: [2, 6], speed: 0.50, offset: 0.3 },
];

// ─── Single pulsing node ───────────────────────────────────────────────────────
function Node({ position, radius, color, phase }: {
  position: THREE.Vector3;
  radius: number;
  color: string;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.6 + phase) * 0.14;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} />
    </mesh>
  );
}

// ─── Signal pulse travelling along an edge ────────────────────────────────────
function SignalPulse({ start, end, speed, offset }: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  speed: number;
  offset: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const t   = useRef(offset);
  useFrame((_, delta) => {
    t.current = (t.current + delta * speed) % 1;
    ref.current?.position.lerpVectors(start, end, t.current);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.038, 8, 8]} />
      <meshStandardMaterial color="#93C5FD" emissive="#93C5FD" emissiveIntensity={4} />
    </mesh>
  );
}

// ─── Full network cluster ──────────────────────────────────────────────────────
function NodeNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =  state.clock.elapsedTime * 0.18;
    groupRef.current.rotation.x =  Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
  });

  const vecs = NODE_DATA.map(n => new THREE.Vector3(...n.pos));

  return (
    <Float speed={1.3} rotationIntensity={0.07} floatIntensity={0.6}>
      <group ref={groupRef}>

        {/* Edges */}
        {EDGES.map(([a, b], i) => (
          <Line
            key={i}
            points={[vecs[a], vecs[b]]}
            color="#3B82F6"
            lineWidth={0.9}
            transparent
            opacity={0.35}
          />
        ))}

        {/* Nodes */}
        {NODE_DATA.map((n, i) => (
          <Node
            key={i}
            position={vecs[i]}
            radius={n.radius}
            color={n.color}
            phase={n.phase}
          />
        ))}

        {/* Signal pulses */}
        {PULSE_EDGES.map(({ edge: [a, b], speed, offset }, i) => (
          <SignalPulse
            key={i}
            start={vecs[a]}
            end={vecs[b]}
            speed={speed}
            offset={offset}
          />
        ))}

      </group>
    </Float>
  );
}

// ─── Canvas ────────────────────────────────────────────────────────────────────
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4.5], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[ 3,  4,  3]} intensity={3}   color="#3B82F6" />
      <pointLight position={[-3,  2,  3]} intensity={2}   color="#8B5CF6" />
      <pointLight position={[ 0, -3,  2]} intensity={1.5} color="#60A5FA" />
      <Suspense fallback={null}>
        <NodeNetwork />
      </Suspense>
    </Canvas>
  );
}
