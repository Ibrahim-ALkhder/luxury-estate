import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SearchSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('keyword', location);
    if (type) params.set('type', type);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative -mt-24 z-30">
      <div className="mx-auto max-w-5xl px-6">
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onSubmit={handleSearch}
          className="glass-dark p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-gold-glow-lg border border-champagne-300/20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-[10px] sm:text-xs text-muted mb-2 uppercase tracking-wider font-utility font-semibold">
                {t('search.keyword')}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('search.keyword')}
                className="w-full bg-background/50 border border-default rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs text-muted mb-2 uppercase tracking-wider font-utility font-semibold">
                {t('search.type')}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-background/50 border border-default rounded-xl px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-sm"
              >
                <option value="">{t('search.type')}</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Palace">Palace</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs text-muted mb-2 uppercase tracking-wider font-utility font-semibold">
                {t('search.minPrice')}
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-background/50 border border-default rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs text-muted mb-2 uppercase tracking-wider font-utility font-semibold">
                {t('search.maxPrice')}
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="9999999"
                className="w-full bg-background/50 border border-default rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary w-full mt-6 py-4 text-lg font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t('search.search')}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
