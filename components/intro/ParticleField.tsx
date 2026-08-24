'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01, smoothstep } from './intro-constants';

interface ParticleFieldProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

type ParticleData = {
  geometry: THREE.BufferGeometry;
  count: number;
};

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

function sampleMPoint(index: number, count: number) {
  const segment = index % 4;
  const t = (Math.floor(index / 4) + Math.random() * 0.85) / Math.max(1, Math.ceil(count / 4));
  const jitter = randomBetween(-0.045, 0.045);
  const top = 1.1;
  const bottom = -1.15;
  const left = -1.45;
  const mid = 0;
  const right = 1.45;

  if (segment === 0) return [left + jitter, bottom + (top - bottom) * t, jitter];
  if (segment === 1) return [left + (mid - left) * t + jitter, top + (bottom - top) * t + jitter, randomBetween(-0.03, 0.03)];
  if (segment === 2) return [mid + (right - mid) * t + jitter, bottom + (top - bottom) * t + jitter, randomBetween(-0.03, 0.03)];
  return [right + jitter, bottom + (top - bottom) * t, jitter];
}

function createParticleData(count: number): ParticleData {
  const positions = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const randoms = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const i3 = index * 3;
    const radius = randomBetween(2.2, 6.8);
    const angle = Math.random() * Math.PI * 2;

    positions[i3] = Math.cos(angle) * radius + randomBetween(-0.7, 0.7);
    positions[i3 + 1] = randomBetween(-3.6, 3.6);
    positions[i3 + 2] = Math.sin(angle) * radius - randomBetween(0.5, 3.5);

    const target = sampleMPoint(index, count);
    targets[i3] = target[0];
    targets[i3 + 1] = target[1];
    targets[i3 + 2] = target[2];

    randoms[i3] = Math.random() * 2 - 1;
    randoms[i3 + 1] = Math.random() * 2 - 1;
    randoms[i3 + 2] = Math.random() * 2 - 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3));
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
  geometry.computeBoundingSphere();

  return { geometry, count };
}

export default function ParticleField({ progressRef, reducedMotion = false }: ParticleFieldProps) {
  const [count, setCount] = useState(2200);
  const pointsRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);

  useEffect(() => {
    const updateQuality = () => {
      const nav = navigator as Navigator & { deviceMemory?: number };
      const isSmallScreen = window.innerWidth < 760;
      const isLowPower = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4;
      setCount(isSmallScreen || isLowPower ? 950 : 2200);
    };

    updateQuality();
    window.addEventListener('resize', updateQuality);
    return () => window.removeEventListener('resize', updateQuality);
  }, []);

  const particleData = useMemo(() => createParticleData(count), [count]);

  useEffect(() => () => particleData.geometry.dispose(), [particleData]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const progress = clamp01(progressRef.current);
    const formation = smoothstep(0.27, 0.72, progress);
    const pulse = Math.max(0, 1 - Math.abs(progress - 0.78) / 0.08);
    const material = points.material;

    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uFormation.value = formation;
    material.uniforms.uPulse.value = pulse;
    material.uniforms.uReducedMotion.value = reducedMotion ? 1 : 0;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <primitive object={particleData.geometry} attach="geometry" />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uFormation: { value: 0 },
          uPulse: { value: 0 },
          uReducedMotion: { value: reducedMotion ? 1 : 0 },
        }}
        vertexShader={`
          uniform float uTime;
          uniform float uFormation;
          uniform float uPulse;
          uniform float uReducedMotion;
          attribute vec3 aTarget;
          attribute vec3 aRandom;
          varying float vFormation;
          varying float vPulse;

          void main() {
            float safeTime = mix(uTime, 0.0, uReducedMotion);
            float spin = safeTime * 0.22 + aRandom.x * 6.2831;
            float radius = 2.2 + (aRandom.y + 1.0) * 2.05;
            vec3 orbit = vec3(
              cos(spin) * radius,
              sin(spin * 1.13) * radius * 0.52,
              sin(spin) * radius - 2.0
            );
            vec3 drift = vec3(
              sin(safeTime * 0.42 + aRandom.x * 8.0) * 0.16,
              cos(safeTime * 0.31 + aRandom.y * 7.0) * 0.13,
              sin(safeTime * 0.27 + aRandom.z * 9.0) * 0.12
            );
            vec3 formed = mix(position + drift + orbit * 0.16, aTarget, uFormation);
            formed += normalize(formed + vec3(0.001)) * uPulse * 0.42;
            formed += aRandom * (1.0 - uFormation) * 0.12;

            vec4 mvPosition = modelViewMatrix * vec4(formed, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            float baseSize = mix(1.2, 2.35, uFormation);
            gl_PointSize = baseSize * (1.0 + uPulse * 1.8) * (74.0 / max(1.0, -mvPosition.z));
          }
        `}
        fragmentShader={`
          varying float vFormation;
          varying float vPulse;

          void main() {
            vec2 centered = gl_PointCoord - vec2(0.5);
            float distanceFromCenter = length(centered);
            float softCircle = smoothstep(0.5, 0.06, distanceFromCenter);
            vec3 voidColor = vec3(0.18, 0.55, 1.0);
            vec3 formedColor = vec3(0.55, 0.95, 1.0);
            vec3 color = mix(voidColor, formedColor, vFormation);
            float brightness = 0.7 + vFormation * 0.75 + vPulse * 1.6;
            gl_FragColor = vec4(color * brightness, softCircle * (0.58 + vFormation * 0.3));
          }
        `}
      />
    </points>
  );
}
