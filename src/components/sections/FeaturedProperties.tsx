import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../../features/favorites/FavoriteButton';
import { usePropertyStore } from '../../store/propertyStore';
import type { PropertyData } from '../../store/propertyStore';

function PropertyCard({ property, index }: { property: PropertyData; index: number }) {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const isArabic = i18n.language === 'ar';
  const pick = <T,>(v: T | { en: T; ar: T }): T =>
    v && typeof v === 'object' && !Array.isArray(v) ? (isArabic ? (v as { en: T; ar: T }).ar : (v as { en: T; ar: T }).en) : (v as T);
  const title = pick(property.title);
  const location = pick(property.location);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 w-[85vw] sm:w-[450px] md:w-[500px] lg:w-[580px] rounded-3xl overflow-hidden card-hover cursor-pointer aspect-[4/5] sm:aspect-[5/6] md:aspect-[4/5]"
    >
      <motion.img
        src={property.image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 1.2 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className={`absolute inset-0 border-2 border-transparent rounded-3xl transition-all duration-500 ${isHovered ? 'border-gold-500/60 shadow-gold-glow-lg' : ''}`} />

      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-10">
        <FavoriteButton propertyId={property.id} />
      </div>

      {property.price >= 5000000 && (
        <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] sm:text-xs font-utility font-semibold uppercase tracking-wider bg-gold-500/90 text-background rounded-lg shadow-gold">
            <i className="fa-solid fa-crown text-[10px]" />
            Signature
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
        <div className="flex items-center text-gold-500 mb-2">
          <i className="fa-solid fa-location-dot mr-1 text-[10px] sm:text-sm" />
          <span className="text-xs sm:text-sm font-medium font-utility">{location}</span>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl text-on-dark mb-3 leading-tight">{title}</h3>
        <div className="flex gap-4 sm:gap-6 text-muted text-xs sm:text-sm mb-4 font-body">
          <span className="flex items-center gap-1 sm:gap-2">
            <i className="fa-solid fa-bed text-gold-500" />
            {property.bedrooms} {t('featured.beds')}
          </span>
          <span className="flex items-center gap-1 sm:gap-2">
            <i className="fa-solid fa-bath text-gold-500" />
            {property.bathrooms} {t('featured.baths')}
          </span>
          <span className="flex items-center gap-1 sm:gap-2">
            <i className="fa-solid fa-ruler-combined text-gold-500" />
            {property.area} {t('featured.area')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl sm:text-3xl font-bold text-gold-500 font-utility">
            ${property.price.toLocaleString()}
          </span>
          <Link
            to={`/properties/${property.id}`}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gold-500/10 backdrop-blur-md border border-gold-500/30 text-gold-500 rounded-xl hover:bg-gold-500 hover:text-background transition-all duration-300 text-xs sm:text-sm font-medium font-utility"
          >
            {t('featured.viewDetails')}
            <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedProperties() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const properties = usePropertyStore((s) => s.properties).slice(0, 3);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/8 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-12 sm:mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="section-subtitle">{t('featured.subtitle')}</span>
            <h2 className="section-title mt-4 text-on-dark">
              {t('featured.title')}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="p-3 rounded-xl border border-default text-muted hover:text-gold-500 hover:border-gold-500/30 transition-all"
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="p-3 rounded-xl border border-default text-muted hover:text-gold-500 hover:border-gold-500/30 transition-all"
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 sm:gap-8 overflow-x-auto px-4 sm:px-6 pb-8 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((p, i) => (
          <PropertyCard key={p.id} property={p} index={i} />
        ))}
      </div>
    </section>
  );
}
