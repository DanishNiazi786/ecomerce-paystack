"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const bannerImages = [
    {
        src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
        title: "Elevate Your Lifestyle",
        description: "Discover the latest trends in fashion, electronics, and more.",
    },
    {
        src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        title: "Fashion Forward",
        description: "Explore our new collection of premium clothing.",
    },
    {
        src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
        title: "Tech Essentials",
        description: "Upgrade your gear with the latest gadgets.",
    },
];

export default function HeroCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 6000, stopOnInteraction: false })
    );

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black">
            <Carousel
                plugins={[plugin.current]}
                className="w-full h-full"
            >
                <CarouselContent className="h-full ml-0">
                    {bannerImages.map((image, index) => (
                        <CarouselItem key={index} className="relative h-full w-full pl-0">
                            <div className="absolute inset-0">
                                <Image
                                    src={image.src}
                                    alt={image.title}
                                    fill
                                    className="object-cover opacity-70 scale-105 animate-in fade-in zoom-in duration-1000"
                                    priority={index === 0}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>

                            <div className="container relative z-10 flex h-full flex-col justify-center items-center text-center space-y-8">
                                <div className="glass p-6 md:p-10 rounded-2xl max-w-2xl animate-fade-up backdrop-blur-md border-white/10">
                                    <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl lg:text-8xl text-white mb-6">
                                        {image.title}
                                    </h1>
                                    <p className="max-w-2xl mx-auto text-lg text-gray-200 sm:text-xl font-light tracking-wide mb-8">
                                        {image.description}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button
                                            size="lg"
                                            className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105"
                                        >
                                            Shop Collection
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="h-14 px-8 text-lg rounded-full bg-white/10 border-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
                                        >
                                            View Lookbook
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {bannerImages.map((_, index) => (
                        <div
                            key={index}
                            className="w-2 h-2 rounded-full bg-white/50 transition-all hover:bg-white hover:scale-125 cursor-pointer"
                        />
                    ))}
                </div>

                <CarouselPrevious className="left-8 h-12 w-12 border-white/10 bg-black/20 text-white hover:bg-black/40 backdrop-blur-md" />
                <CarouselNext className="right-8 h-12 w-12 border-white/10 bg-black/20 text-white hover:bg-black/40 backdrop-blur-md" />
            </Carousel>
        </section>
    );
}
