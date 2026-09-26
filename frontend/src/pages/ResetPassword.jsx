// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import FloatingButtons from '../components/FloatingButtons';
import { authApi } from '../api/auth';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(23, 100, 141, 0.2); border-color: #17648d; }
`;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus({
        type: 'error',
        message: 'This reset link is missing a token. Please request a new one.',
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== confirm) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Could not reset password. Try requesting a new link.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="flex min-h-screen w-full items-center justify-center bg-background font-body-md text-on-background antialiased p-4">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 soft-shadow border border-outline-variant/30 animate-fade-in-up">

          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-lg">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {done ? 'check_circle' : 'lock_reset'}
              </span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-primary mb-2">
              {done ? 'Password Reset' : 'Set a New Password'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {done
                ? 'Redirecting you to sign in…'
                : 'Choose a strong password for your SmartCare Baby account.'}
            </p>
          </div>

          {status && (
            <div
              className={`mb-5 px-4 py-3 rounded-xl text-body-sm font-body-sm flex items-center gap-2 ${
                status.type === 'success'
                  ? 'bg-primary-fixed text-on-primary-fixed'
                  : 'bg-error-container text-on-error-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {status.type === 'success' ? 'check_circle' : 'error'}
              </span>
              {status.message}
            </div>
          )}

          {!done && token && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 pr-12 font-body-md text-on-surface placeholder:text-outline focus:outline-none input-glow transition-all soft-shadow"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>

              <input
                className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-on-surface placeholder:text-outline focus:outline-none input-glow transition-all soft-shadow"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />

              <p className="text-body-sm text-on-surface-variant px-2">
                Minimum 8 characters. Use a mix of letters, numbers, and symbols.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-primary text-on-primary py-4 px-6 font-headline-sm text-headline-sm hover:opacity-90 active:scale-[0.98] disabled:opacity-60 transition-all soft-shadow mt-2"
              >
                {submitting ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          )}

          {!done && !token && (
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="inline-block px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90"
              >
                Request a New Link
              </Link>
            </div>
          )}

          <div className="text-center pt-6">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        <FloatingButtons />
      </div>
    </>
  );
}