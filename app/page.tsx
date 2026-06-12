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
  getMedia,
  mediaSrc,
  DEFAULT_MEDIA,
} from "@/lib/content";

export default async function HomePage() {
  const [hero, about, storeInfo, hours, valueProps, reviews, categories, footer, media] =
    await Promise.all([
      getHero(),
      getAbout(),
      getStoreInfo(),
      getHours(),
      getValueProps(),
      getReviews(),
      getCategories(),
      getFooter(),
      getMedia(),
    ]);

  return (
    <>
      <Navbar storeInfo={storeInfo} />
      <main id="main-content">
        <Hero content={hero} imageSrc={mediaSrc(media.hero, DEFAULT_MEDIA.hero)} />
        <Categories content={categories} />
        <About content={about} imageSrc={mediaSrc(media.about, DEFAULT_MEDIA.about)} />
        <WhyUs content={valueProps} imageSrc={mediaSrc(media.whyUs, DEFAULT_MEDIA.whyUs)} />
        <Reviews content={reviews} />
        <HoursLocation hours={hours} storeInfo={storeInfo} />
      </main>
      <Footer footer={footer} storeInfo={storeInfo} />
    </>
  );
}
