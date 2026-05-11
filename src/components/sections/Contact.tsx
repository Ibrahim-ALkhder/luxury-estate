import { useTranslation } from 'react-i18next';
import ScrollReveal from '../animations/ScrollReveal';
import ContactForm from '../forms/ContactForm';

export default function Contact() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="py-32 bg-charcoal-900 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <span className="text-gold-500 uppercase tracking-[0.2em] text-sm font-medium">{t('contact.subtitle')}</span>
          <h2 className="font-display text-5xl md:text-6xl mt-4 text-white">{t('contact.title')}</h2>
        </ScrollReveal>
        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}