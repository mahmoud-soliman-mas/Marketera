"use client";

import { Canvas  , useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import { PointLight } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CameraRig from "./camerarig";
import LogoParticles from "./effects/LogoParticles";

function OrbitRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (ring1.current) {
      ring1.current.rotation.x = Math.sin(t * 0.5) * 0.3;
      ring1.current.rotation.y = t * 0.4;
    }

    if (ring2.current) {
      ring2.current.rotation.x = t * 0.3;
      ring2.current.rotation.z = t * 0.5;
    }
  });

  return (
    <>
      <mesh ref={ring1}>
        <torusGeometry args={[0.8, 0.008, 32, 128]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={5}
        />
      </mesh>

      <mesh ref={ring2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.1, 0.006, 32, 128]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={4}
        />
      </mesh>
    </>
  );
}

function FloatingParticles() {
    const particles = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if(!particles.current) return;
        const t =clock.getElapsedTime();

        particles.current.rotation.y = t * 0.15;
        particles.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    });

    const points = Array.from({ length: 80 }, (_, i) => {
        const angle = (i / 80) * Math.PI * 2;
        const radius = 1.5 + Math.random() * 1.5;

        return [
            Math.cos(angle) * radius , (Math.random() - 0.5) * 1.5,
            Math.sin(angle) * radius,
        ];
    });

    return (
        <group ref={particles}>
            {points.map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]}>
                    <sphereGeometry args={[0.015, 8, 8]} />
                    <meshStandardMaterial
                        color="#60a5fa"
                        emissive="#3b82f6"
                        emissiveIntensity={3}
                    />
                </mesh>
            ))}
        </group>
    );
}


function CoreLight() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
      if (!meshRef.current) return;

      const t = clock.getElapsedTime();

      const scale = 1 + Math.sin(t * 2) * 0.12;
      meshRef.current.scale.set(scale, scale, scale);
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.4, 64, 64]} />
            <meshStandardMaterial 
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={5}/>
        </mesh>
    );
}

export default function IntroScene() {
  return (
    <Canvas
      style={{
        position: "absolute",
        inset: 0,
      }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={1} />

      <pointLight
        position={[0, 0, 0]}
        intensity={25}
        color="3b82f6" />

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        fade
      />

        <LogoParticles />

        <CoreLight /> 

        <OrbitRings />

        <FloatingParticles/>

        <CameraRig />

        <EffectComposer>
            <Bloom
            intensity={2}
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
            />
        </EffectComposer> 
    </Canvas>
  );
}