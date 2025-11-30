"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Heart, 
    MapPin, 
    User,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const accountNavItems = [
    { href: "/account", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/account/wishlist", label: "My Wishlist", icon: Heart },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/details", label: "Account Details", icon: User },
];

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth();
            setIsLoading(false);

            if (!isAuthenticated) {
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            }
        };

        verifyAuth();
    }, [isAuthenticated, checkAuth, router, pathname]);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        router.push("/");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                        My Account
                    </h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row pt-16 lg:pt-0">
                {/* Sidebar */}
                <aside className="lg:fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40 hidden lg:block">
                    <div className="p-6 border-b border-border">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                            My Account
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">Welcome, {user.name}</p>
                    </div>
                    <nav className="p-4 space-y-2">
                        {accountNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (item.href !== "/account" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </aside>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 bg-background z-40 pt-16">
                        <nav className="p-4 space-y-2">
                            {accountNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || (item.href !== "/account" && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full justify-start mt-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </nav>
                    </div>
                )}

                {/* Main Content */}
                <main className="lg:ml-64 flex-1">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

