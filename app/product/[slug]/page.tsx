import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getProduct(slug: string) {
    await connectToDatabase();
    const product = await Product.findOne({ slug }).lean();
    return JSON.parse(JSON.stringify(product));
}

async function getRelatedProducts(category: string, currentProductId: string) {
    await connectToDatabase();
    const products = await Product.find({ category, _id: { $ne: currentProductId } }).limit(4).lean();
    return JSON.parse(JSON.stringify(products));
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.category, product._id);

    return (
        <div className="container py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <ProductGallery images={product.images} />
                <ProductInfo product={product} />
            </div>

            {/* Related Products */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map((relatedProduct: any) => (
                        <ProductCard key={relatedProduct._id} product={relatedProduct} />
                    ))}
                </div>
            </div>
        </div>
    );
}
