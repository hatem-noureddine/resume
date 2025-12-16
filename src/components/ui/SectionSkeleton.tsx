"use client";

import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Generic section skeleton with header and grid.
 * Used as fallback for Services, Blog, etc.
 */
export function SectionSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="flex flex-col items-center mb-12">
                <Skeleton className="h-4 w-24 mb-4 rounded-full" />
                <Skeleton className="h-10 w-64 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 w-full rounded-2xl bg-secondary/20 p-6 flex flex-col space-y-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-6 w-3/4 rounded" />
                        <Skeleton className="h-20 w-full rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Specialized skeleton for the Portfolio section.
 * Include category filter bar simulation.
 */
export function PortfolioSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="flex flex-col items-center mb-12">
                <Skeleton className="h-4 w-24 mb-4 rounded-full" />
                <Skeleton className="h-10 w-64 rounded-lg" />
            </div>

            <div className="flex gap-4 mb-8 overflow-hidden">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                ))}
            </div>
        </div>
    );
}

/**
 * Specialized skeleton for the Experience section.
 * Mimics: Left timeline (desktop) / Stacked timeline (mobile) + Details pane.
 */
export function ExperienceSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="flex flex-col items-center mb-12">
                <Skeleton className="h-4 w-24 mb-4 rounded-full" />
                <Skeleton className="h-10 w-64 rounded-lg" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 max-w-6xl mx-auto">
                {/* Timeline List */}
                <div className="hidden md:flex flex-col gap-4 w-1/3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 rounded-xl bg-secondary/20 p-4 flex flex-col justify-center space-y-2">
                            <Skeleton className="h-4 w-1/2 rounded" />
                            <Skeleton className="h-3 w-1/3 rounded" />
                        </div>
                    ))}
                </div>

                {/* Mobile List */}
                <div className="flex md:hidden flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-xl bg-secondary/20 p-4 w-full flex flex-col justify-center space-y-2">
                            <Skeleton className="h-4 w-1/2 rounded" />
                            <Skeleton className="h-3 w-1/3 rounded" />
                        </div>
                    ))}
                </div>

                {/* Detail View */}
                <div className="hidden md:block w-2/3 h-[400px] rounded-2xl bg-secondary/20 p-8">
                    <div className="flex gap-4 mb-6">
                        <Skeleton className="h-16 w-16 rounded-xl" />
                        <div className="space-y-2 flex-1 pt-2">
                            <Skeleton className="h-6 w-1/2 rounded" />
                            <Skeleton className="h-4 w-1/3 rounded" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-full rounded mb-2" />
                    <Skeleton className="h-4 w-full rounded mb-2" />
                    <Skeleton className="h-4 w-3/4 rounded mb-6" />

                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-14 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Specialized skeleton for the Skills section.
 * Mimics: Professional list (left) + Technical tag cloud (right).
 */
export function SkillsSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="flex flex-col items-center mb-12">
                <Skeleton className="h-4 w-24 mb-4 rounded-full" />
                <Skeleton className="h-10 w-64 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                {/* Left Col */}
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48 rounded mb-6" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-xl" />
                    ))}
                </div>
                {/* Right Col */}
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48 rounded mb-6" />
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <Skeleton key={i} className="h-8 w-24 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
