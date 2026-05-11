import { useTranslation } from 'react-i18next';
import SearchFilter from '../forms/SearchFilter';

export default function SearchSection() {
  const { t } = useTranslation();
  return (
    <section className="py-32 bg-dark-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/5 to-transparent" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-5xl md:text-6xl text-white">{t('search.title')}</h2>
        <p className="mt-4 text-cream-300">{t('search.subtitle')}</p>
        <div className="mt-12">
          <SearchFilter />
        </div>
      </div>
    </section>
  );
}