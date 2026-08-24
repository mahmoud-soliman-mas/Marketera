'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { clamp01, smoothstep } from './intro-constants';

interface AnalyticsSceneProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

function AnalyticsGraph({
  progressRef,
  reducedMotion = false,
  color,
  position,
  scale = 1,
}: {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
  color: string;
  position: [number, number, number];
  scale?: number;
}) {
  const geometry = useMemo(() => new THREE.BufferGeometry(), []);
  const points = useMemo(() => new Float32Array(16 * 3), []);
  const lineObject = useMemo(() => {
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    return new THREE.Line(geometry, material);
  }, [color, geometry]);

  useEffect(() => () => {
    lineObject.geometry.dispose();
    (lineObject.material as THREE.Material).dispose();
  }, [lineObject]);

  useFrame(({ clock }) => {
    const progress = clamp01(progressRef.current);
    const reveal = smoothstep(0.68, 0.84, progress);
    const time = clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.1 : 1;
    const vertices: THREE.Vector3[] = [];

    for (let index = 0; index < 16; index += 1) {
      const x = -1.2 + index * 0.16;
      const wave = Math.sin(index * 0.72 + time * 0.7 * motionFactor) * 0.05;
      const trend = index * 0.065;
      const y = -0.48 + (wave + trend) * reveal;
      points[index * 3] = x;
      points[index * 3 + 1] = y;
      points[index * 3 + 2] = 0;
      vertices.push(new THREE.Vector3(x, y, 0));
    }

    geometry.setFromPoints(vertices);
    geometry.computeBoundingSphere();
    (lineObject.material as THREE.LineBasicMaterial).opacity = reveal * 0.9;
  });

  return <primitive object={lineObject} position={position} scale={scale} />;
}

function MetricCard({
  progressRef,
  label,
  value,
  accent,
  position,
}: {
  progressRef: React.MutableRefObject<number>;
  label: string;
  value: string;
  accent: string;
  position: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const progress = clamp01(progressRef.current);
    const reveal = smoothstep(0.72, 0.86, progress);
    if (!groupRef.current) return;
    groupRef.current.scale.setScalar(0.82 + reveal * 0.18);
    groupRef.current.position.lerp(new THREE.Vector3(position[0], position[1], position[2] + reveal * 0.03), 0.12);
    if (materialRef.current) materialRef.current.opacity = reveal * 0.7;
  });

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2] - 0.4]}>
      <mesh>
        <planeGeometry args={[0.78, 0.38]} />
        <meshBasicMaterial ref={materialRef} color="#0a2545" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.32, 0.11, 0.015]}>
        <planeGeometry args={[0.04, 0.04]} />
        <meshBasicMaterial color={accent} transparent opacity={0.95} blending={THREE.AdditiveBlending} />
      </mesh>
      <Text position={[-0.22, 0.11, 0.02]} fontSize={0.065} color="#a4c8e9" anchorX="left" anchorY="middle" letterSpacing={0.06}>
        {label}
      </Text>
      <Text position={[-0.32, -0.08, 0.02]} fontSize={0.105} color="#ecfbff" anchorX="left" anchorY="middle" fontWeight="bold">
        {value}
      </Text>
    </group>
  );
}

export default function AnalyticsScene({ progressRef, reducedMotion = false }: AnalyticsSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const progress = clamp01(progressRef.current);
    const reveal = smoothstep(0.64, 0.84, progress);
    const motionFactor = reducedMotion ? 0.12 : 1;
    if (groupRef.current) {
      groupRef.current.position.z = -1.7 + reveal * 0.3;
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.24) * 0.06 * motionFactor;
      groupRef.current.scale.setScalar(0.84 + reveal * 0.16);
    }
    if (frameRef.current) {
      const material = frameRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = reveal * 0.42;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.02, -2]}>
      <mesh ref={frameRef}>
        <planeGeometry args={[4.1, 2.15]} />
        <meshBasicMaterial color="#102f51" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(4.1, 2.15)]} />
        <lineBasicMaterial color="#45c7ff" transparent opacity={0.55} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <Text position={[-1.7, 0.75, 0.03]} fontSize={0.11} color="#d6f5ff" anchorX="left" anchorY="middle" letterSpacing={0.1}>
        CAMPAIGN ANALYTICS
      </Text>
      <Text position={[-1.7, 0.54, 0.03]} fontSize={0.06} color="#6e9fc4" anchorX="left" anchorY="middle" letterSpacing={0.05}>
        RAW SIGNALS → SMART DECISIONS
      </Text>
      <AnalyticsGraph progressRef={progressRef} reducedMotion={reducedMotion} color="#5be4c0" position={[-0.95, -0.02, 0.05]} />
      <AnalyticsGraph progressRef={progressRef} reducedMotion={reducedMotion} color="#65b9ff" position={[-0.95, -0.06, 0.04]} scale={0.85} />
      <MetricCard progressRef={progressRef} label="CTR" value="↑ 4.82%" accent="#55d7ff" position={[0.72, 0.34, 0.04]} />
      <MetricCard progressRef={progressRef} label="CONVERSIONS" value="↑ 684" accent="#63e4c0" position={[0.72, -0.12, 0.04]} />
      <MetricCard progressRef={progressRef} label="ROI" value="↑ 3.8×" accent="#b497ff" position={[0.72, -0.58, 0.04]} />
    </group>
  );
}
