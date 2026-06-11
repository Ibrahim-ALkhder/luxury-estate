import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../../features/favorites/FavoriteButton';

const properties = [
  {
    id: '1',
    title: 'Luxury Villa with Sea View',
    location: 'Palm Jumeirah, Dubai',
    price: 4500000,
    bedrooms: 5,
    bathrooms: 6,
    area: 750,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Sky Penthouse',
    location: 'Downtown Dubai',
    price: 3200000,
    bedrooms: 3,
    bathrooms: 3,
    area: 420,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Beachfront Mansion',
    location: 'Jumeirah Beach',
    price: 6800000,
    bedrooms: 7,
    bathrooms: 8,
    area: 1200,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
  },
];

function PropertyCard({ property, index }: { property: typeof properties[0]; index: number }) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 w-[85vw] md:w-[500px] lg:w-[580px] h-[500px] md:h-[600px] rounded-3xl overflow-hidden card-hover cursor-pointer"
    >
      <motion.img
        src={property.image}
        alt={property.title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 1.2 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className={`absolute inset-0 border-2 border-transparent rounded-3xl transition-all duration-500 ${isHovered ? 'border-gold-500/50 shadow-gold-glow-lg' : ''}`} />

      <div className="absolute top-6 right-6 z-10">
        <FavoriteButton propertyId={property.id} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        <div className="flex items-center text-gold-500 mb-2">
          <i className="fa-solid fa-location-dot mr-1 text-sm" />
          <span className="text-sm font-medium">{property.location}</span>
        </div>
        <h3 className="font-heading text-3xl font-bold text-white mb-3">{property.title}</h3>
        <div className="flex gap-6 text-muted text-sm mb-4">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-bed text-gold-500" />
            {property.bedrooms} {t('featured.beds')}
          </span>
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-bath text-gold-500" />
            {property.bathrooms} {t('featured.baths')}
          </span>
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-ruler-combined text-gold-500" />
            {property.area} {t('featured.area')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-gold-500">
            ${property.price.toLocaleString()}
          </span>
          <Link
            to={`/properties/${property.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500/10 backdrop-blur-md border border-gold-500/30 text-gold-500 rounded-xl hover:bg-gold-500 hover:text-background transition-all duration-300 text-sm font-medium"
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="section-subtitle">{t('featured.subtitle')}</span>
            <h2 className="section-title mt-4 text-white">
              {t('featured.title')}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-xl border border-white/10 text-white/60 hover:text-gold-500 hover:border-gold-500/30 transition-all"
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-xl border border-white/10 text-white/60 hover:text-gold-500 hover:border-gold-500/30 transition-all"
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto px-6 pb-8 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((p, i) => (
          <PropertyCard key={p.id} property={p} index={i} />
        ))}
      </div>
    </section>
  );
}
