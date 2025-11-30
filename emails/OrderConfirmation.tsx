import * as React from 'react';

interface OrderConfirmationProps {
    orderNumber: string;
    customerName: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        image: string;
    }>;
    subtotal: number;
    shippingFee: number;
    tax: number;
    total: number;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    orderDate: string;
}

export const OrderConfirmationEmail = ({
    orderNumber,
    customerName,
    items,
    subtotal,
    shippingFee,
    tax,
    total,
    shippingAddress,
    orderDate,
}: OrderConfirmationProps) => {
    return (
        <html>
            <body style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, backgroundColor: '#f5f5f5' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '40px 20px',
                        textAlign: 'center',
                    }}>
                        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                            ShopWithUs
                        </h1>
                        <p style={{ color: '#ffffff', margin: '10px 0 0 0', fontSize: '16px', opacity: 0.9 }}>
                            Order Confirmation
                        </p>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '40px 30px' }}>
                        <h2 style={{ color: '#1f2937', marginTop: 0, fontSize: '24px' }}>
                            Thank you for your order, {customerName}!
                        </h2>
                        <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '16px' }}>
                            We've received your order and are preparing it for shipment. You'll receive another email when your order ships.
                        </p>

                        {/* Order Info */}
                        <div style={{
                            background: '#f9fafb',
                            borderRadius: '8px',
                            padding: '20px',
                            margin: '30px 0',
                        }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>Order Number</p>
                            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                                {orderNumber}
                            </p>
                            <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                                Placed on {orderDate}
                            </p>
                        </div>

                        {/* Items */}
                        <h3 style={{ color: '#1f2937', fontSize: '18px', marginTop: '30px' }}>Order Items</h3>
                        <div style={{ marginTop: '20px' }}>
                            {items.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    gap: '15px',
                                    padding: '15px 0',
                                    borderBottom: index < items.length - 1 ? '1px solid #e5e7eb' : 'none',
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        backgroundColor: '#f3f4f6',
                                        borderRadius: '8px',
                                        flexShrink: 0,
                                        backgroundImage: `url(${item.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#1f2937' }}>
                                            {item.name}
                                        </p>
                                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#6b7280' }}>
                                            Quantity: {item.quantity}
                                        </p>
                                        <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#1f2937' }}>
                                            KSh {(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div style={{
                            background: '#f9fafb',
                            borderRadius: '8px',
                            padding: '20px',
                            marginTop: '30px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#6b7280' }}>Subtotal</span>
                                <span style={{ fontWeight: '600' }}>KSh {subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#6b7280' }}>Shipping</span>
                                <span style={{ fontWeight: '600' }}>KSh {shippingFee.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#6b7280' }}>Tax</span>
                                <span style={{ fontWeight: '600' }}>KSh {tax.toLocaleString()}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '15px',
                                borderTop: '2px solid #e5e7eb',
                                marginTop: '15px',
                            }}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>Total</span>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                                    KSh {total.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #e5e7eb' }}>
                            <h3 style={{ color: '#1f2937', fontSize: '18px', marginBottom: '15px' }}>Shipping Address</h3>
                            <p style={{ margin: '5px 0', color: '#4b5563', lineHeight: '1.6' }}>
                                {shippingAddress.fullName}<br />
                                {shippingAddress.address}<br />
                                {shippingAddress.city}, {shippingAddress.postalCode}<br />
                                {shippingAddress.country}
                            </p>
                        </div>

                        {/* CTA */}
                        <div style={{
                            textAlign: 'center',
                            marginTop: '40px',
                            padding: '30px',
                            background: '#f9fafb',
                            borderRadius: '8px',
                        }}>
                            <a href={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/account/orders`}
                                style={{
                                    display: 'inline-block',
                                    padding: '12px 30px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                }}>
                                View Order Details
                            </a>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        background: '#f9fafb',
                        padding: '30px',
                        textAlign: 'center',
                        borderTop: '1px solid #e5e7eb',
                    }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>
                            Questions? Contact us at{' '}
                            <a href={`mailto:${process.env.ADMIN_EMAIL || 'support@shopwithus.com'}`}
                                style={{ color: '#667eea', textDecoration: 'none' }}>
                                {process.env.ADMIN_EMAIL || 'support@shopwithus.com'}
                            </a>
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                            This is an automated message. Please do not reply to this email.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    );
};

export const getOrderConfirmationHtml = (props: OrderConfirmationProps): string => {
    // Convert React component to HTML string
    const { OrderConfirmationEmail } = require('./OrderConfirmation');
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ShopWithUs</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order Confirmation</p>
        </div>
        <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 24px;">Thank you for your order, ${props.customerName}!</h2>
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">We've received your order and are preparing it for shipment. You'll receive another email when your order ships.</p>
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Order Number</p>
                <p style="margin: 0; font-size: 20px; font-weight: bold; color: #1f2937;">${props.orderNumber}</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Placed on ${props.orderDate}</p>
            </div>
            <h3 style="color: #1f2937; font-size: 18px; margin-top: 30px;">Order Items</h3>
            <div style="margin-top: 20px;">
                ${props.items.map((item, index) => `
                    <div style="display: flex; gap: 15px; padding: 15px 0; border-bottom: ${index < props.items.length - 1 ? '1px solid #e5e7eb' : 'none'};">
                        <div style="width: 80px; height: 80px; background-color: #f3f4f6; border-radius: 8px; flex-shrink: 0; background-image: url(${item.image}); background-size: cover; background-position: center;"></div>
                        <div style="flex: 1;">
                            <p style="margin: 0 0 5px 0; font-weight: 600; color: #1f2937;">${item.name}</p>
                            <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">Quantity: ${item.quantity}</p>
                            <p style="margin: 5px 0 0 0; font-weight: bold; color: #1f2937;">KSh ${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #6b7280;">Subtotal</span>
                    <span style="font-weight: 600;">KSh ${props.subtotal.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #6b7280;">Shipping</span>
                    <span style="font-weight: 600;">KSh ${props.shippingFee.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #6b7280;">Tax</span>
                    <span style="font-weight: 600;">KSh ${props.tax.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 2px solid #e5e7eb; margin-top: 15px;">
                    <span style="font-size: 18px; font-weight: bold; color: #1f2937;">Total</span>
                    <span style="font-size: 18px; font-weight: bold; color: #1f2937;">KSh ${props.total.toLocaleString()}</span>
                </div>
            </div>
            <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Shipping Address</h3>
                <p style="margin: 5px 0; color: #4b5563; line-height: 1.6;">
                    ${props.shippingAddress.fullName}<br />
                    ${props.shippingAddress.address}<br />
                    ${props.shippingAddress.city}, ${props.shippingAddress.postalCode}<br />
                    ${props.shippingAddress.country}
                </p>
            </div>
            <div style="text-align: center; margin-top: 40px; padding: 30px; background: #f9fafb; border-radius: 8px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/account/orders" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">View Order Details</a>
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

