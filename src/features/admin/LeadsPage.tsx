import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

interface Lead {
  id: string; name: string; email: string; phone: string;
  source: string; status: string; created_at: string;
}

export default function LeadsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    api.get<{ leads: Lead[] }>('/leads').then((d) => setLeads(d.leads)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="section-title text-white">{t('admin.leads')}</h1>
            <p className="text-muted mt-1">{t('admin.leadsSubtitle')}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/secure-portal/dashboard')} className="btn-outline text-sm">
              <i className="fa-solid fa-building mr-2" /> {t('admin.properties')}
            </button>
            <button onClick={() => navigate('/secure-portal/bookings')} className="btn-outline text-sm">
              <i className="fa-solid fa-calendar mr-2" /> {t('admin.bookingsTitle')}
            </button>
            <button onClick={() => navigate('/secure-portal/messages')} className="btn-outline text-sm">
              <i className="fa-solid fa-message mr-2" /> {t('admin.messages')}
            </button>
            <button onClick={() => navigate('/secure-portal/settings')} className="btn-outline text-sm">
              <i className="fa-solid fa-gear mr-2" /> {t('admin.settings')}
            </button>
            <button onClick={() => { logout(); navigate('/secure-portal'); }} className="btn-outline text-sm">
              <i className="fa-solid fa-right-from-bracket mr-2" /> {t('admin.logout')}
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card overflow-hidden rounded-2xl">
            {leads.length === 0 ? (
              <div className="p-12 text-center">
                <i className="fa-regular fa-user text-4xl text-muted mb-4" />
                <p className="text-muted">{t('admin.noLeads')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.leadName')}</th>
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.leadEmail')}</th>
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.leadPhone')}</th>
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.leadSource')}</th>
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.leadStatus')}</th>
                      <th className="text-left p-4 text-muted text-sm font-medium">{t('admin.leadDate')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white font-medium">{lead.name}</td>
                        <td className="p-4 text-muted text-sm">{lead.email}</td>
                        <td className="p-4 text-muted text-sm">{lead.phone}</td>
                        <td className="p-4 text-muted text-sm capitalize">{lead.source}</td>
                        <td className="p-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 text-xs font-medium capitalize">
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4 text-muted text-sm">{new Date(lead.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
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
