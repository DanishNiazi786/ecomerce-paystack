import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
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

        const product = await Product.findById(id).lean();
        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            product,
        });
    } catch (error: any) {
        console.error("Get product error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

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

        const product = await Product.findByIdAndUpdate(
            id,
            {
                $set: {
                    name: body.name,
                    slug: body.slug,
                    description: body.description,
                    price: parseFloat(body.price),
                    discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : undefined,
                    images: body.images || [],
                    category: body.category || "",
                    stock: parseInt(body.stock) || 0,
                },
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            product,
            message: "Product updated successfully",
        });
    } catch (error: any) {
        console.error("Update product error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

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

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error: any) {
        console.error("Delete product error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

