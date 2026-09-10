import React, { useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); }
`;

const vaccines = [
  { id: 1, title: '2-Month Checkup', date: 'March 15, 2024', status: 'completed', vaccines: ['DTaP', 'RV', 'Hib'] },
  { id: 2, title: '4-Month Checkup', date: 'May 15, 2024', status: 'completed', vaccines: ['DTaP (2nd)', 'RV (2nd)'] },
  { id: 3, title: '6-Month Boosters', date: 'Due: July 15, 2024', status: 'due', vaccines: ['DTaP (3rd)', 'PCV13 (3rd)', 'Flu (Annual)'] },
  { id: 4, title: '12-Month Checkup', date: 'January 2025', status: 'upcoming', vaccines: ['MMR', 'Varicella'] },
];

export default function VaccinationList() {
  const [reminders, setReminders] = useState(true);

  const statusStyles = {
    completed: 'bg-[#e6f4ea] text-[#1e8e3e]',
    due: 'bg-[#fef7e0] text-[#f29900]',
    upcoming: 'bg-surface-variant text-on-surface-variant'
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-up">
            <div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-1">Vaccination Schedule</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">Track your baby's immunization journey.</p>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-full border border-surface-variant">
              <label className="text-label-md font-label-md text-on-surface-variant cursor-pointer">Reminders</label>
              <button onClick={() => setReminders(!reminders)} className={`relative w-12 h-6 rounded-full transition-colors ${reminders ? 'bg-primary' : 'bg-surface-variant'}`}>
                <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${reminders ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>

          {/* Vaccination Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaccines.map((v, index) => (
              <article
                key={v.id}
                className={`bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow flex flex-col h-full animate-fade-in-up ${
                  v.status === 'due' ? 'border-2 border-[#fbbc04] relative' :
                  v.status === 'completed' ? 'opacity-70 hover:opacity-100 transition-opacity border border-surface-variant' :
                  'border border-surface-variant bg-opacity-50'
                }`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                {v.status === 'due' && (
                  <div className="absolute -top-3 right-4 bg-[#fbbc04] text-white px-3 py-1 rounded-full text-label-md font-label-md shadow-sm">ACTION NEEDED</div>
                )}

                <div className="flex justify-between items-start mb-4 mt-2">
                  <div>
                    <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1">{v.title}</h3>
                    <p className={`text-body-sm font-body-sm ${v.status === 'due' ? 'text-error font-medium' : 'text-on-surface-variant'}`}>{v.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-label-md font-label-md flex items-center gap-1 ${statusStyles[v.status]}`}>
                    {v.status === 'completed' && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                    {v.status === 'due' && <span className="material-symbols-outlined text-[16px]">schedule</span>}
                    {v.status === 'upcoming' && <span className="material-symbols-outlined text-[16px]">hourglass_empty</span>}
                    {v.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-auto space-y-2">
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    {v.status === 'completed' ? 'Administered:' : 'Required Vaccines:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {v.vaccines.map((vac, i) => (
                      <span key={i} className={`px-2 py-1 rounded-md text-label-md font-label-md ${
                        v.status === 'due' ? 'bg-primary-container text-on-primary-container font-bold' :
                        v.status === 'upcoming' ? 'bg-surface-container-low text-on-surface-variant border border-outline-variant border-dashed' :
                        'bg-surface-container-low text-on-surface-variant border border-outline-variant'
                      }`}>{vac}</span>
                    ))}
                  </div>
                </div>

                {v.status === 'due' && (
                  <button className="mt-4 w-full bg-primary text-on-primary py-3 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    Schedule Appointment
                  </button>
                )}
              </article>
            ))}
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}