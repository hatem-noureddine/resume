"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

import { ScrollProgress } from "@/components/ui/ScrollProgress";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <>
            <ScrollProgress />
            <motion.div
                key={pathname}
                initial={prefersReducedMotion ? false : { opacity: 0.9 }}
                animate={{ opacity: 1 }}
                transition={{
                    type: "tween",
                    ease: "easeOut",
                    duration: 0.1
                }}
                className="w-full"
            >
                {children}
            </motion.div>
        </>
    );
}
