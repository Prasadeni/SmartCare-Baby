// src/pages/BabyDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { babiesApi } from '../api/babies';
import {
  formatAge, formatDate, formatWeight, formatHeight, getInitial,
} from '../utils/formatters';

const BABY_ACTIONS = [
  { to: (id) => `/symptoms?babyId=${id}`, icon: 'stethoscope', label: 'Check Symptoms', desc: 'Answer a symptom questionnaire' },
  { to: (id) => `/milestones?babyId=${id}`, icon: 'flag', label: 'Milestones', desc: 'Track developmental progress' },
  { to: (id) => `/mchat?babyId=${id}`, icon: 'psychology_alt', label: 'M-CHAT-R', desc: 'Autism screening questionnaire' },
  { to: (id) => `/growth?babyId=${id}`, icon: 'straighten', label: 'Growth Chart', desc: 'Weight, height, head circumference' },
  { to: (id) => `/vaccinations?babyId=${id}`, icon: 'vaccines', label: 'Vaccinations', desc: 'Vaccine schedule & records' },
];

// NEW — report links
const REPORT_LINKS = [
  { to: (id) => `/reports/mchat/${id}`,      icon: 'psychology_alt', label: 'M-CHAT-R'   },
  { to: (id) => `/reports/milestones/${id}`, icon: 'flag',           label: 'Milestones' },
  { to: (id) => `/reports/symptoms/${id}`,   icon: 'stethoscope',    label: 'Symptoms'   },
  { to: (id) => `/reports/growth/${id}`,     icon: 'straighten',     label: 'Growth'     },
];

export default function BabyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baby, setBaby] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const b = await babiesApi.get(id);
      setBaby(b);
    } catch (err) {
      setError(err.message || 'Could not load baby');
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
            onClick={() => navigate('/babies')}
            className="flex items-center gap-2 text-primary font-label-md text-label-md mb-6 hover:opacity-80"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            All Babies
          </button>

          {loading ? (
            <LoadingSpinner label="Loading baby profile…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : !baby ? (
            <ErrorState title="Baby not found" message="This baby profile does not exist." />
          ) : (
            <>
              {/* Profile card */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 soft-shadow mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-28 h-28 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 font-headline-xl text-4xl font-bold">
                    {getInitial(baby.name)}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1">
                      {baby.name}
                    </h2>
                    <p className="text-body-md text-on-surface-variant mb-4">
                      {formatAge(baby.dob)} • Born {formatDate(baby.dob)}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="bg-surface-container px-4 py-1 rounded-full font-label-md text-label-md text-on-surface-variant capitalize">
                        {baby.gender}
                      </span>
                      <span className="bg-error-container text-on-error-container px-4 py-1 rounded-full font-label-md text-label-md">
                        Blood: {baby.bloodGroup}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/edit-baby/${baby.id}`}
                    className="border-2 border-primary text-primary px-5 py-2 rounded-full font-label-md text-label-md hover:bg-primary-fixed transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit
                  </Link>
                </div>
              </div>

              {/* Birth stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard icon="monitor_weight" label="Birth Weight" value={formatWeight(baby.birthWeightKg)} />
                <StatCard icon="height" label="Birth Height" value={formatHeight(baby.birthHeightCm)} />
                <StatCard icon="cake" label="Age" value={formatAge(baby.dob)} />
                <StatCard icon="water_drop" label="Blood Group" value={baby.bloodGroup} />
              </div>

              {/* Actions scoped to this baby */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-4">
                  {baby.name}'s Health Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {BABY_ACTIONS.map((action) => (
                    <Link
                      key={action.label}
                      to={action.to(baby.id)}
                      className="bg-surface-container hover:bg-surface-container-high transition-colors p-4 rounded-2xl flex items-center gap-3 group"
                    >
                      <div className="w-11 h-11 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary-fixed transition-colors shrink-0">
                        <span className="material-symbols-outlined text-primary">{action.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-headline-sm text-body-md text-on-surface truncate">
                          {action.label}
                        </p>
                        <p className="text-body-sm text-on-surface-variant truncate">
                          {action.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* NEW — Clinical Reports */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow mt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-headline-md font-headline-md text-on-surface mb-1">
                      Clinical Reports
                    </h3>
                    <p className="text-body-sm text-on-surface-variant">
                      Export {baby.name}'s health records as a printable PDF.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-label-md font-label-md text-primary bg-primary-fixed px-3 py-1 rounded-full uppercase tracking-wider self-start md:self-auto">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Print-ready
                  </span>
                </div>

                {/* Per-section downloads */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {REPORT_LINKS.map((r) => (
                    <Link
                      key={r.label}
                      to={r.to(baby.id)}
                      className="bg-surface-container hover:bg-surface-container-high transition-colors p-4 rounded-2xl flex flex-col items-center gap-2 text-center group"
                    >
                      <div className="w-11 h-11 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
                        <span className="material-symbols-outlined text-primary">{r.icon}</span>
                      </div>
                      <span className="text-label-md font-label-md text-on-surface">
                        {r.label} PDF
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Full report CTA */}
                <Link
                  to={`/reports/full/${baby.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-error text-on-error px-6 py-4 rounded-2xl font-headline-sm text-headline-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(186,26,26,0.25)]"
                >
                  <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                  Download Full Health Report
                </Link>
                <p className="text-label-md font-label-md text-on-surface-variant text-center mt-2">
                  Includes M-CHAT-R, Milestones, Symptoms and Growth in one PDF
                </p>
              </div>
            </>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 soft-shadow text-center">
      <span className="material-symbols-outlined text-primary text-3xl mb-2">{icon}</span>
      <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-headline-sm font-headline-sm text-on-surface">{value}</p>
    </div>
  );
}