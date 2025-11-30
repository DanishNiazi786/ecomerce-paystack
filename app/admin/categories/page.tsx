"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/admin/categories");
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            toast.error("Failed to fetch categories");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Category deleted successfully");
                fetchCategories();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-muted-foreground">Manage product categories</p>
                </div>
                <Button onClick={() => toast.info("Create category modal - implement as needed")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {isLoading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No categories found
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category._id}>
                                        <TableCell>
                                            {category.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-muted rounded"></div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category.slug}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {category.description || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(category._id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

