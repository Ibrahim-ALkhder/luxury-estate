import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

interface MessageRow {
  id: string; name: string; email: string; message: string;
  property_id: string | null; property_title: string | null;
  read: number; created_at: string;
}

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
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="section-title text-white">
              {t('admin.messages')}
              {unread > 0 && (
                <span className="ml-3 text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                  {unread} {t('admin.unread')}
                </span>
              )}
            </h1>
            <p className="text-muted mt-1">{t('admin.messagesSubtitle')}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/secure-portal/dashboard')} className="btn-outline text-sm">
              <i className="fa-solid fa-building mr-2" /> {t('admin.properties')}
            </button>
            <button onClick={() => navigate('/secure-portal/leads')} className="btn-outline text-sm">
              <i className="fa-solid fa-users mr-2" /> {t('admin.leads')}
            </button>
            <button onClick={() => navigate('/secure-portal/bookings')} className="btn-outline text-sm">
              <i className="fa-solid fa-calendar mr-2" /> {t('admin.bookingsTitle')}
            </button>
            <button onClick={() => { logout(); navigate('/secure-portal'); }} className="btn-outline text-sm">
              <i className="fa-solid fa-right-from-bracket mr-2" /> {t('admin.logout')}
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {messages.length === 0 ? (
            <div className="card p-12 text-center rounded-2xl">
              <i className="fa-regular fa-message text-4xl text-muted mb-4" />
              <p className="text-muted">{t('admin.noMessages')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`card p-6 rounded-2xl transition-all ${!msg.read ? 'border-l-4 border-gold-500 bg-gold-500/5' : ''}`}
                  onClick={() => { if (!msg.read) markRead(msg.id); }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{msg.name}</h3>
                      <p className="text-muted text-sm">{msg.email}</p>
                    </div>
                    <span className="text-xs text-muted">{new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-white/80 whitespace-pre-wrap">{msg.message}</p>
                  {msg.property_title && (
                    <p className="text-xs text-gold-500 mt-3">
                      <i className="fa-solid fa-building mr-1" /> {msg.property_title}
                    </p>
                  )}
                  {!msg.read && (
                    <span className="inline-block mt-3 text-xs bg-gold-500/10 text-gold-500 px-2 py-1 rounded-full">
                      {t('admin.new')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
