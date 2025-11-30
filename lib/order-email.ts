import { sendOTPEmail } from "./email";

export const sendOrderConfirmationEmail = async (email: string, order: any) => {
    try {
        const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
        const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
        
        if (!smtpUser || !smtpPass) {
            console.log(`[DEV MODE] Order confirmation email would be sent to ${email} for order ${order.orderNumber}`);
            return { success: true, messageId: 'dev-mode-no-email' };
        }

        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const itemsHtml = order.items.map((item: any) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">KSh ${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_FROM || smtpUser,
            to: email,
            subject: `Order Confirmation - ${order.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">ShopWithUs</h1>
                    </div>
                    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #1f2937; margin-top: 0;">Order Confirmation</h2>
                        <p style="color: #4b5563; line-height: 1.6;">
                            Thank you for your order! Your order has been confirmed and is being processed.
                        </p>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold;">Order Number: ${order.orderNumber}</p>
                            <p style="margin: 5px 0 0 0; color: #6b7280;">Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <h3 style="color: #1f2937; margin-top: 30px;">Order Items</h3>
                        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
                            <thead>
                                <tr style="background: #f3f4f6;">
                                    <th style="padding: 10px; text-align: left;">Image</th>
                                    <th style="padding: 10px; text-align: left;">Product</th>
                                    <th style="padding: 10px; text-align: center;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Subtotal:</span>
                                <span>KSh ${order.subtotal.toLocaleString()}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Shipping:</span>
                                <span>KSh ${order.shippingFee.toLocaleString()}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; padding-top: 10px; border-top: 2px solid #e5e7eb;">
                                <span>Total:</span>
                                <span>KSh ${order.total.toLocaleString()}</span>
                            </div>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #1f2937; margin-top: 0;">Shipping Address</h3>
                            <p style="margin: 5px 0; color: #4b5563;">
                                ${order.shippingAddress.fullName}<br>
                                ${order.shippingAddress.address}<br>
                                ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                                ${order.shippingAddress.country}
                            </p>
                        </div>
                        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                            This is an automated message, please do not reply to this email.
                        </p>
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error('Order email sending error:', error);
        throw new Error(`Failed to send order confirmation email: ${error.message}`);
    }
};

