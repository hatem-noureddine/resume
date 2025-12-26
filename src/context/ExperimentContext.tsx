"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { track } from '@vercel/analytics';

interface ExperimentAssignments {
    [experimentId: string]: string; // experimentId -> variantId
}

interface ExperimentContextType {
    assignments: ExperimentAssignments;
    getVariant: (experimentId: string, variants: string[]) => string;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

const STORAGE_KEY = 'experiment-assignments';

export function ExperimentProvider({ children }: { readonly children: React.ReactNode }) {
    const [assignments, setAssignments] = useState<ExperimentAssignments>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load assignments from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setAssignments(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load experiment assignments', e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Persist assignments when they change
    useEffect(() => {
        if (!isLoaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
        } catch (e) {
            console.error('Failed to save experiment assignments', e);
        }
    }, [assignments, isLoaded]);

    const getVariant = useCallback((experimentId: string, variants: string[]): string => {
        if (variants.length === 0) return 'control';

        // Return existing assignment if available
        if (assignments[experimentId] && variants.includes(assignments[experimentId])) {
            return assignments[experimentId];
        }

        // Assign new variant (simple uniform random distribution)
        const randomIndex = Math.floor(Math.random() * variants.length);
        const newVariant = variants[randomIndex];

        setAssignments(prev => {
            const next = { ...prev, [experimentId]: newVariant };
            // Persist immediately to avoid race conditions in same render cycle
            // (though useEffect handles the main storage)
            return next;
        });

        // Track exposure
        track('experiment_exposure', {
            experiment_id: experimentId,
            variant_id: newVariant,
        });

        return newVariant;
    }, [assignments]);

    const value = useMemo(() => ({ assignments, getVariant }), [assignments, getVariant]);

    return (
        <ExperimentContext.Provider value={value}>
            {children}
        </ExperimentContext.Provider>
    );
}

export function useExperiment() {
    const context = useContext(ExperimentContext);
    if (context === undefined) {
        throw new Error('useExperiment must be used within an ExperimentProvider');
    }
    return context;
}
