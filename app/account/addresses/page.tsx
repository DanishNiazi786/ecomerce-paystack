"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Address {
    _id: string;
    type: 'shipping' | 'billing';
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState({
        type: 'shipping' as 'shipping' | 'billing',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Kenya',
        isDefault: false,
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await fetch('/api/user/addresses');
            const data = await response.json();
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (error) {
            toast.error("Failed to fetch addresses");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenDialog = (address?: Address) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                type: address.type,
                fullName: address.fullName,
                phone: address.phone,
                address: address.address,
                city: address.city,
                state: address.state || '',
                postalCode: address.postalCode,
                country: address.country,
                isDefault: address.isDefault,
            });
        } else {
            setEditingAddress(null);
            setFormData({
                type: 'shipping',
                fullName: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'Kenya',
                isDefault: false,
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingAddress
                ? `/api/user/addresses/${editingAddress._id}`
                : '/api/user/addresses';
            const method = editingAddress ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(editingAddress ? "Address updated" : "Address added");
                setIsDialogOpen(false);
                fetchAddresses();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            const response = await fetch(`/api/user/addresses/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Address deleted");
                fetchAddresses();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            const response = await fetch(`/api/user/addresses/${id}/default`, {
                method: 'PUT',
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Default address updated");
                fetchAddresses();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded w-48"></div>
                <div className="h-64 bg-muted animate-pulse rounded"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Addresses</h1>
                    <p className="text-muted-foreground">Manage your shipping addresses</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingAddress
                                    ? 'Update your address information'
                                    : 'Add a new shipping address'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fullName: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address *</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData({ ...formData, city: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Postal Code *</Label>
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode}
                                        onChange={(e) =>
                                            setFormData({ ...formData, postalCode: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="state">State/Province</Label>
                                    <Input
                                        id="state"
                                        value={formData.state}
                                        onChange={(e) =>
                                            setFormData({ ...formData, state: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country *</Label>
                                    <Input
                                        id="country"
                                        value={formData.country}
                                        onChange={(e) =>
                                            setFormData({ ...formData, country: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isDefault: e.target.checked })
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor="isDefault">Set as default address</Label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingAddress ? 'Update' : 'Add'} Address
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {addresses.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No addresses saved</p>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Address
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <Card key={address._id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {address.type === 'shipping' ? 'Shipping' : 'Billing'} Address
                                    </CardTitle>
                                    {address.isDefault && (
                                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                            Default
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-4">
                                    <p className="font-medium">{address.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{address.address}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.city}, {address.postalCode}
                                    </p>
                                    {address.state && (
                                        <p className="text-sm text-muted-foreground">{address.state}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">{address.country}</p>
                                    <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                                </div>
                                <div className="flex gap-2">
                                    {!address.isDefault && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSetDefault(address._id)}
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Set Default
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleOpenDialog(address)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(address._id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

