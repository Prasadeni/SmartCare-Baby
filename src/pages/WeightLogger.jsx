import React, { useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(118, 182, 227, 0.2); border-color: #17648d; }
`;

export default function WeightLogger() {
  const [entries, setEntries] = useState([
    { date: '2024-08-01', weight: '8.2' },
    { date: '2024-08-15', weight: '8.5' },
  ]);
  const [form, setForm] = useState({ date: '', weight: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setEntries([{ ...form }, ...entries]);
    // Backend ready: fetch('/api/weight', { method: 'POST', body: JSON.stringify(form) })
    setForm({ date: '', weight: '' });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-1">Weight Logger</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Track your maternal health progress.</p>
          </div>

          <div className="max-w-lg mx-auto flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">Date</label>
                <input name="date" value={form.date} onChange={handleChange} required className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow" type="date" />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">Weight (kg)</label>
                <input name="weight" value={form.weight} onChange={handleChange} required className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none input-glow transition-all soft-shadow" placeholder="e.g. 8.5" type="number" step="0.1" />
              </div>
              <button type="submit" className="w-full py-4 rounded-full bg-primary text-on-primary font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all">Add Entry</button>
            </form>

            <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">Weight History</h3>
              <div className="flex flex-col gap-3">
                {entries.map((e, i) => (
                  <div key={i} className="flex justify-between items-center bg-surface-container rounded-xl px-4 py-3">
                    <span className="text-body-md font-body-md text-on-surface-variant">{e.date}</span>
                    <span className="text-headline-sm font-headline-sm text-primary">{e.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}