import Hero from '../components/sections/Hero';
import FeaturedProperties from '../components/sections/FeaturedProperties';
import About from '../components/sections/About';
import PropertyCarousel from '../components/sections/PropertyCarousel';
import Services from '../components/sections/Services';
import SearchSection from '../components/sections/SearchSection';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <About />
      <PropertyCarousel />
      <Services />
      <SearchSection />
      <Testimonials />
      <Contact />
    </>
  );
}