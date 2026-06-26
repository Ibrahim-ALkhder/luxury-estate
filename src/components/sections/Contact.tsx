import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ContactForm from '../forms/ContactForm';

export default function Contact() {
  const { t } = useTranslation();

  const companyInfo = [
    { label: 'contact.phoneLabel', value: t('contact.phoneValue'), icon: 'fa-phone' },
    { label: 'contact.emailLabel', value: t('contact.emailValue'), icon: 'fa-envelope' },
    { label: 'contact.addressLabel', value: t('contact.address'), icon: 'fa-location-dot' },
    { label: 'contact.hoursLabel', value: t('contact.hoursValue'), icon: 'fa-clock' },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-champagne-300/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-bronze-500/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="section-subtitle">{t('contact.subtitle')}</span>
          <h2 className="section-title mt-4 text-on-dark">{t('contact.title')}</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ContactForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card p-6 sm:p-8 rounded-2xl space-y-6">
              {companyInfo.map((info) => (
                <div key={info.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-champagne-300/10 flex items-center justify-center text-gold-500">
                    <i className={`fa-solid ${info.icon} text-base sm:text-lg`} />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider font-utility">{t(info.label)}</p>
                    <p className="text-on-dark font-medium text-sm sm:text-base">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/97141234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all duration-300 font-medium font-utility"
            >
              <i className="fa-brands fa-whatsapp text-xl" />
              {t('contact.whatsapp')}
            </a>

            <div className="card rounded-2xl overflow-hidden h-[200px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178837134251!2d55.2722!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff55e6a6f7ae9c0!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
