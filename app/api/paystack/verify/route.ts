import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";

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
            // Create order after successful payment verification
            try {
                await connectToDatabase();
                const Order = (await import("@/models/Order")).default;
                const User = (await import("@/models/User")).default;
                const Product = (await import("@/models/Product")).default;

                // Check if order already exists
                const existingOrder = await Order.findOne({ paymentReference: reference });
                if (!existingOrder) {
                    // Get user from email
                    const customerEmail = data.data.customer?.email || data.data.metadata?.email;
                    const user = await User.findOne({ email: customerEmail });

                    if (user) {
                        // Get metadata
                        const metadata = data.data.metadata || {};
                        const items = metadata.items || [];
                        const shippingAddress = metadata.shippingAddress || {};

                        if (items.length > 0) {
                            // Calculate totals
                            const subtotal = items.reduce(
                                (sum: number, item: any) => sum + item.price * item.quantity,
                                0
                            );
                            const shippingFee = metadata.shippingFee || 0;
                            const tax = metadata.tax || 0;
                            const total = data.data.amount / 100; // Convert from kobo

                            // Create order
                            const order = await Order.create({
                                user: user._id,
                                items: items.map((item: any) => ({
                                    productId: item.id,
                                    name: item.name,
                                    image: item.image,
                                    price: item.price,
                                    quantity: item.quantity,
                                    slug: item.slug,
                                })),
                                shippingAddress: {
                                    fullName: shippingAddress.fullName || customerEmail,
                                    address: shippingAddress.address || "N/A",
                                    city: shippingAddress.city || "N/A",
                                    postalCode: shippingAddress.postalCode || "N/A",
                                    country: shippingAddress.country || "N/A",
                                    phone: shippingAddress.phone,
                                },
                                paymentMethod: "paystack",
                                paymentStatus: "paid",
                                paymentReference: reference,
                                orderStatus: "paid",
                                statusHistory: [{
                                    status: "paid",
                                    timestamp: new Date(),
                                    changedBy: "system",
                                    note: "Payment confirmed via Paystack",
                                }],
                                subtotal,
                                shippingFee,
                                tax,
                                total,
                                currency: "KES",
                                isNewOrder: true,
                            });

                            // Update inventory - decrease stock
                            for (const item of items) {
                                const product = await Product.findById(item.id);
                                if (product) {
                                    product.stock = Math.max(0, product.stock - item.quantity);
                                    await product.save();
                                }
                            }

                            // Send order confirmation email
                            try {
                                const { sendOrderConfirmationEmail, sendNewOrderAdminEmail } = await import("@/lib/order-emails");
                                await sendOrderConfirmationEmail({
                                    orderNumber: order.orderNumber,
                                    customerName: user.name,
                                    customerEmail: user.email,
                                    items: order.items.map((item: any) => ({
                                        name: item.name,
                                        quantity: item.quantity,
                                        price: item.price,
                                        image: item.image,
                                    })),
                                    subtotal: order.subtotal,
                                    shippingFee: order.shippingFee,
                                    tax: order.tax,
                                    total: order.total,
                                    shippingAddress: order.shippingAddress,
                                    orderDate: order.createdAt,
                                });

                                // Send admin notification
                                await sendNewOrderAdminEmail({
                                    orderNumber: order.orderNumber,
                                    customerName: user.name,
                                    customerEmail: user.email,
                                    items: order.items.map((item: any) => ({
                                        name: item.name,
                                        quantity: item.quantity,
                                        price: item.price,
                                        image: item.image,
                                    })),
                                    subtotal: order.subtotal,
                                    shippingFee: order.shippingFee,
                                    tax: order.tax,
                                    total: order.total,
                                    shippingAddress: order.shippingAddress,
                                    orderDate: order.createdAt,
                                });
                            } catch (emailError) {
                                console.error("Failed to send order emails:", emailError);
                                // Don't fail if email fails
                            }
                        }
                    }
                }
            } catch (orderError) {
                console.error("Order creation error:", orderError);
                // Don't fail the verification if order creation fails
            }

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
