"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupPage() {
    const router = useRouter();
    const { verifyOTP, sendOTP, isAuthenticated, isLoading } = useAuthStore();
    const { toast } = useToast();
    const [step, setStep] = useState<"form" | "otp">("form");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailValid, setEmailValid] = useState<boolean | null>(null);
    const [emailTouched, setEmailTouched] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    // Enhanced email validation
    const validateEmail = (email: string): boolean => {
        if (!email || email.trim().length === 0) {
            return false;
        }
        // More strict email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailRegex.test(email) && email.length <= 254;

        // Additional checks
        if (!isValid) return false;

        // Check for common invalid patterns
        if (email.includes('..')) return false;
        if (email.startsWith('.') || email.startsWith('@')) return false;
        if (email.includes('@.') || email.includes('.@')) return false;

        return true;
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setEmailTouched(true);

        // Only validate if user has typed something
        if (value.trim().length > 0) {
            // Don't show valid until email is complete (has @ and domain)
            if (value.includes('@') && value.includes('.')) {
                setEmailValid(validateEmail(value));
            } else {
                // Still typing, don't show invalid yet
                setEmailValid(null);
            }
        } else {
            setEmailValid(null);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !validateEmail(trimmedEmail)) {
            setEmailValid(false);
            setEmailTouched(true);
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address (e.g., name@example.com)",
                variant: "destructive",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Password Mismatch",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Password Too Short",
                description: "Password must be at least 6 characters",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        // Send OTP with normalized email
        const result = await sendOTP(trimmedEmail);

        if (result.success) {
            toast({
                title: "OTP Sent",
                description: `A verification code has been sent to ${trimmedEmail}. Please check your email.`,
            });
            setStep("otp");
        } else {
            // Check if error is about duplicate email
            if (result.message.toLowerCase().includes('already exists') ||
                result.message.toLowerCase().includes('already registered')) {
                toast({
                    title: "Email Already Registered",
                    description: result.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Failed to Send OTP",
                    description: result.message,
                    variant: "destructive",
                });
            }
        }

        setIsSubmitting(false);
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast({
                title: "Invalid OTP",
                description: "OTP must be 6 digits",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        const result = await verifyOTP(email, otp, name, password);

        if (result.success) {
            toast({
                title: "Registration Successful",
                description: "Account created and verified successfully!",
            });
            router.push("/");
        } else {
            toast({
                title: "Verification Failed",
                description: result.message,
                variant: "destructive",
            });
        }

        setIsSubmitting(false);
    };

    const handleResendOTP = async () => {
        setIsSubmitting(true);
        const trimmedEmail = email.trim();
        const result = await sendOTP(trimmedEmail);

        if (result.success) {
            toast({
                title: "OTP Resent",
                description: `A new verification code has been sent to ${trimmedEmail}`,
            });
        } else {
            toast({
                title: "Failed to Resend OTP",
                description: result.message,
                variant: "destructive",
            });
        }
        setIsSubmitting(false);
    };

    if (step === "otp") {
        return (
            <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-16">
                <div className="w-full max-w-md space-y-8 p-8 rounded-lg border bg-card shadow-lg">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-violet-100 dark:bg-violet-900/20 rounded-full flex items-center justify-center mb-4">
                            <Mail className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                            Verify Your Email
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            We&apos;ve sent a 6-digit code to <strong>{email}</strong>
                        </p>
                    </div>

                    <form onSubmit={handleOTPSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="otp" className="text-sm font-medium">
                                Enter Verification Code
                            </label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                required
                                disabled={isSubmitting || isLoading}
                                className="w-full text-center text-2xl tracking-widest font-mono"
                                maxLength={6}
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                Enter the 6-digit code sent to your email
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
                            disabled={isSubmitting || isLoading || otp.length !== 6}
                        >
                            {isSubmitting || isLoading ? "Verifying..." : "Verify & Create Account"}
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={isSubmitting || isLoading}
                                className="text-sm text-violet-500 hover:text-violet-600 font-medium disabled:opacity-50"
                            >
                                Resend OTP
                            </button>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setStep("form")}
                                disabled={isSubmitting || isLoading}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                ← Back to form
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-16">
            <div className="w-full max-w-md space-y-8 p-8 rounded-lg border bg-card shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                        Create Account
                    </h1>
                    <p className="mt-2 text-muted-foreground">Sign up to get started</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder=""
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSubmitting || isLoading}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                onBlur={() => setEmailTouched(true)}
                                required
                                disabled={isSubmitting || isLoading}
                                className={cn(
                                    "w-full pr-10",
                                    emailTouched && emailValid === false && "border-red-500 focus:border-red-500",
                                    emailTouched && emailValid === true && "border-green-500 focus:border-green-500"
                                )}
                            />
                            {emailTouched && email.length > 0 && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {emailValid ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                            )}
                        </div>
                        {emailTouched && email.length > 0 && emailValid === false && (
                            <p className="text-xs flex items-center gap-1 text-red-600 dark:text-red-400">
                                <XCircle className="h-3 w-3" />
                                Invalid email format. Please check and try again.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting || isLoading}
                            className="w-full"
                        />
                        {password.length > 0 && password.length < 6 && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                                Password must be at least 6 characters
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                        </label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isSubmitting || isLoading}
                            className={cn(
                                "w-full",
                                confirmPassword.length > 0 && password !== confirmPassword && "border-red-500"
                            )}
                        />
                        {confirmPassword.length > 0 && password !== confirmPassword && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
                        disabled={isSubmitting || isLoading || (emailTouched && emailValid === false)}
                    >
                        {isSubmitting || isLoading ? "Sending OTP..." : "Continue"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link href="/login" className="text-violet-500 hover:text-violet-600 font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

