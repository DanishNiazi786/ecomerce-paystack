"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, ShoppingCart, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function WishlistPage() {
    const { items, removeItem } = useWishlistStore();
    const { addItem } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleMoveToCart = (item: any) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            slug: item.slug,
        });
        removeItem(item.id);
        toast.success(`${item.name} moved to cart`);
    };

    const handleRemove = (item: any) => {
        removeItem(item.id);
        toast.success(`${item.name} removed from wishlist`);
    };

    const handleShare = async () => {
        const shareData = {
            title: "My Wishlist",
            text: `Check out my wishlist with ${items.length} items!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Wishlist link copied to clipboard!");
            }
        } catch (error) {
            // User cancelled or error occurred
        }
    };

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                    <p className="text-muted-foreground">Save items you love for later</p>
                </div>
                <Card>
                    <CardContent className="text-center py-12">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                        <Link href="/">
                            <Button>Start Shopping</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                    <p className="text-muted-foreground">
                        {items.length} {items.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
                <Button onClick={handleShare} variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Wishlist
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <Link href={`/product/${item.slug}`}>
                            <div className="relative aspect-square w-full">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </Link>
                        <CardContent className="p-4">
                            <Link href={`/product/${item.slug}`}>
                                <h3 className="font-semibold mb-2 hover:underline line-clamp-2">
                                    {item.name}
                                </h3>
                            </Link>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-bold">
                                    KSh {item.price.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleMoveToCart(item)}
                                    className="flex-1"
                                    size="sm"
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                                <Button
                                    onClick={() => handleRemove(item)}
                                    variant="outline"
                                    size="icon"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

