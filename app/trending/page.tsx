import { ProductCard } from "@/components/product/ProductCard";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";

async function getTrendingProducts() {
    await connectToDatabase();
    const products = await Product.find({ isTrending: true }).sort({ rating: -1 }).lean();
    return JSON.parse(JSON.stringify(products));
}

export default async function TrendingPage() {
    const products = await getTrendingProducts();

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                        Trending Now
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground text-lg">
                        Explore the most popular items loved by our community.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product: any) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground">No trending items at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
