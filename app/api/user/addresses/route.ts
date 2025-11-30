import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Address from "@/models/Address";
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

        const addresses = await Address.find({ user: user.id })
            .sort({ isDefault: -1, createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            addresses,
        });
    } catch (error: any) {
        console.error("Get addresses error:", error);
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
        const { user, error } = await verifyAuth(request);
        if (error) return error;
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const body = await request.json();
        const { type, fullName, phone, address, city, state, postalCode, country, isDefault } = body;

        // If setting as default, unset other defaults of the same type
        if (isDefault) {
            await Address.updateMany(
                { user: user.id, type, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        const newAddress = await Address.create({
            user: user.id,
            type,
            fullName,
            phone,
            address,
            city,
            state,
            postalCode,
            country,
            isDefault: isDefault || false,
        });

        return NextResponse.json({
            success: true,
            address: newAddress,
            message: "Address added successfully",
        });
    } catch (error: any) {
        console.error("Create address error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

