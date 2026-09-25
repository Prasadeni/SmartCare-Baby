// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import motherImage from '../assets/mother.jpg';
import { useAuth } from '../context/AuthContext';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(23, 100, 141, 0.2); border-color: #17648d; }
`;

const ROLE_OPTIONS = [
  {
    value: 'Caregiver',
    icon: 'child_care',
    title: "I'm caring for a baby",
    subtitle: 'Parent, guardian, or caregiver',
    accentColor: 'primary',
  },
  {
    value: 'PregnantMother',
    icon: 'pregnant_woman',
    title: "I'm pregnant",
    subtitle: 'Expecting a baby',
    accentColor: 'secondary',
  },
];

// Shared input style (compact)
const inputCls =
  'w-full rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none input-glow transition-all soft-shadow';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Colombo',
    password: '',
    confirmPassword: '',
    role: 'Caregiver', // default
  });

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        fullName: formData.fullName,
        email: formData.email.trim(),
        phone: formData.phone,
        city: formData.city,
        country: 'Sri Lanka',
        password: formData.password,
        role: formData.role,
      });

      // Route by role
      if (user.role === 'Admin') navigate('/admin', { replace: true });
      else navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="flex w-full bg-background font-body-md text-on-background antialiased min-h-screen lg:h-screen lg:overflow-hidden">

        {/* LEFT: illustration */}
        <div className="hidden lg:block relative w-1/2 p-2">
          <div className="sticky top-2 h-[calc(100vh-16px)] rounded-[40px] overflow-hidden shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <img src={motherImage} alt="Pregnant mother" className="absolute inset-0 h-full w-full object-cover" />
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
                Join SmartCare Baby to track your pregnancy and baby-care journey.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: form */}
        <div className="w-full lg:w-1/2 flex p-4 md:p-6 lg:h-screen lg:overflow-y-auto">
          <div className="w-full max-w-[560px] m-auto bg-surface-container-lowest rounded-lg p-6 md:p-8 soft-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

            <div className="mb-4">
              <h2 className="font-headline text-3xl text-primary font-bold mb-1">Create your account</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Join SmartCare Baby to start your journey.</p>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-error-container text-on-error-container px-4 py-2 rounded-xl text-body-sm font-body-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}

              {/* ROLE SELECTOR (compact) */}
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-2 ml-1">
                  What best describes you?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLE_OPTIONS.map((opt) => {
                    const selected = formData.role === opt.value;
                    const isSecondary = opt.accentColor === 'secondary';
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, role: opt.value }))}
                        className={`px-3 py-2.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                          selected
                            ? isSecondary
                              ? 'border-secondary bg-secondary-fixed shadow-md'
                              : 'border-primary bg-primary-fixed shadow-md'
                            : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-2xl ${
                            selected
                              ? isSecondary
                                ? 'text-secondary'
                                : 'text-primary'
                              : 'text-on-surface-variant'
                          }`}
                          style={{ fontVariationSettings: selected ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {opt.icon}
                        </span>
                        <span className="flex flex-col min-w-0">
                          <span className="font-headline-sm text-body-md text-on-surface font-bold leading-tight">
                            {opt.title}
                          </span>
                          <span className="text-body-sm text-on-surface-variant leading-tight">
                            {opt.subtitle}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-body-sm text-on-surface-variant mt-1.5 ml-1">
                  {formData.role === 'Caregiver'
                    ? "You'll be able to add and manage baby profiles."
                    : "You'll get access to the pregnancy tracker and baby profiles."}
                </p>
              </div>

              {/* Full name */}
              <input
                className={inputCls}
                id="fullName"
                name="fullName"
                placeholder="Full Name"
                required
                type="text"
                value={formData.fullName}
                onChange={handleChange}
              />

              {/* Phone + City */}
              <div className="flex gap-3">
                <input
                  className={`${inputCls} flex-1`}
                  id="phone"
                  name="phone"
                  placeholder="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <input
                  className={`${inputCls} flex-1`}
                  id="city"
                  name="city"
                  placeholder="City"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <input
                className={inputCls}
                id="email"
                name="email"
                placeholder="Email Address"
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              {/* Password + Confirm side by side */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    className={`${inputCls} pr-10`}
                    id="password"
                    name="password"
                    placeholder="Password (min 8)"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                <div className="relative flex-1">
                  <input
                    className={`${inputCls} pr-10`}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    type={showConfirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirm ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  className="mt-1 w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary"
                  id="terms"
                  name="terms"
                  required
                  type="checkbox"
                />
                <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">
                  I agree to the <a className="text-primary hover:underline" href="#">Terms of Service</a> and{' '}
                  <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-primary text-on-primary py-3 px-6 font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 disabled:opacity-60 transition-all soft-shadow mt-2"
              >
                {submitting ? 'Creating account…' : 'Create Account'}
              </button>

              <div className="text-center">
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-semibold">Login here</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
