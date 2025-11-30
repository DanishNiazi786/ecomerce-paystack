import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
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
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";

        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
            ];
        }

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
        });
    } catch (error: any) {
        console.error("Get products error:", error);
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

        const body = await request.json();
        const {
            name,
            slug,
            description,
            price,
            discountPrice,
            costPrice,
            sku,
            barcode,
            stock,
            lowStockThreshold,
            category,
            subCategory,
            images,
            weight,
            dimensions,
            published,
            seoTitle,
            seoDescription,
        } = body;

        // Generate slug if not provided
        const productSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

        const product = await Product.create({
            name,
            slug: productSlug,
            description: description || "",
            price: parseFloat(price),
            discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
            images: images || [],
            category: category || "",
            stock: parseInt(stock) || 0,
            rating: 0,
            numReviews: 0,
            isFeatured: false,
            isTrending: false,
            isNewArrival: false,
            tags: [],
            attributes: [],
        });

        return NextResponse.json({
            success: true,
            product,
            message: "Product created successfully",
        });
    } catch (error: any) {
        console.error("Create product error:", error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: "Product with this slug already exists" },
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

