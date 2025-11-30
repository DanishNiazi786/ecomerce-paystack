"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    DollarSign, 
    ShoppingCart, 
    Package, 
    TrendingUp,
    Clock,
    CheckCircle2,
    Truck,
    XCircle
} from "lucide-react";
import { format } from "date-fns";

interface DashboardStats {
    salesToday: number;
    salesThisWeek: number;
    salesThisMonth: number;
    totalOrders: number;
    ordersByStatus: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    recentOrders: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your store performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KSh {stats?.salesToday.toLocaleString() || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales This Week</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KSh {stats?.salesThisWeek.toLocaleString() || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales This Month</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KSh {stats?.salesThisMonth.toLocaleString() || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Order Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Orders by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                    <span>Pending</span>
                                </div>
                                <span className="font-bold">{stats?.ordersByStatus.pending || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-blue-500" />
                                    <span>Processing</span>
                                </div>
                                <span className="font-bold">{stats?.ordersByStatus.processing || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-purple-500" />
                                    <span>Shipped</span>
                                </div>
                                <span className="font-bold">{stats?.ordersByStatus.shipped || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span>Delivered</span>
                                </div>
                                <span className="font-bold">{stats?.ordersByStatus.delivered || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span>Cancelled</span>
                                </div>
                                <span className="font-bold">{stats?.ordersByStatus.cancelled || 0}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map((order: any) => (
                                    <div key={order._id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div>
                                            <p className="font-medium">{order.orderNumber}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">KSh {order.total.toLocaleString()}</p>
                                            <p className="text-sm text-muted-foreground capitalize">{order.orderStatus}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-4">No recent orders</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

