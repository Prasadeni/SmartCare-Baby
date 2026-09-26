// src/pages/ForgetPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FloatingButtons from '../components/FloatingButtons';
import { authApi } from '../api/auth';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(23, 100, 141, 0.2); border-color: #17648d; }
`;

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
        const res = await authApi.forgotPassword(email);
        setStatus({
        type: 'success',
        message:
          res?.message ||
          'If that email is registered, a reset link has been sent. Check your inbox and spam folder.',
      });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Could not send reset link.' });
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
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-primary mb-2">Forgot Password</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {status && (
              <div
                className={`px-4 py-3 rounded-xl text-body-sm font-body-sm flex items-center gap-2 ${
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

            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <input
                className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none input-glow transition-all soft-shadow"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary text-on-primary py-4 px-6 font-headline-sm text-headline-sm hover:opacity-90 active:scale-[0.98] disabled:opacity-60 transition-all soft-shadow mt-6"
            >
              {submitting ? 'Sending…' : 'Send Reset Link'}
            </button>

            <div className="text-center pt-4">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Remembered your password?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">Back to Login</Link>
              </p>
            </div>
          </form>
        </div>

        <FloatingButtons />
      </div>
    </>
  );
}