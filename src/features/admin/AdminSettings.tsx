import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const subNavItems = [
  { key: 'dashboard', path: '/secure-portal/dashboard', icon: 'fa-building', label: 'admin.properties' },
  { key: 'bookings', path: '/secure-portal/bookings', icon: 'fa-calendar-check', label: 'admin.bookingsTitle' },
  { key: 'leads', path: '/secure-portal/leads', icon: 'fa-users', label: 'admin.leads' },
  { key: 'messages', path: '/secure-portal/messages', icon: 'fa-message', label: 'admin.messages' },
];

export default function AdminSettings() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || '');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!user) return;
    if (!email) { setError(t('admin.errEmailRequired')); return; }
    if (!oldPwd) { setError(t('admin.pwdRequired')); return; }
    if (newPwd && newPwd.length < 6) { setError(t('admin.errPasswordLength')); return; }

    try {
      await api.put('/auth/profile', {
        name: user.name, email, phone: '',
        oldPassword: oldPwd, newPassword: newPwd || undefined,
      });
      updateUser({ name: user.name, email });
      setSuccess(t('admin.successSettingsUpdated'));
      setTimeout(() => { logout(); navigate('/secure-portal'); }, 1500);
    } catch (err: any) {
      if (err?.status === 403) setError(t('admin.errPasswordIncorrect'));
      else if (err?.status === 409) setError(t('admin.errEmailExists'));
      else setError(t('profile.errUpdateFailed'));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24 sm:pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">{t('admin.settingsTitle')}</h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5 sm:mt-1 font-body">{t('admin.settingsSubtitle')}</p>
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

        {/* Settings card */}
        <div className="bg-card rounded-2xl border border-white/5 p-5 sm:p-8">
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
              <i className="fa-solid fa-shield-halved text-xl sm:text-2xl" />
            </div>
            <div>
              <h2 className="font-heading text-base sm:text-xl text-white font-bold">{t('admin.accountSettings')}</h2>
              <p className="text-xs sm:text-sm text-muted">{user.email}</p>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs sm:text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-400 text-xs sm:text-sm text-center mb-4">{success}</p>}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-white/80">{t('admin.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            </div>

            <hr className="border-white/5 my-4 sm:my-6" />

            <p className="text-xs text-muted">{t('admin.pwdInstruction')}</p>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-white/80">
                {t('profile.currentPassword')} <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={oldPwd}
                onChange={(e) => setOldPwd(e.target.value)}
                placeholder={t('admin.pwdRequired')}
                className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-white/80">{t('profile.newPassword')}</label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder={t('profile.pwdOptional')}
                className="w-full bg-background border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-6 bg-gold-500 hover:bg-gold-400 text-background text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 font-utility"
          >
            {t('profile.saveChanges')}
          </button>
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
