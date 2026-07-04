import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  return NextResponse.json(serialized);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity = 1 } = await request.json();

  if (!productId || quantity < 1) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.stock < quantity) {
    return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
      include: { product: { include: { category: true } } },
    });

    return NextResponse.json(updated);
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      userId: session.user.id,
      productId,
      quantity,
    },
    include: { product: { include: { category: true } } },
  });

  return NextResponse.json(cartItem, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemId, quantity } = await request.json();

  if (!itemId || quantity < 1) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: { id: itemId, userId: session.user.id },
    include: { product: true },
  });

  if (!cartItem) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  if (quantity > cartItem.product.stock) {
    return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
  }

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: { include: { category: true } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 });
  }

  await prisma.cartItem.deleteMany({
    where: { id: itemId, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
