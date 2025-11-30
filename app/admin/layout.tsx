"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    FolderTree, 
    BarChart3,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const verifyAdmin = async () => {
            await checkAuth();
            setIsLoading(false);

            if (!isAuthenticated || user?.role !== 'admin') {
                router.push('/login?redirect=/admin');
            }
        };

        verifyAdmin();
    }, [isAuthenticated, user, checkAuth, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40 hidden lg:block">
                <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                        Admin Panel
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Welcome, {user.name}</p>
                </div>
                <nav className="p-4 space-y-2">
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    "hover:bg-secondary text-muted-foreground hover:text-foreground"
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
                        className="w-full justify-start"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                        Admin Panel
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

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-background z-40 pt-16">
                    <nav className="p-4 space-y-2">
                        {adminNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                        "hover:bg-secondary text-muted-foreground hover:text-foreground"
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
                            className="w-full justify-start mt-4"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 lg:pt-0">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

