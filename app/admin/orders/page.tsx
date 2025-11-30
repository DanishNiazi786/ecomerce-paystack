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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Order {
    _id: string;
    orderNumber: string;
    user: {
        name: string;
        email: string;
    };
    total: number;
    orderStatus: string;
    paymentStatus: string;
    isNewOrder?: boolean;
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, statusFilter]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("search", searchQuery);
            if (statusFilter !== "all") params.append("status", statusFilter);

            const response = await fetch(`/api/admin/orders?${params.toString()}`);
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground">Manage customer orders</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by order number, customer name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
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
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No orders found
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order Number</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <span>{order.orderNumber}</span>
                                                {order.isNewOrder && (
                                                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{order.user?.name || "N/A"}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.user?.email || "N/A"}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold">
                                                KSh {order.total.toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`text-xs px-2 py-1 rounded capitalize ${order.orderStatus === "delivered"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.orderStatus === "cancelled"
                                                        ? "bg-red-100 text-red-800"
                                                        : order.orderStatus === "shipped"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${order.paymentStatus === "paid"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/orders/${order._id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
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

