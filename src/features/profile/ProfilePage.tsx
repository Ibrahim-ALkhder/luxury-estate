import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import { useFavoritesStore } from '../../store/favoritesStore';
import { usePropertyStore } from '../../store/propertyStore';
import { api } from '../../services/api';
import { motion } from 'framer-motion';
import type { User } from '../../types';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const { favorites } = useFavoritesStore();
  const { properties } = usePropertyStore();
  const isArabic = i18n.language === 'ar';

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const favProperties = properties.filter((p) => favorites.includes(p.id));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openEdit = () => {
    if (!user) return;
    setEditing(true);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setOldPwd('');
    setNewPwd('');
    setEditError('');
    setEditSuccess('');
  };

  const handleSave = async () => {
    setEditError('');
    setEditSuccess('');
    if (!user) return;
    if (!editName || !editEmail) { setEditError(t('profile.errNameEmailRequired')); return; }
    if (!oldPwd) { setEditError(t('profile.pwdRequired')); return; }
    if (newPwd && newPwd.length < 6) { setEditError(t('profile.errPasswordLength')); return; }

    try {
      const data = await api.put<{ user: User }>('/auth/profile', {
        name: editName, email: editEmail, phone: editPhone,
        oldPassword: oldPwd, newPassword: newPwd || undefined,
      });
      // Update session with the server-returned user
      setEditSuccess(t('profile.editSuccess'));
      setEditing(false);
      setUser(data.user);
    } catch (err: any) {
      if (err?.status === 409) setEditError(t('profile.errEmailExists'));
      else if (err?.status === 403) setEditError(t('profile.errPasswordIncorrect'));
      else setEditError(t('profile.errUpdateFailed'));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="section-title text-white">{t('profile.title')}</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="card p-8 rounded-2xl text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
                <i className="fa-solid fa-user text-3xl" />
              </div>
              <h2 className="font-heading text-xl text-white font-bold">{user.name}</h2>
              <p className="text-muted text-sm">{user.email}</p>
              <p className="text-xs text-muted mt-2">{t('profile.memberSince')} {new Date(user.createdAt).toLocaleDateString()}</p>

              <div className="mt-8 space-y-3">
                <Link to="/profile/favorites" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white/80 hover:text-gold-500 hover:bg-gold-500/10 transition-all">
                  <i className="fa-regular fa-heart text-gold-500" />
                  <span className="text-sm">{t('profile.savedProperties')} ({favProperties.length})</span>
                </Link>
                <Link to="/profile/bookings" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white/80 hover:text-gold-500 hover:bg-gold-500/10 transition-all">
                  <i className="fa-regular fa-calendar text-gold-500" />
                  <span className="text-sm">{t('profile.myBookings')}</span>
                </Link>
              </div>

              <button onClick={handleLogout} className="btn-outline w-full mt-8 text-sm flex items-center justify-center gap-2">
                <i className="fa-solid fa-right-from-bracket" />
                {t('profile.signOut')}
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <div className="card p-8 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl text-white font-bold">
                  <i className="fa-solid fa-user-pen text-gold-500 mr-3" />
                  {t('profile.personalInfo')}
                </h2>
                {!editing && (
                  <button onClick={openEdit} className="btn-outline text-sm flex items-center gap-2">
                    <i className="fa-solid fa-pen-to-square" /> {t('profile.edit')}
                  </button>
                )}
              </div>

              {!editing ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-muted uppercase tracking-wider mb-1">{t('auth.name')}</label>
                    <p className="text-white font-medium">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-muted uppercase tracking-wider mb-1">{t('auth.email')}</label>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-muted uppercase tracking-wider mb-1">{t('auth.phone')}</label>
                    <p className="text-white font-medium">{user.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {editError && <p className="text-red-400 text-sm text-center">{editError}</p>}
                  {editSuccess && <p className="text-green-400 text-sm text-center">{editSuccess}</p>}

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">{t('auth.name')}</label>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">{t('auth.email')}</label>
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">{t('auth.phone')}</label>
                    <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="input-field" />
                  </div>

                  <hr className="border-white/5 my-4" />
                  <p className="text-xs text-muted">{t('profile.pwdInstruction')}</p>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">{t('profile.currentPassword')} <span className="text-red-400">*</span></label>
                    <input type="password" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} className="input-field" placeholder={t('profile.pwdRequired')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">{t('profile.newPassword')}</label>
                    <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="input-field" placeholder={t('profile.pwdOptional')} />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button onClick={() => setEditing(false)} className="btn-outline">{t('profile.cancel')}</button>
                    <button onClick={handleSave} className="btn-primary">{t('profile.saveChanges')}</button>
                  </div>
                </div>
              )}
            </div>

            <div className="card p-8 rounded-2xl mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl text-white font-bold">
                  <i className="fa-regular fa-heart text-gold-500 mr-3" />
                  {t('profile.savedProperties')}
                </h2>
                <Link to="/profile/favorites" className="text-sm text-gold-500 hover:underline">
                  {t('profile.viewAll')}
                </Link>
              </div>

              {favProperties.length === 0 ? (
                <p className="text-muted text-sm">{t('profile.noFavorites')}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favProperties.slice(0, 4).map((p) => {
                    const title = isArabic ? p.title.ar : p.title.en;
                    return (
                      <Link key={p.id} to={`/properties/${p.id}`} className="flex gap-3 card-hover rounded-xl p-3 group">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <img src={p.image} alt={title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-sm font-medium truncate group-hover:text-gold-500 transition-colors">{title}</p>
                          <p className="text-gold-500 font-bold text-sm mt-1">${p.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
