import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getAnalytics } from "@/lib/analytics";
import AnalyticsDashboard from "./AnalyticsDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analytics · Admin · Jerry's Warehouse",
  robots: { index: false },
};

export default async function AnalyticsPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login?error=not-allowed");

  const data = await getAnalytics();
  return <AnalyticsDashboard email={user.email ?? ""} data={data} />;
}
