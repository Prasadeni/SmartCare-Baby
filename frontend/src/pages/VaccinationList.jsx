// src/pages/VaccinationList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { vaccinationsApi } from '../api/vaccinations';
import { babiesApi } from '../api/babies';
import { formatDate } from '../utils/formatters';

function ageInMonths(dob) {
  if (!dob) return 0;
  const birth = new Date(dob);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

export default function VaccinationList() {
  const [searchParams] = useSearchParams();
  const babyIdParam = searchParams.get('babyId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baby, setBaby] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [records, setRecords] = useState([]);
  const [reminders, setReminders] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pick baby
      let babyData = null;
      if (babyIdParam) {
        babyData = await babiesApi.get(babyIdParam);
      } else {
        const babies = await babiesApi.list();
        babyData = babies?.[0] || null;
      }
      setBaby(babyData);

      const [scheduleList, recordList] = await Promise.all([
        vaccinationsApi.listSchedules(),
        babyData ? vaccinationsApi.listRecords(babyData.id) : Promise.resolve([]),
      ]);

      setSchedules(scheduleList || []);
      setRecords(recordList || []);
    } catch (err) {
      setError(err.message || 'Could not load vaccination data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [babyIdParam]);

  // Compute status for each schedule item
  const items = useMemo(() => {
    if (!baby) return [];
    const babyAge = ageInMonths(baby.dob);

    return schedules.map((s) => {
      const record = records.find((r) => r.vaccineScheduleId === s.id);
      let status = 'upcoming';
      if (record) status = 'completed';
      else if (babyAge >= s.dueAgeMonths) {
        // Overdue if more than 1 month past due
        status = babyAge - s.dueAgeMonths >= 1 ? 'overdue' : 'due';
      }
      return { ...s, record, status, babyAge };
    });
  }, [schedules, records, baby]);

  const grouped = useMemo(() => {
    const groups = {};
    items.forEach((item) => {
      const key = item.dueAgeMonths;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([age, list]) => ({ age: Number(age), items: list }));
  }, [items]);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((i) => i.status === 'completed').length;
    const due = items.filter((i) => i.status === 'due' || i.status === 'overdue').length;
    return { total, completed, due, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [items]);

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">

          {baby && (
            <Link
              to={`/baby/${baby.id}`}
              className="inline-flex items-center gap-2 text-primary font-label-md text-label-md mb-4 hover:opacity-80"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              {baby.name}'s profile
            </Link>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-1">
                Vaccination Schedule
              </h2>
              <p className="text-body-md text-on-surface-variant">
                {baby ? `${baby.name} • ${ageInMonths(baby.dob)} months old` : 'Track immunization journey.'}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-full border border-surface-variant">
              <label className="text-label-md font-label-md text-on-surface-variant cursor-pointer">
                Reminders
              </label>
              <button
                onClick={() => setReminders(!reminders)}
                className={`relative w-12 h-6 rounded-full transition-colors ${reminders ? 'bg-primary' : 'bg-surface-variant'}`}
              >
                <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${reminders ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading vaccination schedule…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : !baby ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 soft-shadow text-center">
              <p className="text-body-md text-on-surface-variant mb-4">
                Add a baby to view the vaccination schedule.
              </p>
              <Link
                to="/add-baby"
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md hover:opacity-90"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add a Baby
              </Link>
            </div>
          ) : (
            <>
              {/* Progress card */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-headline-sm font-headline-sm text-on-surface">
                    Overall Progress
                  </h3>
                  <span className="text-headline-sm font-headline-sm text-primary">
                    {stats.completed} / {stats.total}
                  </span>
                </div>
                <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stats.percent}%` }}
                  ></div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-[#e6f4ea] text-[#1e8e3e] px-3 py-1 rounded-full text-label-md font-label-md">
                    {stats.completed} completed
                  </span>
                  {stats.due > 0 && (
                    <span className="bg-[#fef7e0] text-[#b45309] px-3 py-1 rounded-full text-label-md font-label-md">
                      {stats.due} action needed
                    </span>
                  )}
                </div>
              </div>

              {/* Groups */}
              <div className="flex flex-col gap-8">
                {grouped.map((group) => (
                  <div key={group.age}>
                    <h3 className="text-headline-sm font-headline-sm text-on-surface mb-3 flex items-center gap-2">
                      <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-md font-label-md">
                        {group.age === 0 ? 'At birth' : `${group.age} months`}
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.items.map((item) => (
                        <VaccineCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {grouped.length === 0 && (
                <p className="text-center text-on-surface-variant py-12">
                  No vaccines in schedule.
                </p>
              )}
            </>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}

function VaccineCard({ item }) {
  const STATUS_STYLES = {
    completed: 'bg-[#e6f4ea] text-[#1e8e3e]',
    due: 'bg-[#fef7e0] text-[#f29900]',
    overdue: 'bg-error-container text-on-error-container',
    upcoming: 'bg-surface-variant text-on-surface-variant',
  };

  const STATUS_ICONS = {
    completed: 'check_circle',
    due: 'schedule',
    overdue: 'warning',
    upcoming: 'hourglass_empty',
  };

  return (
    <article
      className={`bg-surface-container-lowest rounded-2xl p-5 soft-shadow flex flex-col h-full ${
        item.status === 'overdue'
          ? 'border-2 border-error relative'
          : item.status === 'due'
          ? 'border-2 border-[#fbbc04]'
          : 'border border-surface-variant'
      }`}
    >
      {item.status === 'overdue' && (
        <div className="absolute -top-2.5 right-4 bg-error text-on-error px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Overdue
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <h4 className="text-headline-sm font-headline-sm text-on-surface pr-2">
          {item.vaccineName}
        </h4>
        <span className={`px-2.5 py-1 rounded-full text-label-md font-label-md flex items-center gap-1 shrink-0 ${STATUS_STYLES[item.status]}`}>
          <span className="material-symbols-outlined text-[14px]">
            {STATUS_ICONS[item.status]}
          </span>
          {item.status}
        </span>
      </div>

      <p className="text-body-sm text-on-surface-variant mb-3 flex-grow">
        {item.description}
      </p>

      <div className="text-label-md text-on-surface-variant mb-3">
        <p>
          <strong className="text-on-surface">Prevents:</strong> {item.preventsDiseases}
        </p>
        {item.record && (
          <p className="mt-1">
            <strong className="text-on-surface">Given:</strong> {formatDate(item.record.administeredDate)}
            {item.record.administeredBy && ` by ${item.record.administeredBy}`}
          </p>
        )}
      </div>

      {!item.mandatory && (
        <span className="text-[10px] text-tertiary font-bold uppercase tracking-wider mb-2">
          Optional
        </span>
      )}

      {item.status === 'due' && !item.record && (
        <button className="w-full bg-primary text-on-primary py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          Schedule Appointment
        </button>
      )}

      {item.status === 'overdue' && !item.record && (
        <button className="w-full bg-error text-on-error py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">priority_high</span>
          Book Immediately
        </button>
      )}
    </article>
  );
}