"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function cameraRig() {
    const t = useRef(0);

    useFrame(({ camera }) => {
        t.current += 0.002;

        camera.position.x = Math.sin(t.current) * 0.6;
        camera.position.y = Math.cos(t.current * 0.7) * 0.3;
        camera.position.z = 5 + Math.sin(t.current * 0.5) * 0.2;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    });
    return null;
}