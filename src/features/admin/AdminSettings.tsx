import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="section-title text-white">{t('admin.settingsTitle')}</h1>
            <p className="text-muted mt-1">{t('admin.settingsSubtitle')}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/secure-portal/dashboard')} className="btn-outline text-sm">
              <i className="fa-solid fa-building mr-2" /> {t('admin.properties')}
            </button>
            <button onClick={() => { logout(); navigate('/secure-portal'); }} className="btn-outline text-sm">
              <i className="fa-solid fa-right-from-bracket mr-2" /> {t('admin.logout')}
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card p-8 rounded-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                <i className="fa-solid fa-shield-halved text-2xl" />
              </div>
              <div>
                <h2 className="font-heading text-xl text-white font-bold">{t('admin.accountSettings')}</h2>
                <p className="text-muted text-sm">{user.email}</p>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            {success && <p className="text-green-400 text-sm text-center mb-4">{success}</p>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">{t('admin.email')}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
              </div>

              <hr className="border-white/5 my-4" />
              <p className="text-xs text-muted">{t('admin.pwdInstruction')}</p>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">{t('profile.currentPassword')} <span className="text-red-400">*</span></label>
                <input type="password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} className="input-field" placeholder={t('admin.pwdRequired')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">{t('profile.newPassword')}</label>
                <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="input-field" placeholder={t('profile.pwdOptional')} />
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary w-full mt-6">{t('profile.saveChanges')}</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
