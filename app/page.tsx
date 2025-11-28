import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// We need a client component for the Hero Carousel to use plugins
import HeroCarousel from "@/components/layout/HeroCarousel";

async function getFeaturedCategories() {
  await connectToDatabase();
  const categories = await Category.find().limit(6).lean();
  return JSON.parse(JSON.stringify(categories));
}

async function getTrendingProducts() {
  await connectToDatabase();
  const products = await Product.find({ isTrending: true }).limit(8).lean();
  return JSON.parse(JSON.stringify(products));
}

async function getNewArrivals() {
  await connectToDatabase();
  const products = await Product.find({ isNewArrival: true }).limit(8).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function Home() {
  const categories = await getFeaturedCategories();
  const trendingProducts = await getTrendingProducts();
  const newArrivals = await getNewArrivals();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Featured Categories */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          <Link href="/categories" className="text-sm font-medium text-primary hover:underline flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category: any) => (
            <Link
              key={category._id}
              href={`/category/${category.slug}`}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-all"
            >
              <div className="relative h-24 w-24 mb-4 overflow-hidden rounded-full bg-muted">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-muted-foreground uppercase">
                    {category.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium group-hover:text-primary">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Trending Now</h2>
            <Link href="/trending" className="text-sm font-medium text-primary hover:underline flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {trendingProducts.map((product: any) => (
                <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
          <Link href="/new-arrivals" className="text-sm font-medium text-primary hover:underline flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Join Our Newsletter</h2>
          <p className="max-w-[600px] text-primary-foreground/80">
            Sign up for our newsletter to receive updates on new arrivals, special offers, and exclusive discounts.
          </p>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
