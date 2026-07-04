import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CartPageClient } from "@/components/cart/CartPageClient";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/cart");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { category: true },
      },
    },
  });

  const serialized = cartItems.map((item) => ({
    ...item,
    product: {
      ...item.product,
      price: Number(item.product.price),
    },
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <CartPageClient initialItems={serialized} />
    </div>
  );
}
