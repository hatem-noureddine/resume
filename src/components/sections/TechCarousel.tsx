"use client";

import carouselData from "@/data/carousels.json";
import { useFeatureFlags } from "@/context/FeatureFlags";
import { InfiniteLogoCarousel } from "@/components/ui/InfiniteLogoCarousel";

export function TechCarousel() {
    const { isEnabled } = useFeatureFlags();
    const duration = `${carouselData.techs.length * 2}s`;

    if (!isEnabled('showTechCarousel')) {
        return null;
    }

    return (
        <InfiniteLogoCarousel
            items={carouselData.techs}
            duration={duration}
            className="animate-infinite-scroll-half"
        />
    );
}
