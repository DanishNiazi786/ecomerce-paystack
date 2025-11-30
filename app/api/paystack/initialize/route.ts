import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, amount, metadata = {} } = await request.json();

        if (!email || !amount) {
            return NextResponse.json(
                { success: false, message: "Email and amount are required" },
                { status: 400 }
            );
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_1003840b1d7d3981058ba0e2c131086b69cc7902";
        
        // Generate a unique reference
        const reference = 'PS_' + Math.floor((Math.random() * 1000000000) + Date.now());

        // Initialize transaction with Paystack
        const response = await fetch(
            "https://api.paystack.co/transaction/initialize",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    amount: Math.round(amount * 100), // Convert to cents (KES uses cents)
                    currency: "KES",
                    reference: reference,
                    metadata: {
                        ...metadata,
                        reference: reference,
                    },
                    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/callback`,
                }),
            }
        );

        const data = await response.json();

        if (data.status && data.data) {
            return NextResponse.json({
                success: true,
                authorization_url: data.data.authorization_url,
                reference: reference,
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || "Failed to initialize transaction",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Initialization error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred during initialization",
            },
            { status: 500 }
        );
    }
}

