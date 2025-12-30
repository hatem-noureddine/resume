"use client";

import carouselData from "@/data/carousels.json";

export function ClientCarousel() {
    return (
        <div className="w-full overflow-hidden relative group">
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent z-10" />

            <div className="flex gap-16 animate-infinite-scroll-reverse py-4 hover:pause">
                {[...carouselData.clients, ...carouselData.clients, ...carouselData.clients].map((client, index) => (
                    <div key={`${client.name}-${index}`} className="flex items-center gap-3 group/item min-w-max px-4 py-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                        <div
                            className="text-secondary-foreground group-hover/item:text-primary transition-colors duration-300 w-8 h-8 bg-current"
                            style={{
                                maskImage: `url(${client.icon})`,
                                maskSize: "contain",
                                maskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskImage: `url(${client.icon})`,
                                WebkitMaskSize: "contain",
                                WebkitMaskRepeat: "no-repeat",
                                WebkitMaskPosition: "center"
                            }}
                        />
                        <span className="text-xl font-bold font-outfit text-secondary-foreground group-hover/item:text-foreground transition-colors duration-300">
                            {client.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
