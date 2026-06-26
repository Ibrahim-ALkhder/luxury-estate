import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

interface Lead {
  id: string; name: string; email: string; phone: string;
  source: string; status: string; created_at: string;
}

const subNavItems = [
  { key: 'dashboard', path: '/secure-portal/dashboard', icon: 'fa-building', label: 'admin.properties' },
  { key: 'bookings', path: '/secure-portal/bookings', icon: 'fa-calendar-check', label: 'admin.bookingsTitle' },
  { key: 'messages', path: '/secure-portal/messages', icon: 'fa-message', label: 'admin.messages' },
  { key: 'settings', path: '/secure-portal/settings', icon: 'fa-gear', label: 'admin.settings' },
];

export default function LeadsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    api.get<{ leads: Lead[] }>('/leads').then((d) => setLeads(d.leads)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24 sm:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">{t('admin.leads')}</h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5 sm:mt-1 font-body">{t('admin.leadsSubtitle')}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {subNavItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border bg-glass-medium text-muted hover:text-white hover:border-white/20 border-transparent"
              >
                <i className={`fa-solid ${item.icon} mr-1.5`} />
                {t(item.label)}
              </button>
            ))}
            <button
              onClick={() => { logout(); navigate('/secure-portal'); }}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border bg-red-500/5 text-red-400 hover:bg-red-500/10 border-red-500/20"
            >
              <i className="fa-solid fa-right-from-bracket mr-1.5" />
              {t('admin.logout')}
            </button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block bg-card rounded-2xl border border-white/5 overflow-hidden">
          {leads.length === 0 ? (
            <div className="p-12 text-center">
              <i className="fa-regular fa-user text-3xl text-muted/30 mb-3" />
              <p className="text-sm text-muted font-body">{t('admin.noLeads')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['leadName', 'leadEmail', 'leadPhone', 'leadSource', 'leadStatus', 'leadDate'].map((h) => (
                      <th key={h} className="text-left p-4 text-muted text-xs font-medium uppercase tracking-wider font-utility">
                        {t(`admin.${h}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-white text-sm font-medium">{lead.name}</td>
                      <td className="p-4 text-muted text-sm">{lead.email}</td>
                      <td className="p-4 text-muted text-sm">{lead.phone}</td>
                      <td className="p-4 text-muted text-sm capitalize">{lead.source}</td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-gold-500/10 text-gold-500 text-xs font-medium capitalize">
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted text-sm whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-3">
          {leads.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <i className="fa-regular fa-user text-2xl sm:text-3xl mb-3 text-muted/30" />
              <p className="text-sm font-body">{t('admin.noLeads')}</p>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="bg-card rounded-2xl border border-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-white">{lead.name}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500 text-[10px] font-medium capitalize">
                    {lead.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-muted">
                  <p><i className="fa-solid fa-envelope w-4 text-gold-500/70 mr-1" /> {lead.email}</p>
                  <p><i className="fa-solid fa-phone w-4 text-gold-500/70 mr-1" /> {lead.phone}</p>
                  <p><i className="fa-solid fa-tag w-4 text-gold-500/70 mr-1" /> {lead.source}</p>
                </div>
                <p className="text-[10px] text-muted/60 mt-2">{new Date(lead.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-white/5 z-40 px-2 pb-1 pt-2">
        <div className="flex items-center justify-around">
          {subNavItems.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors text-muted hover:text-white"
            >
              <i className={`fa-solid ${item.icon} text-sm`} />
              <span className="text-[9px] font-medium">{t(item.label)}</span>
            </button>
          ))}
          <button
            onClick={() => { logout(); navigate('/secure-portal'); }}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors text-red-400/70 hover:text-red-400"
          >
            <i className="fa-solid fa-right-from-bracket text-sm" />
            <span className="text-[9px] font-medium">{t('admin.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
