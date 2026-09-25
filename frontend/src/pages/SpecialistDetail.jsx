// src/pages/SpecialistDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { specialistsApi } from '../api/specialists';
import { getInitial } from '../utils/formatters';

export default function SpecialistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialist, setSpecialist] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await specialistsApi.get(id);
      setSpecialist(data);
    } catch (err) {
      setError(err.message || 'Could not load specialist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary font-label-md mb-6 hover:opacity-80"
          >
            <span className="material-symbols-outlined">arrow_back</span> Back
          </button>

          {loading ? (
            <LoadingSpinner label="Loading specialist…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : !specialist ? (
            <ErrorState
              title="Specialist not found"
              message="This profile doesn't exist."
            />
          ) : (
            <div className="max-w-2xl mx-auto flex flex-col gap-6">

              <div className="bg-surface-container-lowest rounded-[2rem] p-8 soft-shadow text-center">
                <div className="w-28 h-28 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-4 font-headline-xl text-4xl font-bold">
                  {getInitial(specialist.name.replace('Dr. ', ''))}
                </div>
                <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1">
                  {specialist.name}
                </h2>
                <p className="text-body-lg text-primary mb-3">{specialist.specialty}</p>
                <div className="flex items-center justify-center gap-1 text-secondary mb-6">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-headline-sm font-headline-sm">
                    {specialist.rating}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    ({specialist.reviews} reviews)
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant">{specialist.bio}</p>
              </div>

              <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">local_hospital</span>
                  <span className="text-body-md text-on-surface">
                    {specialist.hospitalAffiliation}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span className="text-body-md text-on-surface">
                    {specialist.city}, {specialist.country}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">call</span>
                  <span className="text-body-md text-on-surface">{specialist.phone}</span>
                </div>
                {specialist.email && (
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary">mail</span>
                    <a
                      href={`mailto:${specialist.email}`}
                      className="text-body-md text-primary hover:underline"
                    >
                      {specialist.email}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  <span className="text-body-md text-on-surface">
                    Consultation: {specialist.fee}
                  </span>
                </div>
                {specialist.availableDays?.length > 0 && (
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-0.5">
                      event_available
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {specialist.availableDays.map((d) => (
                        <span
                          key={d}
                          className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-label-md font-label-md"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
  {/* Appointment button — uses the stored echannelingUrl, falls back to eChannelling home */}
<a
  href={specialist.echannelingUrl || 'https://www.echannelling.com/'}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all"
>
  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
  Book Appointment
</a>

  {/* Secondary — Call + Email */}
  <div className="flex flex-col sm:flex-row gap-3">
    <a
      href={`tel:${specialist.phone}`}
      className="flex-1 text-center py-4 rounded-full border-2 border-primary text-primary font-headline-sm hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2"
    >
      <span className="material-symbols-outlined">call</span>
      Call Now
    </a>
    {specialist.email && (
      <a
        href={`mailto:${specialist.email}`}
        className="flex-1 text-center py-4 rounded-full border-2 border-primary text-primary font-headline-sm hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">mail</span>
        Email
      </a>
    )}
  </div>
</div>

             
            </div>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}