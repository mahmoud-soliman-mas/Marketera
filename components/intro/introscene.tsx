"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { PointLight } from "three";

function CoreLight() {
  return (
    <mesh>
      <sphereGeometry args={[0.4, 64, 64]} />
      <meshStandardMaterial
      color="#3b82f6"
      emissive="#3b82f6"
      emissiveIntensity={5}
      />
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
    </Canvas>
  );
}