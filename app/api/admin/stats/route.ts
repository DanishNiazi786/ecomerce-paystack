import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/admin-auth";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";

export async function GET(request: NextRequest) {
    try {
        const { user, error } = await verifyAdmin(request);
        if (error) return error;
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const now = new Date();
        const todayStart = startOfDay(now);
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const monthStart = startOfMonth(now);

        // Sales calculations
        const salesToday = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: todayStart },
                    paymentStatus: 'paid',
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        const salesThisWeek = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: weekStart },
                    paymentStatus: 'paid',
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        const salesThisMonth = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart },
                    paymentStatus: 'paid',
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        // Total orders
        const totalOrders = await Order.countDocuments();

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusMap: Record<string, number> = {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        };

        ordersByStatus.forEach((item: any) => {
            if (item._id in statusMap) {
                statusMap[item._id] = item.count;
            }
        });

        // Recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email')
            .lean();

        return NextResponse.json({
            success: true,
            data: {
                salesToday: salesToday[0]?.total || 0,
                salesThisWeek: salesThisWeek[0]?.total || 0,
                salesThisMonth: salesThisMonth[0]?.total || 0,
                totalOrders,
                ordersByStatus: statusMap,
                recentOrders,
            }
        });
    } catch (error: any) {
        console.error("Stats error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred",
            },
            { status: 500 }
        );
    }
}

