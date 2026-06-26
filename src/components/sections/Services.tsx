import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const servicesList = [
  { key: 'buying', icon: 'fa-building' },
  { key: 'consulting', icon: 'fa-chart-line' },
  { key: 'management', icon: 'fa-shield-halved' },
  { key: 'design', icon: 'fa-pen-ruler' },
];

export default function Services() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bronze-500/8 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="section-subtitle">{t('services.subtitle')}</span>
          <h2 className="section-title mt-4 text-on-dark">{t('services.title')}</h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto font-body">{t('services.description')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service, i) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group card-hover p-6 sm:p-8 rounded-2xl text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/5 transition-all duration-500" />

              <div className="relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-champagne-300/10 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-background transition-all duration-500 group-hover:shadow-gold-glow">
                  <i className={`fa-solid ${service.icon} text-xl sm:text-2xl`} />
                </div>
                <h3 className="mt-5 sm:mt-6 text-lg font-semibold text-on-dark">
                  {t(`services.${service.key}.title`)}
                </h3>
                <p className="mt-3 text-muted text-sm leading-relaxed font-body">
                  {t(`services.${service.key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
