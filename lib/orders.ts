import { revalidateTag, revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isOrderPaid } from "@/lib/square";
import { PRODUCTS_TAG } from "@/lib/shop";

type FinalizeResult = "paid" | "pending" | "notfound";

/** Mark an order paid + its items sold, but only once Square confirms payment. */
export async function finalizeOrderIfPaid(
  orderId: string
): Promise<FinalizeResult> {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return "notfound";
  if (order.status === "paid") return "paid";
  if (!order.square_order_id) return "pending";

  const paid = await isOrderPaid(order.square_order_id);
  if (!paid) return "pending";

  await supabase.from("orders").update({ status: "paid" }).eq("id", orderId);

  const { data: items } = await supabase
    .from("order_items")
    .select("product_id")
    .eq("order_id", orderId);

  const productIds = (items ?? [])
    .map((i) => i.product_id)
    .filter((id): id is string => Boolean(id));

  if (productIds.length > 0) {
    await supabase
      .from("products")
      .update({ status: "sold" })
      .in("id", productIds);
  }

  revalidateTag(PRODUCTS_TAG);
  revalidatePath("/shop");
  return "paid";
}

/** Webhook entry point: resolve a Square order id to a local order, then finalize. */
export async function finalizeBySquareOrderId(
  squareOrderId: string
): Promise<FinalizeResult> {
  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id")
    .eq("square_order_id", squareOrderId)
    .maybeSingle();
  if (!order) return "notfound";
  return finalizeOrderIfPaid(order.id);
}
