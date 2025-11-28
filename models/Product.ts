import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    images: string[];
    category: string;
    stock: number;
    rating: number;
    numReviews: number;
    isFeatured: boolean;
    isTrending: boolean;
    isNewArrival: boolean;
    tags: string[];
    attributes: {
        name: string;
        value: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        images: [{ type: String, required: true }],
        category: { type: String, required: true, index: true },
        stock: { type: Number, required: true, default: 0 },
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
        isTrending: { type: Boolean, default: false },
        isNewArrival: { type: Boolean, default: false },
        tags: [{ type: String }],
        attributes: [
            {
                name: { type: String },
                value: { type: String },
            },
        ],
    },
    { timestamps: true }
);

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
