import { type Product, type Category, type Order, type OrderItem } from "@prisma/client";

export type ProductWithCategory = Product & { category: Category };

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

export type CartItemWithProduct = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: ProductWithCategory;
};

export type ProductSpecs = Record<string, string>;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const CATEGORIES = [
  { name: "Phones", slug: "phones", icon: "Smartphone" },
  { name: "Laptops", slug: "laptops", icon: "Laptop" },
  { name: "Tablets", slug: "tablets", icon: "Tablet" },
  { name: "Audio", slug: "audio", icon: "Headphones" },
  { name: "Accessories", slug: "accessories", icon: "Cable" },
] as const;
