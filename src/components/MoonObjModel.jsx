import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

function MoonOBJModel(props) {
  const obj = useLoader(OBJLoader, "/model/moon.obj"); // Put your OBJ file in public folder

  // Optional: apply material to all meshes in the loaded model for better lighting
  useEffect(() => {
  if (!obj) return;
  obj.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: "#888888",
        roughness: 1,
        metalness: 0,
      });
    }
  });
}, [obj]);


  return <primitive object={obj} {...props} />;
}

export default function WaningCrescentMoonViewer() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      {/* Ambient light so dark side isn't pitch black */}
      <ambientLight intensity={0.15} />
      {/* Directional light from right simulating the Sun for waning crescent */}
      <directionalLight position={[5, 0, 0]} intensity={1} />
      {/* Load and show Moon OBJ model */}
      <MoonOBJModel scale={1.5} />
      {/* Controls for user interaction */}
      <OrbitControls />
    </Canvas>
  );
}
