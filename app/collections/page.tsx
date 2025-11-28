import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Link from "next/link";
import Image from "next/image";

async function getCategories() {
    await connectToDatabase();
    const categories = await Category.find().lean();
    return JSON.parse(JSON.stringify(categories));
}

export default async function CollectionsPage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                        Collections
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground text-lg">
                        Browse our curated collections by category.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {categories.map((category: any) => (
                        <Link
                            key={category._id}
                            href={`/category/${category.slug}`}
                            className="group relative overflow-hidden rounded-2xl aspect-[4/3] border border-white/10 glass hover:shadow-2xl transition-all duration-500"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-3xl font-bold text-white tracking-tight mb-2 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                                    {category.name}
                                </h3>
                                <span className="inline-block px-4 py-2 rounded-full border border-white/30 text-white text-sm backdrop-blur-md opacity-0 transform translate-y-8 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                                    Explore Collection
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
