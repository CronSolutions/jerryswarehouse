import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import {
  getHero,
  getAbout,
  getStoreInfo,
  getHours,
  getValueProps,
  getReviews,
  getCategories,
  getFooter,
} from "@/lib/content";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Jerry's Warehouse",
  robots: { index: false },
};

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login?error=not-allowed");

  const [hero, about, storeInfo, hours, valueProps, reviews, categories, footer] =
    await Promise.all([
      getHero(),
      getAbout(),
      getStoreInfo(),
      getHours(),
      getValueProps(),
      getReviews(),
      getCategories(),
      getFooter(),
    ]);

  return (
    <AdminDashboard
      email={user?.email ?? ""}
      content={{
        hero,
        about,
        store_info: storeInfo,
        hours,
        value_props: valueProps,
        reviews,
        categories,
        footer,
      }}
    />
  );
}
