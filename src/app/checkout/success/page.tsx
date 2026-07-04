import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const stripeSessionId = params.session_id;

  let order = null;
  if (stripeSessionId) {
    order = await prisma.order.findUnique({
      where: { stripeSessionId },
      include: {
        items: { include: { product: true } },
      },
    });
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your purchase. Your order has been received.
        </p>

        {order && (
          <Card className="mt-8 text-left">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm">{order.id}</p>
              <p className="mt-4 text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{formatPrice(Number(order.total))}</p>
              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>{formatPrice(Number(item.priceAtPurchase) * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/account/orders">
            <Button variant="outline">View Orders</Button>
          </Link>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
