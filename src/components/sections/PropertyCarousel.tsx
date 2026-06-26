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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_left,_var(--tw-gradient-stops))] from-bronze-500/8 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-champagne-300/10 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-12 sm:mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-subtitle">{t('carousel.subtitle')}</span>
          <h2 className="section-title mt-4 text-on-dark">
            {t('carousel.title')}
          </h2>
        </motion.div>
      </div>

      <motion.div style={{ x }} className="flex gap-6 sm:gap-8 px-4 sm:px-6 relative z-10">
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
              className="relative flex-shrink-0 w-[80vw] sm:w-[400px] md:w-[450px] lg:w-[520px] rounded-3xl overflow-hidden card-hover group aspect-[4/5] sm:aspect-[3/4]"
            >
              <img
                src={property.image}
                alt={title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-10">
                <FavoriteButton propertyId={property.id} />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
                <div className="flex items-center gap-2 text-champagne-300 mb-2">
                  <i className="fa-solid fa-location-dot text-xs sm:text-sm" />
                  <span className="text-xs sm:text-sm font-medium font-utility">{location}</span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl md:text-3xl text-on-dark mb-3 leading-tight">{title}</h3>
                <div className="flex gap-3 sm:gap-4 text-muted text-xs sm:text-sm mb-4 font-body">
                  <span className="flex items-center gap-1"><i className="fa-solid fa-bed text-gold-500" /> {property.bedrooms} {t('carousel.beds')}</span>
                  <span className="flex items-center gap-1"><i className="fa-solid fa-bath text-gold-500" /> {property.bathrooms} {t('carousel.baths')}</span>
                  <span className="flex items-center gap-1"><i className="fa-solid fa-ruler-combined text-gold-500" /> {property.area} {t('carousel.area')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl sm:text-2xl font-bold text-gold-500 font-utility">
                    ${property.price.toLocaleString()}
                  </span>
                  <Link
                    to={`/properties/${property.id}`}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-champagne-300/10 backdrop-blur-md border border-champagne-300/30 text-champagne-300 rounded-xl hover:bg-gold-500 hover:text-background transition-all duration-300 text-xs sm:text-sm font-medium font-utility"
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
          className="relative z-10 text-center mt-12 sm:mt-16"
        >
          <Link to="/properties" className="btn-primary inline-flex items-center gap-2 text-base sm:text-lg">
            {t('carousel.seeAll')}
            <i className="fa-solid fa-arrow-right" />
          </Link>
        </motion.div>
      )}
    </section>
  );
}
