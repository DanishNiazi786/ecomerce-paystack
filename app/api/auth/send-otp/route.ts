import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import OTP from "@/models/OTP";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/email";

// Generate 6-digit OTP
const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Enhanced email validation
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
};

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        // Enhanced email validation
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { success: false, message: "Invalid email format" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "An account with this email already exists. Please use a different email or try logging in." },
                { status: 400 }
            );
        }

        // Normalize email (lowercase and trim)
        const normalizedEmail = email.toLowerCase().trim();

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Delete any existing OTP for this email
        await OTP.deleteMany({ email: normalizedEmail });

        // Save new OTP
        await OTP.create({
            email: normalizedEmail,
            otp,
            expiresAt,
        });

        // Send OTP email
        try {
            const emailResult = await sendOTPEmail(normalizedEmail, otp);
            
            // Check if email was actually sent or just logged (dev mode)
            if (emailResult.messageId === 'dev-mode-no-email') {
                // In dev mode without email config, OTP is logged to console
                return NextResponse.json(
                    {
                        success: true,
                        message: "OTP generated. Check console for OTP code (Email not configured in dev mode).",
                    },
                    { status: 200 }
                );
            }
            
            // Email sent successfully
            return NextResponse.json(
                {
                    success: true,
                    message: "OTP sent successfully to your email. Please check your inbox.",
                },
                { status: 200 }
            );
        } catch (emailError: any) {
            console.error("Email sending failed:", emailError);
            console.error("Error details:", {
                message: emailError.message,
                code: emailError.code,
                response: emailError.response,
            });
            
            // Delete the OTP since we couldn't send it
            await OTP.deleteOne({ email: normalizedEmail, otp });
            
            // Return error - email sending is required in production
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to send OTP email. Please check your email configuration and try again. If the problem persists, contact support.",
                    error: emailError.message,
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("Send OTP error:", error);
        
        // Handle MongoDB errors
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: "An account with this email already exists." },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred while sending OTP",
            },
            { status: 500 }
        );
    }
}

