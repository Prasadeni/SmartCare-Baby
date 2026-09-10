import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  
  /* Home Page Styles */
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(23, 100, 141, 0.2); border-color: #17648d; }
`;

export default function ForgetPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending reset link to:", email);
    // Add your backend API call here later (e.g., POST /api/forgot-password)
    alert("Password reset link sent to your email!");
  };

  return (
    <>
      <style>{styles}</style>

      {/* Centered Layout */}
      <div className="flex min-h-screen w-full items-center justify-center bg-background font-body-md text-on-background antialiased p-4">

        {/* Forgot Password Card */}
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 soft-shadow border border-outline-variant/30 animate-fade-in-up">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-lg">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-primary mb-2">
              Forgot Password
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label className="sr-only" htmlFor="email">Email Address</label>
              <input 
                className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-0 input-glow transition-all duration-200 soft-shadow" 
                id="email" 
                name="email" 
                placeholder="Enter your email" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full rounded-full bg-primary text-on-primary py-4 px-6 font-headline-sm text-headline-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_12px_rgba(23,100,141,0.2)] mt-6 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Send Reset Link
            </button>

            {/* Back to Login */}
            <div className="text-center pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Remembered your password? <Link to="/login" className="font-semibold text-primary hover:underline">Back to Login</Link>
              </p>
            </div>

          </form>
        </div>

        {/* Emergency & Assistant Buttons */}
        <FloatingButtons />

      </div>
    </>
  );
}