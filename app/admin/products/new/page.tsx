"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    slug: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    price: z.string().min(1, "Price is required"),
    discountPrice: z.string().optional(),
    stock: z.string().min(1, "Stock is required"),
    category: z.string().min(1, "Category is required"),
    images: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
    });

    const nameValue = watch("name");

    // Auto-generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
    };

    const onSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true);
        try {
            const slug = data.slug || generateSlug(data.name);
            const images = data.images ? data.images.split(",").map((img) => img.trim()) : [];

            const response = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    slug,
                    images,
                    price: parseFloat(data.price),
                    discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : undefined,
                    stock: parseInt(data.stock),
                }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Product created successfully");
                router.push("/admin/products");
            } else {
                toast.error(result.message || "Failed to create product");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">New Product</h1>
                    <p className="text-muted-foreground">Add a new product to your store</p>
                </div>
                <Link href="/admin/products">
                    <Button variant="outline">Cancel</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        {...register("name")}
                                        placeholder="Enter product name"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        {...register("slug")}
                                        placeholder="Auto-generated from name"
                                        onChange={(e) => {
                                            if (!e.target.value && nameValue) {
                                                setValue("slug", generateSlug(nameValue));
                                            }
                                        }}
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-red-500">{errors.slug.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <textarea
                                        id="description"
                                        {...register("description")}
                                        rows={6}
                                        className="w-full p-2 border rounded-md bg-background"
                                        placeholder="Enter product description"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (KES) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            {...register("price")}
                                            placeholder="0.00"
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-red-500">{errors.price.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="discountPrice">Discount Price (KES)</Label>
                                        <Input
                                            id="discountPrice"
                                            type="number"
                                            step="0.01"
                                            {...register("discountPrice")}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="images">Image URLs (comma-separated)</Label>
                                    <Input
                                        id="images"
                                        {...register("images")}
                                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter image URLs separated by commas
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inventory</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Quantity *</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        {...register("stock")}
                                        placeholder="0"
                                    />
                                    {errors.stock && (
                                        <p className="text-sm text-red-500">{errors.stock.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Input
                                        id="category"
                                        {...register("category")}
                                        placeholder="e.g., Electronics"
                                    />
                                    {errors.category && (
                                        <p className="text-sm text-red-500">{errors.category.message}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating..." : "Create Product"}
                            </Button>
                            <Link href="/admin/products">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

