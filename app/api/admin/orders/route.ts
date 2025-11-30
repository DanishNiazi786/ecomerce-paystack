import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";

        // Build query
        const query: any = {};
        if (status && status !== "all") {
            query.orderStatus = status;
        }
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { paymentReference: { $regex: search, $options: "i" } },
            ];
        }

        const orders = await Order.find(query)
            .populate("user", "name email")
            .sort({ isNewOrder: -1, createdAt: -1 })
            .limit(100)
            .select("-__v")
            .lean();

        return NextResponse.json({
            success: true,
            orders,
        });
    } catch (error: any) {
        console.error("Get orders error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

