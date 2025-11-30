export const getNewOrderAdminHtml = (props: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    itemCount: number;
    orderDate: string;
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
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ShopWithUs Admin</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">New Order Alert! 🔔</p>
        </div>
        <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">New Order Received</h2>
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">A new order has been placed and requires your attention.</p>
            <div style="background: #fffbeb; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #d97706; font-weight: 600;">ORDER NUMBER</p>
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #92400e;">${props.orderNumber}</p>
            </div>
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Customer</p>
                <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${props.customerName}</p>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">${props.customerEmail}</p>
            </div>
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #6b7280;">Items</span>
                    <span style="font-weight: 600; color: #1f2937;">${props.itemCount} item(s)</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                    <span style="font-size: 18px; font-weight: bold; color: #1f2937;">Total</span>
                    <span style="font-size: 18px; font-weight: bold; color: #1f2937;">KSh ${props.total.toLocaleString()}</span>
                </div>
            </div>
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Order Date</p>
                <p style="margin: 0; font-size: 16px; color: #1f2937;">${props.orderDate}</p>
            </div>
            <div style="text-align: center; margin-top: 40px; padding: 30px; background: #f9fafb; border-radius: 8px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/orders" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">View Order in Admin Panel</a>
            </div>
        </div>
        <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">This is an automated notification from ShopWithUs Admin Panel.</p>
        </div>
    </div>
</body>
</html>
    `;
};

