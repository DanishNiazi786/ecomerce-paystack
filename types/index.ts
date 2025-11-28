export interface Product {
    _id: string;
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
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
}
