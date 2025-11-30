/**
 * Order Email Service
 * Sends emails for different order status changes
 */

import { sendEmail } from './email-service';
import { getOrderConfirmationHtml } from '../emails/OrderConfirmation';
import { getOrderShippedHtml } from '../emails/OrderShipped';
import { getOrderDeliveredHtml } from '../emails/OrderDelivered';
import { getOrderCancelledHtml } from '../emails/OrderCancelled';
import { getNewOrderAdminHtml } from '../emails/NewOrderAdmin';
import { format } from 'date-fns';

interface OrderData {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
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
    orderDate: Date;
    trackingNumber?: string;
    estimatedDelivery?: string;
    reason?: string;
}

export async function sendOrderConfirmationEmail(orderData: OrderData) {
    const html = getOrderConfirmationHtml({
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shippingFee: orderData.shippingFee,
        tax: orderData.tax,
        total: orderData.total,
        shippingAddress: orderData.shippingAddress,
        orderDate: format(orderData.orderDate, 'MMMM dd, yyyy'),
    });

    return await sendEmail({
        to: orderData.customerEmail,
        subject: `Order Confirmation - ${orderData.orderNumber}`,
        html,
    });
}

export async function sendOrderShippedEmail(orderData: OrderData) {
    const html = getOrderShippedHtml({
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        trackingNumber: orderData.trackingNumber,
        estimatedDelivery: orderData.estimatedDelivery,
    });

    return await sendEmail({
        to: orderData.customerEmail,
        subject: `Your Order Has Shipped - ${orderData.orderNumber}`,
        html,
    });
}

export async function sendOrderDeliveredEmail(orderData: OrderData) {
    const html = getOrderDeliveredHtml({
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
    });

    return await sendEmail({
        to: orderData.customerEmail,
        subject: `Order Delivered - ${orderData.orderNumber}`,
        html,
    });
}

export async function sendOrderCancelledEmail(orderData: OrderData) {
    const html = getOrderCancelledHtml({
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        reason: orderData.reason,
    });

    return await sendEmail({
        to: orderData.customerEmail,
        subject: `Order Cancelled - ${orderData.orderNumber}`,
        html,
    });
}

export async function sendNewOrderAdminEmail(orderData: OrderData) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@shopwithus.com';
    
    const html = getNewOrderAdminHtml({
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        total: orderData.total,
        itemCount: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
        orderDate: format(orderData.orderDate, 'MMMM dd, yyyy HH:mm'),
    });

    return await sendEmail({
        to: adminEmail,
        subject: `🔔 New Order: ${orderData.orderNumber} - KSh ${orderData.total.toLocaleString()}`,
        html,
    });
}

