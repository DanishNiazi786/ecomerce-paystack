"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapPin, Plus } from "lucide-react";
import { toast } from "sonner";

const PaystackPaymentButton = dynamic(() => import("@/components/PaystackButton"), { ssr: false });

interface SavedAddress {
    _id: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export default function CheckoutPage() {
    const { items, totalPrice } = useCartStore();
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("Kenya");
    const [phone, setPhone] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [useManualEntry, setUseManualEntry] = useState(false);

    useEffect(() => {
        setIsClient(true);
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isAuthenticated && user) {
            setEmail(user.email || "");
            fetchSavedAddresses();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (selectedAddressId && savedAddresses.length > 0) {
            const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
            if (selectedAddress) {
                setFullName(selectedAddress.fullName);
                setAddress(selectedAddress.address);
                setCity(selectedAddress.city);
                setPostalCode(selectedAddress.postalCode);
                setCountry(selectedAddress.country);
                setPhone(selectedAddress.phone || "");
                setUseManualEntry(false);
            }
        }
    }, [selectedAddressId, savedAddresses]);

    const fetchSavedAddresses = async () => {
        try {
            const response = await fetch("/api/user/addresses");
            const data = await response.json();
            if (data.success && data.addresses.length > 0) {
                setSavedAddresses(data.addresses);
                // Auto-select default address if available
                const defaultAddress = data.addresses.find((addr: SavedAddress) => addr.isDefault);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress._id);
                } else {
                    setSelectedAddressId(data.addresses[0]._id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        }
    };

    const handleAddressSelect = (addressId: string) => {
        if (addressId === "manual") {
            setUseManualEntry(true);
            setSelectedAddressId("");
            // Clear form fields
            setFullName("");
            setAddress("");
            setCity("");
            setPostalCode("");
            setCountry("Kenya");
            setPhone("");
        } else {
            setSelectedAddressId(addressId);
            setUseManualEntry(false);
        }
    };

    if (!isClient) {
        return null; // Prevent hydration mismatch
    }

    const total = totalPrice();

    if (items.length === 0) {
        return (
            <div className="container py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">
                    Add some products to your cart to proceed to checkout.
                </p>
                <Link href="/">
                    <Button>Return to Store</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-16 max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

            <div className="bg-card p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>KSh {total.toLocaleString()}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={isAuthenticated && user?.email ? true : false}
                    />
                    {isAuthenticated && user?.email && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Using your account email
                        </p>
                    )}
                </div>

                {/* Saved Addresses Selector */}
                {isAuthenticated && savedAddresses.length > 0 && (
                    <div>
                        <Label>Shipping Address</Label>
                        <Select
                            value={useManualEntry ? "manual" : selectedAddressId}
                            onValueChange={handleAddressSelect}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a saved address" />
                            </SelectTrigger>
                            <SelectContent>
                                {savedAddresses.map((addr) => (
                                    <SelectItem key={addr._id} value={addr._id}>
                                        {addr.fullName} - {addr.address}, {addr.city}
                                        {addr.isDefault && " (Default)"}
                                    </SelectItem>
                                ))}
                                <SelectItem value="manual">
                                    Enter new address
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {!useManualEntry && selectedAddressId && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Using saved address. You can edit the fields below if needed.
                            </p>
                        )}
                    </div>
                )}

                {/* Address Form Fields */}
                <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            setUseManualEntry(true);
                        }}
                        placeholder="Enter your full name"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setUseManualEntry(true);
                        }}
                        placeholder="Street address"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                setUseManualEntry(true);
                            }}
                            placeholder="City"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                            type="text"
                            id="postalCode"
                            value={postalCode}
                            onChange={(e) => {
                                setPostalCode(e.target.value);
                                setUseManualEntry(true);
                            }}
                            placeholder="Postal code"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                            type="text"
                            id="country"
                            value={country}
                            onChange={(e) => {
                                setCountry(e.target.value);
                                setUseManualEntry(true);
                            }}
                            placeholder="Country"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setUseManualEntry(true);
                            }}
                            placeholder="Phone number"
                        />
                    </div>
                </div>

                {isAuthenticated && savedAddresses.length === 0 && (
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                            Save addresses for faster checkout next time!
                        </p>
                        <Link href="/account/addresses">
                            <Button variant="outline" size="sm">
                                <MapPin className="h-4 w-4 mr-2" />
                                Manage Addresses
                            </Button>
                        </Link>
                    </div>
                )}

                {email && fullName && address && city && postalCode && country ? (
                    <PaystackPaymentButton 
                        amount={total} 
                        email={email}
                        metadata={{
                            items: items.map(item => ({
                                id: item.id,
                                name: item.name,
                                image: item.image,
                                price: item.price,
                                quantity: item.quantity,
                                slug: item.slug,
                            })),
                            shippingAddress: {
                                fullName,
                                address,
                                city,
                                postalCode,
                                country,
                                phone,
                            },
                            shippingFee: 0,
                            tax: 0,
                        }}
                    />
                ) : (
                    <Button disabled className="w-full">
                        Fill all required fields to proceed
                    </Button>
                )}
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="text-primary hover:underline">
                    Return to Store
                </Link>
            </div>
        </div>
    );
}
