import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LocaleSwitcher from './LocaleSwitcher';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAnchor = (to: string) => {
    if (isHome) {
      const id = to.split('#')[1];
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/${to}`);
    }
    setMobileOpen(false);
  };

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/properties', label: t('nav.properties') },
    { to: '/#about', label: t('nav.about'), isAnchor: true },
    { to: '/#contact', label: t('nav.contact'), isAnchor: true },
  ];

  // الحفاظ على ألوان الناف كما هي دون تغيير
  let headerBg, textColor, linkColor, linkHover, activeBorder;
  if (scrolled) {
    if (isHome) {
      headerBg = 'glass-dark shadow-luxury';
      textColor = 'text-white';
      linkColor = 'text-white';
    } else {
      headerBg = 'glass shadow-luxury';
      textColor = 'text-charcoal-900';
      linkColor = 'text-charcoal-700';
    }
    linkHover = 'hover:text-gold-500';
    activeBorder = 'text-gold-500 border-b-2 border-gold-500';
  } else {
    if (isHome) {
      headerBg = 'bg-transparent';
      textColor = 'text-white';
      linkColor = 'text-white';
    } else {
      headerBg = 'bg-transparent';
      textColor = 'text-charcoal-900';
      linkColor = 'text-charcoal-700';
    }
    linkHover = 'hover:text-gold-500';
    activeBorder = 'text-gold-500';
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${headerBg}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className={`font-heading text-2xl font-bold tracking-wide ${textColor}`}>
          LUX<span className="text-gold-500">ESTATE</span>
        </Link>

        {/* سطح المكتب */}
        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) =>
            link.isAnchor ? (
              <button
                key={link.to}
                onClick={() => handleAnchor(link.to)}
                className={`text-sm font-medium tracking-wide uppercase transition-colors ${linkColor} ${linkHover} ${
                  isHome && location.hash === link.to.substring(1) ? activeBorder : ''
                }`}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wide uppercase transition-colors ${linkColor} ${linkHover} ${
                  location.pathname === link.to ? activeBorder : ''
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          <LocaleSwitcher textColor={textColor} />
          <Link
            to="/admin"
            className={`ml-2 px-6 py-2 rounded-lg border transition-all ${
              scrolled || !isHome
                ? 'border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-black'
            }`}
          >
            {t('nav.login')}
          </Link>
        </div>

        {/* زر القائمة للجوال */}
        <button className={`md:hidden ${textColor}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* قائمة الجوال: عرض أفقي مرتب */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`${scrolled || !isHome ? 'glass' : 'bg-charcoal-900/90'} md:hidden`}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 justify-center">
              {links.map((link) =>
                link.isAnchor ? (
                  <button
                    key={link.to}
                    onClick={() => handleAnchor(link.to)}
                    className={`text-sm font-medium text-gold-500 hover:text-gold-600`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium ${scrolled || !isHome ? 'text-gold-500' : 'text-gold-300'} hover:text-gold-600`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <LocaleSwitcher textColor="text-gold-500" />
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium text-gold-500 border border-gold-500 px-3 py-1 rounded-lg hover:bg-gold-500 hover:text-white`}
              >
                {t('nav.login')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
