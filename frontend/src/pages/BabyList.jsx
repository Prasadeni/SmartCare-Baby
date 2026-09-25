// src/pages/BabyList.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { babiesApi } from '../api/babies';
import { formatAge, formatWeight, formatDate, getInitial } from '../utils/formatters';

export default function BabyList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [babies, setBabies] = useState([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await babiesApi.list();
      setBabies(list || []);
    } catch (err) {
      setError(err.message || 'Could not load babies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-1">
                My Babies
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Manage all your baby profiles in one place.
              </p>
            </div>
            <Link
              to="/add-baby"
              className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">add</span>
              Add Baby
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading babies…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : babies.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 soft-shadow">
              <EmptyState
                icon="child_care"
                title="No babies yet"
                message="Add your first baby profile to start tracking milestones, growth, and health records."
                primaryAction={
                  <Link
                    to="/add-baby"
                    className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90"
                  >
                    Add a Baby
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {babies.map((baby) => (
                <div
                  key={baby.id}
                  onClick={() => navigate(`/baby/${baby.id}`)}
                  className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow text-left hover:-translate-y-1 hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 font-headline-lg text-3xl font-bold">
                      {getInitial(baby.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-headline-md font-headline-md text-on-surface truncate">
                        {baby.name}
                      </h3>
                      <p className="text-body-sm text-on-surface-variant truncate">
                        {formatAge(baby.dob)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-surface-container px-3 py-1 rounded-full text-label-md font-label-md text-on-surface-variant">
                      {baby.bloodGroup}
                    </span>
                    {baby.birthWeightKg ? (
                      <span className="bg-surface-container px-3 py-1 rounded-full text-label-md font-label-md text-on-surface-variant">
                        {formatWeight(baby.birthWeightKg)}
                      </span>
                    ) : null}
                    <span className="bg-surface-container px-3 py-1 rounded-full text-label-md font-label-md text-on-surface-variant capitalize">
                      {baby.gender}
                    </span>
                  </div>

                  <p className="text-body-sm text-on-surface-variant mb-3">
                    Born {formatDate(baby.dob)}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/baby/${baby.id}`);
                    }}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}