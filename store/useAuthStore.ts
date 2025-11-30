import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: 'user' | 'admin';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    sendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
    verifyOTP: (email: string, otp: string, name: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            setUser: (user) => {
                set({ user, isAuthenticated: !!user });
            },

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (data.success && data.user) {
                        set({ user: data.user, isAuthenticated: true, isLoading: false });
                        return { success: true, message: data.message, user: data.user };
                    } else {
                        set({ isLoading: false });
                        return { success: false, message: data.message || 'Login failed' };
                    }
                } catch (error: any) {
                    set({ isLoading: false });
                    return { success: false, message: error.message || 'An error occurred during login' };
                }
            },

            register: async (name, email, password) => {
                // This method is kept for backward compatibility but won't be used in new flow
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, email, password }),
                    });

                    const data = await response.json();

                    if (data.success && data.user) {
                        set({ user: data.user, isAuthenticated: true, isLoading: false });
                        return { success: true, message: data.message };
                    } else {
                        set({ isLoading: false });
                        return { success: false, message: data.message || 'Registration failed' };
                    }
                } catch (error: any) {
                    set({ isLoading: false });
                    return { success: false, message: error.message || 'An error occurred during registration' };
                }
            },

            sendOTP: async (email) => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/auth/send-otp', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });

                    const data = await response.json();
                    set({ isLoading: false });
                    
                    return { 
                        success: data.success, 
                        message: data.message,
                    };
                } catch (error: any) {
                    set({ isLoading: false });
                    return { success: false, message: error.message || 'An error occurred while sending OTP' };
                }
            },

            verifyOTP: async (email, otp, name, password) => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/auth/verify-otp', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, otp, name, password }),
                    });

                    const data = await response.json();

                    if (data.success && data.user) {
                        set({ user: data.user, isAuthenticated: true, isLoading: false });
                        return { success: true, message: data.message };
                    } else {
                        set({ isLoading: false });
                        return { success: false, message: data.message || 'OTP verification failed' };
                    }
                } catch (error: any) {
                    set({ isLoading: false });
                    return { success: false, message: error.message || 'An error occurred during OTP verification' };
                }
            },

            logout: async () => {
                try {
                    await fetch('/api/auth/logout', {
                        method: 'POST',
                    });
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    set({ user: null, isAuthenticated: false });
                }
            },

            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/auth/me');
                    const data = await response.json();

                    if (data.success && data.user) {
                        set({ user: data.user, isAuthenticated: true, isLoading: false });
                    } else {
                        set({ user: null, isAuthenticated: false, isLoading: false });
                    }
                } catch (error) {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);

