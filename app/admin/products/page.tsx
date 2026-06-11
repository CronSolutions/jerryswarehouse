import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/shop";
import ProductManager from "./ProductManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop · Admin · Jerry's Warehouse",
  robots: { index: false },
};

export default async function ProductsAdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login?error=not-allowed");

  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <ProductManager
      email={user.email ?? ""}
      products={(data as Product[]) ?? []}
    />
  );
}
