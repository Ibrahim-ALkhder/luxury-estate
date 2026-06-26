import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

interface MessageRow {
  id: string; name: string; email: string; message: string;
  property_id: string | null; property_title: string | null;
  read: number; created_at: string;
}

const subNavItems = [
  { key: 'dashboard', path: '/secure-portal/dashboard', icon: 'fa-building', label: 'admin.properties' },
  { key: 'leads', path: '/secure-portal/leads', icon: 'fa-users', label: 'admin.leads' },
  { key: 'bookings', path: '/secure-portal/bookings', icon: 'fa-calendar-check', label: 'admin.bookingsTitle' },
  { key: 'settings', path: '/secure-portal/settings', icon: 'fa-gear', label: 'admin.settings' },
];

export default function MessagesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [messages, setMessages] = useState<MessageRow[]>([]);

  useEffect(() => {
    api.get<{ messages: MessageRow[] }>('/messages').then((d) => setMessages(d.messages)).catch(() => {});
  }, []);

  const markRead = async (id: string) => {
    await api.patch(`/messages/${id}/read`);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: 1 } : m)));
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24 sm:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-heading flex items-center gap-3">
              {t('admin.messages')}
              {unread > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full font-medium">
                  {unread} {t('admin.unread')}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5 sm:mt-1 font-body">{t('admin.messagesSubtitle')}</p>
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

        {/* Message list */}
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <i className="fa-regular fa-message text-2xl sm:text-3xl mb-3 text-muted/30" />
            <p className="text-sm font-body">{t('admin.noMessages')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-card rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer ${
                  !msg.read ? 'border-gold-500/30 bg-gold-500/[0.03]' : 'border-white/5'
                }`}
                onClick={() => { if (!msg.read) markRead(msg.id); }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{msg.name}</p>
                    <p className="text-xs text-muted truncate">{msg.email}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-gold-500" />
                    )}
                    <span className="text-[10px] text-muted/60 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed line-clamp-3">{msg.message}</p>
                {msg.property_title && (
                  <p className="text-[10px] sm:text-xs text-gold-500/80 mt-2">
                    <i className="fa-solid fa-building mr-1" /> {msg.property_title}
                  </p>
                )}
                {!msg.read && (
                  <span className="inline-block mt-2 text-[10px] bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded-full font-medium">
                    {t('admin.new')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
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
