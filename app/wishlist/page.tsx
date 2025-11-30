"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function WishlistPage() {
    const { items, removeItem } = useWishlistStore();
    const addItemToCart = useCartStore((state) => state.addItem);
    const [isMounted, setIsMounted] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const handleMoveToCart = (item: any) => {
        addItemToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
            slug: item.slug,
        });
        removeItem(item.id);
        toast({
            title: "Moved to cart",
            description: `${item.name} has been moved to your cart.`,
        });
    };

    if (items.length === 0) {
        return (
            <div className="container py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
                <p className="text-muted-foreground mb-8">Save items you love for later.</p>
                <Button asChild size="lg">
                    <Link href="/">Start Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-8 md:py-12">
            <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-lg">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => removeItem(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                            <h3 className="text-lg font-semibold truncate">
                                <Link href={`/product/${item.slug}`} className="hover:underline">
                                    {item.name}
                                </Link>
                            </h3>
                            <div className="mt-auto flex items-center justify-between pt-4">
                                <span className="text-lg font-bold">KSh {item.price.toLocaleString()}</span>
                                <Button size="sm" onClick={() => handleMoveToCart(item)}>
                                    <ShoppingCart className="mr-2 h-4 w-4" /> Move to Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
