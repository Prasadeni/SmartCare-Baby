import React, { useState } from 'react';
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
  .input-glow:focus { box-shadow: 0 0 0 4px rgba(118, 182, 227, 0.2); border-color: #17648d; }
`;

export default function EditBaby() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Backend ready: fetch(`/api/babies/${id}`)
  const [baby, setBaby] = useState({
    name: 'Leo',
    dob: '2023-10-12',
    gender: 'Male',
    birthWeight: '3.2',
    bloodGroup: 'O+'
  });

  const handleChange = (e) => setBaby({ ...baby, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating baby:', baby);
    // Backend ready: fetch(`/api/babies/${id}`, { method: 'PUT', body: JSON.stringify(baby) })
    alert(`Baby ${baby.name} updated successfully!`);
    navigate(`/baby/${id}`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-1">Edit Baby Profile</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Update {baby.name}'s information.</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 soft-shadow animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">Baby Name</label>
                <input name="name" value={baby.name} onChange={handleChange} required className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow" type="text" />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">Date of Birth</label>
                <input name="dob" value={baby.dob} onChange={handleChange} required className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow" type="date" />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">Gender</label>
                <select name="gender" value={baby.gender} onChange={handleChange} className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">Birth Weight (kg)</label>
                <input name="birthWeight" value={baby.birthWeight} onChange={handleChange} className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow" type="number" step="0.1" />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">Blood Group</label>
                <select name="bloodGroup" value={baby.bloodGroup} onChange={handleChange} className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow">
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                </select>
              </div>
              <button type="submit" className="w-full rounded-full bg-primary text-on-primary py-4 px-6 font-headline-sm text-headline-sm hover:opacity-90 active:scale-95 transition-all mt-2">Update Profile</button>
              <button type="button" onClick={() => navigate(`/baby/${id}`)} className="w-full py-3 rounded-full border-2 border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors">Cancel</button>
            </div>
          </form>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}