"use client";

import { Canvas } from "@react-three/fiber";
import { Stars , Float , OrbitControls } from "@react-three/drei";

function CoreLight () {
    return (
        <Float speed={2} rotationIntensity={1}>
            <mesh>
                <sphereGeometry args={[0.5, 64, 64]} />
                <meshStandardMaterial 
                color ="#3b82f6"
                emissive ="#3b82f6"
                emissiveIntensity={6} />
            </mesh>
        </Float> 
    );
}

export default function Introscene () {
    return (
        <Canvas camera ={{ position: [0,0, 6], fov: 45}}>
            <color attach="background" args={["#020617"]} />

            <ambientLight intensity={0.4} />

            <pointLight 
            position={[0, 0, 0]}
            intensity={40}
            color="#3b82f6" />

            <Stars 
            radius={100}
            depth={50}
            count={6000}
            factor={5}
            saturation={0}
            fade
            speed={1} />

            <CoreLight />

            <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.2}
            />
        </Canvas>
    );
}
