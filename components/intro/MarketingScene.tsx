'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import AudienceParticles from './AudienceParticles';
import AnalyticsScene from './AnalyticsScene';
import ContentAssets from './ContentAssets';
import CameraRig from './camerarig';
import { CAMPAIGN_DURATION_MS, clamp01, smoothstep } from './intro-constants';

interface MarketingSceneProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

function TimelineDriver({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const startTime = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (startTime.current === null) startTime.current = clock.getElapsedTime();
    progressRef.current = clamp01(((clock.getElapsedTime() - startTime.current) * 1000) / CAMPAIGN_DURATION_MS);
  });

  return null;
}

function CampaignHub({ progressRef, reducedMotion = false }: MarketingSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const progress = clamp01(progressRef.current);
    const idea = smoothstep(0.01, 0.18, progress);
    const content = smoothstep(0.14, 0.35, progress);
    const launch = smoothstep(0.37, 0.55, progress);
    const insight = smoothstep(0.84, 0.96, progress);
    const motionFactor = reducedMotion ? 0.1 : 1;
    const time = clock.getElapsedTime();

    if (!groupRef.current || !screenRef.current || !coreRef.current || !labelRef.current) return;
    groupRef.current.rotation.y = Math.sin(time * 0.18) * 0.05 * motionFactor;
    groupRef.current.rotation.z = Math.sin(time * 0.21) * 0.025 * motionFactor;
    groupRef.current.scale.setScalar(0.9 + idea * 0.1 + launch * 0.03);
    groupRef.current.position.z = -0.8 + content * 0.2 + launch * 0.14;
    screenRef.current.scale.set(1 + launch * 0.09, 1 + launch * 0.09, 1);
    coreRef.current.scale.setScalar(0.75 + idea * 0.3 + launch * 0.35 + insight * 0.2 + Math.sin(time * 2.3) * 0.04);
    labelRef.current.scale.setScalar(0.78 + Math.max(idea, content) * 0.22);
    labelRef.current.position.y = 1.55 + Math.sin(time * 0.55) * 0.025 * motionFactor;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={screenRef} position={[0, 0.12, -0.32]}>
        <planeGeometry args={[2.8, 1.72]} />
        <meshBasicMaterial color="#06203b" transparent opacity={0.82} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments position={[0, 0.12, -0.3]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.8, 1.72)]} />
        <lineBasicMaterial color="#4fd8ff" transparent opacity={0.68} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <mesh ref={coreRef} position={[0, 0.02, -0.21]}>
        <icosahedronGeometry args={[0.23, 2]} />
        <meshBasicMaterial color="#d8fbff" transparent opacity={0.93} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0.02, -0.18]}>
        <torusGeometry args={[0.38, 0.008, 12, 96]} />
        <meshBasicMaterial color="#61e3ff" transparent opacity={0.78} blending={THREE.AdditiveBlending} />
      </mesh>
      <Text ref={labelRef} position={[0, 1.55, -0.4]} fontSize={0.16} color="#dffaff" anchorX="center" anchorY="middle" letterSpacing={0.18}>
        NEW CAMPAIGN
      </Text>
      <Text position={[0, 0.58, -0.2]} fontSize={0.075} color="#79aeca" anchorX="center" anchorY="middle" letterSpacing={0.12}>
        IDEA → CONTENT → CAMPAIGN
      </Text>
      <Text position={[0, -0.22, -0.2]} fontSize={0.11} color="#65e4c5" anchorX="center" anchorY="middle" letterSpacing={0.15}>
        CREATE
      </Text>
      <mesh position={[0, -0.48, -0.2]}>
        <planeGeometry args={[1.22, 0.02]} />
        <meshBasicMaterial color="#5ed9ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

const CHANNELS = [
  { label: 'INSTAGRAM', glyph: '◎', color: '#f08cb0', position: [-2.3, 0.8, -1.2] as [number, number, number] },
  { label: 'FACEBOOK', glyph: 'f', color: '#76a9ff', position: [2.3, 0.62, -1.1] as [number, number, number] },
  { label: 'GOOGLE', glyph: 'G', color: '#ffd070', position: [-2.25, -0.72, -1.05] as [number, number, number] },
  { label: 'TIKTOK', glyph: '♪', color: '#79e1d3', position: [2.25, -0.66, -1.2] as [number, number, number] },
  { label: 'YOUTUBE', glyph: '▶', color: '#ff9b91', position: [0, 1.84, -1.1] as [number, number, number] },
];

