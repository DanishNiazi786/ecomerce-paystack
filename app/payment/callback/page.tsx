"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCartStore();
    const { toast } = useToast();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const reference = searchParams.get("reference");
        const trxref = searchParams.get("trxref");

        const verifyPayment = async () => {
            if (!reference && !trxref) {
                setStatus("failed");
                setMessage("No payment reference found");
                return;
            }

            const ref = reference || trxref;

            try {
                const verifyResponse = await fetch("/api/paystack/verify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ reference: ref }),
                });

                const verifyData = await verifyResponse.json();

                if (verifyData.success) {
                    clearCart();
                    setStatus("success");
                    setMessage("Payment successful! Thank you for your purchase.");
                    toast({
                        title: "Payment Successful",
                        description: "Thank you for your purchase!",
                    });
                } else {
                    setStatus("failed");
                    setMessage(verifyData.message || "Payment verification failed");
                    toast({
                        title: "Verification Failed",
                        description: "Payment could not be verified. Please contact support.",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("failed");
                setMessage("An error occurred while verifying payment.");
                toast({
                    title: "Error",
                    description: "An error occurred while verifying payment.",
                    variant: "destructive",
                });
            }
        };

        verifyPayment();
    }, [searchParams, clearCart, toast]);

    return (
        <div className="container py-16 max-w-md mx-auto text-center">
            {status === "loading" && (
                <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold mb-2">Verifying Payment...</h1>
                    <p className="text-muted-foreground">Please wait while we verify your payment.</p>
                </>
            )}

            {status === "success" && (
                <>
                    <div className="text-green-600 text-6xl mb-4">✓</div>
                    <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-muted-foreground mb-6">{message}</p>
                    <Link href="/">
                        <Button>Return to Store</Button>
                    </Link>
                </>
            )}

            {status === "failed" && (
                <>
                    <div className="text-red-600 text-6xl mb-4">✗</div>
                    <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
                    <p className="text-muted-foreground mb-6">{message}</p>
                    <div className="space-y-2">
                        <Link href="/checkout">
                            <Button>Try Again</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline">Return to Store</Button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

