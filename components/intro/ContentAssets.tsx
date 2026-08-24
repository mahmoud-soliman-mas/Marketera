'use client';

import { useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01, easeOutCubic, smoothstep } from './intro-constants';

interface ContentAssetsProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

type Asset = {
  label: string;
  kicker: string;
  position: [number, number, number];
  color: string;
  rotation: [number, number, number];
};

const ASSETS: Asset[] = [
  { label: 'AD COPY', kicker: 'HEADLINE', position: [-1.9, 0.92, -1.3], color: '#64cfff', rotation: [0.03, 0.12, -0.08] },
  { label: 'SOCIAL POST', kicker: 'CONTENT', position: [1.9, 0.72, -1.45], color: '#b28bff', rotation: [-0.06, -0.13, 0.08] },
  { label: 'VIDEO', kicker: 'THUMBNAIL', position: [-1.8, -0.82, -1.2], color: '#67e2c0', rotation: [0.04, 0.11, 0.07] },
  { label: 'CTA', kicker: 'CONVERSION', position: [1.75, -0.74, -1.1], color: '#ffcf78', rotation: [-0.05, -0.1, -0.08] },
];

function AssetCard({ asset, index, progressRef, reducedMotion = false }: { asset: Asset; index: number; progressRef: React.MutableRefObject<number>; reducedMotion?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const panelRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const progress = clamp01(progressRef.current);
    const reveal = smoothstep(0.13 + index * 0.035, 0.42 + index * 0.03, progress);
    const contentStage = smoothstep(0.18, 0.5, progress);
    const motionFactor = reducedMotion ? 0.12 : 1;
    if (!groupRef.current || !panelRef.current || !pulseRef.current) return;

    const targetZ = asset.position[2] + contentStage * 0.45;
    groupRef.current.position.lerp(new THREE.Vector3(asset.position[0] * (1 - reveal * 0.08), asset.position[1], targetZ), 0.08);
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.45 + index) * 0.05 * motionFactor;
    groupRef.current.scale.setScalar(0.65 + reveal * 0.35);
    (panelRef.current.material as THREE.MeshBasicMaterial).opacity = reveal * 0.76;
    pulseRef.current.scale.setScalar(0.8 + Math.max(0, Math.sin(clock.getElapsedTime() * 1.7 + index)) * 0.16);
  });

  return (
    <group ref={groupRef} position={[asset.position[0] * 1.35, asset.position[1] * 1.25, asset.position[2] - 2]} rotation={asset.rotation}>
      <mesh ref={panelRef}>
        <planeGeometry args={[1.42, 0.78]} />
        <meshBasicMaterial color="#0c2340" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.52, 0.24, 0.015]}>
        <planeGeometry args={[0.26, 0.06]} />
        <meshBasicMaterial color={asset.color} transparent opacity={0.65} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={pulseRef} position={[0.5, -0.2, 0.015]}>
        <circleGeometry args={[0.055, 18]} />
        <meshBasicMaterial color={asset.color} transparent opacity={0.82} blending={THREE.AdditiveBlending} />
      </mesh>
      <Text position={[-0.52, 0.25, 0.03]} fontSize={0.075} color="#8cafc9" anchorX="left" anchorY="middle" letterSpacing={0.1}>
        {asset.kicker}
      </Text>
      <Text position={[-0.52, 0.02, 0.03]} fontSize={0.13} color="#effaff" anchorX="left" anchorY="middle" fontWeight="bold" letterSpacing={0.04}>
        {asset.label}
      </Text>
      <mesh position={[-0.52, -0.22, 0.02]}>
        <planeGeometry args={[0.6, 0.018]} />
        <meshBasicMaterial color={asset.color} transparent opacity={0.46} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export default function ContentAssets({ progressRef, reducedMotion = false }: ContentAssetsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRingRef = useRef<THREE.Mesh>(null);
  const assets = useMemo(() => ASSETS, []);

  useFrame(({ clock }) => {
    const progress = clamp01(progressRef.current);
    const reveal = easeOutCubic(smoothstep(0.18, 0.55, progress));
    const motionFactor = reducedMotion ? 0.12 : 1;
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.24) * 0.035 * motionFactor;
      groupRef.current.scale.setScalar(0.85 + reveal * 0.15);
    }
    if (coreRingRef.current) {
      coreRingRef.current.rotation.z = clock.getElapsedTime() * 0.35 * motionFactor;
      coreRingRef.current.scale.setScalar(0.8 + reveal * 0.42);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRingRef} position={[0, 0, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.78, 0.01, 12, 120]} />
        <meshBasicMaterial color="#4ad7ff" transparent opacity={0.75} blending={THREE.AdditiveBlending} />
      </mesh>
      {assets.map((asset, index) => (
        <AssetCard key={asset.label} asset={asset} index={index} progressRef={progressRef} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}
