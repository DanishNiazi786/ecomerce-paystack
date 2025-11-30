"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading } = useAuthStore();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
            router.push("/");
        } else {
            toast({
                title: "Login Failed",
                description: result.message,
                variant: "destructive",
            });
        }

        setIsSubmitting(false);
    };

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-16">
            <div className="w-full max-w-md space-y-8 p-8 rounded-lg border bg-card shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-muted-foreground">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting || isLoading}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting || isLoading}
                            className="w-full"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting || isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <Link href="/signup" className="text-violet-500 hover:text-violet-600 font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}

