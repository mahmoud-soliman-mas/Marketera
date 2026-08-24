'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
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
  playing?: boolean;
}

function RobotTimelineDriver({ progressRef, playing = true }: { progressRef: React.MutableRefObject<number>; playing?: boolean }) {
  const startTime = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (!playing) {
      startTime.current = null;
      progressRef.current = 0;
      return;
    }
    if (startTime.current === null) startTime.current = clock.getElapsedTime();
    progressRef.current = clamp01(((clock.getElapsedTime() - startTime.current) * 1000) / ROBOT_DURATION_MS);
  });

  return null;
}

function RobotEnvironment({ progressRef, reducedMotion = false, lowPower = false }: RobotSceneProps & { lowPower?: boolean }) {
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
      <gridHelper args={[12, lowPower ? 12 : 26, '#104d71', '#0a2842']} position={[0, -1.75, -1.5]} rotation={[0.02, 0, 0]} />
      <mesh position={[0, 0.25, -2.35]}>
        <planeGeometry args={[5.8, 3.9]} />
        <meshBasicMaterial color="#071525" transparent opacity={0.58} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments position={[0, 0.25, -2.32]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(5.8, 3.9)]} />
        <lineBasicMaterial color="#1e668d" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <mesh ref={pulseRef} position={[0, 0.25, -2.28]}>
          <ringGeometry args={[1.95, 1.96, lowPower ? 48 : 96]} />
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

function RobotFallback({ speaking, reducedMotion }: { speaking: boolean; reducedMotion: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#030914]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(41,188,226,0.18),transparent_28%,rgba(0,0,0,0.58)_76%)]" />
      <div className="absolute bottom-[18%] h-px w-[min(72vw,620px)] bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
      <motion.div
        className="relative mt-6 flex w-44 flex-col items-center"
        animate={reducedMotion ? undefined : { y: [0, -8, 0], rotateY: [-2, 2, -2] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative flex h-28 w-32 items-center justify-center rounded-[42%] border border-cyan-200/25 bg-gradient-to-br from-[#244d6a] to-[#091b31] shadow-[0_0_70px_rgba(54,210,255,0.24)]">
          <div className="absolute inset-x-5 top-10 flex justify-center gap-8">
            <span className="h-3 w-5 rounded-full bg-cyan-100/85 shadow-[0_0_18px_rgba(117,236,255,0.9)]" />
            <span className="h-3 w-5 rounded-full bg-cyan-100/85 shadow-[0_0_18px_rgba(117,236,255,0.9)]" />
          </div>
          <span className={`absolute bottom-6 h-4 w-2 rounded-full bg-cyan-200/80 shadow-[0_0_18px_rgba(117,236,255,0.9)] ${speaking ? 'animate-pulse' : ''}`} />
          <span className="absolute -top-9 h-9 w-px bg-cyan-200/80" />
          <span className="absolute -top-12 h-3 w-3 rounded-full bg-cyan-100 shadow-[0_0_20px_rgba(117,236,255,0.95)]" />
        </div>
        <div className="mt-[-8px] h-28 w-40 rounded-[36%] border border-cyan-200/20 bg-gradient-to-b from-[#173d5e] to-[#0a1b30] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          <div className="mx-auto mt-9 h-8 w-16 rounded-xl border border-cyan-200/30 bg-cyan-300/10 shadow-[0_0_22px_rgba(54,210,255,0.22)]" />
          <p className="mt-2 text-center text-[8px] font-semibold tracking-[0.25em] text-cyan-100/65">MRK / AI</p>
        </div>
        <div className="mt-[-8px] h-3 w-48 rounded-full bg-cyan-200/15 blur-[1px]" />
      </motion.div>
      <div className="absolute left-1/2 top-[18%] -translate-x-1/2 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-100/55">MARKETING INTELLIGENCE / LIVE</p>
        <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-white/25">ASSISTANT SYSTEM / LOW-POWER MODE</p>
      </div>
    </div>
  );
}

export default function RobotScene({ progressRef, speaking, reducedMotion = false, playing = true }: RobotSceneProps) {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const isCompact = window.innerWidth < 700;
    const isWeak = (device.hardwareConcurrency || 8) <= 4;
    const hasLimitedMemory = typeof device.deviceMemory === 'number' && device.deviceMemory <= 4;
    const isSavingData = device.connection?.saveData === true;
    setLowPower(isCompact || isWeak || hasLimitedMemory || isSavingData);
  }, []);

  useEffect(() => {
    if (!lowPower || !playing) return;
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      progressRef.current = clamp01((performance.now() - startedAt) / ROBOT_DURATION_MS);
    }, 60);
    return () => window.clearInterval(timer);
  }, [lowPower, playing, progressRef]);

  if (lowPower) {
    return <RobotFallback speaking={speaking} reducedMotion={reducedMotion} />;
  }

  return (
    <Canvas
      dpr={[0.8, 1.2]}
      camera={{ position: [0, 0.15, 7.8], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor('#030914', 1)}
      fallback={<RobotFallback speaking={speaking} reducedMotion={reducedMotion} />}
    >
      <RobotTimelineDriver progressRef={progressRef} playing={playing} />
      <color attach="background" args={['#030914']} />
      <fogExp2 attach="fog" args={['#07192f', 0.035]} />
      <ambientLight intensity={0.18} color="#6aa7ff" />
      <pointLight position={[0, 0.7, 1.2]} intensity={3.2} color="#3ad5ff" distance={10} decay={2} />
      <pointLight position={[-3, 2, -2]} intensity={1.1} color="#8b6fff" distance={9} decay={2} />
      <RobotEnvironment progressRef={progressRef} reducedMotion={reducedMotion} speaking={speaking} lowPower={lowPower} />
      <MarketingRobot progressRef={progressRef} speaking={speaking} reducedMotion={reducedMotion} />
      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
      {!lowPower && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.28} luminanceThreshold={0.12} luminanceSmoothing={0.85} mipmapBlur />
          <DepthOfField focusDistance={0.018} focalLength={0.045} bokehScale={1.15} height={420} />
          <ChromaticAberration offset={new THREE.Vector2(0.00025, 0.00015)} radialModulation modulationOffset={0.5} />
          <Noise premultiply opacity={0.02} />
          <Vignette eskil={false} offset={0.18} darkness={0.78} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
