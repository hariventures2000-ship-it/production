"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// An abstract geometric wireframe sphere that slowly rotates and pulsates
function AbstractGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
      
      // Subtle pulsation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.5, 2]} />
      <meshBasicMaterial 
        color="#16A34A" 
        wireframe={true}
        transparent={true}
        opacity={0.3}
      />
      {/* Inner core */}
      <mesh>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial 
          color="#000000" 
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </mesh>
  );
}

// Particle field
function Particles() {
  const count = 500;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#16A34A" transparent opacity={0.6} />
    </instancedMesh>
  );
}

interface Hero3DProps {
  title: string;
  subtitle: string;
  highlightWords?: string[];
}

export function Hero3D({ title, subtitle, highlightWords = [] }: Hero3DProps) {
  // Helper to wrap highlighted words in the .font-important class
  const renderTitle = () => {
    if (!highlightWords.length) return title;
    
    let result: any[] = [title];
    
    highlightWords.forEach(word => {
      result = result.flatMap((part, i) => {
        if (typeof part === 'string') {
          const split = part.split(new RegExp(`(${word})`, 'gi'));
          return split.map((s, j) => 
            s.toLowerCase() === word.toLowerCase() 
              ? <span key={`${i}-${j}`} className="font-important">{s}</span>
              : s
          );
        }
        return [part];
      });
    });
    
    return <>{result}</>;
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden bg-white border-b border-slate-200">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <AbstractGeometry />
          <Particles />
        </Canvas>
      </div>

      {/* Foreground Content Overlay */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-6 flex flex-col justify-center pointer-events-none">
        <div className="max-w-2xl bg-white/40 backdrop-blur-sm p-8 rounded-2xl border border-white/60 shadow-sm pointer-events-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black tracking-tight leading-tight mb-4">
            {renderTitle()}
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 font-medium">
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Fading gradient to blend into page */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-0" />
    </div>
  );
}
