'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import MarketingRobot from './MarketingRobot';
import CameraRig from './camerarig';
import { ROBOT_DURATION_MS, clamp01, smoothstep } from './intro-constants';

interface RobotSceneProps {
  progressRef: React.MutableRefObject<number>;
  speaking: boolean;
  reducedMotion?: boolean;
}

function RobotTimelineDriver({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const startTime = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (startTime.current === null) startTime.current = clock.getElapsedTime();
    progressRef.current = clamp01(((clock.getElapsedTime() - startTime.current) * 1000) / ROBOT_DURATION_MS);
  });

  return null;
}

function RobotEnvironment({ progressRef, reducedMotion = false }: RobotSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const progress = clamp01(progressRef.current);
    const reveal = smoothstep(0, 0.22, progress);
    const motionFactor = reducedMotion ? 0.1 : 1;
    if (!groupRef.current || !pulseRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.16) * 0.04 * motionFactor;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.025 * motionFactor;
    groupRef.current.scale.setScalar(0.88 + reveal * 0.12);
    pulseRef.current.scale.setScalar(0.94 + Math.sin(clock.getElapsedTime() * 1.8) * 0.03 * motionFactor);
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -1.83, -1.8]} rotation={[-Math.PI / 2.05, 0, 0]}>
        <planeGeometry args={[12, 7]} />
        <meshBasicMaterial color="#071528" transparent opacity={0.86} side={THREE.DoubleSide} />
      </mesh>
      <gridHelper args={[12, 26, '#104d71', '#0a2842']} position={[0, -1.75, -1.5]} rotation={[0.02, 0, 0]} />
      <mesh position={[0, 0.25, -2.35]}>
        <planeGeometry args={[5.8, 3.9]} />
        <meshBasicMaterial color="#071525" transparent opacity={0.58} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments position={[0, 0.25, -2.32]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(5.8, 3.9)]} />
        <lineBasicMaterial color="#1e668d" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <mesh ref={pulseRef} position={[0, 0.25, -2.28]}>
        <ringGeometry args={[1.95, 1.96, 96]} />
        <meshBasicMaterial color="#36c9e9" transparent opacity={0.26} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[-2.55, 1.72, -2.25]} fontSize={0.11} color="#87b5cd" anchorX="left" anchorY="middle" letterSpacing={0.1}>
        MARKETING INTELLIGENCE / LIVE
      </Text>
      <Text position={[-2.55, 1.45, -2.25]} fontSize={0.08} color="#4c88aa" anchorX="left" anchorY="middle" letterSpacing={0.08}>
        CAMPAIGN DATA • AUDIENCE SIGNALS • AI INSIGHTS
      </Text>
      <Text position={[1.88, 1.12, -2.25]} fontSize={0.075} color="#6dabc7" anchorX="left" anchorY="middle" letterSpacing={0.1}>
        CTR     4.82%
      </Text>
      <Text position={[1.88, 0.89, -2.25]} fontSize={0.075} color="#62dcbf" anchorX="left" anchorY="middle" letterSpacing={0.1}>
        LEADS   684
      </Text>
      <Text position={[1.88, 0.66, -2.25]} fontSize={0.075} color="#b69bff" anchorX="left" anchorY="middle" letterSpacing={0.1}>
        ROI     3.8×
      </Text>
      <Text position={[-2.55, -1.84, -1.1]} fontSize={0.075} color="#5b93b0" anchorX="left" anchorY="middle" letterSpacing={0.12}>
        MARKETRA AI ASSISTANT / READY
      </Text>
    </group>
  );
}

export default function RobotScene({ progressRef, speaking, reducedMotion = false }: RobotSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.15, 7.8], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor('#030914', 1)}
    >
      <RobotTimelineDriver progressRef={progressRef} />
      <color attach="background" args={['#030914']} />
      <fogExp2 attach="fog" args={['#07192f', 0.035]} />
      <ambientLight intensity={0.18} color="#6aa7ff" />
      <pointLight position={[0, 0.7, 1.2]} intensity={3.2} color="#3ad5ff" distance={10} decay={2} />
      <pointLight position={[-3, 2, -2]} intensity={1.1} color="#8b6fff" distance={9} decay={2} />
      <RobotEnvironment progressRef={progressRef} reducedMotion={reducedMotion} speaking={speaking} />
      <MarketingRobot progressRef={progressRef} speaking={speaking} reducedMotion={reducedMotion} />
      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.46} luminanceThreshold={0.1} luminanceSmoothing={0.85} mipmapBlur />
        <DepthOfField focusDistance={0.018} focalLength={0.045} bokehScale={1.4} height={480} />
        <ChromaticAberration offset={new THREE.Vector2(0.00035, 0.0002)} radialModulation modulationOffset={0.5} />
        <Noise premultiply opacity={0.025} />
        <Vignette eskil={false} offset={0.18} darkness={0.78} />
      </EffectComposer>
    </Canvas>
  );
}
