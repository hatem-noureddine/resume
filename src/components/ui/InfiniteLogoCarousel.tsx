'use client';

interface CarouselItem {
    name: string;
    icon: string;
}

interface InfiniteLogoCarouselProps {
    items: CarouselItem[];
    duration?: string;
    pauseOnHover?: boolean;
    className?: string;
}

export function InfiniteLogoCarousel({
    items,
    duration = '20s',
    pauseOnHover = true,
    className = ""
}: Readonly<InfiniteLogoCarouselProps>) {
    return (
        <div className={`w-full overflow-hidden relative group ${className}`}>
            <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

            <div
                className={`flex w-max animate-infinite-scroll-half ${pauseOnHover ? 'hover:pause' : ''} group`}
                style={{ animationDuration: duration }}
            >
                {/* First list */}
                <div className="flex gap-8 md:gap-16 pr-8 md:pr-16 bg-background shrink-0">
                    {items.map((item, index) => (
                        <button
                            type="button"
                            key={`${item.name}-${index}`}
                            className="flex items-center gap-3 group/item min-w-max px-4 py-2 hover:bg-foreground/5 rounded-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <img
                                src={item.icon}
                                alt={`${item.name} icon`}
                                className="w-8 h-8 object-contain opacity-50 grayscale dark:invert group-hover/item:grayscale-0 group-hover/item:opacity-100 group-hover/item:dark:invert-0 group-focus-visible/item:grayscale-0 group-focus-visible/item:opacity-100 group-focus-visible/item:dark:invert-0 transition-all duration-300"
                                loading="lazy"
                            />
                            <span className="text-xl font-bold font-outfit text-secondary-foreground group-hover/item:text-transparent group-hover/item:bg-clip-text group-hover/item:bg-linear-to-r group-hover/item:from-primary group-hover/item:to-purple-500 group-focus-visible/item:text-transparent group-focus-visible/item:bg-clip-text group-focus-visible/item:bg-linear-to-r group-focus-visible/item:from-primary group-focus-visible/item:to-purple-500 transition-all duration-300">
                                {item.name}
                            </span>
                        </button>
                    ))}
                </div>
                {/* Second list (duplicate for seamless loop) */}
                <div className="flex gap-8 md:gap-16 pr-8 md:pr-16 bg-background shrink-0" aria-hidden="true">
                    {items.map((item, index) => (
                        <button
                            type="button"
                            key={`${item.name}-duplicate-${index}`}
                            className="flex items-center gap-3 group/item min-w-max px-4 py-2 hover:bg-foreground/5 rounded-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <img
                                src={item.icon}
                                alt={`${item.name} icon`}
                                className="w-8 h-8 object-contain opacity-50 grayscale dark:invert group-hover/item:grayscale-0 group-hover/item:opacity-100 group-hover/item:dark:invert-0 group-focus-visible/item:grayscale-0 group-focus-visible/item:opacity-100 group-focus-visible/item:dark:invert-0 transition-all duration-300"
                                loading="lazy"
                            />
                            <span className="text-xl font-bold font-outfit text-secondary-foreground group-hover/item:text-transparent group-hover/item:bg-clip-text group-hover/item:bg-linear-to-r group-hover/item:from-primary group-hover/item:to-purple-500 group-focus-visible/item:text-transparent group-focus-visible/item:bg-clip-text group-focus-visible/item:bg-linear-to-r group-focus-visible/item:from-primary group-focus-visible/item:to-purple-500 transition-all duration-300">
                                {item.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
