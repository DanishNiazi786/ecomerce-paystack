/**
 * Unified Email Service
 * Supports both Resend (preferred) and Nodemailer (fallback)
 */

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { to, subject, html, text } = options;

    // Try Resend first (preferred for production)
    if (process.env.RESEND_API_KEY) {
        try {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);

            const { data, error } = await resend.emails.send({
                from: process.env.EMAIL_FROM || 'ShopWithUs <onboarding@resend.dev>',
                to: [to],
                subject,
                html,
                text: text || subject,
            });

            if (error) {
                console.error('Resend error:', error);
                // Fall through to Nodemailer
            } else {
                console.log(`✅ Email sent via Resend to ${to}. Message ID: ${data?.id}`);
                return { success: true, messageId: data?.id };
            }
        } catch (error: any) {
            console.error('Resend failed, trying Nodemailer:', error.message);
            // Fall through to Nodemailer
        }
    }

    // Fallback to Nodemailer
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

    if (!smtpUser || !smtpPass) {
        if (process.env.NODE_ENV === 'development') {
            console.log('\n═══════════════════════════════════════');
            console.log(`⚠️  [DEV MODE] Email not configured`);
            console.log(`   Would send to: ${to}`);
            console.log(`   Subject: ${subject}`);
            console.log(`   Configure RESEND_API_KEY or SMTP credentials`);
            console.log(`═══════════════════════════════════════\n`);
            return { success: true, messageId: 'dev-mode-no-email' };
        } else {
            return { 
                success: false, 
                error: 'Email configuration is missing. Please set RESEND_API_KEY or SMTP credentials.' 
            };
        }
    }

    try {
        const nodemailer = await import('nodemailer');
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPort = parseInt(process.env.SMTP_PORT || '587');

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            ...(smtpHost.includes('gmail.com') && {
                service: 'gmail',
            }),
        });

        const mailOptions = {
            from: `ShopWithUs <${process.env.EMAIL_FROM || smtpUser}>`,
            to,
            subject,
            text: text || subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent via Nodemailer to ${to}. Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error('❌ Email sending error:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to send email' 
        };
    }
}

