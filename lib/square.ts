import crypto from "crypto";

const SQUARE_VERSION = "2025-01-23";

function baseUrl(): string {
  return process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

function headers() {
  return {
    "Square-Version": SQUARE_VERSION,
    Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export type SquareLineItem = {
  name: string;
  amountCents: number;
};

/** Create a hosted Square checkout (Payment Link). Returns the checkout URL + ids. */
export async function createPaymentLink(opts: {
  lineItems: SquareLineItem[];
  redirectUrl: string;
  askForShipping: boolean;
}): Promise<{ url: string; orderId: string; paymentLinkId: string }> {
  const body = {
    idempotency_key: crypto.randomUUID(),
    order: {
      location_id: process.env.SQUARE_LOCATION_ID,
      line_items: opts.lineItems.map((li) => ({
        name: li.name,
        quantity: "1",
        base_price_money: { amount: li.amountCents, currency: "USD" },
      })),
    },
    checkout_options: {
      redirect_url: opts.redirectUrl,
      ask_for_shipping_address: opts.askForShipping,
    },
  };

  const res = await fetch(`${baseUrl()}/v2/online-checkout/payment-links`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    const msg = json?.errors?.[0]?.detail ?? "Square checkout failed.";
    throw new Error(msg);
  }

  return {
    url: json.payment_link.url,
    orderId: json.payment_link.order_id,
    paymentLinkId: json.payment_link.id,
  };
}

/** True once the Square order has been paid (state COMPLETED or has tenders). */
export async function isOrderPaid(squareOrderId: string): Promise<boolean> {
  const res = await fetch(`${baseUrl()}/v2/orders/${squareOrderId}`, {
    headers: headers(),
  });
  if (!res.ok) return false;
  const json = await res.json();
  const order = json?.order;
  if (!order) return false;
  return order.state === "COMPLETED" || (order.tenders?.length ?? 0) > 0;
}

/** Verify a Square webhook signature (HMAC-SHA256 of notificationUrl + body). */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  notificationUrl: string
): boolean {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key || !signature) return false;
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(notificationUrl + rawBody);
  const expected = hmac.digest("base64");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}
