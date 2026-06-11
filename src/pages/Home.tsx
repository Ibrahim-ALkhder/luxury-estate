import Hero from '../components/sections/Hero';
import SearchSection from '../components/sections/SearchSection';
import FeaturedProperties from '../components/sections/FeaturedProperties';
import About from '../components/sections/About';
import PropertyCarousel from '../components/sections/PropertyCarousel';
import Services from '../components/sections/Services';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <SearchSection />
      <FeaturedProperties />
      <About />
      <Services />
      <PropertyCarousel />
      <Testimonials />
      <Contact />
    </>
  );
}
