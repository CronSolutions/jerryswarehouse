import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import About from "@/components/sections/About";
import WhyUs from "@/components/sections/WhyUs";
import Reviews from "@/components/sections/Reviews";
import HoursLocation from "@/components/sections/HoursLocation";
import Footer from "@/components/sections/Footer";
import {
  getHero,
  getAbout,
  getStoreInfo,
  getHours,
  getValueProps,
  getReviews,
  getCategories,
  getFooter,
} from "@/lib/content";

export default async function HomePage() {
  const [hero, about, storeInfo, hours, valueProps, reviews, categories, footer] =
    await Promise.all([
      getHero(),
      getAbout(),
      getStoreInfo(),
      getHours(),
      getValueProps(),
      getReviews(),
      getCategories(),
      getFooter(),
    ]);

  return (
    <>
      <Navbar storeInfo={storeInfo} />
      <main id="main-content">
        <Hero content={hero} />
        <Categories content={categories} />
        <About content={about} />
        <WhyUs content={valueProps} />
        <Reviews content={reviews} />
        <HoursLocation hours={hours} storeInfo={storeInfo} />
      </main>
      <Footer footer={footer} storeInfo={storeInfo} />
    </>
  );
}
