"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS_LABELS } from "@/types";
import type { Order, OrderItem, Product, User } from "@prisma/client";

type OrderWithDetails = Order & {
  user: User;
  items: (OrderItem & { product: Product })[];
  total: number;
};

type AdminOrdersClientProps = {
  orders: OrderWithDetails[];
};

export function AdminOrdersClient({ orders: initialOrders }: AdminOrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);

  const updateStatus = async (orderId: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: status as Order["status"] } : o))
      );
      router.refresh();
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Customer</th>
            <th className="px-4 py-3 text-left font-medium">Items</th>
            <th className="px-4 py-3 text-left font-medium">Total</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="px-4 py-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">{order.user.email}</td>
              <td className="px-4 py-3">
                {order.items.map((item) => (
                  <div key={item.id} className="text-xs">
                    {item.product.name} x{item.quantity}
                  </div>
                ))}
              </td>
              <td className="px-4 py-3">{formatPrice(order.total)}</td>
              <td className="px-4 py-3">
                <Select
                  value={order.status}
                  onValueChange={(value) => updateStatus(order.id, value)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
