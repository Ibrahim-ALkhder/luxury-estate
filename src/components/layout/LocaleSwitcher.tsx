import { useTranslation } from 'react-i18next';

export default function LocaleSwitcher() {
  const { i18n } = useTranslation();
  const toggleLocale = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <button
      onClick={toggleLocale}
      className="text-white/70 hover:text-gold-500 transition-colors text-xs font-medium uppercase tracking-widest"
    >
      {i18n.language === 'ar' ? 'EN' : 'AR'}
    </button>
  );
}
