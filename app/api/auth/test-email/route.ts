import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Debug: Check what environment variables are available
    const envCheck = {
        SMTP_USER: process.env.SMTP_USER ? 'SET' : 'NOT SET',
        SMTP_PASS: process.env.SMTP_PASS ? 'SET' : 'NOT SET',
        EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET',
        SMTP_HOST: process.env.SMTP_HOST || 'not set',
        SMTP_PORT: process.env.SMTP_PORT || 'not set',
        NODE_ENV: process.env.NODE_ENV,
        // Don't show actual passwords, just if they exist
        SMTP_USER_VALUE: process.env.SMTP_USER || 'NOT SET',
        SMTP_PASS_LENGTH: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0,
    };

    return NextResponse.json({
        message: "Email configuration check",
        config: envCheck,
        note: "Check if SMTP_USER and SMTP_PASS are set. If not, add them to .env.local and restart server."
    });
}

