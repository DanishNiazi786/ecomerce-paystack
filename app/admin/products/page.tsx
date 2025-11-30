"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Product {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    stock: number;
    category: string;
    images: string[];
    isFeatured: boolean;
    createdAt: string;
}

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchQuery]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/admin/products?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchQuery)}`
            );
            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            toast.error("Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Product deleted successfully");
                fetchProducts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">Manage your product catalog</p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Product
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products by name or SKU..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No products found
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product._id}>
                                            <TableCell>
                                                {product.images && product.images.length > 0 ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-muted rounded"></div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>
                                                {product.discountPrice ? (
                                                    <div>
                                                        <span className="line-through text-muted-foreground">
                                                            KSh {product.price.toLocaleString()}
                                                        </span>
                                                        <span className="ml-2 font-bold">
                                                            KSh {product.discountPrice.toLocaleString()}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>KSh {product.price.toLocaleString()}</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className={product.stock < 10 ? "text-red-500 font-bold" : ""}>
                                                    {product.stock}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {product.isFeatured ? (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        Featured
                                                    </span>
                                                ) : (
                                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                        Regular
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/product/${product.slug}`} target="_blank">
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/products/edit/${product._id}`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(product._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

