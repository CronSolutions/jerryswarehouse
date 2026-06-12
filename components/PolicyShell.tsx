import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { getStoreInfo, getFooter } from "@/lib/content";

export default async function PolicyShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [storeInfo, footer] = await Promise.all([getStoreInfo(), getFooter()]);
  return (
    <>
      <Navbar storeInfo={storeInfo} solid />
      <main className="min-h-screen bg-white pt-32 pb-24 px-6 sm:px-8 lg:px-[150px]">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl font-bold text-[#4a2c0a] mb-8">
            {title}
          </h1>
          <div className="space-y-4 text-[#6e4218] leading-relaxed text-sm sm:text-base">
            {children}
          </div>
        </div>
      </main>
      <Footer footer={footer} storeInfo={storeInfo} />
    </>
  );
}

/** Sub-heading for use inside policy content. */
export function PolicyHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-xl font-bold text-[#4a2c0a] mt-8 mb-2">
      {children}
    </h2>
  );
}
