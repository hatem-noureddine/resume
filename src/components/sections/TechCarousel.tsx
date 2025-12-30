"use client";

import carouselData from "@/data/carousels.json";



export function TechCarousel() {
    return (
        <div className="w-full overflow-hidden relative group">
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent z-10" />

            <div className="flex gap-16 animate-infinite-scroll py-4 hover:pause">
                {[...carouselData.techs, ...carouselData.techs, ...carouselData.techs].map((tech, index) => (
                    <div key={`${tech.name}-${index}`} className="flex items-center gap-3 group/item min-w-max px-4 py-2 rounded-xl hover:bg-foreground/5 transition-colors duration-300">
                        <div
                            className="text-secondary-foreground group-hover/item:text-primary transition-colors duration-300 scale-110 w-8 h-8 bg-current"
                            style={{
                                maskImage: `url(${tech.icon})`,
                                maskSize: "contain",
                                maskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskImage: `url(${tech.icon})`,
                                WebkitMaskSize: "contain",
                                WebkitMaskRepeat: "no-repeat",
                                WebkitMaskPosition: "center"
                            }}
                        />
                        <span className="text-lg font-bold font-outfit text-secondary-foreground group-hover/item:text-foreground transition-colors duration-300">
                            {tech.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
