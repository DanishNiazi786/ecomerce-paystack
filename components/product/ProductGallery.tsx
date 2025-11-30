"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-8 sticky top-24">
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={cn(
                            "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300",
                            selectedImage === image
                                ? "border-violet-500 ring-2 ring-violet-500/20"
                                : "border-transparent hover:border-violet-500/50"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 20vw, 10vw"
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted glass border-white/10">
                <Image
                    src={selectedImage}
                    alt="Product image"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-all duration-500 hover:scale-110 cursor-zoom-in"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
