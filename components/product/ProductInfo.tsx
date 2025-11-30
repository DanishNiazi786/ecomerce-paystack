"use client";

import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Share2, Star } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductInfoProps {
    product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();
    const { toast } = useToast();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const isWishlisted = isInWishlist(product._id);

    const handleAddToCart = () => {
        addItem({
            id: product._id,
            name: product.name,
            price: product.discountPrice || product.price,
            image: product.images[0],
            quantity: 1,
            slug: product.slug,
        });
        toast({
            title: "Added to cart",
            description: `${product.name} added to your cart.`,
            className: "glass border-violet-500/20",
        });
    };

    const handleToggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist({
                id: product._id,
                name: product.name,
                price: product.discountPrice || product.price,
                image: product.images[0],
                slug: product.slug,
            });
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-up">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="border-violet-500/50 text-violet-500">
                        {product.category}
                    </Badge>
                    {product.isNewArrival && (
                        <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 hover:bg-cyan-500/20">
                            New Arrival
                        </Badge>
                    )}
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">{product.name}</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "h-5 w-5",
                                    star <= Math.round(Number(product.rating))
                                        ? "fill-violet-500 text-violet-500"
                                        : "fill-muted text-muted"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        ({product.numReviews} reviews)
                    </span>
                </div>
            </div>

            <div className="flex items-baseline gap-4">
                {product.discountPrice ? (
                    <>
                        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                            KSh {product.discountPrice.toLocaleString()}
                        </span>
                        <span className="text-xl text-muted-foreground line-through decoration-red-500/50">
                            KSh {product.price.toLocaleString()}
                        </span>
                    </>
                ) : (
                    <span className="text-4xl font-bold">KSh {product.price.toLocaleString()}</span>
                )}
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">
                    {product.description}
                </p>
            </div>

            {/* Variants */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <span className="text-sm font-medium">Color</span>
                    <div className="flex gap-3">
                        {['Black', 'White', 'Blue'].map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "h-8 w-8 rounded-full border-2 transition-all duration-300 hover:scale-110",
                                    selectedColor === color
                                        ? "border-violet-500 ring-2 ring-violet-500/20 scale-110"
                                        : "border-transparent ring-1 ring-border"
                                )}
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <span className="text-sm font-medium">Size</span>
                    <div className="flex gap-3">
                        {['S', 'M', 'L', 'XL'].map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "h-10 w-10 rounded-lg border transition-all duration-300 hover:border-violet-500 hover:text-violet-500",
                                    selectedSize === size
                                        ? "bg-violet-500 text-white border-violet-500"
                                        : "bg-background border-input"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
                <Button
                    size="lg"
                    className="flex-1 h-14 text-lg rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02]"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-14 rounded-full border-input hover:bg-secondary hover:text-red-500 hover:border-red-500/20 transition-all"
                    onClick={handleToggleWishlist}
                >
                    <Heart className={cn("h-6 w-6", isWishlisted && "fill-current")} />
                </Button>
                <Button
                    size="lg"
                    variant="ghost"
                    className="h-14 w-14 rounded-full hover:bg-secondary transition-all"
                >
                    <Share2 className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
