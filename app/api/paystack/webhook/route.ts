import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "sk_test_1003840b1d7d3981058ba0e2c131086b69cc7902";

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get("x-paystack-signature");

        if (!signature) {
            return NextResponse.json(
                { success: false, message: "Missing signature" },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const hash = crypto
            .createHmac("sha512", PAYSTACK_SECRET_KEY)
            .update(body)
            .digest("hex");

        if (hash !== signature) {
            return NextResponse.json(
                { success: false, message: "Invalid signature" },
                { status: 401 }
            );
        }

        const event = JSON.parse(body);

        // Handle successful payment
        if (event.event === "charge.success" && event.data.status === "success") {
            const { reference, customer, amount, metadata } = event.data;

            await connectToDatabase();

            // Check if order already exists
            const existingOrder = await Order.findOne({ paymentReference: reference });
            if (existingOrder) {
                return NextResponse.json({
                    success: true,
                    message: "Order already processed",
                });
            }

            // Get user from email
            const user = await User.findOne({ email: customer.email });
            if (!user) {
                return NextResponse.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }

            // Parse metadata (should contain cart items and shipping address)
            const items = metadata?.items || [];
            const shippingAddress = metadata?.shippingAddress || {};

            if (!items || items.length === 0) {
                return NextResponse.json(
                    { success: false, message: "No items in order" },
                    { status: 400 }
                );
            }

            // Calculate totals
            const subtotal = items.reduce(
                (sum: number, item: any) => sum + item.price * item.quantity,
                0
            );
            const shippingFee = metadata?.shippingFee || 0;
            const tax = metadata?.tax || 0;
            const total = subtotal + shippingFee + tax;

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
                    fullName: shippingAddress.fullName || customer.name || "N/A",
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
                total: amount / 100, // Convert from kobo to main currency
                currency: "KES",
                isNewOrder: true,
            });

            // Update inventory - decrease stock for each product
            for (const item of items) {
                const product = await Product.findById(item.id);
                if (product) {
                    product.stock = Math.max(0, product.stock - item.quantity);
                    await product.save();
                }
            }

            // Send order confirmation email to customer
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
                // Don't fail the webhook if email fails
            }

            return NextResponse.json({
                success: true,
                message: "Order created successfully",
                orderId: order._id,
            });
        }

        return NextResponse.json({
            success: true,
            message: "Webhook received",
        });
    } catch (error: any) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

