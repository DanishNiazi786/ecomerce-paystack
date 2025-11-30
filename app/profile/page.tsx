"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, LogOut } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router, checkAuth]);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="container py-16 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Account Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <div className="flex items-center gap-2 p-3 rounded-md border bg-background">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{user.name}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <div className="flex items-center gap-2 p-3 rounded-md border bg-background">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{user.email}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                        <div className="flex items-center gap-2 p-3 rounded-md border bg-background">
                            <span className="capitalize">{user.role}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <Button
                            onClick={handleLogout}
                            variant="destructive"
                            className="w-full"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

