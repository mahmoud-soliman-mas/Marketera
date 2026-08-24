'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01, smoothstep } from './intro-constants';

interface AudienceParticlesProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

export default function AudienceParticles({ progressRef, reducedMotion = false }: AudienceParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const seeds = useMemo(() => Array.from({ length: 92 }, (_, index) => {
    const group = index % 4;
    const column = Math.floor(index / 4);
    return {
      group,
      angle: (column / 24) * Math.PI * 2 + group * 0.18,
      radius: 1.35 + (column % 6) * 0.1 + group * 0.08,
      height: ((column % 8) - 3.5) * 0.11 + (group - 1.5) * 0.06,
      seed: Math.random() * Math.PI * 2,
    };
  }), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    seeds.forEach((seed, index) => {
      dummy.position.set(0, -5, -4);
      dummy.scale.setScalar(0.01);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      color.set(seed.group === 0 ? '#69c8ff' : seed.group === 1 ? '#a98bff' : seed.group === 2 ? '#50e0c0' : '#ffd47a');
      mesh.setColorAt(index, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [color, dummy, seeds]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const time = clock.getElapsedTime();
    const progress = clamp01(progressRef.current);
    const audienceReveal = smoothstep(0.52, 0.76, progress);
    const analysisPull = smoothstep(0.74, 0.92, progress);
    const motionFactor = reducedMotion ? 0.12 : 1;

    seeds.forEach((seed, index) => {
      const orbitAngle = seed.angle + time * (0.08 + seed.group * 0.012) * motionFactor;
      const spreadRadius = seed.radius * (1 + audienceReveal * 0.58);
      const centerPull = 1 - analysisPull * 0.7;
      dummy.position.set(
        Math.cos(orbitAngle) * spreadRadius * centerPull,
        seed.height + Math.sin(time * 0.7 + seed.seed) * 0.055 * motionFactor,
        -1.1 + Math.sin(orbitAngle) * spreadRadius * 0.28 * centerPull,
      );
      const scale = (0.028 + (seed.group === 2 ? 0.012 : 0)) * audienceReveal;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, seeds.length]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.84} vertexColors blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}
