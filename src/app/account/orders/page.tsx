import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ORDER_STATUS_LABELS } from "@/types";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order History</h1>
        <Link href="/account" className="text-sm text-primary hover:underline">
          Back to Account
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p>No orders yet.</p>
          <Link href="/products" className="mt-2 inline-block text-primary hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {order.id}
                    </p>
                  </div>
                  <Badge
                    variant={
                      order.status === "PAID" || order.status === "DELIVERED"
                        ? "success"
                        : order.status === "CANCELLED"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                  <p className="font-bold">{formatPrice(Number(order.total))}</p>
                </div>
                <div className="mt-4 space-y-1 border-t pt-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>
                        {formatPrice(Number(item.priceAtPurchase) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
