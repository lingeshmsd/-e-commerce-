"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { ProductWithCategory } from "@/types";

type AddToCartButtonProps = {
  product: ProductWithCategory & { price: number };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push("/login?callbackUrl=/products/" + product.slug);
        return;
      }

      if (!res.ok) {
        setMessage(data.error || "Failed to add to cart");
        return;
      }

      setMessage("Added to cart!");
      router.refresh();
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (product.stock <= 0) {
    return (
      <Button disabled className="w-full">
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))
            }
            className="w-16 border-0 text-center"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={handleAddToCart}
          disabled={loading}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
      {message && (
        <p className={`text-sm ${message.includes("Added") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
