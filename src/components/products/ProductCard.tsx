import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductWithCategory } from "@/types";
import { Star } from "lucide-react";

type ProductCardProps = {
  product: ProductWithCategory & { price: number };
};

export function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {!inStock && (
            <Badge variant="destructive" className="absolute left-2 top-2">
              Out of Stock
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="mt-1 line-clamp-2 font-semibold group-hover:text-primary">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">(4.5)</span>
          </div>
          <p className="mt-2 text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
