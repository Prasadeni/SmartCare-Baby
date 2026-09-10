import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(118, 182, 227, 0.2); border-color: #17648d; }
`;

const specialists = [
  { id: 1, name: 'Dr. Emily Chen', specialty: 'Pediatric Gastroenterologist', city: 'Colombo', rating: 4.9, reviews: 120, hospital: 'Sunrise Medical Center', distance: '2.4 miles away', available: 'Tomorrow', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA96KnkGW2EOEGIfbjXhxkSRMRXkXvfGHnMLWB7zTF2UWIOcvh5h8OzwJmyoCaQ0fb2h7qp0TI4khfGT-9ZcFKvp4HrwxqIHRKY_DS69dxAfdC4XzrvD9lY3JXVwECxv697AjXUifHkgquDLpjUvzl089lDVIk2TZgfWPxf7oJm_otTSjbtWWwMk6Cm6A3WI5kf9i_u7xTD1xM9jIfFlRib4mww9j99h3vALSNtbPSjG8AzAY5EPAAf' },
  { id: 2, name: 'Dr. Mark Lee', specialty: 'General Pediatrics & Nutrition', city: 'Kandy', rating: 4.8, reviews: 85, hospital: 'Oak Tree Clinic', distance: '3.1 miles away', available: 'Thursday', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFXvrqwUFXI2d-Q-95TPkB2QaBr5BJaHrT86qyiSsmUiZL2haXkNDPsonO22ilT1UiqzCisRgBi3e1IRmPnSQPK8t8YlWXHK-fLgJtqkzxFbEIr-jVgGfaGKFjvw9-k2Q2arAgj0m09zm5VHr_mIMDd1c6JjP2SyFO-m6e44cWGl32-YBzHlwN92kg2Bcd2pnvb4IVgRO-7xbsNwb5GZ6xHdHtWkJ0Gzrh0lGaEVtdU_JszPZ_ic2P' },
];

export default function SpecialistLocator() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = specialists.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.specialty.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          {/* Header */}
          <div className="max-w-3xl mb-8 animate-fade-in-up">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-2">Consult a Specialist</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              Based on the recent screening results for Baby Leo, we recommend consulting with a pediatric specialist. Here are highly-rated professionals nearby.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Specialists List */}
            <section className="lg:col-span-2 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {/* Search */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, specialty, or city..."
                  className="w-full pl-12 pr-4 py-4 rounded-full border border-outline-variant bg-surface-container-lowest focus:outline-none input-glow transition-all soft-shadow"
                />
              </div>

              {/* Specialist Cards */}
              {filtered.map((s) => (
                <article key={s.id} className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow border border-outline-variant/20 flex flex-col sm:flex-row gap-6 items-center sm:items-start hover:scale-[0.99] transition-transform">
                  <img src={s.image} alt={s.name} className="w-24 h-24 rounded-full object-cover border-4 border-surface-container shrink-0" />
                  <div className="flex-grow text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <div>
                        <h3 className="text-headline-sm font-headline-sm text-on-surface">{s.name}</h3>
                        <p className="text-body-md font-body-md text-primary">{s.specialty}</p>
                      </div>
                      <div className="flex items-center gap-1 text-secondary justify-center sm:justify-start mt-1 sm:mt-0">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-label-md font-label-md">{s.rating} ({s.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-tertiary text-body-sm font-body-sm">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span>{s.distance} • {s.hospital}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-tertiary text-body-sm font-body-sm">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      <span>Next available: {s.available}</span>
                    </div>
                    <div className="mt-4 flex gap-3 justify-center sm:justify-start">
                      <button onClick={() => navigate(`/specialist/${s.id}`)} className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:opacity-90 transition-opacity active:scale-95">Contact</button>
                      <button onClick={() => navigate(`/specialist/${s.id}`)} className="border-2 border-primary text-primary font-label-md text-label-md px-6 py-2 rounded-full hover:bg-surface-container-low transition-colors active:scale-95">View Profile</button>
                    </div>
                  </div>
                </article>
              ))}

              {filtered.length === 0 && (
                <p className="text-center text-body-md text-on-surface-variant py-8">No specialists found.</p>
              )}
            </section>

            {/* Map/Nearby Clinics */}
            <aside className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow flex flex-col gap-4">
                <h3 className="text-headline-sm font-headline-sm text-primary">Nearby Clinics</h3>
                <div className="w-full h-48 rounded-xl overflow-hidden bg-surface-container relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-container/30 to-secondary-container/30"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="bg-secondary text-on-secondary rounded-full p-2 shadow-md">
                      <span className="material-symbols-outlined text-sm">local_hospital</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-body-md font-body-md font-bold text-on-surface">Sunrise Medical Center</h4>
                    <span className="bg-primary-container/20 text-on-primary-container px-2 py-1 rounded-full text-[10px] font-label-md uppercase">Closest</span>
                  </div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">directions_car</span> 10 min drive (2.4 mi)
                  </p>
                  <button className="w-full mt-2 border border-outline-variant text-primary font-label-md text-label-md py-2 rounded-full hover:bg-surface-container-low transition-colors">Get Directions</button>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}