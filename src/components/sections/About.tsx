import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const milestones = [
  { year: '2008', key: 'about.founded' },
  { year: '2012', key: 'about.expanded' },
  { year: '2016', key: 'about.globalLaunch' },
  { year: '2020', key: 'about.digitalTransformation' },
  { year: '2024', key: 'about.portfolioMilestone' },
];

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-gold-500/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden card border-gold-500/10">
              <img
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop"
                alt="Luxury estate"
                className="w-full h-[500px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="glass-dark rounded-2xl p-4 text-center"
                >
                  <div className="text-3xl font-bold text-gold-500">15+</div>
                  <div className="text-xs text-muted mt-1">{t('about.years')}</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="glass-dark rounded-2xl p-4 text-center"
                >
                  <div className="text-3xl font-bold text-gold-500">200+</div>
                  <div className="text-xs text-muted mt-1">{t('about.properties')}</div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-subtitle">{t('about.title')}</span>
            <h2 className="section-title mt-4 text-white">
              {t('about.title')}
            </h2>
            <p className="mt-8 text-muted leading-relaxed text-lg">
              {t('about.description')}
            </p>

            <div className="mt-12 space-y-4">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-6 p-4 rounded-2xl card hover:border-gold-500/20 transition-all duration-300"
                >
                  <div className="w-20 text-center">
                    <span className="text-gold-500 font-bold text-lg">{m.year}</span>
                  </div>
                  <div className="w-px h-10 bg-gold-500/30" />
                  <span className="text-white/80 text-sm">{t(m.key)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
