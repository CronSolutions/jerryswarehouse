import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CartView from "@/components/shop/CartView";
import { getStoreInfo, getFooter } from "@/lib/content";

export const metadata = {
  title: "Cart — Jerry's Warehouse",
  robots: { index: false },
};

export default async function CartPage() {
  const [storeInfo, footer] = await Promise.all([getStoreInfo(), getFooter()]);

  return (
    <>
      <Navbar storeInfo={storeInfo} solid />
      <main className="min-h-screen bg-white pt-32 pb-24 px-6 sm:px-8 lg:px-[150px]">
        <h1 className="font-serif text-4xl font-bold text-[#4a2c0a] mb-10">Cart</h1>
        <CartView />
      </main>
      <Footer footer={footer} storeInfo={storeInfo} />
    </>
  );
}
