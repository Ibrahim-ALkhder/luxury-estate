import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/animations/ScrollReveal';
import { Bed, Bath, Maximize2, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { usePropertyStore } from '../store/propertyStore';

export default function Properties() {
  const { t, i18n } = useTranslation();
  const properties = usePropertyStore((s) => s.properties);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const isArabic = i18n.language === 'ar';

  const filtered = properties.filter((p) => {
    const title = typeof p.title === 'string' ? p.title : isArabic ? p.title.ar : p.title.en;
    const location = typeof p.location === 'string' ? p.location : isArabic ? p.location.ar : p.location.en;
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? p.type === selectedType : true;
    return matchesSearch && matchesType;
  });

  const types = [...new Set(properties.map((p) => p.type))];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl font-bold text-charcoal-900">{t('propertiesPage.title')}</h1>
          <p className="mt-4 text-charcoal-500">{t('propertiesPage.subtitle')}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12 glass p-4 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('propertiesPage.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 w-5 h-5" />
            <select
              className="pl-10 pr-8 py-3 bg-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 appearance-none"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">{t('propertiesPage.allTypes')}</option>
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p, i) => {
            const title = typeof p.title === 'string' ? p.title : isArabic ? p.title.ar : p.title.en;
            const location = typeof p.location === 'string' ? p.location : isArabic ? p.location.ar : p.location.en;
            return (
              <ScrollReveal key={p.id} delay={i * 0.05}>
                <Link
                  to={`/properties/${p.id}`}
                  className="group block h-[400px] rounded-3xl overflow-hidden shadow-luxury hover:shadow-2xl transition-all duration-500 relative"
                >
                  <img
                    src={p.image}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center text-gold-400 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{location}</span>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">{title}</h3>
                    <div className="flex gap-4 text-cream-200 text-sm mb-3">
                      <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {p.bedrooms}</span>
                      <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {p.bathrooms}</span>
                      <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4" /> {p.area} m²</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gold-500">{p.price.toLocaleString(isArabic ? 'ar-SA' : 'en-US')} SAR</span>
                      <span className="inline-flex items-center gap-1 bg-gold-500/20 backdrop-blur-sm px-3 py-1 rounded-lg text-gold-300 text-sm font-medium">
                        {t('propertiesPage.details')} →
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-charcoal-500 mt-12">{t('propertiesPage.noResults')}</p>
        )}
      </div>
    </div>
  );
}