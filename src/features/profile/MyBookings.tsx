import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import { usePropertyStore } from '../../store/propertyStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../services/api';

interface BookingRow {
  id: string; userId: string; propertyId: string;
  userName: string; userEmail: string; userPhone: string;
  propertyTitle: string; createdAt: string;
}

export default function MyBookings() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { properties } = usePropertyStore();
  const isArabic = i18n.language === 'ar';
  const [myBookings, setMyBookings] = useState<BookingRow[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get<{ bookings: BookingRow[] }>('/bookings').then((d) => {
      setMyBookings(d.bookings.filter((b) => b.userId === user.id));
    }).catch(() => {});
  }, [user]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="section-title text-white">{t('profile.myBookingsTitle')}</h1>
          <p className="text-muted mt-2">{t('profile.myBookingsSubtitle')}</p>
        </motion.div>

        {myBookings.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-16 text-center rounded-2xl">
            <i className="fa-regular fa-calendar text-5xl text-muted mb-4" />
            <p className="text-muted text-lg mb-6">{t('profile.noBookings')}</p>
            <Link to="/properties" className="btn-primary inline-flex">{t('profile.browseProperties')}</Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {myBookings.map((booking, idx) => {
              const property = properties.find((p) => p.id === booking.propertyId);
              const title = property ? (isArabic ? property.title.ar : property.title.en) : booking.propertyId;
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card p-6 rounded-2xl flex items-center gap-6"
                >
                  {property && (
                    <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={property.image} alt={title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link to={`/properties/${booking.propertyId}`} className="text-white font-heading font-bold hover:text-gold-500 transition-colors">
                      {title}
                    </Link>
                    <p className="text-muted text-sm mt-1">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-gold-500 text-xs font-medium uppercase tracking-wider bg-gold-500/10 px-3 py-1 rounded-full">
                    {t('propertyDetails.bookNow')}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
