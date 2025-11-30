import nodemailer from 'nodemailer';

// Create transporter - using Gmail as example, but you can configure with any SMTP service
const createTransporter = () => {
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');

    return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        // Gmail specific settings
        ...(smtpHost.includes('gmail.com') && {
            service: 'gmail',
        }),
    });
};

export const sendOTPEmail = async (email: string, otp: string) => {
    try {
        // Check if email credentials are configured
        const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
        const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

        // If credentials are missing, log and return (only in dev mode)
        if (!smtpUser || !smtpPass) {
            if (process.env.NODE_ENV === 'development') {
                console.log('\n═══════════════════════════════════════');
                console.log(`⚠️  [DEV MODE] Email not configured`);
                console.log(`   OTP for ${email}: ${otp}`);
                console.log(`   Expires in: 10 minutes`);
                console.log(`   To receive emails, configure SMTP in .env.local`);
                console.log(`   See SETUP_EMAIL.md for instructions`);
                console.log(`═══════════════════════════════════════\n`);
                return { success: true, messageId: 'dev-mode-no-email' };
            } else {
                throw new Error('Email configuration is missing. Please set SMTP_USER and SMTP_PASS environment variables.');
            }
        }

        const transporter = createTransporter();

        // Verify connection before sending
        console.log('Verifying email connection...');
        await transporter.verify();
        console.log('Email connection verified successfully');

        const mailOptions = {
            from: `ShopWithUs <${process.env.EMAIL_FROM || smtpUser}>`,
            to: email,
            subject: 'Your Verification Code - ShopWithUs',
            text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">ShopWithUs</h1>
                    </div>
                    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email Address</h2>
                        <p style="color: #4b5563; line-height: 1.6;">
                            Thank you for signing up! Please use the following OTP (One-Time Password) to verify your email address:
                        </p>
                        <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">
                                ${otp}
                            </h1>
                        </div>
                        <p style="color: #4b5563; line-height: 1.6; font-size: 14px;">
                            This OTP will expire in 10 minutes. If you didn't request this code, please ignore this email.
                        </p>
                        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                            This is an automated message, please do not reply to this email.
                        </p>
                    </div>
                </div>
            `,
        };

        console.log(`Sending OTP email to ${email}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error('❌ Email sending error:', error);

        // Provide helpful error messages
        if (error.code === 'EAUTH') {
            throw new Error('Email authentication failed. Please check your SMTP_USER and SMTP_PASS credentials.');
        } else if (error.code === 'ECONNECTION') {
            throw new Error('Could not connect to email server. Please check your SMTP_HOST and SMTP_PORT settings.');
        } else {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
};

