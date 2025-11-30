import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAddress extends Document {
    user: mongoose.Types.ObjectId;
    type: 'shipping' | 'billing';
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        type: { type: String, enum: ['shipping', 'billing'], required: true },
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        postalCode: { type: String, required: true },
        country: { type: String, required: true, default: 'Kenya' },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Address: Model<IAddress> =
    mongoose.models.Address || mongoose.model<IAddress>('Address', AddressSchema);

export default Address;

