"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Printer } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface OrderItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    user: {
        name: string;
        email: string;
    };
    items: OrderItem[];
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone?: string;
    };
    paymentStatus: string;
    paymentReference: string;
    orderStatus: string;
    statusHistory?: Array<{
        status: string;
        timestamp: string;
        changedBy?: string;
        note?: string;
    }>;
    trackingNumber?: string;
    subtotal: number;
    shippingFee: number;
    tax: number;
    total: number;
    createdAt: string;
}

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState<string>("");
    const [trackingNumber, setTrackingNumber] = useState<string>("");
    const [note, setNote] = useState<string>("");

    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`);
            const data = await response.json();
            if (data.success) {
                setOrder(data.order);
                setStatus(data.order.orderStatus);
                setTrackingNumber(data.order.trackingNumber || "");
            } else {
                toast.error("Order not found");
                router.push("/admin/orders");
            }
        } catch (error) {
            toast.error("Failed to load order");
            router.push("/admin/orders");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!order || status === order.orderStatus) return;

        setIsUpdating(true);
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderStatus: status,
                    trackingNumber: trackingNumber || undefined,
                    note: note || undefined,
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Order status updated and customer notified");
                setNote("");
                fetchOrder();
            } else {
                toast.error(data.message || "Failed to update order");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Order Details</h1>
                        <p className="text-muted-foreground">{order.orderNumber}</p>
                    </div>
                </div>
                <Button onClick={handlePrintInvoice}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Invoice
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">
                                                KSh {(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                KSh {item.price.toLocaleString()} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="font-medium">{order.shippingAddress.fullName}</p>
                                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                                <p className="text-muted-foreground">
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                </p>
                                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                                {order.shippingAddress.phone && (
                                    <p className="text-muted-foreground">
                                        Phone: {order.shippingAddress.phone}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status History */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Status History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.statusHistory.map((history, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full ${index === order.statusHistory!.length - 1
                                                        ? 'bg-primary'
                                                        : 'bg-muted'
                                                    }`} />
                                                {index < order.statusHistory!.length - 1 && (
                                                    <div className="w-0.5 h-8 bg-muted mt-1" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4 last:pb-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium capitalize">{history.status}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(history.timestamp), "MMM dd, yyyy HH:mm")}
                                                    </p>
                                                </div>
                                                {history.note && (
                                                    <p className="text-sm text-muted-foreground mt-1">{history.note}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Order Date</p>
                                <p className="font-medium">
                                    {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Customer</p>
                                <p className="font-medium">{order.user?.name || "N/A"}</p>
                                <p className="text-sm text-muted-foreground">{order.user?.email || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Payment Reference</p>
                                <p className="font-medium font-mono text-xs">{order.paymentReference}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Order Status</p>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>
                                {status === "shipped" && (
                                    <div className="mt-2">
                                        <label className="text-xs text-muted-foreground mb-1 block">Tracking Number (Optional)</label>
                                        <input
                                            type="text"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            placeholder="Enter tracking number"
                                            className="w-full p-2 border rounded-md bg-background text-sm"
                                        />
                                    </div>
                                )}
                                <div className="mt-2">
                                    <label className="text-xs text-muted-foreground mb-1 block">Note (Optional)</label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add a note for this status change"
                                        rows={2}
                                        className="w-full p-2 border rounded-md bg-background text-sm"
                                    />
                                </div>
                                <Button
                                    className="w-full mt-2"
                                    onClick={handleStatusUpdate}
                                    disabled={isUpdating || status === order.orderStatus}
                                >
                                    {isUpdating ? "Updating..." : "Update Status"}
                                </Button>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Payment Status</p>
                                <p className="font-medium capitalize">{order.paymentStatus}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>KSh {order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>KSh {order.shippingFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>KSh {order.tax.toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>KSh {order.total.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

