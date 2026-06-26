import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="bg-background border-t border-champagne-300/20 pt-16 sm:pt-20 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-champagne-300/8 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16">
          <div>
            <Link to="/" className="font-heading text-2xl sm:text-3xl tracking-wide text-gold-500">
              LUX<span className="text-on-dark">ESTATE</span>
            </Link>
            <p className="mt-4 text-muted leading-relaxed text-sm font-body">
              {t('footer.description')}
            </p>
            <div className="flex gap-3 sm:gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-glass-medium flex items-center justify-center text-muted hover:bg-gold-500 hover:text-background transition-all duration-300">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-glass-medium flex items-center justify-center text-muted hover:bg-gold-500 hover:text-background transition-all duration-300">
                <i className="fa-brands fa-twitter" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-glass-medium flex items-center justify-center text-muted hover:bg-gold-500 hover:text-background transition-all duration-300">
                <i className="fa-brands fa-linkedin-in" />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-glass-medium flex items-center justify-center text-muted hover:bg-gold-500 hover:text-background transition-all duration-300">
                <i className="fa-brands fa-facebook-f" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-on-dark text-lg mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li><Link to="/properties" className="text-muted hover:text-gold-500 transition-colors text-sm font-body">{t('footer.properties')}</Link></li>
              <li><Link to="/#about" className="text-muted hover:text-gold-500 transition-colors text-sm font-body">{t('footer.about')}</Link></li>
              <li><Link to="/#services" className="text-muted hover:text-gold-500 transition-colors text-sm font-body">{t('services.title')}</Link></li>
              <li><Link to="/#contact" className="text-muted hover:text-gold-500 transition-colors text-sm font-body">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-on-dark text-lg mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot text-gold-500 mt-1" />
                <span className="text-muted text-sm font-body">{t('contact.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-phone text-gold-500" />
                <span className="text-muted text-sm font-body">{t('contact.phoneValue')}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-gold-500" />
                <span className="text-muted text-sm font-body">{t('contact.emailValue')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-on-dark text-lg mb-6">{t('footer.newsletter')}</h4>
            <p className="text-muted text-sm mb-4 font-body">{t('footer.newsletterText')}</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletterPlaceholder')}
                required
                className="input-field text-sm"
              />
              <button type="submit" className="btn-primary w-full text-sm font-utility">
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-subtle pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs font-body">
            © {new Date().getFullYear()} LUXESTATE. {t('footer.rights')}
          </p>
          <div className="flex gap-6 text-xs text-muted font-body">
            <a href="#" className="hover:text-gold-500 transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-gold-500 transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
