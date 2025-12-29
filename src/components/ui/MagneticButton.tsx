"use client";

import { useRef, MouseEvent } from "react";
import { motion, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // How strong the pull is (default: 0.5)
}

export function MagneticButton({ children, className = "", strength = 0.5 }: Readonly<MagneticButtonProps>) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    // Physics springs for a more natural, "magnetic" feel
    const springConfig = { stiffness: 100, damping: 10, mass: 0.1 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);
    const scale = useSpring(1, { stiffness: 200, damping: 20 });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion || !ref.current) return;

        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Move the button towards the cursor
        x.set(distanceX * strength);
        y.set(distanceY * strength);
        scale.set(1.05); // Subtle grow when active
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        scale.set(1);
    };

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x, y, scale }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
