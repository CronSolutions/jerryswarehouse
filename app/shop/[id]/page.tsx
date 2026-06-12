import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { getStoreInfo, getFooter } from "@/lib/content";
import { getProduct, formatPrice } from "@/lib/shop";
import AddToCartButton from "@/components/shop/AddToCartButton";
import ProductGallery from "@/components/shop/ProductGallery";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return {
    title: product ? `${product.name} — Jerry's Warehouse` : "Shop — Jerry's Warehouse",
    description: product?.description?.slice(0, 150),
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [product, storeInfo, footer] = await Promise.all([
    getProduct(params.id),
    getStoreInfo(),
    getFooter(),
  ]);

  if (!product) notFound();
  const sold = product.status === "sold";

  return (
    <>
      <Navbar storeInfo={storeInfo} solid />
      <main className="min-h-screen bg-white pt-32 pb-24 px-6 sm:px-8 lg:px-[150px]">
        <Link
          href="/shop"
          className="inline-block mb-8 text-sm text-[#6e4218] hover:text-[#c49335] transition-colors"
        >
          ← Back to shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Images */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info */}
          <div className="lg:pt-2">
            {product.category && (
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c49335] mb-3">
                {product.category}
              </p>
            )}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#4a2c0a] leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl text-[#6e4218] mt-4">{formatPrice(product.price_cents)}</p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6 text-sm">
              {product.size && (
                <p className="text-[#6e4218]">
                  <span className="text-[#9a6840]">Size:</span> {product.size}
                </p>
              )}
              {product.condition && (
                <p className="text-[#6e4218]">
                  <span className="text-[#9a6840]">Condition:</span> {product.condition}
                </p>
              )}
            </div>

            {product.description && (
              <p className="text-[#6e4218] leading-relaxed mt-6 whitespace-pre-line">
                {product.description}
              </p>
            )}

            <div className="mt-8">
              {sold ? (
                <span className="inline-block bg-[#4a2c0a] text-white font-semibold text-sm px-8 py-4 rounded">
                  Sold
                </span>
              ) : (
                <AddToCartButton
                  item={{
                    id: product.id,
                    name: product.name,
                    price_cents: product.price_cents,
                    image: product.images[0] ?? "",
                    size: product.size,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer footer={footer} storeInfo={storeInfo} />
    </>
  );
}
