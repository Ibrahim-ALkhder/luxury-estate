import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError(t('auth.fillFields')); return; }
    const ok = await login(email, password);
    if (ok) navigate(from, { replace: true });
    else setError(t('auth.invalidCredentials'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-24">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="card p-8 rounded-3xl shadow-luxury w-full max-w-md mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
            <i className="fa-solid fa-user text-2xl" />
          </div>
          <h2 className="font-heading text-2xl text-on-dark">{t('auth.signIn')}</h2>
          <p className="text-muted text-sm mt-2 font-body">{t('auth.welcomeBack')}</p>
        </div>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mb-4"
        />
        <input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mb-6"
        />
        <button type="submit" className="btn-primary w-full">
          {t('auth.signIn')}
        </button>

        <p className="text-muted text-sm text-center mt-6">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-gold-500 hover:underline">
            {t('auth.signUp')}
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
