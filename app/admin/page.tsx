import { createClient } from "@/lib/supabase/server";
import { getHero, getAbout } from "@/lib/content";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin · Jerry's Warehouse", robots: { index: false } };

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [hero, about] = await Promise.all([getHero(), getAbout()]);

  return <AdminDashboard email={user?.email ?? ""} hero={hero} about={about} />;
}
