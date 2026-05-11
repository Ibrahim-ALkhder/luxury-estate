import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Bed, Bath, Maximize2, MapPin, Phone, Calendar, Ruler, Sun, Volume2, ArrowUp, Check, Expand } from 'lucide-react';
import { usePropertyStore } from '../store/propertyStore';
import { useState } from 'react';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const properties = usePropertyStore((s) => s.properties);
  const property = properties.find((p) => p.id === id);
  const [showBooking, setShowBooking] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

  if (!property) {
    return (
      <div className="pt-32 text-center min-h-screen bg-cream-50">
        <h2 className="text-2xl text-charcoal-500">Property not found</h2>
        <Link to="/properties" className="text-gold-500 underline mt-4 inline-block">{t('propertyDetails.back')}</Link>
      </div>
    );
  }

  const isArabic = i18n.language === 'ar';
  const title = typeof property.title === 'object' ? (isArabic ? property.title.ar : property.title.en) : property.title;
  const location = typeof property.location === 'object' ? (isArabic ? property.location.ar : property.location.en) : property.location;
  const description = property.description ? (isArabic ? property.description.ar : property.description.en) : '';
  const features = property.features ? (typeof property.features === 'object' ? (isArabic ? property.features.ar : property.features.en) : property.features) : [];
  const hasAdvanced = property.hasAdvanced;

  // تحديد لون ونص الحالة
  const statusMap = {
    available: { bg: 'bg-green-500', text: t('propertyDetails.status.available'), icon: '🟢' },
    sold: { bg: 'bg-red-500', text: t('propertyDetails.status.sold'), icon: '🔴' },
    underConstruction: { bg: 'bg-yellow-500', text: t('propertyDetails.status.underConstruction'), icon: '🟡' },
  };
  const status = statusMap[property.status] || statusMap.available;

  return (
    <div className="pt-24 pb-24 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link to="/properties" className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600">
            <ArrowLeft className="w-4 h-4" /> {t('propertyDetails.back')}
          </Link>
        </motion.div>

        {/* شريط الحالة البارز */}
        <div className={`${status.bg} text-white px-6 py-3 rounded-2xl mb-8 flex items-center justify-center gap-3 text-lg font-bold shadow-lg`}>
          <span className="text-2xl">{status.icon}</span>
          <span>{status.text}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-[500px]">
          {/* العمود الأيسر: صورة قابلة للنقر لتكبيرها */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-3xl overflow-hidden shadow-luxury cursor-pointer group"
            onClick={() => setLightbox(property.image)}
          >
            <img src={property.image} alt={title} className="w-full h-full object-cover min-h-[300px]" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Expand className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-2 text-gold-400 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{location}</span>
              </div>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold leading-tight">{title}</h1>
            </div>
          </motion.div>

          {/* العمود الأيمن: المعلومات */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-luxury p-8 flex flex-col"
          >
            <p className="text-3xl font-bold text-gold-500 mb-4">{property.price.toLocaleString(locale)} SAR</p>

            <div className="flex flex-wrap gap-4 text-charcoal-600 text-sm mb-4">
              <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-gold-500" /> {property.bedrooms} {t('propertyDetails.bedrooms')}</span>
              <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-gold-500" /> {property.bathrooms} {t('propertyDetails.bathrooms')}</span>
              <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4 text-gold-500" /> {property.area} m²</span>
            </div>

            {description && (
              <p className="text-charcoal-600 leading-relaxed mb-4 text-sm">{description}</p>
            )}

            {hasAdvanced && (
              <div className="space-y-4 flex-1">
                <hr className="border-cream-200" />
                {(property.floor || property.occupancy) && (
                  <div className="flex flex-wrap gap-4 text-charcoal-700 text-sm">
                    {property.floor && (
                      <span className="flex items-center gap-1"><ArrowUp className="w-4 h-4 text-gold-500" /> {t('propertyDetails.floor')}: {property.floor}</span>
                    )}
                    {property.occupancy && (
                      <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-gold-500" /> {t('propertyDetails.occupancy')}: {property.occupancy} {t('propertyDetails.persons')}</span>
                    )}
                  </div>
                )}

                {property.floorPlanImage && (
                  <div className="bg-cream-50 rounded-xl overflow-hidden" style={{ maxHeight: '300px' }}>
                    <img
                      src={property.floorPlanImage}
                      alt="Floor Plan"
                      className="w-full h-auto object-contain cursor-pointer hover:opacity-90 transition"
                      onClick={() => setLightbox(property.floorPlanImage!)}
                    />
                  </div>
                )}

                {property.measurements && property.measurements.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-charcoal-600">
                    {property.measurements.map((m, idx) => (
                      <span key={idx} className="bg-cream-100 rounded-lg px-2 py-1 font-medium">{m}</span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {property.soundInsulation && (
                    <div className="flex items-center gap-2 bg-cream-100 rounded-lg p-2">
                      <Volume2 className="w-4 h-4 text-gold-500" />
                      <div>
                        <p className="text-charcoal-400">{t('propertyDetails.soundInsulation')}</p>
                        <p className="font-semibold">{property.soundInsulation}</p>
                      </div>
                    </div>
                  )}
                  {property.daylightFactor && (
                    <div className="flex items-center gap-2 bg-cream-100 rounded-lg p-2">
                      <Sun className="w-4 h-4 text-gold-500" />
                      <div>
                        <p className="text-charcoal-400">{t('propertyDetails.daylightFactor')}</p>
                        <p className="font-semibold">{property.daylightFactor}</p>
                      </div>
                    </div>
                  )}
                  {property.ceilingHeight && (
                    <div className="flex items-center gap-2 bg-cream-100 rounded-lg p-2">
                      <Ruler className="w-4 h-4 text-gold-500" />
                      <div>
                        <p className="text-charcoal-400">{t('propertyDetails.ceilingHeight')}</p>
                        <p className="font-semibold">{property.ceilingHeight}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {features.length > 0 && (
              <div className="mt-4">
                <h4 className="font-heading text-lg mb-2 text-charcoal-900">{t('propertyDetails.features')}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {features.map((feat) => (
                    <div key={feat} className="flex items-center gap-1 text-sm bg-cream-50 rounded-lg p-2">
                      <Check className="w-4 h-4 text-gold-500 shrink-0" /> <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-cream-200 flex flex-col sm:flex-row gap-3">
              {property.status === 'available' && (
                <button onClick={() => setShowBooking(true)} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" /> {t('propertyDetails.bookNow')}
                </button>
              )}
              <button onClick={() => setShowContact(true)} className="btn-outline flex-1 flex items-center justify-center gap-2 text-sm">
                <Phone className="w-4 h-4" /> {t('propertyDetails.contactAgent')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox لعرض الصورة الكاملة */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8" onClick={() => setLightbox(null)}>
          <img src={lightbox} className="max-w-full max-h-full object-contain" />
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setLightbox(null)}>×</button>
        </div>
      )}

      {/* نافذة الحجز */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="font-heading text-2xl mb-4">{t('propertyDetails.bookNow')}</h3>
            <p className="mb-6 text-charcoal-600">{t('propertyDetails.bookingMessage', { title })}</p>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setShowBooking(false)} className="btn-outline">{t('admin.cancel')}</button>
              <button onClick={() => { alert(t('propertyDetails.bookingSuccess')); setShowBooking(false); }} className="btn-primary">{t('propertyDetails.confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة التواصل */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="font-heading text-2xl mb-4">{t('propertyDetails.contactAgent')}</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowContact(false); alert(t('propertyDetails.contactSuccess')); }}>
              <input type="text" placeholder={t('contact.name')} className="input-field" />
              <input type="email" placeholder={t('contact.email')} className="input-field" />
              <textarea placeholder={t('contact.message')} rows={4} className="input-field" />
              <div className="flex gap-4 justify-end">
                <button type="button" onClick={() => setShowContact(false)} className="btn-outline">{t('admin.cancel')}</button>
                <button type="submit" className="btn-primary">{t('contact.send')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
