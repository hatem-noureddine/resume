"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useExperiment } from '@/context/ExperimentContext';

interface ExperimentProps {
    id: string;
    variants: { [key: string]: ReactNode };
    fallback?: ReactNode;
}

/**
 * Renders a specific variant of an experiment based on random assignment.
 * 
 * Usage:
 * ```tsx
 * <Experiment 
 *   id="new-hero-design"
 *   variants={{
 *     control: <HeroOld />,
 *     variantB: <HeroNew />
 *   }}
 * />
 * ```
 */
export function Experiment({ id, variants, fallback = null }: Readonly<ExperimentProps>) {
    const { getVariant } = useExperiment();
    const [variant, setVariant] = useState<string | null>(null);

    useEffect(() => {
        const assignedVariant = getVariant(id, Object.keys(variants));
        // eslint-disable-next-line
        setVariant(assignedVariant);
    }, [id, variants, getVariant]);

    if (!variant) {
        return <>{fallback}</>;
    }

    return <>{variants[variant]}</>;
}
