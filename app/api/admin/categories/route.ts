import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
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

        const categories = await Category.find().sort({ name: 1 }).lean();

        return NextResponse.json({
            success: true,
            categories,
        });
    } catch (error: any) {
        console.error("Get categories error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
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

        const { name, slug, image, description } = await request.json();

        const categorySlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

        const category = await Category.create({
            name,
            slug: categorySlug,
            image,
            description,
        });

        return NextResponse.json({
            success: true,
            category,
            message: "Category created successfully",
        });
    } catch (error: any) {
        console.error("Create category error:", error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: "Category with this slug already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

