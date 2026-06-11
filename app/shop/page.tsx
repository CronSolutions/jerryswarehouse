import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { getStoreInfo, getFooter } from "@/lib/content";
import { getProducts, productImageUrl, formatPrice } from "@/lib/shop";

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
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((p) => {
              const sold = p.status === "sold";
              return (
                <li key={p.id}>
                  <Link href={`/shop/${p.id}`} className="group block">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f5ede0] mb-3">
                      {p.images[0] && (
                        <Image
                          src={productImageUrl(p.images[0])}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                            sold ? "opacity-60" : ""
                          }`}
                        />
                      )}
                      {sold && (
                        <span className="absolute top-3 left-3 bg-[#4a2c0a] text-white text-xs font-semibold tracking-wide px-2.5 py-1 rounded">
                          SOLD
                        </span>
                      )}
                    </div>
                    <h2 className="font-medium text-[#4a2c0a] text-sm leading-snug line-clamp-1">
                      {p.name}
                    </h2>
                    <p className="text-sm text-[#6e4218] mt-0.5">
                      {formatPrice(p.price_cents)}
                      {p.size && <span className="text-[#9a6840]"> · {p.size}</span>}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <Footer footer={footer} storeInfo={storeInfo} />
    </>
  );
}
