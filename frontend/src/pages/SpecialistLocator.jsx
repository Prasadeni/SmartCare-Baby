// src/pages/SpecialistLocator.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { specialistsApi } from '../api/specialists';
import { getInitial } from '../utils/formatters';

export default function SpecialistLocator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialists, setSpecialists] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [specialtyFilter, setSpecialtyFilter] = useState(
    searchParams.get('specialty') || ''
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, mapList] = await Promise.all([
        specialistsApi.list({ search, city, specialty: specialtyFilter }),
        specialistsApi.mappings().catch(() => []),
      ]);
      setSpecialists(list || []);
      setMappings(mapList || []);
    } catch (err) {
      setError(err.message || 'Could not load specialists');
    } finally {
      setLoading(false);
    }
  }, [search, city, specialtyFilter]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const cities = ['Colombo', 'Kandy', 'Galle', 'Jaffna'];
  const specialties = [
    'Pediatric Gastroenterologist',
    'General Pediatrics',
    'Developmental Pediatrician',
    'Pediatric Pulmonologist',
    'Speech-Language Pathologist',
  ];

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="max-w-3xl mb-8">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-2">
              Consult a Specialist
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              Find and connect with pediatric specialists near you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            <section className="lg:col-span-2 flex flex-col gap-6">
              {/* Search + filters */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    search
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, specialty, or city…"
                    className="w-full pl-12 pr-4 py-4 rounded-full border border-outline-variant bg-surface-container-lowest focus:outline-none input-glow soft-shadow"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-3 text-body-md focus:outline-none input-glow"
                  >
                    <option value="">All Cities</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-3 text-body-md focus:outline-none input-glow"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {(city || specialtyFilter || search) && (
                    <button
                      onClick={() => {
                        setCity('');
                        setSpecialtyFilter('');
                        setSearch('');
                      }}
                      className="flex items-center gap-1 text-primary font-label-md px-4 hover:underline"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              {loading ? (
                <LoadingSpinner label="Loading specialists…" />
              ) : error ? (
                <ErrorState message={error} onRetry={load} />
              ) : specialists.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-2xl p-8 soft-shadow text-center">
                  <span className="material-symbols-outlined text-primary text-5xl mb-3">
                    person_search
                  </span>
                  <p className="text-body-md text-on-surface-variant">
                    No specialists match your filters. Try widening the search.
                  </p>
                </div>
              ) : (
                specialists.map((s) => (
                  <article
                    key={s.id}
                    className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow border border-outline-variant/20 flex flex-col sm:flex-row gap-6 items-center sm:items-start hover:scale-[0.99] transition-transform"
                  >
                    <div className="w-24 h-24 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 font-headline-lg text-3xl font-bold">
                      {getInitial(s.name.replace('Dr. ', ''))}
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <h3 className="text-headline-sm font-headline-sm text-on-surface">
                            {s.name}
                          </h3>
                          <p className="text-body-md text-primary">{s.specialty}</p>
                        </div>
                        <div className="flex items-center gap-1 text-secondary justify-center sm:justify-start mt-1 sm:mt-0">
                          <span
                            className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className="text-label-md font-label-md">
                            {s.rating} ({s.reviews})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-tertiary text-body-sm">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>{s.city} • {s.hospitalAffiliation}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-tertiary text-body-sm">
                        <span className="material-symbols-outlined text-sm">payments</span>
                        <span>Consultation: {s.fee}</span>
                      </div>
                      <div className="mt-4 flex gap-3 justify-center sm:justify-start">
                        <a
                          href={`tel:${s.phone}`}
                          className="bg-primary text-on-primary font-label-md px-6 py-2 rounded-full hover:opacity-90 transition-opacity active:scale-95"
                        >
                          Call
                        </a>
                        <button
                          onClick={() => navigate(`/specialist/${s.id}`)}
                          className="border-2 border-primary text-primary font-label-md px-6 py-2 rounded-full hover:bg-primary-fixed transition-colors active:scale-95"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </section>

            {/* Sidebar: recommended mappings */}
            <aside className="flex flex-col gap-4">
              <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow flex flex-col gap-3">
                <h3 className="text-headline-sm font-headline-sm text-primary mb-2">
                  Recommended Specialties
                </h3>
                <p className="text-body-sm text-on-surface-variant mb-2">
                  Based on common assessment outcomes:
                </p>
                {mappings.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSpecialtyFilter(m.recommendedSpecialty)}
                    className="text-left p-3 rounded-xl hover:bg-surface-container-low transition-colors"
                  >
                    <p className="text-body-md font-semibold text-on-surface">
                      {m.triggerCondition}
                    </p>
                    <p className="text-body-sm text-primary">
                      → {m.recommendedSpecialty}
                    </p>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}