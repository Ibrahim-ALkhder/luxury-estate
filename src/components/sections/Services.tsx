import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Building, Search, Shield, Paintbrush } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const icons: Record<string, React.ElementType> = {
  buying: Building,
  consulting: Search,
  management: Shield,
  design: Paintbrush,
};

const services = ['buying', 'consulting', 'management', 'design'] as const;

export default function Services() {
  const { t } = useTranslation();
  // هذا المرجع سيغطي القسم بأكمله (العنوان + الشبكة)
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // نبحث عن البطاقات داخل الـ wrapperRef فقط
    const cards = wrapperRef.current?.querySelectorAll('.service-card');
    if (!cards || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(cards).forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapperRef} className="py-32 bg-cream-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="font-heading text-5xl md:text-6xl text-charcoal-900 mb-4">
            {t('services.title')}
          </h2>
          <p className="text-charcoal-500 max-w-2xl mx-auto mb-16">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((key) => {
            const Icon = icons[key];
            return (
              <div
                key={key}
                className="service-card group p-8 bg-white rounded-3xl shadow-luxury hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-cream-200/30"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center text-white shadow-gold group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-charcoal-900">
                  {t(`services.${key}.title`)}
                </h3>
                <p className="mt-3 text-charcoal-600 leading-relaxed">
                  {t(`services.${key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}