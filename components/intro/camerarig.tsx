'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01, smoothstep } from './intro-constants';

interface CameraRigProps {
  progressRef?: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

export default function CameraRig({ progressRef, reducedMotion = false }: CameraRigProps) {
  const { camera } = useThree();
  const fallbackProgressRef = useRef(0);
  const timelineRef = progressRef ?? fallbackProgressRef;
  const target = useMemo(() => new THREE.Vector3(), []);
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, mouse: pointer }) => {
    const progress = clamp01(timelineRef.current);
    const time = clock.getElapsedTime();
    const approach = smoothstep(0.32, 0.92, progress);
    const activation = smoothstep(0.84, 1, progress);
    const motionFactor = reducedMotion ? 0.15 : 1;

    const pointerX = pointer.x * 0.12 * motionFactor;
    const pointerY = pointer.y * 0.08 * motionFactor;
    const cameraX = Math.sin(time * 0.19) * 0.34 * (1 - activation) * motionFactor + pointerX;
    const cameraY = Math.cos(time * 0.16) * 0.2 * (1 - activation) * motionFactor + pointerY;
    const cameraZ = THREE.MathUtils.lerp(8.8, 3.8, approach) - activation * 1.35;

    desiredPosition.set(cameraX, cameraY, cameraZ);
    camera.position.lerp(desiredPosition, 0.035);
    target.set(0, 0, -0.35 - activation * 0.12);
    camera.lookAt(target);
    camera.rotation.z = Math.sin(time * 0.22) * 0.006 * motionFactor;
  });

  return null;
}
