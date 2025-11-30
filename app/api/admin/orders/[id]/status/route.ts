import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/admin-auth";
import {
    sendOrderShippedEmail,
    sendOrderDeliveredEmail,
    sendOrderCancelledEmail
} from "@/lib/order-emails";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user, error } = await verifyAdmin(request);
        if (error) return error;
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();
        const { orderStatus, trackingNumber, note } = body;

        const order = await Order.findById(id).populate('user');
        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        const oldStatus = order.orderStatus;

        // Update order status
        order.orderStatus = orderStatus;
        order.isNewOrder = false; // Mark as seen by admin

        // Add to status history
        order.statusHistory.push({
            status: orderStatus,
            timestamp: new Date(),
            changedBy: user.id,
            note: note || `Status changed from ${oldStatus} to ${orderStatus}`,
        });

        // Update tracking number if provided
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }

        await order.save();

        // Handle inventory adjustments
        if (oldStatus !== orderStatus) {
            if (
                (oldStatus !== "delivered" && orderStatus === "delivered") ||
                (oldStatus !== "cancelled" && orderStatus === "cancelled") ||
                (oldStatus !== "refunded" && orderStatus === "refunded")
            ) {
                // If cancelling/refunding after being delivered, restore inventory
                if (oldStatus === "delivered" && (orderStatus === "cancelled" || orderStatus === "refunded")) {
                    for (const item of order.items) {
                        const product = await Product.findById(item.productId);
                        if (product) {
                            product.stock += item.quantity;
                            await product.save();
                        }
                    }
                }
            } else if (oldStatus === "cancelled" && orderStatus !== "cancelled") {
                // If uncancelling, deduct inventory again
                for (const item of order.items) {
                    const product = await Product.findById(item.productId);
                    if (product) {
                        product.stock = Math.max(0, product.stock - item.quantity);
                        await product.save();
                    }
                }
            }
        }

        // Send email notifications based on status
        try {
            const customer = order.user as any;
            const orderData = {
                orderNumber: order.orderNumber,
                customerName: customer.name,
                customerEmail: customer.email,
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
                trackingNumber: order.trackingNumber,
            };

            if (orderStatus === "shipped") {
                await sendOrderShippedEmail(orderData);
            } else if (orderStatus === "delivered") {
                await sendOrderDeliveredEmail(orderData);
            } else if (orderStatus === "cancelled" || orderStatus === "refunded") {
                await sendOrderCancelledEmail({
                    ...orderData,
                    reason: note || "Order cancelled by admin",
                });
            }
        } catch (emailError) {
            console.error("Failed to send status email:", emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json({
            success: true,
            order,
            message: "Order status updated successfully",
        });
    } catch (error: any) {
        console.error("Update order status error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

