import { type NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/square";
import { finalizeBySquareOrderId } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-square-hmacsha256-signature");

  // Square signs (notificationUrl + body). The URL must exactly match what's
  // registered in the Square dashboard.
  const notificationUrl =
    process.env.SQUARE_WEBHOOK_URL ??
    `${req.nextUrl.origin}/api/square/webhook`;

  if (!verifyWebhookSignature(rawBody, signature, notificationUrl)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  // Pull the Square order id out of payment.* and order.* events.
  const obj = (event as { data?: { object?: Record<string, unknown> } })?.data
    ?.object as
    | {
        payment?: { order_id?: string };
        order_updated?: { order_id?: string };
      }
    | undefined;

  const squareOrderId =
    obj?.payment?.order_id ?? obj?.order_updated?.order_id ?? null;

  if (squareOrderId) {
    await finalizeBySquareOrderId(squareOrderId);
  }

  // Always 200 so Square doesn't retry indefinitely.
  return NextResponse.json({ received: true });
}
