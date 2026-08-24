'use client';

import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01, smoothstep } from './intro-constants';

interface MarketingRobotProps {
  progressRef: React.MutableRefObject<number>;
  speaking: boolean;
  reducedMotion?: boolean;
}

export default function MarketingRobot({ progressRef, speaking, reducedMotion = false }: MarketingRobotProps) {
  const rootRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const chestRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const progress = clamp01(progressRef.current);
    const reveal = smoothstep(0.02, 0.22, progress);
    const activation = smoothstep(0.2, 0.42, progress);
    const speakingPulse = speaking ? 0.5 + Math.abs(Math.sin(time * 7.5)) * 0.5 : 0;
    const motionFactor = reducedMotion ? 0.1 : 1;

    if (!rootRef.current || !bodyRef.current || !headRef.current || !leftArmRef.current || !rightArmRef.current || !leftEyeRef.current || !rightEyeRef.current || !mouthRef.current || !chestRef.current) return;

    rootRef.current.scale.setScalar(0.72 + reveal * 0.28);
    rootRef.current.position.y = -0.72 + reveal * 0.72;
    bodyRef.current.position.y = Math.sin(time * 1.1) * 0.025 * motionFactor;
    headRef.current.rotation.y = Math.sin(time * 0.65) * 0.075 * motionFactor;
    headRef.current.rotation.z = Math.sin(time * 0.9) * 0.018 * motionFactor;
    leftArmRef.current.rotation.z = -0.08 + Math.sin(time * 0.75) * 0.03 * motionFactor;
    rightArmRef.current.rotation.z = 0.16 + (speaking ? Math.sin(time * 1.5) * 0.11 : 0) * motionFactor;
    mouthRef.current.scale.y = speaking ? 0.75 + speakingPulse * 0.55 : 0.3;
    chestRef.current.scale.setScalar(0.94 + activation * 0.08 + speakingPulse * 0.02);
    (leftEyeRef.current.material as THREE.MeshBasicMaterial).opacity = 0.48 + activation * 0.5;
    (rightEyeRef.current.material as THREE.MeshBasicMaterial).opacity = 0.48 + activation * 0.5;
  });

  return (
    <group ref={rootRef} position={[0, -0.72, 0.1]}>
      <group ref={bodyRef}>
        <mesh position={[0, -0.68, 0]}>
          <capsuleGeometry args={[0.58, 0.9, 6, 20]} />
          <meshStandardMaterial color="#142c49" emissive="#0c2844" emissiveIntensity={0.65} metalness={0.72} roughness={0.28} />
        </mesh>
        <mesh ref={chestRef} position={[0, -0.54, 0.55]}>
          <planeGeometry args={[0.52, 0.32]} />
          <meshBasicMaterial color="#0e6a91" transparent opacity={0.72} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.54, 0.57]}>
          <ringGeometry args={[0.1, 0.115, 32]} />
          <meshBasicMaterial color="#72e8ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
        <Text position={[0, -0.23, 0.58]} fontSize={0.075} color="#a2eaff" anchorX="center" anchorY="middle" letterSpacing={0.08}>
          MRK / AI
        </Text>
        <group ref={leftArmRef} position={[-0.65, -0.62, 0]}>
          <mesh rotation={[0, 0, -0.2]}>
            <capsuleGeometry args={[0.11, 0.65, 5, 12]} />
            <meshStandardMaterial color="#1c4260" emissive="#0f2f4f" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[-0.06, -0.4, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial color="#61dfff" transparent opacity={0.72} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.65, -0.6, 0]}>
          <mesh rotation={[0, 0, 0.24]}>
            <capsuleGeometry args={[0.11, 0.65, 5, 12]} />
            <meshStandardMaterial color="#1c4260" emissive="#0f2f4f" emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.06, -0.4, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial color="#61dfff" transparent opacity={0.72} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
      </group>
      <group ref={headRef} position={[0, 0.32, 0.02]}>
        <mesh>
          <icosahedronGeometry args={[0.65, 3]} />
          <meshStandardMaterial color="#274866" emissive="#102d4a" emissiveIntensity={0.75} metalness={0.68} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0.02, 0.56]} scale={[0.82, 0.46, 0.1]}>
          <sphereGeometry args={[0.58, 24, 12]} />
          <meshBasicMaterial color="#082540" transparent opacity={0.96} />
        </mesh>
        <mesh ref={leftEyeRef} position={[-0.22, 0.09, 0.64]} scale={[0.09, 0.055, 0.02]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color="#87f0ff" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.22, 0.09, 0.64]} scale={[0.09, 0.055, 0.02]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color="#87f0ff" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={mouthRef} position={[0, -0.2, 0.64]} scale={[0.1, 0.3, 0.02]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#6de5ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.71, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.26, 10]} />
          <meshStandardMaterial color="#5bd5ff" emissive="#42cfff" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.06, 14, 14]} />
          <meshBasicMaterial color="#b3f7ff" transparent opacity={0.95} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </group>
  );
}
