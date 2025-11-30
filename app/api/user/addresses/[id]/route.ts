import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Address from "@/models/Address";
import { verifyAuth } from "@/lib/user-auth";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { id } = await params;
        const body = await request.json();

        const address = await Address.findOne({ _id: id, user: user.id });
        if (!address) {
            return NextResponse.json(
                { success: false, message: "Address not found" },
                { status: 404 }
            );
        }

        // If setting as default, unset other defaults of the same type
        if (body.isDefault) {
            await Address.updateMany(
                { user: user.id, type: body.type || address.type, isDefault: true, _id: { $ne: id } },
                { $set: { isDefault: false } }
            );
        }

        Object.assign(address, body);
        await address.save();

        return NextResponse.json({
            success: true,
            address,
            message: "Address updated successfully",
        });
    } catch (error: any) {
        console.error("Update address error:", error);
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
        const { user, error } = await verifyAuth(request);
        if (error) return error;
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();
        const { id } = await params;

        const address = await Address.findOneAndDelete({ _id: id, user: user.id });
        if (!address) {
            return NextResponse.json(
                { success: false, message: "Address not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Address deleted successfully",
        });
    } catch (error: any) {
        console.error("Delete address error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

