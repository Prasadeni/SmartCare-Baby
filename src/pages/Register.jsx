import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import motherImage from '../assets/mother.jpg';

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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Submitting user data:", formData);
    alert("Account created successfully!");
    navigate('/login');
  };

  return (
    <>
      <style>{styles}</style>

      {/* Main Wrapper */}
      <div className="flex h-screen w-full overflow-hidden bg-background font-body-md text-on-background antialiased">

        {/* LEFT SIDE: Added p-2 padding for a small gap, and rounded on all corners */}
        <div className="hidden lg:block relative w-1/2 h-full p-2">
          <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <img 
              src={motherImage} 
              alt="Pregnant mother holding a teddy bear" 
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Dark gradient overlay */}
            <div 
              className="absolute inset-0" 
              style={{ background: 'linear-gradient(180deg, rgba(11,28,48,0.1) 0%, rgba(11,28,48,0.1) 40%, rgba(11,28,48,0.9) 100%)' }}
            />
            
            {/* Brand and Text (Inside the contained image) */}
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <div className="flex items-center gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
                <span className="text-white font-bold text-2xl font-headline">SmartCare Baby</span>
              </div>
              
              <h1 className="text-5xl font-headline font-bold text-white leading-tight mb-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                Nurturing every step<br /> of the journey
              </h1>
              <p className="text-white/80 text-lg max-w-md font-body-md animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                Join SmartCare Baby to track your pregnancy and baby-care journey right where you left off.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[520px] bg-surface-container-lowest rounded-lg p-8 md:p-10 soft-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            <div className="mb-8">
              {/* INCREASED FONT SIZE TO headline-xl */}
              <h2 className="font-headline text-3xl text-primary font-bold mb-2">
                Create your account
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Join SmartCare Baby to start your journey.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <label className="sr-only" htmlFor="fullName">Full Name</label>
                <input 
                  className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-0 input-glow transition-all duration-200 soft-shadow" 
                  id="fullName" name="fullName" placeholder="Full Name" required type="text"
                  value={formData.fullName} onChange={handleChange}
                />
              </div>

              <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                <div className="w-1/3">
                  <label className="sr-only" htmlFor="countryCode">Country Code</label>
                  <select className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-4 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-0 input-glow transition-all duration-200 soft-shadow appearance-none" id="countryCode" name="countryCode" defaultValue="+1">
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (AU)</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="sr-only" htmlFor="phone">Phone Number</label>
                  <input className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-0 input-glow transition-all duration-200 soft-shadow" id="phone" name="phone" placeholder="Phone Number" required type="tel" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <label className="sr-only" htmlFor="email">Email Address</label>
                <input className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-0 input-glow transition-all duration-200 soft-shadow" id="email" name="email" placeholder="Email Address" required type="email" value={formData.email} onChange={handleChange} />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
                <div className="relative">
                  <label className="sr-only" htmlFor="password">Password</label>
                  <input className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 pr-12 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-0 input-glow transition-all duration-200 soft-shadow" id="password" name="password" placeholder="Password" required type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">{showPassword ? "visibility" : "visibility_off"}</span></button>
                </div>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="relative">
                  <label className="sr-only" htmlFor="confirmPassword">Confirm Password</label>
                  <input className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 pr-12 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-0 input-glow transition-all duration-200 soft-shadow" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">{showConfirmPassword ? "visibility" : "visibility_off"}</span></button>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
                <div className="flex items-center h-5">
                  <input className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary focus:ring-offset-surface-container-lowest" id="terms" name="terms" required type="checkbox" />
                </div>
                <div className="text-sm leading-5">
                  <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">I agree to the <a className="text-primary hover:underline" href="#">Terms of Service</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.</label>
                </div>
              </div>

              <button type="submit" className="w-full rounded-full bg-primary text-on-primary py-4 px-6 font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all duration-200 soft-shadow mt-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>Create Account</button>

              <div className="text-center pt-4 animate-fade-in-up" style={{ animationDelay: '0.65s' }}>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Already have an account? <Link to="/login" className="text-primary hover:underline font-semibold">Login here</Link></p>
              </div>

            </form>
          </div>
        </div>

        <button className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-error text-on-error px-6 py-3 rounded-full soft-shadow hover:opacity-90 active:scale-95 transition-all duration-200 font-headline-sm">
          <span className="material-symbols-outlined">emergency</span>
          <span className="font-bold">Emergency</span>
        </button>

      </div>
    </>
  );
}