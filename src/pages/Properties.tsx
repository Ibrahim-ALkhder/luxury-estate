import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePropertyStore } from '../store/propertyStore';
import FavoriteButton from '../features/favorites/FavoriteButton';

const typeIcons: Record<string, string> = {
  Villa: 'fa-house-chimney',
  Apartment: 'fa-building',
  Penthouse: 'fa-crown',
  Palace: 'fa-chess-rook',
};

const statusColors: Record<string, string> = {
  available: 'text-green-400 bg-green-500/10 border-green-500/30',
  sold: 'text-red-400 bg-red-500/10 border-red-500/30',
  underConstruction: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
};

export default function Properties() {
  const { t, i18n } = useTranslation();
  const properties = usePropertyStore((s) => s.properties);
  const isArabic = i18n.language === 'ar';
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const types = useMemo(() => [...new Set(properties.map((p) => p.type))], [properties]);

  const filtered = useMemo(() => {
    let result = properties.filter((p) => {
      const title = typeof p.title === 'string' ? p.title : isArabic ? p.title.ar : p.title.en;
      const location = typeof p.location === 'string' ? p.location : isArabic ? p.location.ar : p.location.en;
      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType ? p.type === selectedType : true;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesType && matchesPrice;
    });

    switch (sortBy) {
      case 'price-asc':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result = result.sort((a, b) => {
          const aTitle = typeof a.title === 'string' ? a.title : a.title.en;
          const bTitle = typeof b.title === 'string' ? b.title : b.title.en;
          return aTitle.localeCompare(bTitle);
        });
        break;
      default:
        break;
    }

    return result;
  }, [properties, searchTerm, selectedType, priceRange, sortBy, isArabic]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="section-title text-white">{t('propertiesPage.title')}</h1>
          <p className="mt-3 text-muted">{t('propertiesPage.subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card p-6 rounded-2xl space-y-6 sticky top-28">
              <div>
                <label className="block text-xs text-muted mb-2 uppercase tracking-wider font-medium">
                  <i className="fa-solid fa-search mr-2" />
                  {t('propertiesPage.searchPlaceholder')}
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('propertiesPage.searchPlaceholder')}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-muted mb-2 uppercase tracking-wider font-medium">
                  <i className="fa-solid fa-filter mr-2" />
                  {t('search.type')}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">{t('propertiesPage.allTypes')}</option>
                  {types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted mb-2 uppercase tracking-wider font-medium">
                  <i className="fa-solid fa-dollar-sign mr-2" />
                  {t('propertiesPage.priceRange')} ({t('propertiesPage.max')} ${(priceRange[1] / 1000000).toFixed(0)}M)
                </label>
                <input
                  type="range"
                  min={0}
                  max={30000000}
                  step={100000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-full accent-gold-500"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>$0</span>
                  <span>$30M</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted mb-2 uppercase tracking-wider font-medium">
                  <i className="fa-solid fa-arrow-up-wide-short mr-2" />
                  {t('propertiesPage.sortBy')}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="newest">{t('propertiesPage.newest')}</option>
                  <option value="price-asc">{t('propertiesPage.priceLowHigh')}</option>
                  <option value="price-desc">{t('propertiesPage.priceHighLow')}</option>
                  <option value="name">{t('propertiesPage.name')}</option>
                </select>
              </div>
            </div>
          </motion.aside>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted">
                {filtered.length} {t('propertiesPage.title')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30'
                      : 'bg-white/5 text-muted border border-white/10 hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-grid-2" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30'
                      : 'bg-white/5 text-muted border border-white/10 hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-list" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="card p-16 text-center rounded-2xl"
                >
                  <i className="fa-solid fa-building-circle-xmark text-5xl text-muted/40 mb-4" />
                  <p className="text-muted">{t('propertiesPage.noResults')}</p>
                </motion.div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                      : 'flex flex-col gap-4'
                  }
                >
                  {filtered.map((p, i) => {
                    const title = typeof p.title === 'string' ? p.title : isArabic ? p.title.ar : p.title.en;
                    const location = typeof p.location === 'string' ? p.location : isArabic ? p.location.ar : p.location.en;

                    if (viewMode === 'list') {
                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.4 }}
                        >
                          <Link
                            to={`/properties/${p.id}`}
                            className="card-hover flex rounded-2xl overflow-hidden group"
                          >
                            <div className="w-56 h-44 shrink-0 relative overflow-hidden">
                              <div className="absolute top-3 left-3 z-10">
                                <FavoriteButton propertyId={p.id} />
                              </div>
                              <img
                                src={p.image}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                              />
                            </div>
                            <div className="flex-1 p-6">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-gold-500 transition-colors">{title}</h3>
                                  <p className="text-muted text-sm mt-1">
                                    <i className="fa-solid fa-location-dot text-gold-500 mr-1" />
                                    {location}
                                  </p>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[p.status] || 'text-muted'}`}>
                                  {p.status === 'available' ? t('propertyDetails.status.available') : p.status === 'sold' ? t('propertyDetails.status.sold') : t('propertyDetails.status.underConstruction')}
                                </span>
                              </div>
                              <div className="flex gap-4 mt-3 text-sm text-muted">
                                <span><i className="fa-solid fa-bed text-gold-500 mr-1" />{p.bedrooms} {t('propertiesPage.beds')}</span>
                                <span><i className="fa-solid fa-bath text-gold-500 mr-1" />{p.bathrooms} {t('propertiesPage.baths')}</span>
                                <span><i className="fa-solid fa-ruler-combined text-gold-500 mr-1" />{p.area} {t('propertiesPage.area')}</span>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <span className="text-xl font-bold text-gold-500">${p.price.toLocaleString()}</span>
                                <span className="text-sm text-muted group-hover:text-gold-500 transition-colors">
                                  {t('propertiesPage.details')} <i className="fa-solid fa-arrow-right ml-1" />
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                      >
                        <Link
                          to={`/properties/${p.id}`}
                          className="card-hover group block rounded-2xl overflow-hidden"
                        >
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={p.image}
                              alt={title}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                              <span className={`text-xs px-3 py-1 rounded-full border backdrop-blur-sm ${statusColors[p.status] || 'text-muted bg-white/5'}`}>
                                {p.status === 'available' ? t('propertyDetails.status.available') : p.status === 'sold' ? t('propertyDetails.status.sold') : t('propertyDetails.status.underConstruction')}
                              </span>
                            </div>
                            <div className="absolute top-4 left-4 z-10">
                              <FavoriteButton propertyId={p.id} />
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center text-muted text-xs mb-2">
                              <i className="fa-solid fa-location-dot text-gold-500 mr-1" />
                              {location}
                            </div>
                            <h3 className="font-heading text-lg font-bold text-white group-hover:text-gold-500 transition-colors mb-2">{title}</h3>
                            <div className="flex gap-4 text-muted text-xs mb-4">
                              <span className="flex items-center gap-1"><i className="fa-solid fa-bed text-gold-500" /> {p.bedrooms} {t('propertiesPage.beds')}</span>
                              <span className="flex items-center gap-1"><i className="fa-solid fa-bath text-gold-500" /> {p.bathrooms} {t('propertiesPage.baths')}</span>
                              <span className="flex items-center gap-1"><i className="fa-solid fa-ruler-combined text-gold-500" /> {p.area} {t('propertiesPage.area')}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                              <span className="text-xl font-bold text-gold-500">${p.price.toLocaleString()}</span>
                              <span className="inline-flex items-center gap-2 text-sm text-muted group-hover:text-gold-500 transition-colors">
                                {t('propertiesPage.details')} <i className="fa-solid fa-arrow-right text-xs" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
