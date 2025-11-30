"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, Package } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    orderStatus: string;
    createdAt: string;
    items: any[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, currentPage]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.append("status", statusFilter);
            params.append("page", currentPage.toString());

            const response = await fetch(`/api/user/orders?${params.toString()}`);
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded w-48"></div>
                <div className="h-64 bg-muted animate-pulse rounded"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <p className="text-muted-foreground">View and track your orders</p>
                </div>
                <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent className="p-0">
                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">No orders found</p>
                            <Link href="/">
                                <Button>Start Shopping</Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order Number</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order._id}>
                                            <TableCell className="font-medium">
                                                {order.orderNumber}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {order.items?.length || 0} item(s)
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-bold">
                                                    KSh {order.total.toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded capitalize ${order.orderStatus === "delivered"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            : order.orderStatus === "cancelled" || order.orderStatus === "refunded"
                                                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                                : order.orderStatus === "shipped"
                                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                                    : order.orderStatus === "processing"
                                                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                        }`}
                                                >
                                                    {order.orderStatus}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/account/orders/${order._id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between p-4 border-t">
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

