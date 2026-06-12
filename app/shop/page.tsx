import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ShopBrowser from "@/components/shop/ShopBrowser";
import { getStoreInfo, getFooter } from "@/lib/content";
import { getProducts } from "@/lib/shop";

export const metadata = {
  title: "Shop — Jerry's Warehouse",
  description: "Shop one-of-a-kind vintage and thrift finds from Jerry's Warehouse.",
};

export default async function ShopPage() {
  const [products, storeInfo, footer] = await Promise.all([
    getProducts(),
    getStoreInfo(),
    getFooter(),
  ]);

  return (
    <>
      <Navbar storeInfo={storeInfo} solid />
      <main className="min-h-screen bg-white pt-32 pb-24 px-6 sm:px-8 lg:px-[150px]">
        <header className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#4a2c0a]">
            The <em className="text-[#c49335] not-italic">Shop</em>
          </h1>
          <p className="text-[#6e4218] mt-4 max-w-md mx-auto">
            One-of-a-kind finds, fresh off the racks. When it&apos;s gone, it&apos;s gone.
          </p>
          <div className="gold-divider mx-auto mt-5" aria-hidden="true" />
        </header>

        {products.length === 0 ? (
          <p className="text-center text-[#9a6840] py-16">
            New pieces are on the way — check back soon.
          </p>
        ) : (
          <ShopBrowser products={products} />
        )}
      </main>
      <Footer footer={footer} storeInfo={storeInfo} />
    </>
  );
}
