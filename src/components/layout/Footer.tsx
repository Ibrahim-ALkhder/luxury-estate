import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-charcoal-900 text-cream-200 pt-24 pb-12 border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="font-heading text-3xl font-bold text-gold-500">
              LUX<span className="text-white">ESTATE</span>
            </Link>
            <p className="mt-4 text-cream-400 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-cream-400 hover:text-gold-500 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-cream-400 hover:text-gold-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-cream-400 hover:text-gold-500 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-white text-lg font-semibold mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li><Link to="/properties" className="text-cream-400 hover:text-gold-500 transition-colors">{t('footer.properties')}</Link></li>
              <li><Link to="/#about" className="text-cream-400 hover:text-gold-500 transition-colors">{t('footer.about')}</Link></li>
              <li><Link to="/#services" className="text-cream-400 hover:text-gold-500 transition-colors">{t('services.title')}</Link></li>
              <li><Link to="/#contact" className="text-cream-400 hover:text-gold-500 transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-white text-lg font-semibold mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 mt-1" />
                <span className="text-cream-400">123 Luxury Avenue, Dubai, UAE</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-500" />
                <span className="text-cream-400">+971 4 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-500" />
                <span className="text-cream-400">info@luxestate.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-white text-lg font-semibold mb-6">Newsletter</h4>
            <p className="text-cream-400 mb-4">Subscribe for exclusive listings and insights.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-cream-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <button type="submit" className="btn-primary w-full text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream-500 text-sm">
            © {new Date().getFullYear()} LUXESTATE. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-cream-500">
            <a href="#" className="hover:text-gold-500">Privacy Policy</a>
            <a href="#" className="hover:text-gold-500">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}