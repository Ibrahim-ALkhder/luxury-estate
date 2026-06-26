import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { usePropertyStore } from '../store/propertyStore';
import FavoriteButton from '../features/favorites/FavoriteButton';
import { useAuth } from '../features/auth/AuthProvider';
import { api } from '../services/api';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const properties = usePropertyStore((s) => s.properties);
  const property = properties.find((p) => p.id === id);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactStatus, setContactStatus] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

  const isSold = property?.status === 'sold';

  const doBooking = async () => {
    if (!property || !user || isSold) return;
    setBookingMsg('');
    try {
      await api.post('/bookings', { propertyId: property.id });
      setShowBooking(false);
    } catch (err: any) {
      if (err?.status === 401 || err?.status === 403) {
        setBookingMsg(t('propertyDetails.loginRequired'));
      } else if (err?.status === 400) {
        setBookingMsg(err.message || t('propertyDetails.bookingFailed'));
      } else {
        setBookingMsg(t('propertyDetails.bookingFailed'));
      }
    }
  };

  if (!property) {
    return (
      <div className="pt-32 text-center min-h-screen bg-background">
        <div className="card p-12 max-w-md mx-auto rounded-2xl">
          <i className="fa-solid fa-circle-exclamation text-4xl text-muted mb-4" />
          <h2 className="text-xl text-primary mb-4">{t('propertyDetails.notFound')}</h2>
          <Link to="/properties" className="btn-primary inline-block">
            <i className="fa-solid fa-arrow-left mr-2" />
            {t('propertyDetails.back')}
          </Link>
        </div>
      </div>
    );
  }

  const isArabic = i18n.language === 'ar';
  const pick = <T,>(v: T | { en: T; ar: T }): T =>
    v && typeof v === 'object' && !Array.isArray(v) ? (isArabic ? (v as { en: T; ar: T }).ar : (v as { en: T; ar: T }).en) : (v as T);
  const title: string = pick(property.title);
  const location: string = pick(property.location);
  const description: string = pick(property.description ?? '');
  const features: string[] = Array.isArray(property.features) ? property.features : pick(property.features ?? []);

  const relatedProperties = properties.filter((p) => p.id !== property.id && p.type === property.type).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link to="/properties" className="inline-flex items-center gap-2 text-muted hover:text-gold-500 transition-colors text-sm font-body">
            <i className="fa-solid fa-arrow-left" /> {t('propertyDetails.back')}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative rounded-3xl overflow-hidden card-hover cursor-pointer group aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9]"
              onClick={() => setLightbox(property.image)}
            >
              <img src={property.image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
              {isSold && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <i className="fa-solid fa-ban text-5xl sm:text-6xl text-red-400/80 mb-4" />
                    <p className="text-3xl sm:text-4xl font-bold text-red-400 uppercase tracking-widest font-utility">{t('propertyDetails.soldBadge')}</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity p-4 bg-glass backdrop-blur-md rounded-full">
                  <i className="fa-solid fa-expand text-on-dark text-xl" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-6 sm:p-8">
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-on-dark">{title}</h1>
                <p className="text-muted mt-2 font-body">
                  <i className="fa-solid fa-location-dot text-gold-500 mr-2" />
                  {location}
                </p>
              </div>
              <div className="absolute top-5 right-5 sm:top-6 sm:right-6 flex items-center gap-3">
                <FavoriteButton propertyId={property.id} />
                <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium backdrop-blur-sm border font-utility ${
                  property.status === 'available' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                  property.status === 'sold' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                  'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                }`}>
                  {property.status === 'available' ? t('propertyDetails.status.available') :
                   property.status === 'sold' ? t('propertyDetails.status.sold') :
                   t('propertyDetails.status.underConstruction')}
                </span>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
              ].map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer card-hover" onClick={() => setLightbox(img)}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="card p-6 sm:p-8 rounded-2xl">
              <h2 className="font-heading text-xl sm:text-2xl text-on-dark mb-4">
                <i className="fa-solid fa-circle-info text-gold-500 mr-3" />
                {t('propertyDetails.description')}
              </h2>
              <p className="text-muted leading-relaxed font-body">
                {description || t('propertyDetails.defaultDescription')}
              </p>
            </div>

            {features.length > 0 && (
              <div className="card p-6 sm:p-8 rounded-2xl">
                <h2 className="font-heading text-xl sm:text-2xl text-on-dark mb-6">
                  <i className="fa-solid fa-list-check text-gold-500 mr-3" />
                  {t('propertyDetails.features')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {features.map((feat) => (
                    <div key={feat} className="flex items-center gap-3 bg-secondary rounded-xl p-3 sm:p-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                        <i className="fa-solid fa-check text-xs sm:text-sm" />
                      </div>
                      <span className="text-on-dark/80 text-xs sm:text-sm font-body">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.hasAdvanced && (
              <div className="card p-6 sm:p-8 rounded-2xl">
                <h2 className="font-heading text-xl sm:text-2xl text-on-dark mb-6">
                  <i className="fa-solid fa-sliders text-gold-500 mr-3" />
                  {t('propertyDetails.advancedDetails')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {property.floor && (
                    <div className="bg-secondary rounded-xl p-4">
                      <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1 font-utility">{t('propertyDetails.floor')}</p>
                      <p className="text-on-dark font-medium text-sm sm:text-base">{property.floor}</p>
                    </div>
                  )}
                  {property.occupancy && (
                    <div className="bg-secondary rounded-xl p-4">
                      <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1 font-utility">{t('propertyDetails.occupancy')}</p>
                      <p className="text-on-dark font-medium text-sm sm:text-base">{property.occupancy} {t('propertyDetails.persons')}</p>
                    </div>
                  )}
                  {property.soundInsulation && (
                    <div className="bg-secondary rounded-xl p-4">
                      <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1 font-utility">{t('propertyDetails.soundInsulation')}</p>
                      <p className="text-on-dark font-medium text-sm sm:text-base">{property.soundInsulation}</p>
                    </div>
                  )}
                  {property.daylightFactor && (
                    <div className="bg-secondary rounded-xl p-4">
                      <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1 font-utility">{t('propertyDetails.daylightFactor')}</p>
                      <p className="text-on-dark font-medium text-sm sm:text-base">{property.daylightFactor}</p>
                    </div>
                  )}
                  {property.ceilingHeight && (
                    <div className="bg-secondary rounded-xl p-4">
                      <p className="text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1 font-utility">{t('propertyDetails.ceilingHeight')}</p>
                      <p className="text-on-dark font-medium text-sm sm:text-base">{property.ceilingHeight}</p>
                    </div>
                  )}
                </div>
                {property.floorPlanImage && (
                  <div className="mt-4 rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightbox(property.floorPlanImage!)}>
                    <img src={property.floorPlanImage} alt="Floor Plan" className="w-full h-auto object-contain" />
                  </div>
                )}
              </div>
            )}

            <div className="card p-6 sm:p-8 rounded-2xl">
              <h2 className="font-heading text-xl sm:text-2xl text-on-dark mb-6">
                <i className="fa-solid fa-map-location-dot text-gold-500 mr-3" />
                {t('propertyDetails.location')}
              </h2>
              <div className="rounded-2xl overflow-hidden aspect-video">
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
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-28 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 sm:p-8 rounded-2xl"
              >
                <p className="text-3xl sm:text-4xl font-bold text-gold-500 mb-6 font-utility">${property.price.toLocaleString(locale)}</p>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                  <div className="text-center bg-secondary rounded-xl p-4">
                    <i className="fa-solid fa-bed text-gold-500 text-lg sm:text-xl" />
                    <p className="text-on-dark font-bold mt-1 font-utility">{property.bedrooms}</p>
                    <p className="text-muted text-[10px] sm:text-xs font-body">{t('propertyDetails.bedrooms')}</p>
                  </div>
                  <div className="text-center bg-secondary rounded-xl p-4">
                    <i className="fa-solid fa-bath text-gold-500 text-lg sm:text-xl" />
                    <p className="text-on-dark font-bold mt-1 font-utility">{property.bathrooms}</p>
                    <p className="text-muted text-[10px] sm:text-xs font-body">{t('propertyDetails.bathrooms')}</p>
                  </div>
                  <div className="text-center bg-secondary rounded-xl p-4">
                    <i className="fa-solid fa-ruler-combined text-gold-500 text-lg sm:text-xl" />
                    <p className="text-on-dark font-bold mt-1 font-utility">{property.area}</p>
                    <p className="text-muted text-[10px] sm:text-xs font-body">{t('propertyDetails.area')}</p>
                  </div>
                </div>

                {isSold && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-4">
                    <p className="text-red-400 text-sm font-medium flex items-center gap-2 font-utility">
                      <i className="fa-solid fa-circle-exclamation" />
                      {t('propertyDetails.soldMessage')}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={() => setShowBooking(true)}
                    disabled={isSold}
                    className={`w-full flex items-center justify-center gap-2 text-base py-4 rounded-xl font-medium transition-all duration-300 font-utility ${
                      isSold
                        ? 'bg-muted/20 text-muted cursor-not-allowed border border-default'
                        : 'btn-primary'
                    }`}
                  >
                    <i className={`${isSold ? 'fa-solid fa-ban' : 'fa-regular fa-calendar'}`} />
                    {isSold ? t('propertyDetails.soldDisabled') : t('propertyDetails.bookNow')}
                  </button>
                  <button
                    onClick={() => setShowContact(true)}
                    disabled={isSold}
                    className={`w-full flex items-center justify-center gap-2 text-base py-4 rounded-xl font-medium transition-all duration-300 font-utility ${
                      isSold
                        ? 'bg-muted/20 text-muted cursor-not-allowed border border-default'
                        : 'btn-outline'
                    }`}
                  >
                    <i className="fa-regular fa-message" />
                    {isSold ? t('propertyDetails.soldDisabled') : t('propertyDetails.contactAgent')}
                  </button>
                  <a
                    href="https://wa.me/97141234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all duration-300 font-medium text-base font-utility"
                  >
                    <i className="fa-brands fa-whatsapp text-xl" />
                    {t('propertyDetails.whatsapp')}
                  </a>
                  <a
                    href="tel:+97141234567"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-500 hover:bg-gold-500/20 transition-all duration-300 font-medium text-base font-utility"
                  >
                    <i className="fa-solid fa-phone text-xl" />
                    {t('propertyDetails.callUs')}
                  </a>
                </div>
              </motion.div>

              {relatedProperties.length > 0 && (
                <div className="card p-5 sm:p-6 rounded-2xl">
                  <h3 className="font-heading text-lg text-on-dark mb-4">
                    <i className="fa-solid fa-building text-gold-500 mr-2" />
                    {t('propertyDetails.similarProperties')}
                  </h3>
                  <div className="space-y-4">
                    {relatedProperties.map((rp) => {
                      const rpTitle = typeof rp.title === 'object' ? (isArabic ? rp.title.ar : rp.title.en) : rp.title;
                      return (
                        <Link
                          key={rp.id}
                          to={`/properties/${rp.id}`}
                          className="flex gap-4 card-hover rounded-xl p-3 group"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0">
                            <img src={rp.image} alt={rpTitle} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-on-dark text-xs sm:text-sm font-medium truncate group-hover:text-gold-500 transition-colors font-body">{rpTitle}</p>
                            <p className="text-gold-500 font-bold text-xs sm:text-sm mt-1 font-utility">${rp.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4 sm:p-8" onClick={() => setLightbox(null)}>
          <img src={lightbox} className="max-w-full max-h-full object-contain rounded-2xl" />
          <button className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-glass backdrop-blur-md flex items-center justify-center text-on-dark hover:bg-gold-500 transition-all" onClick={() => setLightbox(null)} aria-label="Close">
            <i className="fa-solid fa-xmark text-lg sm:text-xl" />
          </button>
        </div>
      )}

      {showBooking && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBooking(false)}>
          <div className="card p-6 sm:p-8 max-w-md w-full rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading text-xl sm:text-2xl text-on-dark mb-4">
              <i className="fa-regular fa-calendar text-gold-500 mr-3" />
              {t('propertyDetails.bookNow')}
            </h3>
            <p className="text-muted mb-6 font-body">{t('propertyDetails.bookingMessage', { title })}</p>
            {bookingMsg && <p className="text-red-400 text-sm text-center mb-4 font-body">{bookingMsg}</p>}
            <div className="flex gap-4 justify-end">
              <button onClick={() => setShowBooking(false)} className="btn-outline text-sm">{t('admin.cancel')}</button>
              <button onClick={() => doBooking()} className="btn-primary text-sm">{t('propertyDetails.confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {showContact && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowContact(false); setContactStatus(''); }}>
          <div className="card p-6 sm:p-8 max-w-md w-full rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading text-xl sm:text-2xl text-on-dark mb-6">
              <i className="fa-regular fa-message text-gold-500 mr-3" />
              {t('propertyDetails.contactAgent')}
            </h3>
            {contactStatus && (
              <p className={`text-sm text-center mb-4 font-body ${contactStatus === 'ok' ? 'text-green-400' : 'text-red-400'}`}>
                {contactStatus === 'ok' ? t('propertyDetails.contactSuccess') : t('propertyDetails.contactError')}
              </p>
            )}
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              if (!contactName || !contactEmail || !contactMsg) return;
              setContactStatus('');
              try {
                await api.post('/messages', {
                  name: contactName, email: contactEmail,
                  message: contactMsg, propertyId: property?.id,
                  propertyTitle: typeof property?.title === 'object' ? property.title.en : property?.title,
                });
                setContactStatus('ok');
                setContactName(''); setContactEmail(''); setContactMsg('');
                setTimeout(() => { setShowContact(false); setContactStatus(''); }, 2000);
              } catch {
                setContactStatus('error');
              }
            }}>
              <input type="text" placeholder={t('contact.name')} value={contactName}
                onChange={(e) => setContactName(e.target.value)} className="input-field" />
              <input type="email" placeholder={t('contact.email')} value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)} className="input-field" />
              <textarea placeholder={t('contact.message')} rows={4} value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)} className="input-field" />
              <div className="flex gap-4 justify-end pt-2">
                <button type="button" onClick={() => { setShowContact(false); setContactStatus(''); }} className="btn-outline text-sm">{t('admin.cancel')}</button>
                <button type="submit" className="btn-primary text-sm">{t('contact.send')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
