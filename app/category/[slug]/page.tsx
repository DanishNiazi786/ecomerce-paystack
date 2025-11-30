import { ProductCard } from "@/components/product/ProductCard";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        sort?: string;
    }>;
}

async function getCategory(slug: string) {
    await connectToDatabase();
    const category = await Category.findOne({ slug }).lean();
    return JSON.parse(JSON.stringify(category));
}

async function getProductsByCategory(slug: string) {
    await connectToDatabase();
    const products = await Product.find({ category: slug }).lean();
    return JSON.parse(JSON.stringify(products));
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        notFound();
    }

    const products = await getProductsByCategory(slug);

    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-20">
                        <h2 className="text-lg font-semibold mb-4">Filters</h2>
                        <Accordion type="single" collapsible className="w-full" defaultValue="price">
                            <AccordionItem value="price">
                                <AccordionTrigger>Price Range</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="price-1" />
                                            <Label htmlFor="price-1">Under KSh 5,000</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="price-2" />
                                            <Label htmlFor="price-2">KSh 5,000 - KSh 10,000</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="price-3" />
                                            <Label htmlFor="price-3">KSh 10,000 - KSh 20,000</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="price-4" />
                                            <Label htmlFor="price-4">Over KSh 20,000</Label>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="brand">
                                <AccordionTrigger>Brand</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="brand-1" />
                                            <Label htmlFor="brand-1">Brand A</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="brand-2" />
                                            <Label htmlFor="brand-2">Brand B</Label>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold capitalize">{category.name}</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{products.length} Products</span>
                            {/* Sort Dropdown Stub */}
                            <Button variant="outline" size="sm">Sort by: Featured</Button>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No products found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product: any) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
