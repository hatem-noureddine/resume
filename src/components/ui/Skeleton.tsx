"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: "box" | "text" | "circle";
}

export function Skeleton({
    className,
    width,
    height,
    variant = "box"
}: SkeletonProps) {
    return (
        <div
            className={cn(
                "skeleton-box",
                variant === "text" && "skeleton-text",
                variant === "circle" && "skeleton-circle",
                className
            )}
            style={{
                width: width || "100%",
                height: height || (variant === "text" ? "1em" : "100%")
            }}
            aria-hidden="true"
        />
    );
}

interface ImageWithSkeletonProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    imageClassName?: string;
    fill?: boolean;
    priority?: boolean;
}

export function ImageWithSkeleton({
    src,
    alt,
    width,
    height,
    className,
    imageClassName,
    fill,
    priority
}: ImageWithSkeletonProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const NextImage = require("next/image").default;

    return (
        <div className={cn("relative", className)}>
            {!loaded && !error && (
                <div
                    className="absolute inset-0 skeleton-box"
                    style={{ borderRadius: "inherit" }}
                />
            )}
            <NextImage
                src={src}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                priority={priority}
                className={cn(
                    imageClassName,
                    !loaded && "opacity-0",
                    loaded && "opacity-100 transition-opacity duration-300"
                )}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
            />
        </div>
    );
}
