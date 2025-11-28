import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutPage() {
    return (
        <div className="container py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            <p className="text-muted-foreground mb-8">
                This is a demo checkout page. In a real application, this would integrate with Paystack.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Pay with Paystack
            </Button>
            <div className="mt-8">
                <Link href="/" className="text-primary hover:underline">
                    Return to Store
                </Link>
            </div>
        </div>
    );
}
