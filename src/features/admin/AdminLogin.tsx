import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await login(email, password);
    if (ok) navigate('/secure-portal/dashboard');
    else setError(t('admin.error'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="card p-8 rounded-3xl shadow-luxury w-96 mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
            <i className="fa-solid fa-lock text-2xl" />
          </div>
          <h2 className="font-heading text-2xl text-white">{t('admin.login')}</h2>
        </div>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        <input
          type="email"
          placeholder={t('admin.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mb-4"
        />
        <input
          type="password"
          placeholder={t('admin.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mb-6"
        />
        <button type="submit" className="btn-primary w-full">{t('admin.submit')}</button>
        <p className="text-muted text-xs text-center mt-4">{t('admin.hint')}</p>
      </motion.form>
    </div>
  );
}
