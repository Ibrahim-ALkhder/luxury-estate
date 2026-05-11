import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Shape() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={2}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.1}
          anisotropy={0.2}
          iridescence={1}
          iridescenceIOR={1}
          color="#d4af37"
          envMapIntensity={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.3} />
      <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} />
      <Shape />
      <Environment preset="city" />
    </Canvas>
  );
}