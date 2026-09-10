import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
`;

export default function SpecialistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Backend ready: fetch(`/api/specialists/${id}`)
  const specialist = {
    id,
    name: 'Dr. Emily Chen',
    specialty: 'Pediatric Gastroenterologist',
    hospital: 'Sunrise Medical Center',
    city: 'Colombo',
    rating: 4.9,
    reviews: 120,
    fee: 'LKR 3,500',
    phone: '+94 11 234 5678',
    address: '123 Healthway Dr, Suite 200, Colombo',
    bio: 'Senior pediatrician with 15+ years of experience in child development and preventive care.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA96KnkGW2EOEGIfbjXhxkSRMRXkXvfGHnMLWB7zTF2UWIOcvh5h8OzwJmyoCaQ0fb2h7qp0TI4khfGT-9ZcFKvp4HrwxqIHRKY_DS69dxAfdC4XzrvD9lY3JXVwECxv697AjXUifHkgquDLpjUvzl089lDVIk2TZgfWPxf7oJm_otTSjbtWWwMk6Cm6A3WI5kf9i_u7xTD1xM9jIfFlRib4mww9j99h3vALSNtbPSjG8AzAY5EPAAf'
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary font-label-md text-label-md mb-6 hover:opacity-80">
            <span className="material-symbols-outlined">arrow_back</span> Back
          </button>

          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            {/* Profile Card */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 soft-shadow text-center animate-fade-in-up">
              <img src={specialist.image} alt={specialist.name} className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-surface-container" />
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1">{specialist.name}</h2>
              <p className="text-body-lg font-body-lg text-primary mb-3">{specialist.specialty}</p>
              <div className="flex items-center justify-center gap-1 text-secondary mb-6">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-headline-sm font-headline-sm">{specialist.rating}</span>
                <span className="text-body-sm font-body-sm text-on-surface-variant">({specialist.reviews} reviews)</span>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant">{specialist.bio}</p>
            </div>

            {/* Contact Info */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">local_hospital</span>
                <span className="text-body-md font-body-md text-on-surface">{specialist.hospital}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <span className="text-body-md font-body-md text-on-surface">{specialist.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">call</span>
                <span className="text-body-md font-body-md text-on-surface">{specialist.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">payments</span>
                <span className="text-body-md font-body-md text-on-surface">Consultation: {specialist.fee}</span>
              </div>
            </div>

            <button className="w-full py-4 rounded-full bg-primary text-on-primary font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Book Appointment
            </button>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}