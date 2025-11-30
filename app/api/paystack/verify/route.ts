import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { reference } = await request.json();

        if (!reference) {
            return NextResponse.json(
                { success: false, message: "Reference is required" },
                { status: 400 }
            );
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_1003840b1d7d3981058ba0e2c131086b69cc7902";

        // Verify payment with Paystack
        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (data.status && data.data.status === "success") {
            // Payment verified successfully
            return NextResponse.json({
                success: true,
                message: "Payment verified successfully",
                data: data.data,
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: "Payment verification failed",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred during verification",
            },
            { status: 500 }
        );
    }
}
