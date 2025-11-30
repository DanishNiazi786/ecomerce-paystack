import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return user without password
        const userResponse = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
        };

        // Create response with token in httpOnly cookie
        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful",
                user: userResponse,
            },
            { status: 200 }
        );

        // Set httpOnly cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred during login",
            },
            { status: 500 }
        );
    }
}

