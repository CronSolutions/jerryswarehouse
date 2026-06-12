import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import MessagesView, { type Message } from "./MessagesView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages · Admin · Jerry's Warehouse",
  robots: { index: false },
};

export default async function MessagesPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login?error=not-allowed");

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <MessagesView email={user.email ?? ""} messages={(data as Message[]) ?? []} />
  );
}
