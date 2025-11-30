import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
}

/**
 * Middleware to verify user authentication
 * Returns the authenticated user if valid, otherwise returns null with error response
 */
export async function verifyAuth(request: NextRequest): Promise<{ user: AuthenticatedUser | null; error: NextResponse | null }> {
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
        console.error("Auth error:", error);
        return {
            user: null,
            error: NextResponse.json(
                { success: false, message: "An error occurred during authentication" },
                { status: 500 }
            )
        };
    }
}

