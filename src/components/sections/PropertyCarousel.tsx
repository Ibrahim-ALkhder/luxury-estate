import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePropertyStore } from '../../store/propertyStore';
import FavoriteButton from '../../features/favorites/FavoriteButton';

export default function PropertyCarousel() {
  const { t, i18n } = useTranslation();
  const allProperties = usePropertyStore((s) => s.properties);
  const displayProperties = allProperties.slice(0, 4);
  const isArabic = i18n.language === 'ar';
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-secondary overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-subtitle">{t('carousel.title')}</span>
          <h2 className="section-title mt-4 text-white">
            {t('carousel.title')}
          </h2>
        </motion.div>
      </div>

      <motion.div style={{ x }} className="flex gap-8 px-6 relative z-10">
        {displayProperties.map((property, i) => {
          const title = isArabic ? property.title.ar : property.title.en;
          const location = isArabic ? property.location.ar : property.location.en;

          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative flex-shrink-0 w-[75vw] md:w-[450px] lg:w-[520px] h-[500px] md:h-[580px] rounded-3xl overflow-hidden card-hover group"
            >
              <img
                src={property.image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              <div className="absolute top-6 right-6 z-10">
                <FavoriteButton propertyId={property.id} />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <div className="flex items-center gap-2 text-gold-500 mb-2">
                  <i className="fa-solid fa-location-dot" />
                  <span className="text-sm font-medium">{location}</span>
                </div>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">{title}</h3>
                <div className="flex gap-4 text-muted text-sm mb-4">
                  <span className="flex items-center gap-1"><i className="fa-solid fa-bed text-gold-500" /> {property.bedrooms} {t('carousel.beds')}</span>
                  <span className="flex items-center gap-1"><i className="fa-solid fa-bath text-gold-500" /> {property.bathrooms} {t('carousel.baths')}</span>
                  <span className="flex items-center gap-1"><i className="fa-solid fa-ruler-combined text-gold-500" /> {property.area} {t('carousel.area')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gold-500">
                    ${property.price.toLocaleString()}
                  </span>
                  <Link
                    to={`/properties/${property.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500/10 backdrop-blur-md border border-gold-500/30 text-gold-500 rounded-xl hover:bg-gold-500 hover:text-background transition-all duration-300 text-sm font-medium"
                  >
                    {t('propertiesPage.details')}
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {allProperties.length > 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 text-center mt-16"
        >
          <Link to="/properties" className="btn-primary inline-flex items-center gap-2 text-lg">
            {t('carousel.seeAll')}
            <i className="fa-solid fa-arrow-right" />
          </Link>
        </motion.div>
      )}
    </section>
  );
}
