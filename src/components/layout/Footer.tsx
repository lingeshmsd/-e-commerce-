import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <Zap className="h-5 w-5 text-blue-400" />
              E-Commace
            </Link>
            <p className="mt-3 text-sm">
              Your trusted destination for the latest electronics. Quality products, competitive prices.
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-white">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white">All Products</Link></li>
              <li><Link href="/products?category=phones" className="hover:text-white">Phones</Link></li>
              <li><Link href="/products?category=laptops" className="hover:text-white">Laptops</Link></li>
              <li><Link href="/products?category=audio" className="hover:text-white">Audio</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-white">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white">Register</Link></li>
              <li><Link href="/account/orders" className="hover:text-white">Order History</Link></li>
              <li><Link href="/cart" className="hover:text-white">Shopping Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>Free shipping on orders over $50</li>
              <li>30-day return policy</li>
              <li>Secure checkout with Stripe</li>
              <li>24/7 customer support</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} E-Commace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
