import { useTranslation } from 'react-i18next';

interface Props {
  textColor?: string;
}

export default function LocaleSwitcher({ textColor = 'text-charcoal-600' }: Props) {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <div className={`flex items-center gap-2 ${textColor}`}>
      <button
        onClick={() => changeLanguage('en')}
        className={`text-sm ${i18n.language === 'en' ? 'font-bold text-gold-500' : ''}`}
      >
        EN
      </button>
      <span className="opacity-40">|</span>
      <button
        onClick={() => changeLanguage('ar')}
        className={`text-sm ${i18n.language === 'ar' ? 'font-bold text-gold-500' : ''}`}
      >
        AR
      </button>
    </div>
  );
}