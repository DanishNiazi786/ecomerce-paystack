import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { verifyAuth } from "@/lib/user-auth";

export async function GET(request: NextRequest) {
    try {
        const { user, error } = await verifyAuth(request);
        if (error) return error;
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        // Get total orders
        const totalOrders = await Order.countDocuments({ user: user.id });

        // Get pending orders (pending, paid, processing)
        const pendingOrders = await Order.countDocuments({
            user: user.id,
            orderStatus: { $in: ['pending', 'paid', 'processing'] }
        });

        // Get recent 5 orders
        const recentOrders = await Order.find({ user: user.id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderNumber total orderStatus createdAt')
            .lean();

        return NextResponse.json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                recentOrders,
            }
        });
    } catch (error: any) {
        console.error("Dashboard error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

