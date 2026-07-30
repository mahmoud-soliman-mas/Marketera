"use client";

import { Canvas  , useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import { PointLight } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CameraRig from "./camerarig";

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

        <CoreLight />    

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