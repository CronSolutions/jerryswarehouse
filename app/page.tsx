import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import About from "@/components/sections/About";
import WhyUs from "@/components/sections/WhyUs";
import Reviews from "@/components/sections/Reviews";
import HoursLocation from "@/components/sections/HoursLocation";
import Footer from "@/components/sections/Footer";
import { getHero, getAbout } from "@/lib/content";

export default async function HomePage() {
  const [hero, about] = await Promise.all([getHero(), getAbout()]);

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero content={hero} />
        <Categories />
        <About content={about} />
        <WhyUs />
        <Reviews />
        <HoursLocation />
      </main>
      <Footer />
    </>
  );
}
