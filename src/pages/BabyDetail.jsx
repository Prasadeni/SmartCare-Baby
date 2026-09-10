import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
`;

export default function BabyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Backend ready: fetch(`/api/babies/${id}`)
  const baby = {
    id,
    name: 'Leo',
    age: '6 months old',
    dob: 'Oct 12, 2023',
    gender: 'Male',
    weight: '18.5 lbs',
    height: '28 in',
    bloodGroup: 'O+'
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          {/* Profile Card */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 soft-shadow mb-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
                <span className="material-symbols-outlined" style={{ fontSize: '56px', fontVariationSettings: "'FILL' 1" }}>child_care</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1">{baby.name}</h2>
                <p className="text-body-md font-body-md text-on-surface-variant mb-4">{baby.age} • Born {baby.dob}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-surface-container px-4 py-1 rounded-full font-label-md text-label-md text-on-surface-variant">Gender: {baby.gender}</span>
                  <span className="bg-error-container text-on-error-container px-4 py-1 rounded-full font-label-md text-label-md">Blood: {baby.bloodGroup}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-2">monitor_weight</span>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-1">Weight</p>
              <p className="text-headline-md font-headline-md text-on-surface">{baby.weight}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-2">height</span>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-1">Height</p>
              <p className="text-headline-md font-headline-md text-on-surface">{baby.height}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">Actions</h3>
            <button onClick={() => navigate(`/edit-baby/${id}`)} className="w-full py-3 rounded-full border-2 border-primary text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors">Edit Profile</button>
            <button onClick={() => navigate('/growth')} className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity">View Growth Chart</button>
            <button onClick={() => navigate('/vaccinations')} className="w-full py-3 rounded-full border-2 border-secondary text-secondary font-label-md text-label-md hover:bg-secondary-container/20 transition-colors">Vaccination Schedule</button>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}