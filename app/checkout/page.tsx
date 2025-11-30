"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PaystackPaymentButton = dynamic(() => import("@/components/PaystackButton"), { ssr: false });

export default function CheckoutPage() {
    const { items, totalPrice } = useCartStore();
    const [email, setEmail] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Prevent hydration mismatch
    }

    const total = totalPrice();

    if (items.length === 0) {
        return (
            <div className="container py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">
                    Add some products to your cart to proceed to checkout.
                </p>
                <Link href="/">
                    <Button>Return to Store</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-16 max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

            <div className="bg-card p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>KSh {total.toLocaleString()}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded-md bg-background"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {email ? (
                    <PaystackPaymentButton amount={total} email={email} />
                ) : (
                    <Button disabled className="w-full">
                        Enter Email to Pay
                    </Button>
                )}
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="text-primary hover:underline">
                    Return to Store
                </Link>
            </div>
        </div>
    );
}
