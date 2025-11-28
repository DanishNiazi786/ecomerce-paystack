"use client";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (items.length === 0) {
        return (
            <div className="container py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
                <Button asChild size="lg">
                    <Link href="/">Start Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-8 md:py-12">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-card">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-semibold">
                                            <Link href={`/product/${item.slug}`} className="hover:underline">
                                                {item.name}
                                            </Link>
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Price: ${item.price}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive/90"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center rounded-md border">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none"
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <div className="flex h-8 w-10 items-center justify-center border-x text-sm">
                                            {item.quantity}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="ml-auto font-bold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">${totalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-medium">Calculated at checkout</span>
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="flex gap-2">
                                <Input placeholder="Coupon code" />
                                <Button variant="outline">Apply</Button>
                            </div>
                        </div>
                        <div className="border-t pt-4 mb-6">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${totalPrice().toFixed(2)}</span>
                            </div>
                        </div>
                        <Button className="w-full" size="lg" asChild>
                            <Link href="/checkout">Proceed to Checkout</Link>
                        </Button>
                        <div className="mt-4 text-center">
                            <p className="text-xs text-muted-foreground">
                                Secure checkout powered by Paystack
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
