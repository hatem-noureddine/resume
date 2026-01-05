"use client";

import carouselData from "@/data/carousels.json";
import { useFeatureFlags } from "@/context/FeatureFlags";
import { InfiniteLogoCarousel } from "@/components/ui/InfiniteLogoCarousel";

export function ClientCarousel() {
    const { isEnabled } = useFeatureFlags();
    const duration = `${carouselData.clients.length * 2}s`;

    if (!isEnabled('showClientCarousel')) {
        return null;
    }

    return (
        <InfiniteLogoCarousel
            items={carouselData.clients}
            duration={duration}
            className="animate-infinite-scroll-half-reverse"
        />
    );
}
