import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Scene3D from '../3d/Scene';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-dark-gradient">
      <div className="absolute inset-0 z-0 opacity-40">
        <Scene3D />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal-900/60 to-charcoal-900 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-20 mx-auto max-w-5xl text-center px-6"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gold-500 uppercase tracking-[0.3em] text-sm font-medium"
        >
          {t('hero.subtitle')}
        </motion.span>
        <h1 className="font-heading text-5xl md:text-8xl font-bold leading-tight mt-4">
          <span className="text-white">{t('hero.title')} </span>
          <span className="bg-gold-gradient bg-clip-text text-transparent">{t('hero.highlight')}</span>
        </h1>
        <p className="mt-8 text-xl text-gold-200 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Link to="/properties" className="btn-primary">
            {t('hero.explore')}
          </Link>
          <a href="#contact" className="btn-outline">
            {t('hero.contact')}
          </a>
        </div>
      </motion.div>

      {/* مؤشر التمرير */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 z-20 left-1/2 -translate-x-1/2 text-gold-400"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
            <rect x="11" y="4" width="2" height="10" rx="1" fill="currentColor" />
            <circle cx="12" cy="18" r="6" stroke="currentColor" strokeWidth="2" />
            <path d="M12 26 L12 32" stroke="currentColor" strokeWidth="2" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}