"use client";

import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();
    const { toast } = useToast();

    const isWishlisted = isInWishlist(product._id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
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

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
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
        <Link href={`/product/${product.slug}`}>
            <div className="group relative rounded-xl transition-all duration-300 hover:-translate-y-2">
                {/* Gradient Border Effect */}
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-sm" />

                <Card className="relative h-full overflow-hidden rounded-xl border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl dark:bg-card/40">
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                        {product.images && product.images.length > 0 ? (
                            <>
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className={cn(
                                        "object-cover transition-all duration-700",
                                        product.images.length > 1 ? "group-hover:opacity-0" : "group-hover:scale-110"
                                    )}
                                />
                                {product.images.length > 1 && (
                                    <Image
                                        src={product.images[1]}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="absolute inset-0 object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
                                    />
                                )}
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center bg-secondary">
                                <span className="text-muted-foreground">No Image</span>
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute left-3 top-3 flex flex-col gap-2 z-10">
                            {product.discountPrice && (
                                <Badge className="bg-red-500/90 hover:bg-red-600 backdrop-blur-md border-0">Sale</Badge>
                            )}
                            {product.isNewArrival && (
                                <Badge className="bg-cyan-500/90 hover:bg-cyan-600 backdrop-blur-md border-0">New</Badge>
                            )}
                        </div>

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-20 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex gap-2 justify-center">
                                <Button
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-white text-black hover:bg-white/90 hover:scale-110 transition-all"
                                    onClick={handleToggleWishlist}
                                >
                                    <Heart className={cn("h-5 w-5", isWishlisted && "fill-red-500 text-red-500")} />
                                </Button>
                                <Button
                                    className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border-0 shadow-lg"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" /> Quick Add
                                </Button>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-5">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {product.category}
                            </p>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-violet-500">★ {product.rating}</span>
                            </div>
                        </div>
                        <h3 className="line-clamp-1 text-lg font-bold tracking-tight group-hover:text-violet-500 transition-colors">
                            {product.name}
                        </h3>
                        <div className="mt-3 flex items-baseline gap-2">
                            {product.discountPrice ? (
                                <>
                                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                                        ${product.discountPrice}
                                    </span>
                                    <span className="text-sm text-muted-foreground line-through decoration-red-500/50">
                                        ${product.price}
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl font-bold">${product.price}</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Link>
    );
}