function ChannelNodes({ progressRef, reducedMotion = false }: MarketingSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const progress = clamp01(progressRef.current);
    const launch = smoothstep(0.4, 0.58, progress);
    const analysis = smoothstep(0.76, 0.94, progress);
    const motionFactor = reducedMotion ? 0.1 : 1;
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.025 * motionFactor;
    groupRef.current.scale.setScalar(0.75 + launch * 0.25 - analysis * 0.12);
    groupRef.current.position.z = -0.9 + launch * 0.2 - analysis * 0.1;
    groupRef.current.visible = launch > 0.01 && analysis < 0.98;
  });

  return (
    <group ref={groupRef}>
      {CHANNELS.map((channel, index) => (
        <group key={channel.label} position={[0, 0, -0.6]}>
          <mesh position={channel.position}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshBasicMaterial color={channel.color} transparent opacity={0.78} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh position={channel.position} scale={1.7}>
            <ringGeometry args={[0.14, 0.148, 32]} />
            <meshBasicMaterial color={channel.color} transparent opacity={0.38} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
          <Text position={[channel.position[0], channel.position[1] - 0.27, channel.position[2]]} fontSize={0.07} color="#c2e5f4" anchorX="center" anchorY="middle" letterSpacing={0.08}>
            {channel.label}
          </Text>
          <Text position={[channel.position[0], channel.position[1], channel.position[2] + 0.06]} fontSize={0.09} color="#f3fcff" anchorX="center" anchorY="middle" fontWeight="bold">
            {channel.glyph}
          </Text>
        </group>
      ))}
      <Text position={[0, -1.65, -0.7]} fontSize={0.14} color="#effcff" anchorX="center" anchorY="middle" letterSpacing={0.16}>
        CAMPAIGN LAUNCHED
      </Text>
    </group>
  );
}

function AudienceHeading({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    const progress = clamp01(progressRef.current);
    const reveal = smoothstep(0.52, 0.67, progress);
    if (!groupRef.current) return;
    groupRef.current.visible = reveal > 0.01 && progress < 0.94;
    groupRef.current.scale.setScalar(0.8 + reveal * 0.2);
  });

  return (
    <group ref={groupRef} position={[0, 1.55, -1.4]}>
      <Text fontSize={0.14} color="#ecfbff" anchorX="center" anchorY="middle" letterSpacing={0.16}>
        AUDIENCE SIGNAL
      </Text>
      <Text position={[0, -0.2, 0]} fontSize={0.07} color="#83b9d4" anchorX="center" anchorY="middle" letterSpacing={0.08}>
        VISITORS → ENGAGEMENT → LEADS
      </Text>
    </group>
  );
}

export default function MarketingScene({ progressRef, reducedMotion = false }: MarketingSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.55]}
      camera={{ position: [0, 0.08, 8.2], fov: 43, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor('#020712', 1)}
    >
      <TimelineDriver progressRef={progressRef} />
      <color attach="background" args={['#020712']} />
      <fogExp2 attach="fog" args={['#06162b', 0.039]} />
      <ambientLight intensity={0.12} color="#699fff" />
      <pointLight position={[0, 0, 2]} intensity={1.3} color="#34c9ff" distance={10} decay={2} />
      <gridHelper args={[18, 22, '#0c4870', '#09243e']} position={[0, -2.1, -2.5]} rotation={[0.2, 0, 0]} />
      <CampaignHub progressRef={progressRef} reducedMotion={reducedMotion} />
      <ContentAssets progressRef={progressRef} reducedMotion={reducedMotion} />
      <ChannelNodes progressRef={progressRef} reducedMotion={reducedMotion} />
      <AudienceParticles progressRef={progressRef} reducedMotion={reducedMotion} />
      <AudienceHeading progressRef={progressRef} />
      <AnalyticsScene progressRef={progressRef} reducedMotion={reducedMotion} />
      <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.52} luminanceThreshold={0.08} luminanceSmoothing={0.86} mipmapBlur />
        <DepthOfField focusDistance={0.015} focalLength={0.045} bokehScale={1.6} height={480} />
        <ChromaticAberration offset={new THREE.Vector2(0.0004, 0.00025)} radialModulation modulationOffset={0.55} />
        <Noise premultiply opacity={0.026} />
        <Vignette eskil={false} offset={0.18} darkness={0.84} />
      </EffectComposer>
    </Canvas>
  );
}
