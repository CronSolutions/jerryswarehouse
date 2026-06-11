import Link from "next/link";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ClearCart from "@/components/shop/ClearCart";
import { getStoreInfo, getFooter } from "@/lib/content";
import { finalizeOrderIfPaid } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order Confirmation — Jerry's Warehouse",
  robots: { index: false },
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderId = searchParams.order;
  const [storeInfo, footer] = await Promise.all([getStoreInfo(), getFooter()]);

  const status = orderId ? await finalizeOrderIfPaid(orderId) : "notfound";

  return (
    <>
      <Navbar storeInfo={storeInfo} solid />
      <main className="min-h-screen bg-white pt-40 pb-32 px-6 sm:px-8 lg:px-[150px]">
        <div className="max-w-md mx-auto text-center">
          {status === "paid" && (
            <>
              <ClearCart />
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c49335]/15 flex items-center justify-center text-3xl text-[#c49335]">
                ✓
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#4a2c0a] mb-3">
                Thank you!
              </h1>
              <p className="text-[#6e4218]">
                Your order is confirmed and payment received. We&apos;ll be in
                touch about pickup or shipping shortly.
              </p>
            </>
          )}

          {status === "pending" && (
            <>
              <h1 className="font-serif text-3xl font-bold text-[#4a2c0a] mb-3">
                Finishing up…
              </h1>
              <p className="text-[#6e4218]">
                We&apos;re confirming your payment. This can take a moment — you&apos;ll
                get an email receipt from Square. You can safely close this page.
              </p>
            </>
          )}

          {status === "notfound" && (
            <>
              <h1 className="font-serif text-3xl font-bold text-[#4a2c0a] mb-3">
                Order not found
              </h1>
              <p className="text-[#6e4218]">
                We couldn&apos;t find that order. If you were charged, please
                contact us and we&apos;ll sort it out right away.
              </p>
            </>
          )}

          <Link
            href="/shop"
            className="inline-block mt-8 bg-[#c49335] hover:bg-[#d4a853] text-white font-semibold text-sm px-6 py-3 rounded transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </main>
      <Footer footer={footer} storeInfo={storeInfo} />
    </>
  );
}
