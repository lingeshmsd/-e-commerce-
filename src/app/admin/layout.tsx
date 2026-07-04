import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
      <div className="border-b bg-slate-50">
        <div className="container mx-auto flex gap-6 px-4">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
