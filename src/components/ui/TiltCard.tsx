"use client";

import { useRef, useState, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    tiltAmount?: number;
    glareEffect?: boolean;
}

export function TiltCard({
    children,
    className,
    tiltAmount = 10,
    glareEffect = false
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState({
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: "transform 0.1s ease"
    });
    const [glareStyle, setGlareStyle] = useState({
        background: "transparent",
        opacity: 0
    });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -tiltAmount;
        const rotateY = ((x - centerX) / centerX) * tiltAmount;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
            transition: "transform 0.1s ease"
        });

        if (glareEffect) {
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            setGlareStyle({
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
                opacity: 1
            });
        }
    }, [tiltAmount, glareEffect]);

    const handleMouseLeave = useCallback(() => {
        setStyle({
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
            transition: "transform 0.3s ease"
        });
        setGlareStyle({
            background: "transparent",
            opacity: 0
        });
    }, []);

    return (
        <div
            ref={cardRef}
            className={cn("relative", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                ...style,
                transformStyle: "preserve-3d"
            }}
        >
            {children}
            {glareEffect && (
                <div
                    className="absolute inset-0 pointer-events-none rounded-inherit"
                    style={{
                        ...glareStyle,
                        transition: "opacity 0.3s ease",
                        borderRadius: "inherit"
                    }}
                />
            )}
        </div>
    );
}
