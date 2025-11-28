"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const pathname = usePathname();

    const links = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/search", icon: Search, label: "Search" },
        { href: "/cart", icon: ShoppingBag, label: "Cart" },
        { href: "/wishlist", icon: Heart, label: "Wishlist" },
        { href: "/profile", icon: User, label: "Profile" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="glass border-t border-white/10 px-6 py-4 pb-6">
                <nav className="flex items-center justify-between">
                    {links.map(({ href, icon: Icon, label }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex flex-col items-center gap-1 transition-all duration-300",
                                    isActive ? "text-violet-500 scale-110" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                                <span className="text-[10px] font-medium">{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
