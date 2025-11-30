import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET(
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

        const order = await Order.findById(id)
            .populate("user", "name email")
            .select("-__v")
            .lean();

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error: any) {
        console.error("Get order error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}


