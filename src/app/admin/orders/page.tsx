import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = orders.map((order) => ({
    ...order,
    total: Number(order.total),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Manage Orders</h1>
      {serialized.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <AdminOrdersClient orders={serialized} />
      )}
    </div>
  );
}
