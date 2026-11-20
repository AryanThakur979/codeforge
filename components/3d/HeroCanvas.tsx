"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { HeroFallback } from "./HeroFallback";

function CentralShape({ pointer }: { pointer: React.MutableRefObject<[number, number]> }) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Smooth auto-rotation plus subtle pointer follow
    meshRef.current.rotation.y += delta * 0.35;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointer.current[1] * 0.4,
      0.05
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -pointer.current[0] * 0.4,
      0.05
    );

    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.6;
      ringRef.current.rotation.y -= delta * 0.4;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Core Glowing Geometric Polyhedron */}
      <mesh>
        <octahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#0088FF"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </mesh>

      {/* Inner solid neon crystal */}
      <mesh scale={0.75}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#9D00FF"
          emissive="#7000FF"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Orbiting Cyber Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.1, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#FF007A"
          emissive="#FF007A"
          emissiveIntensity={1}
          wireframe
        />
      </mesh>

      {/* Outer Dashed Ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.6, 0.02, 16, 48]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={0.9}
        />
      </mesh>
    </group>
  );
}

function FloatingCodeCubes() {
  const cubes = useMemo(() => {
    return [
      { pos: [-2.8, 1.6, -0.5] as [number, number, number], scale: 0.4, color: "#00F0FF" },
      { pos: [2.9, 1.4, 0.5] as [number, number, number], scale: 0.45, color: "#9D00FF" },
      { pos: [-2.2, -1.8, 0.2] as [number, number, number], scale: 0.35, color: "#FF007A" },
      { pos: [2.5, -1.6, -0.8] as [number, number, number], scale: 0.38, color: "#00FF66" },
      { pos: [0, 2.7, -1] as [number, number, number], scale: 0.32, color: "#00F0FF" },
    ];
  }, []);

  return (
    <>
      {cubes.map((c, i) => (
        <Float key={i} speed={2 + i * 0.5} rotationIntensity={1.5} floatIntensity={1.8}>
          <mesh position={c.pos} scale={c.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={c.color}
              emissive={c.color}
              emissiveIntensity={0.5}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function CyberParticles({ count = 120 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 14;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 10;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return coords;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00F0FF"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function HeroCanvas() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const pointer = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    // Detect WebGL support safely
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }

    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.current = [x, y];
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  if (hasWebGL === false) {
    return <HeroFallback />;
  }

  return (
    <div className="relative w-full h-[440px] sm:h-[500px] lg:h-[560px] flex items-center justify-center">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.08)_0%,transparent_70%)] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#00F0FF" />
        <pointLight position={[-10, -10, -5]} intensity={1.0} color="#9D00FF" />
        
        <CentralShape pointer={pointer} />
        <FloatingCodeCubes />
        <CyberParticles count={140} />
      </Canvas>
    </div>
  );
}
