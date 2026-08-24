'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01, smoothstep } from './intro-constants';

interface EnergyCoreProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

export default function EnergyCore({ progressRef, reducedMotion = false }: EnergyCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    const core = coreRef.current;
    const halo = haloRef.current;
    const light = pointLightRef.current;
    if (!group || !core || !halo || !light) return;

    const time = clock.getElapsedTime();
    const progress = clamp01(progressRef.current);
    const reveal = smoothstep(0.08, 0.32, progress);
    const formation = smoothstep(0.3, 0.68, progress);
    const pulse = 1 + Math.sin(time * 2.4) * 0.06;
    const motionFactor = reducedMotion ? 0.15 : 1;

    group.rotation.y = time * 0.18 * motionFactor;
    group.rotation.z = Math.sin(time * 0.7) * 0.1 * motionFactor;
    core.scale.setScalar((0.42 + reveal * 0.18) * pulse);
    halo.scale.setScalar((1 + reveal * 0.55 + formation * 0.45) * pulse);
    halo.rotation.z = time * 0.26 * motionFactor;
    light.intensity = 1.5 + reveal * 15 + formation * 3 + Math.sin(time * 2.4) * 1.2;
    light.distance = 3.2 + reveal * 3;
  });

  return (
    <group ref={groupRef}>
      <pointLight ref={pointLightRef} color="#35b9ff" intensity={0} distance={3} decay={2} />
      <mesh ref={haloRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.75, 0.012, 16, 128]} />
        <meshBasicMaterial color="#69d9ff" transparent opacity={0.72} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 4]} />
        <meshStandardMaterial
          color="#b9f3ff"
          emissive="#1ea7ff"
          emissiveIntensity={8}
          roughness={0.18}
          metalness={0.32}
          transparent
          opacity={0.96}
        />
      </mesh>
      <mesh scale={0.72}>
        <sphereGeometry args={[0.56, 32, 32]} />
        <meshBasicMaterial color="#e9fcff" transparent opacity={0.55} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
