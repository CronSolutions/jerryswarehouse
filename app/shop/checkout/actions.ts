"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPaymentLink, type SquareLineItem } from "@/lib/square";
import { SHIPPING_CENTS, type Product } from "@/lib/shop";

type Result = { ok: true; url: string } | { ok: false; error: string };

export async function createCheckout(
  itemIds: string[],
  fulfillment: "pickup" | "shipping"
): Promise<Result> {
  if (!itemIds || itemIds.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (e) {
    console.error("[checkout] admin client:", e);
    return {
      ok: false,
      error:
        "Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it to your env vars.",
    };
  }

  // Re-fetch from the DB so prices/availability come from the server, not the client.
  const { data, error: productErr } = await supabase
    .from("products")
    .select("*")
    .in("id", itemIds)
    .eq("status", "available");

  if (productErr) {
    console.error("[checkout] product fetch:", productErr);
    return { ok: false, error: `Product lookup failed: ${productErr.message}` };
  }

  const products = (data as Product[]) ?? [];

  if (products.length !== itemIds.length) {
    return {
      ok: false,
      error: "One or more items just sold or are no longer available. Please review your cart.",
    };
  }

  const subtotal = products.reduce((sum, p) => sum + p.price_cents, 0);
  const shipping = fulfillment === "shipping" ? SHIPPING_CENTS : 0;
  const total = subtotal + shipping;

  // Create the local order first
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      fulfillment,
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      total_cents: total,
      status: "pending",
    })
    .select()
    .single();

  if (orderErr || !order) {
    console.error("[checkout] order insert:", orderErr);
    return {
      ok: false,
      error: `Could not start checkout: ${orderErr?.message ?? "unknown error"}`,
    };
  }

  const { error: itemsErr } = await supabase.from("order_items").insert(
    products.map((p) => ({
      order_id: order.id,
      product_id: p.id,
      name: p.name,
      price_cents: p.price_cents,
    }))
  );
  if (itemsErr) {
    console.error("[checkout] order_items insert:", itemsErr);
    return { ok: false, error: `Could not save order items: ${itemsErr.message}` };
  }

  // Build Square line items
  const lineItems: SquareLineItem[] = products.map((p) => ({
    name: p.name,
    amountCents: p.price_cents,
  }));
  if (shipping > 0) lineItems.push({ name: "Shipping", amountCents: shipping });

  const h = headers();
  const origin =
    h.get("origin") ?? `https://${h.get("host") ?? "localhost:3000"}`;
  const redirectUrl = `${origin}/shop/confirmation?order=${order.id}`;

  try {
    const link = await createPaymentLink({
      lineItems,
      redirectUrl,
      askForShipping: fulfillment === "shipping",
    });
    await supabase
      .from("orders")
      .update({
        square_order_id: link.orderId,
        square_payment_link_id: link.paymentLinkId,
      })
      .eq("id", order.id);
    return { ok: true, url: link.url };
  } catch (e) {
    await supabase.from("orders").update({ status: "canceled" }).eq("id", order.id);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Checkout failed. Please try again.",
    };
  }
}
