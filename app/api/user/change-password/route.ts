import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
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
        const { currentPassword, newPassword } = body;

        // Get user with password
        const dbUser = await User.findById(user.id);
        if (!dbUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, dbUser.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Current password is incorrect" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        dbUser.password = hashedPassword;
        await dbUser.save();

        return NextResponse.json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error: any) {
        console.error("Change password error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

