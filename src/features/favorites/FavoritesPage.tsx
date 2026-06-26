import { useTranslation } from 'react-i18next';
import { useFavoritesStore } from '../../store/favoritesStore';
import { usePropertyStore } from '../../store/propertyStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthProvider';

export default function FavoritesPage() {
  const { t, i18n } = useTranslation();
  const { favorites } = useFavoritesStore();
  const { properties } = usePropertyStore();
  const { user } = useAuth();
  const isArabic = i18n.language === 'ar';

  const favProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 sm:mb-12"
        >
          <h1 className="section-title text-on-dark">{t('favorites.title')}</h1>
          <p className="text-muted mt-2 font-body">{t('favorites.subtitle', { count: favProperties.length })}</p>
        </motion.div>

        {favProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 sm:p-16 text-center rounded-2xl"
          >
            <i className="fa-regular fa-heart text-5xl text-muted/40 mb-4" />
            <p className="text-muted mb-4 font-body">{t('favorites.empty')}</p>
            <Link to="/properties" className="btn-primary inline-block">
              {t('favorites.browseProperties')}
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {favProperties.map((p, i) => {
              const title = isArabic ? p.title.ar : p.title.en;
              const location = isArabic ? p.location.ar : p.location.en;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/properties/${p.id}`} className="card-hover group block rounded-2xl overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={p.image} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    </div>
                    <div className="p-5 sm:p-6">
                      <p className="text-muted text-xs mb-1 font-body"><i className="fa-solid fa-location-dot text-gold-500 mr-1" />{location}</p>
                      <h3 className="font-heading text-lg text-on-dark group-hover:text-gold-500 transition-colors mb-2">{title}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gold-500 font-utility">${p.price.toLocaleString()}</span>
                        <span className="text-[10px] sm:text-xs text-muted font-body">{p.bedrooms} {t('favorites.beds')} | {p.bathrooms} {t('favorites.baths')}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
