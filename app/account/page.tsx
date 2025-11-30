"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ShoppingBag,
    Clock,
    Heart,
    ArrowRight,
    Package
} from "lucide-react";
import { format } from "date-fns";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";

interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    wishlistItems: number;
    recentOrders: any[];
}

export default function AccountDashboard() {
    const { user } = useAuthStore();
    const wishlistItems = useWishlistStore((state) => state.items);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/user/dashboard');
            const data = await response.json();
            if (data.success) {
                setStats({
                    ...data.data,
                    wishlistItems: wishlistItems.length,
                });
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 bg-muted animate-pulse rounded w-64"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-muted animate-pulse rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
                </h1>
                <p className="text-muted-foreground">
                    Here&apos;s what&apos;s happening with your account
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All time orders
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Awaiting fulfillment
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.wishlistItems || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Saved for later
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <Link href="/account/orders">
                            <Button variant="ghost" size="sm">
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentOrders.map((order: any) => (
                                <div
                                    key={order._id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Package className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{order.orderNumber}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-bold">KSh {order.total.toLocaleString()}</p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded capitalize ${order.orderStatus === "delivered"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                    : order.orderStatus === "cancelled"
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                        : order.orderStatus === "shipped"
                                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                    }`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                        <Link href={`/account/orders/${order._id}`}>
                                            <Button variant="outline" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">No orders yet</p>
                            <Link href="/">
                                <Button>Start Shopping</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Continue Shopping</p>
                                <p className="text-sm text-muted-foreground">Browse our latest collection</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/account/orders">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="font-semibold">View All Orders</p>
                                <p className="text-sm text-muted-foreground">See your complete order history</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}

