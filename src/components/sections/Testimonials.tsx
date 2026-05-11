import { useTranslation } from 'react-i18next';
import ScrollReveal from '../animations/ScrollReveal';
import { Star } from 'lucide-react';

const testimonials = [
  { id: '1', name: 'Ahmed Al-Rashid', role: 'CEO', content: 'Exceptional service. LUXESTATE helped me find the perfect waterfront villa. Their attention to detail is unmatched.', rating: 5 },
  { id: '2', name: 'Sarah Williams', role: 'Investor', content: 'I have worked with many real estate agencies, but none compare to the professionalism and discretion of LUXESTATE.', rating: 5 },
  { id: '3', name: 'Khalid Al-Farsi', role: 'Entrepreneur', content: 'A truly luxurious experience from start to finish. The team understood my needs and delivered beyond expectations.', rating: 5 },
];

export default function Testimonials() {
  const { t } = useTranslation();
  return (
    <section className="py-32 bg-cream-50">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="font-display text-5xl md:text-6xl text-center text-charcoal-900">{t('testimonials.title')}</h2>
        </ScrollReveal>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.1}>
              <div className="glass p-8 rounded-3xl">
                <div className="flex gap-1 text-gold-500">
                  {Array.from({ length: item.rating }).map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="mt-6 text-charcoal-700 leading-relaxed text-lg">&ldquo;{item.content}&rdquo;</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-white font-display text-xl">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-900">{item.name}</p>
                    <p className="text-sm text-charcoal-500">{item.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}