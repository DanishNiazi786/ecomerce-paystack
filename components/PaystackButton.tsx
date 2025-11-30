'use client';

import { useCallback, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PaystackButtonProps {
    email: string;
    amount: number;
    metadata?: Record<string, any>;
}

export default function PaystackButton({ email, amount, metadata = {} }: PaystackButtonProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const initializePayment = useCallback(async () => {
        if (!email) {
            toast({
                title: "Email Required",
                description: "Please enter your email address.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Initialize transaction on backend
            const response = await fetch("/api/paystack/initialize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    amount,
                    metadata,
                }),
            });

            const data = await response.json();

            if (data.success && data.authorization_url) {
                // Redirect to Paystack checkout page (not iframe)
                window.location.href = data.authorization_url;
            } else {
                setIsLoading(false);
                toast({
                    title: "Payment Initialization Failed",
                    description: data.message || "Failed to initialize payment. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Payment initialization error:", error);
            toast({
                title: "Error",
                description: "An error occurred while initializing payment. Please try again.",
                variant: "destructive",
            });
        }
    }, [email, amount, metadata, toast]);

    return (
        <button
            onClick={initializePayment}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
            {isLoading ? "Processing..." : "Pay with Paystack"}
        </button>
    );
}
