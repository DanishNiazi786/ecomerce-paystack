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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "all";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 10;
        const skip = (page - 1) * limit;

        // Build query
        const query: any = { user: user.id };
        if (status && status !== "all") {
            query.orderStatus = status;
        }

        const [orders, total] = await Promise.all([
            Order.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('orderNumber total orderStatus createdAt items')
                .lean(),
            Order.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            orders,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
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

