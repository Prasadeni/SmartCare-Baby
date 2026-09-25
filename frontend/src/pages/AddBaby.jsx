// src/pages/AddBaby.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import PhotoPicker from '../components/PhotoPicker';
import { babiesApi } from '../api/babies';
import { useAuth } from '../context/AuthContext';
import { GENDERS, BLOOD_GROUPS } from '../utils/constants';
import { getInitial } from '../utils/formatters';

export default function AddBaby() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [baby, setBaby] = useState({
    name: '',
    dob: '',
    gender: 'male',
    birthWeightKg: '',
    birthHeightCm: '',
    bloodGroup: 'Unknown',
    photoUrl: '',
  });

  const handleChange = (e) =>
    setBaby({ ...baby, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const created = await babiesApi.create({
        name: baby.name.trim(),
        dob: baby.dob,
        gender: baby.gender,
        birthWeightKg: Number(baby.birthWeightKg) || 0,
        birthHeightCm: Number(baby.birthHeightCm) || 0,
        bloodGroup: baby.bloodGroup,
        photoUrl: baby.photoUrl || null,
      });

      try { await refreshUser(); } catch { /* ignore */ }

      navigate(`/baby/${created.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not save baby profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="mb-8">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-1">
              Add New Baby
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Create a profile to start tracking milestones and health.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 soft-shadow"
          >
            {error && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-body-sm font-body-sm flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5">

              {/* NEW: Photo picker */}
              <div className="pb-2">
                <PhotoPicker
                  value={baby.photoUrl}
                  onChange={(url) => setBaby((prev) => ({ ...prev, photoUrl: url }))}
                  size="w-28 h-28"
                  fallback={baby.name ? getInitial(baby.name) : null}
                  hint="JPG or PNG · Max 2 MB · Optional"
                />
              </div>

              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">
                  Baby Name *
                </label>
                <input
                  name="name"
                  value={baby.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-on-surface placeholder:text-outline focus:outline-none input-glow transition-all soft-shadow"
                  placeholder="Enter baby's name"
                  type="text"
                />
              </div>

              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">
                  Date of Birth *
                </label>
                <input
                  name="dob"
                  value={baby.dob}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow"
                  type="date"
                />
              </div>

              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={baby.gender}
                  onChange={handleChange}
                  className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow capitalize"
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g} className="capitalize">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">
                    Birth Weight (kg)
                  </label>
                  <input
                    name="birthWeightKg"
                    value={baby.birthWeightKg}
                    onChange={handleChange}
                    className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-on-surface placeholder:text-outline focus:outline-none input-glow transition-all soft-shadow"
                    placeholder="3.2"
                    type="number"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">
                    Birth Height (cm)
                  </label>
                  <input
                    name="birthHeightCm"
                    value={baby.birthHeightCm}
                    onChange={handleChange}
                    className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-on-surface placeholder:text-outline focus:outline-none input-glow transition-all soft-shadow"
                    placeholder="50"
                    type="number"
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-1 ml-2">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={baby.bloodGroup}
                  onChange={handleChange}
                  className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-on-surface focus:outline-none input-glow transition-all soft-shadow"
                >
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-primary text-on-primary py-4 px-6 font-headline-sm text-headline-sm hover:opacity-90 active:scale-[0.98] disabled:opacity-60 transition-all duration-200 mt-2"
              >
                {submitting ? 'Saving…' : 'Save Baby Profile'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-3 rounded-full border-2 border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}