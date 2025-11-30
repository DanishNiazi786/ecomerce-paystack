"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
    const router = useRouter();
    const { isAuthenticated, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
        // Redirect to new account section
        if (isAuthenticated) {
            router.replace("/account");
        } else {
            router.replace("/login?redirect=/account");
        }
    }, [isAuthenticated, router, checkAuth]);

    return null;
}

