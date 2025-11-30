import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyAuth } from "@/lib/user-auth";

export async function PUT(request: NextRequest) {
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
        const { name, email, phone } = body;

        // Get current user from database to check role
        const currentUser = await User.findById(user.id);
        if (!currentUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Prevent customers from changing email
        if (currentUser.role !== 'admin' && email && email !== currentUser.email) {
            return NextResponse.json(
                { success: false, message: "Customers cannot change their email address" },
                { status: 403 }
            );
        }

        // For admins: Check if email is already taken by any user (admin or customer)
        if (currentUser.role === 'admin' && email && email !== currentUser.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: user.id } });
            if (existingUser) {
                return NextResponse.json(
                    { success: false, message: "Email already in use by another account" },
                    { status: 400 }
                );
            }
        }

        // Build update object
        const updateData: any = {
            name,
            phone,
        };

        // Only allow email update for admins
        if (currentUser.role === 'admin' && email) {
            updateData.email = email;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            {
                $set: updateData,
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "Failed to update profile" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser._id.toString(),
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                image: updatedUser.image,
                role: updatedUser.role,
            },
            message: "Profile updated successfully",
        });
    } catch (error: any) {
        console.error("Update profile error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

