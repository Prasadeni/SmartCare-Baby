import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
`;

export default function Profile() {
  const [formData, setFormData] = useState({
    name: 'Chamodi',
    phone: '+94 77 123 4567',
    city: 'Colombo'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving profile:', formData);
    alert('Profile updated successfully!');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md">
        <Navbar />

        <main className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl p-8 md:p-10 soft-shadow border border-outline-variant/30 animate-fade-in-up">
            
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-4xl font-bold font-headline border-4 border-white shadow-lg">
                {formData.name.charAt(0)}
              </div>
              <h2 className="font-headline text-3xl font-bold text-primary">Edit Profile</h2>
              <p className="mt-2 text-body-md text-on-surface-variant">Update your personal information</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input 
                label="Full Name"
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
                type="text"
              />

              <Input 
                label="Phone Number"
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                required 
                type="tel"
              />

              <Input 
                label="City"
                id="city" 
                name="city" 
                value={formData.city}
                onChange={handleChange}
                required 
                type="text"
              />

              <Button type="submit">Save Changes</Button>

              <div className="text-center pt-4">
                <Link to="/dashboard" className="text-sm font-semibold text-primary hover:underline">Cancel and go back</Link>
              </div>
            </form>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}