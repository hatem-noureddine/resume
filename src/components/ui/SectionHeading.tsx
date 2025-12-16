"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    subtitle: string;
    className?: string;
    align?: "left" | "center";
}

export function SectionHeading({ title, subtitle, className, align = "center" }: SectionHeadingProps) {
    return (
        <div className={cn("mb-12", align === "center" ? "text-center" : "text-left", className)}>
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="block text-primary font-bold uppercase tracking-wider text-sm mb-2"
            >
                {subtitle}
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold font-outfit"
            >
                {title}
            </motion.h2>
        </div>
    );
}
