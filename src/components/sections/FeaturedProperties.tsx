import { useTranslation } from 'react-i18next';
import ScrollReveal from '../animations/ScrollReveal';
import { Heart, Bed, Bath, Maximize2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const properties = [
  {
    id: '1',
    title: 'Luxury Villa with Sea View',
    location: 'Palm Jumeirah, Dubai',
    price: 4500000,
    bedrooms: 5,
    bathrooms: 6,
    area: 750,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Sky Penthouse',
    location: 'Downtown Dubai',
    price: 3200000,
    bedrooms: 3,
    bathrooms: 3,
    area: 420,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Beachfront Mansion',
    location: 'Jumeirah Beach',
    price: 6800000,
    bedrooms: 7,
    bathrooms: 8,
    area: 1200,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop',
  },
];

function PropertyCard({ property }: { property: typeof properties[0] }) {
  const [isFav, setIsFav] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-luxury hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent" />
        <button
          onClick={(e) => { e.preventDefault(); setIsFav(!isFav); }}
          className="absolute top-3 right-3 p-2 glass rounded-full transition-transform hover:scale-110"
        >
          <Heart className={`w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </button>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center text-gold-600 mb-1">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-xs md:text-sm">{property.location}</span>
        </div>
        <h3 className="font-heading text-xl md:text-2xl font-bold text-charcoal-900 mb-2">{property.title}</h3>
        <div className="flex gap-3 text-charcoal-500 text-xs md:text-sm mb-4">
          <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4" /> {property.area} m²</span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-cream-200 pt-4">
          <span className="text-lg md:text-xl font-bold text-gold-500">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(property.price)}
          </span>
          <Link
            to={`/properties/${property.id}`}
            className="text-charcoal-400 hover:text-gold-500 text-xs md:text-sm font-medium whitespace-nowrap ml-2 transition-colors"
          >
            {t('propertiesPage.details')} →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProperties() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-cream-50">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <span className="text-gold-500 uppercase tracking-[0.2em] text-sm font-medium block text-center">
            {t('featured.subtitle')}
          </span>
          <h2 className="font-heading text-4xl md:text-6xl text-center text-charcoal-900 mt-4">
            {t('featured.title')}
          </h2>
        </ScrollReveal>
        <div className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {properties.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.1}>
              <PropertyCard property={p} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
