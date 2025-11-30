"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { User, Mail, Phone, Lock } from "lucide-react";

const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AccountDetailsPage() {
    const router = useRouter();
    const { user, checkAuth } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        setValue: setProfileValue,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {
        const loadUserData = async () => {
            await checkAuth();
            if (user) {
                setProfileValue("name", user.name);
                setProfileValue("email", user.email);
            }
            setIsLoading(false);
        };
        loadUserData();
    }, [user, checkAuth, setProfileValue]);

    const handleProfileSubmit = async (data: ProfileFormData) => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Profile updated successfully");
                await checkAuth(); // Refresh user data
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSubmit = async (data: PasswordFormData) => {
        setIsChangingPassword(true);
        try {
            const response = await fetch("/api/user/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Password changed successfully");
                resetPassword();
            } else {
                toast.error(result.message || "Failed to change password");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsChangingPassword(false);
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
                <h1 className="text-3xl font-bold">Account Details</h1>
                <p className="text-muted-foreground">Manage your personal information and password</p>
            </div>

            {/* Profile Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitProfile(handleProfileSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    {...registerProfile("name")}
                                    className="pl-10"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {profileErrors.name && (
                                <p className="text-sm text-red-500">{profileErrors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    {...registerProfile("email")}
                                    className="pl-10"
                                    placeholder="Enter your email"
                                    disabled={user?.role !== 'admin'}
                                />
                            </div>
                            {user?.role !== 'admin' && (
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed. Contact support if you need to update your email.
                                </p>
                            )}
                            {profileErrors.email && (
                                <p className="text-sm text-red-500">{profileErrors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    {...registerProfile("phone")}
                                    className="pl-10"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            {profileErrors.phone && (
                                <p className="text-sm text-red-500">{profileErrors.phone.message}</p>
                            )}
                        </div>

                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitPassword(handlePasswordSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password *</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                {...registerPassword("currentPassword")}
                                placeholder="Enter current password"
                            />
                            {passwordErrors.currentPassword && (
                                <p className="text-sm text-red-500">
                                    {passwordErrors.currentPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password *</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                {...registerPassword("newPassword")}
                                placeholder="Enter new password"
                            />
                            {passwordErrors.newPassword && (
                                <p className="text-sm text-red-500">
                                    {passwordErrors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...registerPassword("confirmPassword")}
                                placeholder="Confirm new password"
                            />
                            {passwordErrors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {passwordErrors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={isChangingPassword}>
                            {isChangingPassword ? "Changing..." : "Change Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

