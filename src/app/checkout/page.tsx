import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const [cartItems, user] = await Promise.all([
    prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: { include: { category: true } },
      },
    }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
  ]);

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const serialized = cartItems.map((item) => ({
    ...item,
    product: {
      ...item.product,
      price: Number(item.product.price),
    },
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <CheckoutClient
        cartItems={serialized}
        userDefaults={{
          address: user?.address,
          city: user?.city,
          postalCode: user?.postalCode,
          country: user?.country,
        }}
      />
    </div>
  );
}
