"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function CameraRig() {
  const t = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(({ camera, mouse: pointer }) => {
    t.current += 0.002;

    mouse.current.x = THREE.MathUtils.lerp(
      mouse.current.x,
      pointer.x,
      0.05
    );

    mouse.current.y = THREE.MathUtils.lerp(
      mouse.current.y,
      pointer.y,
      0.05
    );

    camera.position.x =
      Math.sin(t.current) * 0.6 + mouse.current.x * 0.4;

    camera.position.y =
      Math.cos(t.current * 0.7) * 0.3 + mouse.current.y * 0.3;

    camera.position.z =
      5 + Math.sin(t.current * 0.5) * 0.2;

    camera.lookAt(new THREE.Vector3(0, 0, 0));
  });

  return null;
}