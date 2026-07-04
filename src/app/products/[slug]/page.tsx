import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SpecsTable } from "@/components/products/SpecsTable";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { ProductSpecs } from "@/types";
import { Star, ChevronRight } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true },
    take: 4,
  });

  const serialized = {
    ...product,
    price: Number(product.price),
  };

  const related = relatedProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <Badge variant="secondary" className="mb-2">
            {product.category.name}
          </Badge>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-1 text-sm text-muted-foreground">(4.5)</span>
          </div>

          <p className="mt-4 text-3xl font-bold text-primary">
            {formatPrice(serialized.price)}
          </p>

          <div className="mt-2">
            {product.stock > 0 ? (
              <Badge variant="success">In Stock ({product.stock} available)</Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <p className="mt-6 text-muted-foreground">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton product={serialized} />
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold">Specifications</h2>
        <SpecsTable specs={product.specs as ProductSpecs} />
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold">Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
