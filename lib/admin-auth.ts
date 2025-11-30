import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
}

/**
 * Middleware to verify admin access
 * Returns the admin user if authenticated and has admin role
 * Otherwise returns null
 */
export async function verifyAdmin(request: NextRequest): Promise<{ user: AdminUser | null; error: NextResponse | null }> {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return {
                user: null,
                error: NextResponse.json(
                    { success: false, message: "Not authenticated" },
                    { status: 401 }
                )
            };
        }

        // Verify token
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return {
                user: null,
                error: NextResponse.json(
                    { success: false, message: "Invalid token" },
                    { status: 401 }
                )
            };
        }

        await connectToDatabase();

        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return {
                user: null,
                error: NextResponse.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                )
            };
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return {
                user: null,
                error: NextResponse.json(
                    { success: false, message: "Access denied. Admin role required." },
                    { status: 403 }
                )
            };
        }

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
            },
            error: null
        };
    } catch (error: any) {
        console.error("Admin auth error:", error);
        return {
            user: null,
            error: NextResponse.json(
                { success: false, message: "An error occurred during authentication" },
                { status: 500 }
            )
        };
    }
}

