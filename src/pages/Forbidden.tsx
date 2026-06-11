import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Forbidden() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 mx-auto rounded-3xl bg-red-500/10 flex items-center justify-center text-red-400 mb-8">
          <i className="fa-solid fa-shield-halved text-5xl" />
        </div>
        <h1 className="section-title text-white mb-4">403</h1>
        <p className="text-2xl font-heading font-bold text-white mb-2">{t('forbidden.title')}</p>
        <p className="text-muted mb-8">{t('forbidden.description')}</p>
        <Link to="/profile" className="btn-primary inline-flex">
          <i className="fa-solid fa-arrow-left mr-2" /> {t('forbidden.backToProfile')}
        </Link>
      </motion.div>
    </div>
  );
}
