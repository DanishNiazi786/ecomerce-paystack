"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Printer, ShoppingCart, CheckCircle2, Clock, Package, Truck } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";

interface OrderItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    slug: string;
}

interface Order {
    _id: string;
    orderNumber: string;
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

const statusIcons: Record<string, any> = {
    pending: Clock,
    paid: CheckCircle2,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle2,
    cancelled: Clock,
};

const statusColors: Record<string, string> = {
    pending: "text-yellow-600",
    paid: "text-blue-600",
    processing: "text-blue-600",
    shipped: "text-purple-600",
    delivered: "text-green-600",
    cancelled: "text-red-600",
};

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;
    const { addItem } = useCartStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/user/orders/${orderId}`);
            const data = await response.json();
            if (data.success) {
                setOrder(data.order);
            } else {
                toast.error("Order not found");
                router.push("/account/orders");
            }
        } catch (error) {
            toast.error("Failed to load order");
            router.push("/account/orders");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReorder = () => {
        if (!order) return;

        order.items.forEach((item) => {
            addItem({
                id: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                slug: item.slug,
            });
        });

        toast.success("Items added to cart");
        router.push("/cart");
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

    const StatusIcon = statusIcons[order.orderStatus] || Clock;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/account/orders">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Order Details</h1>
                        <p className="text-muted-foreground">{order.orderNumber}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleReorder} variant="outline">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Reorder
                    </Button>
                    <Button onClick={handlePrintInvoice}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print Invoice
                    </Button>
                </div>
            </div>

            {/* Order Status Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.statusHistory && order.statusHistory.length > 0 ? (
                            order.statusHistory.map((history, index) => {
                                const HistoryIcon = statusIcons[history.status] || Clock;
                                const isLatest = index === order.statusHistory!.length - 1;
                                return (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`p-2 rounded-full ${isLatest
                                                    ? `${statusColors[history.status]} bg-muted`
                                                    : 'bg-muted'
                                                }`}>
                                                <HistoryIcon className={`h-5 w-5 ${isLatest ? statusColors[history.status] : 'text-muted-foreground'}`} />
                                            </div>
                                            {index < order.statusHistory!.length - 1 && (
                                                <div className="w-0.5 h-12 bg-muted mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4 last:pb-0">
                                            <div className="flex items-center justify-between">
                                                <p className={`font-semibold capitalize ${isLatest ? statusColors[history.status] : 'text-muted-foreground'}`}>
                                                    {history.status}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(new Date(history.timestamp), "MMM dd, yyyy HH:mm")}
                                                </p>
                                            </div>
                                            {history.note && (
                                                <p className="text-sm text-muted-foreground mt-1">{history.note}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full bg-muted ${statusColors[order.orderStatus]}`}>
                                    <StatusIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-semibold capitalize">{order.orderStatus}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Ordered on {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    {order.trackingNumber && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Tracking Number</p>
                            <p className="font-mono text-lg">{order.trackingNumber}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0">
                                        <div className="relative w-16 h-16 rounded overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Link href={`/product/${item.slug}`}>
                                                <p className="font-medium hover:underline">{item.name}</p>
                                            </Link>
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

                    {/* Shipping Address */}
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
                </div>

                <div className="space-y-6">
                    {/* Order Summary */}
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

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Payment Status</p>
                                <p className="font-medium capitalize">{order.paymentStatus}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Payment Reference</p>
                                <p className="font-mono text-xs">{order.paymentReference}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

