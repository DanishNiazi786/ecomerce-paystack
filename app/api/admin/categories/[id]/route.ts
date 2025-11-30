import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import { verifyAdmin } from "@/lib/admin-auth";

export async function DELETE(
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

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error: any) {
        console.error("Delete category error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

