import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../../features/auth/AuthProvider';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [location]);

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

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] }}
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'bg-card/80 backdrop-blur-xl border-b border-white/5 shadow-glass'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-heading text-2xl font-bold tracking-wide text-white">
            LUX<span className="text-gold-500">ESTATE</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {links.map((link) =>
              link.isAnchor ? (
                <button
                  key={link.to}
                  onClick={() => handleAnchor(link.to)}
                  className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 btn-ghost after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 ${
                    isHome && location.hash === link.to.substring(1)
                      ? 'after:w-full text-gold-500'
                      : 'after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 btn-ghost after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 ${
                    location.pathname === link.to
                      ? 'after:w-full text-gold-500'
                      : 'after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <ThemeSwitcher />
            <LocaleSwitcher />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-gold-500 hover:border-gold-500/30 transition-all text-sm"
                >
                  <i className="fa-solid fa-user" />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  <i className={`fa-solid fa-chevron-down text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-48 card rounded-xl p-2 z-20"
                    >
                      <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:text-gold-500 hover:bg-white/5 transition-all text-sm">
                        <i className="fa-solid fa-id-card" /> {t('nav.profile')}
                      </Link>
                      <Link to="/profile/favorites" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:text-gold-500 hover:bg-white/5 transition-all text-sm">
                        <i className="fa-regular fa-heart" /> {t('nav.favorites')}
                      </Link>
                      <Link to="/profile/bookings" className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:text-gold-500 hover:bg-white/5 transition-all text-sm">
                        <i className="fa-regular fa-calendar" /> {t('profile.myBookings')}
                      </Link>
                      <hr className="border-white/5 my-1" />
                      <button
                        onClick={() => { logout(); navigate('/'); setUserMenuOpen(false); }}
                        className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm w-full text-left"
                      >
                        <i className="fa-solid fa-right-from-bracket" /> {t('nav.signOut')}
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-xl border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-background transition-all duration-300 text-sm font-medium"
              >
                {t('nav.signIn')}
              </Link>
            )}
          </div>

          <button
            className={`md:hidden text-white p-2 ${scrolled ? 'bg-gold-500/10 rounded-lg' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card/95 backdrop-blur-xl border-t border-white/5 flex flex-col gap-4 px-6 pb-6 md:hidden"
            >
              {links.map((link) =>
                link.isAnchor ? (
                  <button
                    key={link.to}
                    onClick={() => handleAnchor(link.to)}
                    className="text-white/80 hover:text-gold-500 transition-colors text-sm font-medium uppercase tracking-wide"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-white/80 hover:text-gold-500 transition-colors text-sm font-medium uppercase tracking-wide"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <hr className="border-white/5" />
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-white/80 hover:text-gold-500 transition-colors text-sm font-medium">
                    <i className="fa-solid fa-user mr-2" />{user?.name}
                  </Link>
                  <Link to="/profile/favorites" onClick={() => setMobileOpen(false)} className="text-white/80 hover:text-gold-500 transition-colors text-sm font-medium">
                    <i className="fa-regular fa-heart mr-2" />{t('nav.favorites')}
                  </Link>
                  <Link to="/profile/bookings" onClick={() => setMobileOpen(false)} className="text-white/80 hover:text-gold-500 transition-colors text-sm font-medium">
                    <i className="fa-regular fa-calendar mr-2" />{t('profile.myBookings')}
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); setMobileOpen(false); }} className="text-white/80 hover:text-red-400 transition-colors text-sm font-medium text-left">
                    <i className="fa-solid fa-right-from-bracket mr-2" />{t('nav.signOut')}
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-white/80 hover:text-gold-500 transition-colors text-sm font-medium">
                  <i className="fa-solid fa-user mr-2" />{t('nav.signIn')}
                </Link>
              )}
              <LocaleSwitcher />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
