import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/category/electronics">Electronics</Link></li>
                            <li><Link href="/category/fashion">Fashion</Link></li>
                            <li><Link href="/category/accessories">Accessories</Link></li>
                            <li><Link href="/category/digital">Digital</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#">Contact Us</Link></li>
                            <li><Link href="#">FAQs</Link></li>
                            <li><Link href="#">Shipping</Link></li>
                            <li><Link href="#">Returns</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#">About Us</Link></li>
                            <li><Link href="#">Careers</Link></li>
                            <li><Link href="#">Privacy Policy</Link></li>
                            <li><Link href="#">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>
                        {/* Newsletter form stub */}
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} STORE. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
