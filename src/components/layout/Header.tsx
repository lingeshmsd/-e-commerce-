"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/cart")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCartCount(data.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
          }
        })
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [session]);

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/products?category=phones", label: "Phones" },
    { href: "/products?category=laptops", label: "Laptops" },
    { href: "/products?category=audio", label: "Audio" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-slate-900 text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Zap className="h-6 w-6 text-blue-400" />
          <span>E-Commace</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="text-sm text-blue-400 hover:text-blue-300">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-slate-800 hover:text-white">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {session ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/account">
                <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800 hover:text-white">
                  <User className="mr-1 h-4 w-4" />
                  {session.user.name || "Account"}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-white hover:bg-slate-800"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-700 bg-slate-900 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/account" className="text-sm text-slate-300 hover:text-white" onClick={() => setMobileOpen(false)}>
                  Account
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm text-blue-400" onClick={() => setMobileOpen(false)}>
                    Admin
                  </Link>
                )}
                <button className="text-left text-sm text-slate-300 hover:text-white" onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-slate-300 hover:text-white" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className="text-sm text-blue-400" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
