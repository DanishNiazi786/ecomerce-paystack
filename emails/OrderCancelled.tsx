export const getOrderCancelledHtml = (props: {
    orderNumber: string;
    customerName: string;
    reason?: string;
}): string => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ShopWithUs</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order Cancelled</p>
        </div>
        <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">Order Cancelled</h2>
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">Hello ${props.customerName},</p>
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">We're sorry to inform you that your order has been cancelled.</p>
            <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #dc2626; font-weight: 600;">ORDER NUMBER</p>
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #991b1b;">${props.orderNumber}</p>
            </div>
            ${props.reason ? `
                <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Reason</p>
                    <p style="margin: 0; font-size: 16px; color: #1f2937;">${props.reason}</p>
                </div>
            ` : ''}
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">If you were charged for this order, a refund will be processed within 5-7 business days.</p>
            <div style="text-align: center; margin-top: 40px; padding: 30px; background: #f9fafb; border-radius: 8px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/account/orders" style="display: inline-block; padding: 12px 30px; background: #ffffff; color: #ef4444; text-decoration: none; border-radius: 6px; font-weight: 600; border: 2px solid #ef4444;">View Order</a>
            </div>
        </div>
        <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Questions? Contact us at <a href="mailto:${process.env.ADMIN_EMAIL || 'support@shopwithus.com'}" style="color: #667eea; text-decoration: none;">${process.env.ADMIN_EMAIL || 'support@shopwithus.com'}</a></p>
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
    `;
};

