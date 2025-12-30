"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useState } from "react";
import type { Points as ThreePoints } from "three";

// Brand colors matching AnimatedBackground
const COLORS = {
    indigo: "#6366f1",
    purple: "#a855f7",
};

// Reduced particle count for better performance
const PARTICLE_COUNT = 400;
const SECONDARY_COUNT = 150;

// Generate random positions (pure function, called during initialization)
function createPositions(count: number, bounds: { x: number, y: number, z: number }): Float32Array {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * bounds.x;
        positions[i * 3 + 1] = (Math.random() - 0.5) * bounds.y;
        positions[i * 3 + 2] = (Math.random() - 0.5) * bounds.z;
    }
    return positions;
}

function createVelocities(count: number): Float32Array {
    const vels = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        vels[i * 3] = (Math.random() - 0.5) * 0.015;
        vels[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
        vels[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return vels;
}

function ParticleFlow() {
    const pointsRef = useRef<ThreePoints>(null);
    const { viewport } = useThree();
    const mouse = useRef({ x: 0, y: 0 });
    const frameCount = useRef(0);

    // Use useState with lazy initializer for positions (called once)
    const [initialPositions] = useState(() => createPositions(PARTICLE_COUNT, { x: 7, y: 4, z: 2 }));
    const [positions] = useState(() => new Float32Array(initialPositions));

    const velocitiesRef = useRef<Float32Array | null>(null);
    velocitiesRef.current ??= createVelocities(PARTICLE_COUNT);

    useFrame((state) => {
        if (!pointsRef.current || !velocitiesRef.current) return;

        // Skip every other frame for better performance
        frameCount.current++;
        if (frameCount.current % 2 !== 0) return;

        const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const time = state.clock.getElapsedTime();
        const vels = velocitiesRef.current;

        // Smooth mouse follow
        const targetX = (state.mouse.x * viewport.width) / 2;
        const targetY = (state.mouse.y * viewport.height) / 2;
        mouse.current.x += (targetX - mouse.current.x) * 0.05;
        mouse.current.y += (targetY - mouse.current.y) * 0.05;

        const mouseX = mouse.current.x;
        const mouseY = mouse.current.y;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            let x = posArray[i3];
            let y = posArray[i3 + 1];
            let z = posArray[i3 + 2];

            // Distance from mouse
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy;

            // Mouse repulsion
            if (distSq < 2.25 && distSq > 0.01) {
                const dist = Math.sqrt(distSq);
                const force = (1.5 - dist) * 0.05;
                vels[i3] += (dx / dist) * force;
                vels[i3 + 1] += (dy / dist) * force;
            }

            // Wave motion
            const wave = Math.sin(time * 0.2 + i * 0.01) * 0.002;

            // Apply velocities
            x += vels[i3] + wave;
            y += vels[i3 + 1];
            z += vels[i3 + 2];

            // Damping
            vels[i3] *= 0.94;
            vels[i3 + 1] *= 0.94;
            vels[i3 + 2] *= 0.94;

            // Reform attraction
            vels[i3] += (initialPositions[i3] - x) * 0.0008;
            vels[i3 + 1] += (initialPositions[i3 + 1] - y) * 0.0008;
            vels[i3 + 2] += (initialPositions[i3 + 2] - z) * 0.0008;

            posArray[i3] = x;
            posArray[i3 + 1] = y;
            posArray[i3 + 2] = z;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.rotation.y = time * 0.015;
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color={COLORS.indigo}
                size={0.05}
                sizeAttenuation
                depthWrite={false}
                opacity={0.75}
            />
        </Points>
    );
}

// Secondary particles (simpler, no interaction)
function SecondaryParticles() {
    const ref = useRef<ThreePoints>(null);

    // Use useState with lazy initializer
    const [positions] = useState(() => {
        const pos = createPositions(SECONDARY_COUNT, { x: 9, y: 5, z: 3 });
        // Offset Z
        for (let i = 0; i < SECONDARY_COUNT; i++) {
            pos[i * 3 + 2] -= 1.5;
        }
        return pos;
    });

    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.getElapsedTime();
            ref.current.rotation.y = t * -0.008;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color={COLORS.purple}
                size={0.035}
                sizeAttenuation
                depthWrite={false}
                opacity={0.45}
            />
        </Points>
    );
}

export function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
            >
                <ambientLight intensity={0.4} />
                <pointLight position={[4, 4, 4]} intensity={0.25} color={COLORS.indigo} />
                <pointLight position={[-4, -4, 4]} intensity={0.15} color={COLORS.purple} />

                <ParticleFlow />
                <SecondaryParticles />
            </Canvas>
        </div>
    );
}
