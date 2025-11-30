"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Search, Menu, User, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const cartItems = useCartStore((state) => state.items);
    const wishlistItems = useWishlistStore((state) => state.items);
    const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
    const { setTheme, theme } = useTheme();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
                isScrolled ? "glass border-white/10 dark:border-white/5 py-2" : "bg-transparent py-4"
            )}
        >
            <div className="container flex items-center justify-between h-16 px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500 transition-all group-hover:opacity-80">
                        ShopWithUs
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {['New Arrivals', 'Trending', 'Collections', 'Accessories'].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase().replace(' ', '-')}`}
                            className="relative text-muted-foreground hover:text-foreground transition-colors after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-gradient-to-r after:from-violet-500 after:to-cyan-500 after:transition-all hover:after:w-full"
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                {/* Search Bar */}
                <div className={cn(
                    "hidden md:flex relative transition-all duration-300",
                    isSearchFocused ? "w-96" : "w-64"
                )}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search luxury..."
                        className="pl-10 bg-secondary/50 border-transparent focus:bg-background focus:border-violet-500/50 transition-all rounded-full"
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full hover:bg-secondary/80 transition-colors"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hidden md:flex rounded-full hover:bg-secondary/80">
                                    <User className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="icon" className="hidden md:flex rounded-full hover:bg-secondary/80">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}

                    <Link href="/wishlist">
                        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-secondary/80">
                            <Heart className="h-5 w-5" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-[10px] font-bold text-white flex items-center justify-center animate-scale-in">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Button>
                    </Link>

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-secondary/80">
                            <ShoppingCart className="h-5 w-5" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-[10px] font-bold text-white flex items-center justify-center animate-scale-in">
                                    {cartItems.length}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="glass border-r border-white/10">
                            <div className="flex flex-col gap-8 mt-8">
                                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                                    LUXE.
                                </Link>
                                <nav className="flex flex-col gap-4">
                                    {['New Arrivals', 'Trending', 'Collections', 'Accessories'].map((item) => (
                                        <Link
                                            key={item}
                                            href={`/${item.toLowerCase().replace(' ', '-')}`}
                                            className="text-lg font-medium hover:text-violet-500 transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
