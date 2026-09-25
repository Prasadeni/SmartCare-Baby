import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }

  /* Home Page Styles */
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(186, 26, 26, 0.2); border-color: #ba1a1a; } /* Red glow */
`;

export default function EmergencyLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Emergency Login clicked");
    // Add emergency login API logic here
  };

  return (
    <>
      <style>{styles}</style>

      {/* Centered Layout */}
      <div className="flex min-h-screen w-full items-center justify-center bg-background font-body-md text-on-background antialiased p-4">

        {/* Emergency Card */}
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 md:p-10 soft-shadow border border-outline-variant/30 animate-fade-in-up">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error text-on-error shadow-lg">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-error mb-2">
              Emergency Access
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              For urgent situations, please sign in with your credentials.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label className="sr-only" htmlFor="email">Email Address</label>
              <input 
                className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-0 input-glow transition-all duration-200 soft-shadow" 
                id="email" name="email" placeholder="Email Address" required type="email"
              />
            </div>

            {/* Password */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <label className="sr-only" htmlFor="password">Password</label>
                <input 
                  className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 pr-12 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-0 input-glow transition-all duration-200 soft-shadow" 
                  id="password" name="password" placeholder="Password" required 
                  type={showPassword ? "text" : "password"}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-error"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Button */}
            <button 
              type="submit" 
              className="w-full rounded-full bg-error text-on-error py-4 px-6 font-headline-sm text-headline-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_12px_rgba(186,26,26,0.25)] mt-6 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              Access Emergency Portal
            </button>

            {/* Footer Link */}
            <div className="text-center pt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Not an emergency? <Link to="/login" className="font-semibold text-primary hover:underline">Return to standard login</Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}