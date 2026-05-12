import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Bed, Bath, Maximize2, MapPin, ArrowRight } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';

gsap.registerPlugin(ScrollTrigger);

export default function PropertyCarousel() {
  const { t, i18n } = useTranslation();
  const allProperties = usePropertyStore((s) => s.properties);
  const displayProperties = allProperties.slice(0, 4);
  const isArabic = i18n.language === 'ar';
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.image-box').forEach((box, i) => {
        gsap.fromTo(box,
          { opacity: 0, x: i % 2 === 0 ? -100 : 100, scale: 0.95 },
          {
            opacity: 1, x: 0, scale: 1,
            duration: 1.3, ease: 'power3.out',
            scrollTrigger: {
              trigger: box.closest('section'),
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.content-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, x: i % 2 === 0 ? 100 : -100, scale: 0.95 },
          {
            opacity: 1, x: 0, scale: 1,
            duration: 1.3, delay: 0.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: card.closest('section'),
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });
    }, sectionsRef);
    return () => ctx.revert();
  }, []);

  const isDarkSection = (i: number) => i % 2 === 1;

  return (
    <div ref={sectionsRef}>
      {displayProperties.map((property, i) => {
        const title = isArabic ? property.title.ar : property.title.en;
        const location = isArabic ? property.location.ar : property.location.en;
        const isEven = i % 2 === 0;
        const imageOnLeft = isArabic ? !isEven : isEven;
        const dark = isDarkSection(i);

        const bgClass = dark
          ? 'bg-gradient-to-b from-charcoal-900 to-charcoal-800'
          : 'bg-gradient-to-b from-cream-50 to-cream-100';

        const textColor = dark ? 'text-white' : 'text-charcoal-900';
        const subTextColor = dark ? 'text-cream-200' : 'text-charcoal-600';
        const cardBg = dark
          ? 'bg-black/30 backdrop-blur-xl border border-white/10'
          : 'bg-white/40 backdrop-blur-xl border border-white/40';

        return (
          <section
            key={property.id}
            className={`relative w-full min-h-screen flex items-center overflow-hidden ${bgClass} py-12 md:py-0`}
          >
            <div
              className={`container mx-auto max-w-7xl flex flex-col md:flex-row items-center h-auto md:h-[70%] px-4 ${
                imageOnLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-8 md:gap-12`}
            >
              <div
                className="image-box w-full md:w-[45%] h-[300px] md:h-full rounded-[40px] overflow-hidden"
                style={{
                  boxShadow: '0 0 50px 10px rgba(212, 175, 55, 0.18)',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                }}
              >
                <img
                  src={property.image}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="content-card flex-1 flex justify-center items-center w-full md:w-auto">
                <div className={`w-full max-w-[480px] p-6 rounded-3xl shadow-2xl ${cardBg}`}>
                  <div className="flex items-center gap-2 text-gold-500 mb-3">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-[0.2em]">{location}</span>
                  </div>
                  <h2 className={`font-heading text-4xl font-black mb-4 leading-tight ${textColor}`}>
                    {title}
                  </h2>
                  <div className={`flex gap-4 text-sm mb-4 ${subTextColor}`}>
                    <span className="flex items-center gap-1"><Bed className="w-5 h-5 text-gold-500" /> {property.bedrooms}</span>
                    <span className="flex items-center gap-1"><Bath className="w-5 h-5 text-gold-500" /> {property.bathrooms}</span>
                    <span className="flex items-center gap-1"><Maximize2 className="w-5 h-5 text-gold-500" /> {property.area} m²</span>
                  </div>
                  <p className="text-2xl font-bold text-gold-500 mb-6">
                    {property.price.toLocaleString()} SAR
                  </p>
                  <Link
                    to={`/properties/${property.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold-500 text-gold-500 rounded-full font-bold hover:bg-gold-500 hover:text-white transition-all duration-500 shadow-lg hover:shadow-gold/30"
                  >
                    {t('propertiesPage.details')} <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-24 z-30 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
          </section>
        );
      })}

      {allProperties.length > 4 && (
        <div className="relative z-20 text-center py-20 bg-cream-50/80 backdrop-blur-sm">
          <Link to="/properties" className="btn-primary inline-flex items-center gap-2 text-lg">
            {t('carousel.seeAll')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
