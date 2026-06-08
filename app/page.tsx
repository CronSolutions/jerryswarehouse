import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import About from "@/components/sections/About";
import WhyUs from "@/components/sections/WhyUs";
import Reviews from "@/components/sections/Reviews";
import HoursLocation from "@/components/sections/HoursLocation";
import DonationsCTA from "@/components/sections/DonationsCTA";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Categories />
        <About />
        <WhyUs />
        <Reviews />
        <HoursLocation />
      </main>
      <Footer />
    </>
  );
}
