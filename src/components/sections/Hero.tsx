import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

export default function Hero() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stats = [
    { value: '15+', label: t('about.years') },
    { value: '200+', label: t('about.properties') },
    { value: '98%', label: t('hero.clientSatisfaction') },
    { value: '$2B+', label: t('hero.portfolioValue') },
  ];

  return (
    <section ref={ref} className="relative h-dvh min-h-[600px] flex items-center justify-center overflow-hidden bg-background">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/15 via-champagne-300/5 to-transparent" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-6xl text-center px-4 sm:px-6 md:px-8">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-utility text-gold-500 uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold block"
        >
          {t('hero.subtitle')}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="section-title mt-4 sm:mt-6 leading-[1.05]"
        >
          <span className="text-on-dark">{t('hero.title')} </span>
          <span className="text-gradient">{t('hero.highlight')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed font-body"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6"
        >
          <Link to="/properties" className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4">
            {t('hero.explore')}
          </Link>
          <a href="#contact" className="btn-outline text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4">
            {t('hero.contact')}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-12 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.15, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-500 font-utility">{stat.value}</div>
              <div className="text-[11px] sm:text-sm text-muted mt-1 px-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 sm:bottom-10 z-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-muted"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-widest font-utility">{t('hero.scroll')}</span>
          <svg width="14" height="22" viewBox="0 0 16 24" fill="none" className="sm:w-[16px] sm:h-[24px]">
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="8" r="2" fill="#F5B700" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
