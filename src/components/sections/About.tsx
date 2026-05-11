import { useTranslation } from 'react-i18next';
import ScrollReveal from '../animations/ScrollReveal';

export default function About() {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-32 bg-charcoal-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-5" />
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <ScrollReveal direction="left">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold-gradient rounded-full blur-3xl opacity-20" />
            <img
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop"
              alt="Luxury estate"
              className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]"
              loading="lazy"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right">
          <span className="text-gold-500 uppercase tracking-[0.2em] text-sm font-medium">
            {t('about.title')}
          </span>
          <h2 className="font-display text-5xl md:text-6xl mt-4 text-white">
            {t('about.title')}
          </h2>
          <p className="mt-8 text-cream-200 leading-relaxed text-lg">
            {t('about.description')}
          </p>
          <div className="mt-12 flex gap-12">
            <div>
              <span className="text-5xl font-display text-gold-500">15+</span>
              <p className="text-cream-300 mt-2">{t('about.years')}</p>
            </div>
            <div>
              <span className="text-5xl font-display text-gold-500">200+</span>
              <p className="text-cream-300 mt-2">{t('about.properties')}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}