import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AccountForm } from "@/components/account/AccountForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Link href="/account/orders">
          <Button variant="outline">View Orders</Button>
        </Link>
      </div>
      <div className="max-w-lg">
        <AccountForm user={user} />
      </div>
    </div>
  );
}
