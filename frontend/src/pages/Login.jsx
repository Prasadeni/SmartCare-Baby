// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import mother2Image from '../assets/mother2.jpg';

import Input from '../components/Input';
import Button from '../components/Button';
import FloatingButtons from '../components/FloatingButtons';
import { useAuth } from '../context/AuthContext';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(23, 100, 141, 0.2); border-color: #17648d; }
`;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'si' ? 'en' : 'si');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const email = e.target.email.value.trim();
      const password = e.target.password.value;
      const user = await login(email, password);

      const from = location.state?.from;
      if (from) navigate(from, { replace: true });
      else if (user.role === 'Admin') navigate('/admin', { replace: true });
      else navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="flex h-screen w-full overflow-hidden bg-background font-body-md text-on-background antialiased">

        <div className="hidden lg:block relative w-1/2 h-full p-2">
          <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <img src={mother2Image} alt="Mother holding newborn baby" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,28,48,0.1) 0%, rgba(11,28,48,0.1) 40%, rgba(11,28,48,0.9) 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <div className="flex items-center gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
                <span className="text-white font-bold text-2xl font-headline">SmartCare Baby</span>
              </div>
              <h1 className="text-5xl font-headline font-bold text-white leading-tight mb-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                Nurturing every step<br /> of the journey
              </h1>
              <p className="text-white/80 text-lg max-w-md font-body-md animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                {t('login.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[520px] bg-surface-container-lowest rounded-lg p-8 md:p-10 soft-shadow animate-fade-in-up relative" style={{ animationDelay: '0.2s' }}>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              aria-label="Switch language"
              title="Switch language"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-[16px]">language</span>
              {i18n.language === 'si' ? 'EN' : 'සිං'}
            </button>

            <div className="mb-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-lg">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
                </div>
              </div>
              <h2 className="font-headline text-5xl font-bold text-primary mb-2">{t('login.welcomeBack')}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">{t('login.subtitle')}</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-body-sm font-body-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}

              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Input id="email" name="email" placeholder={t('login.emailPlaceholder')} required type="email" autoComplete="email" />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder={t('login.passwordPlaceholder')}
                    required
                    type={showPassword ? 'text' : 'password'}
                    className="pr-12"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <label className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                    <input className="peer appearance-none w-5 h-5 border-2 border-outline rounded bg-background checked:bg-primary checked:border-primary transition-colors cursor-pointer focus:ring-2 focus:ring-primary-container focus:ring-offset-2" type="checkbox" />
                    <span className="material-symbols-outlined absolute text-on-primary text-[16px] pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{t('login.rememberMe')}</span>
                </label>
                <Link to="/forgot-password" className="font-label-md text-label-md text-primary hover:text-on-primary-container transition-colors">{t('login.forgotPassword')}</Link>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <Button type="submit" disabled={submitting}>
                  {submitting ? t('login.signingIn') : t('login.signIn')}
                </Button>
              </div>

              <div className="text-center pt-4 animate-fade-in-up" style={{ animationDelay: '0.65s' }}>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {t('login.newTo')} <Link to="/register" className="text-primary hover:underline font-semibold">{t('login.continueRegistration')}</Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        <FloatingButtons />
      </div>
    </>
  );
}