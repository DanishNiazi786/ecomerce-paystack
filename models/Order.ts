import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    slug: string;
}

export interface IShippingAddress {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IStatusHistory {
    status: OrderStatus;
    timestamp: Date;
    changedBy?: string; // Admin user ID or 'system'
    note?: string;
}

export interface IOrder extends Document {
    orderNumber: string;
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    paymentReference: string; // Paystack reference
    orderStatus: OrderStatus;
    statusHistory: IStatusHistory[];
    subtotal: number;
    shippingFee: number;
    tax: number;
    total: number;
    currency: string;
    notes?: string;
    isNewOrder?: boolean; // Flag for admin to see new orders
    trackingNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    slug: { type: String, required: true },
}, { _id: false });

const ShippingAddressSchema = new Schema<IShippingAddress>({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String },
}, { _id: false });

const OrderSchema = new Schema<IOrder>(
    {
        orderNumber: { type: String, required: true, unique: true, index: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        items: [OrderItemSchema],
        shippingAddress: ShippingAddressSchema,
        paymentMethod: { type: String, default: 'paystack' },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
            index: true
        },
        paymentReference: { type: String, required: true, unique: true, index: true },
        orderStatus: {
            type: String,
            enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
            default: 'pending',
            index: true
        },
        statusHistory: [{
            status: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            changedBy: { type: String },
            note: { type: String },
        }],
        isNewOrder: { type: Boolean, default: true, index: true },
        trackingNumber: { type: String },
        subtotal: { type: Number, required: true },
        shippingFee: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        total: { type: Number, required: true },
        currency: { type: String, default: 'KES' },
        notes: { type: String },
    },
    { timestamps: true }
);

// Generate unique order number before saving
OrderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const year = new Date().getFullYear();
        const count = await mongoose.models.Order?.countDocuments() || 0;
        const orderNum = (count + 1).toString().padStart(5, '0');
        this.orderNumber = `#SWU-${year}-${orderNum}`;
    }

    // Initialize status history if empty
    if (!this.statusHistory || this.statusHistory.length === 0) {
        this.statusHistory = [{
            status: this.orderStatus,
            timestamp: new Date(),
            changedBy: 'system',
            note: 'Order created',
        }];
    }

    next();
});

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

