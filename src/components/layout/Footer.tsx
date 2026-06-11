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
    <footer className="bg-background border-t border-gold-500/10 pt-20 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gold-500/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <Link to="/" className="font-heading text-3xl font-bold text-gold-500">
              LUX<span className="text-white">ESTATE</span>
            </Link>
            <p className="mt-4 text-muted leading-relaxed text-sm">
              {t('footer.description')}
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted hover:bg-gold-500 hover:text-background transition-all duration-300">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted hover:bg-gold-500 hover:text-background transition-all duration-300">
                <i className="fa-brands fa-twitter" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted hover:bg-gold-500 hover:text-background transition-all duration-300">
                <i className="fa-brands fa-linkedin-in" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted hover:bg-gold-500 hover:text-background transition-all duration-300">
                <i className="fa-brands fa-facebook-f" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-white text-lg font-semibold mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li><Link to="/properties" className="text-muted hover:text-gold-500 transition-colors text-sm">{t('footer.properties')}</Link></li>
              <li><Link to="/#about" className="text-muted hover:text-gold-500 transition-colors text-sm">{t('footer.about')}</Link></li>
              <li><Link to="/#services" className="text-muted hover:text-gold-500 transition-colors text-sm">{t('services.title')}</Link></li>
              <li><Link to="/#contact" className="text-muted hover:text-gold-500 transition-colors text-sm">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-white text-lg font-semibold mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot text-gold-500 mt-1" />
                <span className="text-muted text-sm">{t('contact.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-phone text-gold-500" />
                <span className="text-muted text-sm">{t('contact.phoneValue')}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-gold-500" />
                <span className="text-muted text-sm">{t('contact.emailValue')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-white text-lg font-semibold mb-6">{t('footer.newsletter')}</h4>
            <p className="text-muted text-sm mb-4">{t('footer.newsletterText')}</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletterPlaceholder')}
                required
                className="input-field text-sm"
              />
              <button type="submit" className="btn-primary w-full text-sm">
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} LUXESTATE. {t('footer.rights')}
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <a href="#" className="hover:text-gold-500 transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-gold-500 transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
