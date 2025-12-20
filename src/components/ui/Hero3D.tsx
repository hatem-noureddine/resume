"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";
import { useTheme } from "@/context/ThemeContext";

function AnimatedSphere({ theme }: { readonly theme: string }) {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        // Subtle rotation
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    });

    const color = theme === 'dark' ? '#38bdf8' : '#0ea5e9'; // Sky blue for both but varied intensity

    return (
        <Sphere args={[1, 100, 200]} scale={2} ref={meshRef}>
            <MeshDistortMaterial
                color={color}
                attach="material"
                distort={0.4} // Strength, 0 disables the effect (default=1)
                speed={2} // Speed (default=1)
                roughness={0.4}
                transparent
                opacity={0.3}
                wireframe={true}
            />
        </Sphere>
    );
}

export function Hero3D() {
    const { theme } = useTheme();

    return (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Float
                    speed={4} // Animation speed, defaults to 1
                    rotationIntensity={1} // XYZ rotation intensity, defaults to 1
                    floatIntensity={2} // Up/down float intensity, defaults to 1
                >
                    <AnimatedSphere theme={theme} />
                </Float>
            </Canvas>
        </div>
    );
}
