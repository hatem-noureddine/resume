"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
}

interface ParticleBackgroundProps {
    readonly className?: string;
    readonly particleCount?: number;
    readonly color?: string;
    readonly maxSpeed?: number;
    readonly connectionDistance?: number;
    readonly interactive?: boolean;
}

/**
 * Subtle interactive particle background effect.
 * Particles float and connect when near each other. Mouse interaction adds attraction.
 * Respects prefers-reduced-motion for accessibility.
 * 
 * Usage:
 * ```tsx
 * <ParticleBackground className="absolute inset-0" />
 * ```
 */
export function ParticleBackground({
    className = "",
    particleCount = 50,
    color = "var(--color-primary)",
    maxSpeed = 0.5,
    connectionDistance = 120,
    interactive = true,
}: ParticleBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const animationRef = useRef<number>(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    // Initialize particles
    const initParticles = useCallback((width: number, height: number) => {
        const particles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * maxSpeed,
                vy: (Math.random() - 0.5) * maxSpeed,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
        particlesRef.current = particles;
    }, [particleCount, maxSpeed]);

    // Animation loop
    const animateCallbackRef = useRef<() => void>(undefined);

    // Animation loop
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        const particles = particlesRef.current;
        const mouse = mouseRef.current;

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Mouse attraction (subtle)
            if (interactive && mouse.active) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (200 - dist) / 200 * 0.02;
                    p.vx += dx * force * 0.01;
                    p.vy += dy * force * 0.01;
                }
            }

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Boundary wrapping
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Damping
            p.vx *= 0.999;
            p.vy *= 0.999;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = (1 - dist / connectionDistance) * 0.2;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = 1;
        animationRef.current = requestAnimationFrame(() => animateCallbackRef.current?.());
    }, [color, connectionDistance, interactive]);

    useEffect(() => {
        animateCallbackRef.current = animate;
    }, [animate]);

    // Handle resize
    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        const dpr = globalThis.devicePixelRatio || 1;
        const rect = parent.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.scale(dpr, dpr);
        }

        initParticles(rect.width, rect.height);
    }, [initParticles]);

    // Handle mouse move
    const handleMouseMove = useCallback((e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            active: true,
        };
    }, []);

    const handleMouseLeave = useCallback(() => {
        mouseRef.current.active = false;
    }, []);

    useEffect(() => {
        if (prefersReducedMotion) return;

        handleResize();

        const canvas = canvasRef.current;
        if (canvas && interactive) {
            canvas.addEventListener("mousemove", handleMouseMove);
            canvas.addEventListener("mouseleave", handleMouseLeave);
        }

        globalThis.addEventListener("resize", handleResize);
        animationRef.current = requestAnimationFrame(() => animateCallbackRef.current?.());

        return () => {
            globalThis.removeEventListener("resize", handleResize);
            if (canvas && interactive) {
                canvas.removeEventListener("mousemove", handleMouseMove);
                canvas.removeEventListener("mouseleave", handleMouseLeave);
            }
            cancelAnimationFrame(animationRef.current);
        };
    }, [prefersReducedMotion, handleResize, handleMouseMove, handleMouseLeave, interactive]);

    // Don't render if reduced motion is preferred
    if (prefersReducedMotion) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-auto ${className}`}
            aria-hidden="true"
        />
    );
}
