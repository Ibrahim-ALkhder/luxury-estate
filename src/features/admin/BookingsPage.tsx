import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePropertyStore } from '../../store/propertyStore';
import { api } from '../../services/api';

interface BookingRow {
  id: string; userId: string; propertyId: string;
  userName: string; userEmail: string; userPhone: string;
  propertyTitle: string; createdAt: string;
}

export default function BookingsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { properties } = usePropertyStore();
  const isArabic = i18n.language === 'ar';
  const [bookings, setBookings] = useState<BookingRow[]>([]);

  useEffect(() => {
    api.get<{ bookings: BookingRow[] }>('/bookings').then((d) => setBookings(d.bookings)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="section-title text-white">{t('admin.bookingsTitle')}</h1>
            <p className="text-muted mt-1">{t('admin.bookingsSubtitle')}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/secure-portal/dashboard')} className="btn-outline text-sm">
              <i className="fa-solid fa-building mr-2" /> {t('admin.properties')}
            </button>
            <button onClick={() => navigate('/secure-portal/leads')} className="btn-outline text-sm">
              <i className="fa-solid fa-users mr-2" /> {t('admin.leads')}
            </button>
            <button onClick={() => navigate('/secure-portal/messages')} className="btn-outline text-sm">
              <i className="fa-solid fa-message mr-2" /> {t('admin.messages')}
            </button>
            <button onClick={() => navigate('/secure-portal/settings')} className="btn-outline text-sm">
              <i className="fa-solid fa-gear mr-2" /> {t('admin.settings')}
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card overflow-hidden rounded-2xl">
            {bookings.length === 0 ? (
              <div className="p-12 text-center">
                <i className="fa-regular fa-calendar text-4xl text-muted mb-4" />
                <p className="text-muted">{t('admin.noBookings')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.clientName')}</th>
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.clientEmail')}</th>
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.clientPhone')}</th>
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.property')}</th>
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      const property = properties.find((p) => p.id === booking.propertyId);
                      const title = property ? (isArabic ? property.title.ar : property.title.en) : booking.propertyId;
                      return (
                        <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 text-white">{booking.userName}</td>
                          <td className="p-4 text-muted text-sm">{booking.userEmail}</td>
                          <td className="p-4 text-muted text-sm">{booking.userPhone}</td>
                          <td className="p-4 text-white text-sm">{title}</td>
                          <td className="p-4 text-muted text-sm">{new Date(booking.createdAt).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
