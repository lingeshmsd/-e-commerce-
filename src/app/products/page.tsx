import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import type { Prisma } from "@prisma/client";

type SearchParams = Promise<{
  category?: string;
  search?: string;
  sort?: string;
  inStock?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const where: Prisma.ProductWhereInput = {};

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.inStock === "true") {
    where.stock = { gt: 0 };
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) {
      where.price.gte = parseFloat(params.minPrice);
    }
    if (params.maxPrice) {
      where.price.lte = parseFloat(params.maxPrice);
    }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (params.sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "name":
      orderBy = { name: "asc" };
      break;
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
  });

  const serialized = products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">All Products</h1>
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ProductFilters />
          </Suspense>
        </aside>
        <div className="lg:col-span-3">
          <p className="mb-4 text-sm text-muted-foreground">
            {serialized.length} product{serialized.length !== 1 ? "s" : ""} found
          </p>
          <ProductGrid products={serialized} />
        </div>
      </div>
    </div>
  );
}
