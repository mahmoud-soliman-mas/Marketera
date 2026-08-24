'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import EnergyCore from './EnergyCore';
import CameraRig from './camerarig';
import { INTRO_DURATION_MS, clamp01, smoothstep } from './intro-constants';

interface CinematicSceneProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

function TimelineDriver({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const startTime = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (startTime.current === null) startTime.current = clock.getElapsedTime();
    progressRef.current = clamp01(((clock.getElapsedTime() - startTime.current) * 1000) / INTRO_DURATION_MS);
  });

  return null;
}

function OrbitalRings({ progressRef, reducedMotion = false }: CinematicSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const ringCRef = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const ringA = ringARef.current;
    const ringB = ringBRef.current;
    const ringC = ringCRef.current;
    const shockwave = shockwaveRef.current;
    if (!group || !ringA || !ringB || !ringC || !shockwave) return;

    const time = clock.getElapsedTime();
    const progress = clamp01(progressRef.current);
    const reveal = smoothstep(0.2, 0.5, progress);
    const formation = smoothstep(0.28, 0.62, progress);
    const impact = Math.max(0, 1 - Math.abs(progress - 0.78) / 0.09);
    const motionFactor = reducedMotion ? 0.15 : 1;

    group.rotation.y = time * 0.1 * motionFactor;
    group.rotation.x = Math.sin(time * 0.18) * 0.18 * motionFactor;
    ringA.rotation.z = time * 0.32 * motionFactor;
    ringB.rotation.x = time * 0.24 * motionFactor;
    ringB.rotation.z = -time * 0.16 * motionFactor;
    ringC.rotation.y = time * 0.18 * motionFactor;

    const opacity = 0.1 + reveal * 0.44 + formation * 0.18;
    (ringA.material as THREE.MeshBasicMaterial).opacity = opacity;
    (ringB.material as THREE.MeshBasicMaterial).opacity = opacity * 0.78;
    (ringC.material as THREE.MeshBasicMaterial).opacity = opacity * 0.54;

    shockwave.scale.setScalar(0.82 + impact * 2.8);
    (shockwave.material as THREE.MeshBasicMaterial).opacity = impact * 0.65;
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.6]}>
      <mesh ref={ringARef} rotation={[Math.PI / 2.6, 0.2, 0]}>
        <torusGeometry args={[1.62, 0.008, 12, 160]} />
        <meshBasicMaterial color="#55c9ff" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringBRef} rotation={[Math.PI / 3.2, -0.4, 0.25]}>
        <torusGeometry args={[2.05, 0.006, 12, 160]} />
        <meshBasicMaterial color="#3178ff" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringCRef} rotation={[Math.PI / 2, 0, Math.PI / 2.6]}>
        <torusGeometry args={[2.55, 0.004, 12, 160]} />
        <meshBasicMaterial color="#32ebd0" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={shockwaveRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75, 0.77, 128]} />
        <meshBasicMaterial color="#baf6ff" transparent opacity={0} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function CinematicScene({ progressRef, reducedMotion = false }: CinematicSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.65]}
      camera={{ position: [0, 0, 8.8], fov: 42, near: 0.1, far: 120 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#01040b', 1);
      }}
    >
      <TimelineDriver progressRef={progressRef} />
      <color attach="background" args={['#01040b']} />
      <fogExp2 attach="fog" args={['#071226', 0.032]} />
      <ambientLight intensity={0.16} color="#5d8dff" />
      <pointLight position={[0, 0, 1]} intensity={1.2} color="#27b8ff" distance={10} />

      <Sparkles
        count={reducedMotion ? 24 : 64}
        scale={[12, 7, 7]}
        size={1.5}
        speed={reducedMotion ? 0.04 : 0.18}
        opacity={0.22}
        color="#7fdcff"
      />
      <ParticleField progressRef={progressRef} reducedMotion={reducedMotion} />
      <EnergyCore progressRef={progressRef} reducedMotion={reducedMotion} />
      <OrbitalRings progressRef={progressRef} reducedMotion={reducedMotion} />
      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />

      <EffectComposer multisampling={0}>
        <Bloom intensity={1.65} luminanceThreshold={0.08} luminanceSmoothing={0.84} mipmapBlur />
        <DepthOfField focusDistance={0.018} focalLength={0.045} bokehScale={1.9} height={480} />
        <ChromaticAberration offset={new THREE.Vector2(0.00055, 0.00035)} radialModulation modulationOffset={0.55} />
        <Noise premultiply opacity={0.028} />
        <Vignette eskil={false} offset={0.18} darkness={0.82} />
      </EffectComposer>
    </Canvas>
  );
}
