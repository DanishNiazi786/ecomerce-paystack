import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import OTP from "@/models/OTP";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
    try {
        const { email, otp, name, password } = await request.json();

        if (!email || !otp || !name || !password) {
            return NextResponse.json(
                { success: false, message: "Email, OTP, name, and password are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists FIRST (before OTP verification)
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "An account with this email already exists. Please try logging in instead." },
                { status: 400 }
            );
        }

        // Find and verify OTP
        const otpRecord = await OTP.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
        
        if (!otpRecord) {
            return NextResponse.json(
                { success: false, message: "OTP not found. Please request a new OTP." },
                { status: 400 }
            );
        }

        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return NextResponse.json(
                { success: false, message: "OTP has expired. Please request a new OTP." },
                { status: 400 }
            );
        }

        if (otpRecord.otp !== otp) {
            return NextResponse.json(
                { success: false, message: "Invalid OTP. Please check the code and try again." },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with normalized email
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        // Delete used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

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
                message: "Account created and verified successfully",
                user: userResponse,
            },
            { status: 201 }
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
        console.error("Verify OTP error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred during OTP verification",
            },
            { status: 500 }
        );
    }
}

