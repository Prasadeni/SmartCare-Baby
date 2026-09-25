// src/pages/PregnancyDashboard.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { pregnancyApi } from '../api/pregnancy';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { getWeekData, getWeekImageUrl } from '../data/pregnancyWeeks';

function calculateFromLMP(lmpDateStr) {
  if (!lmpDateStr) return null;
  const lmpDate = new Date(lmpDateStr);
  const today = new Date();
  lmpDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const daysSinceLMP = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
  const daysToGo = Math.max(0, 280 - daysSinceLMP);
  const currentWeek = Math.max(1, Math.min(40, Math.floor(daysSinceLMP / 7)));
  const currentDay = daysSinceLMP % 7;
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280);
  let trimester = '1st Trimester';
  if (currentWeek >= 13 && currentWeek < 28) trimester = '2nd Trimester';
  else if (currentWeek >= 28) trimester = '3rd Trimester';
  const weekKey = Math.max(4, Math.min(40, currentWeek));
  const weekData = getWeekData(weekKey);
  return {
    lmpDate: lmpDateStr,
    dueDate: dueDate.toISOString().split('T')[0],
    daysSinceLMP,
    daysToGo,
    currentWeek,
    currentDay,
    trimester,
    babySize: weekData.size,
  };
}

function calculateFromDueDate(dueDateStr) {
  if (!dueDateStr) return null;
  const dueDate = new Date(dueDateStr);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const daysToGo = Math.max(0, Math.floor((dueDate - today) / (1000 * 60 * 60 * 24)));
  const daysSinceLMP = 280 - daysToGo;
  const lmpDate = new Date(dueDate);
  lmpDate.setDate(lmpDate.getDate() - 280);
  const currentWeek = Math.max(1, Math.min(40, Math.floor(daysSinceLMP / 7)));
  const currentDay = daysSinceLMP % 7;
  let trimester = '1st Trimester';
  if (currentWeek >= 13 && currentWeek < 28) trimester = '2nd Trimester';
  else if (currentWeek >= 28) trimester = '3rd Trimester';
  const weekKey = Math.max(4, Math.min(40, currentWeek));
  const weekData = getWeekData(weekKey);
  return {
    lmpDate: lmpDate.toISOString().split('T')[0],
    dueDate: dueDateStr,
    daysSinceLMP,
    daysToGo,
    currentWeek,
    currentDay,
    trimester,
    babySize: weekData.size,
  };
}

export default function PregnancyDashboard() {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pregnancy, setPregnancy] = useState(null);

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [inputMethod, setInputMethod] = useState('lmp');
  const [formData, setFormData] = useState({ lmpDate: '', dueDate: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await pregnancyApi.getTracker();
      if (p) {
        const calc = calculateFromDueDate(p.expectedDueDate);
        setPregnancy({
          ...p,
          currentWeek: calc?.currentWeek ?? 0,
          currentDay: calc?.currentDay ?? 0,
          daysToGo: calc?.daysToGo ?? 0,
          trimester: calc?.trimester ?? '1st Trimester',
          babySize: calc?.babySize ?? 'Growing',
        });
      } else {
        setPregnancy(null);
      }
    } catch (err) {
      setError(err.message || 'Could not load pregnancy data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const calc =
        inputMethod === 'lmp'
          ? calculateFromLMP(formData.lmpDate)
          : calculateFromDueDate(formData.dueDate);
      if (!calc) {
        setSubmitting(false);
        return;
      }
      const saved = await pregnancyApi.saveTracker({
        expectedDueDate: calc.dueDate,
        lmpDate: calc.lmpDate,
        currentGestationalAgeWeeks: calc.currentWeek,
      });
      try { await refreshUser(); } catch { /* ignore */ }
      setPregnancy({ ...saved, ...calc });
      setShowSetupModal(false);
    } catch (err) {
      setError(err.message || 'Could not save pregnancy');
    } finally {
      setSubmitting(false);
    }
  };

  const openSetup = (method = 'lmp') => {
    setInputMethod(method);
    setFormData({
      lmpDate: pregnancy?.lmpDate || '',
      dueDate: pregnancy?.expectedDueDate || '',
    });
    setShowSetupModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12">
          {loading ? (
            <LoadingSpinner label="Loading your pregnancy…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : !pregnancy ? (
            <EmptyStateView onAdd={() => openSetup('lmp')} />
          ) : (
            <PopulatedView
              pregnancy={pregnancy}
              onEdit={() => openSetup('lmp')}
            />
          )}
        </main>

        {showSetupModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setShowSetupModal(false)}
          >
            <div
              className="bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 soft-shadow w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    pregnant_woman
                  </span>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface">
                    {pregnancy ? 'Update Pregnancy' : 'Add Pregnancy'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowSetupModal(false)}
                  className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex gap-2 mb-6 bg-surface-container-low p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => setInputMethod('lmp')}
                  className={`flex-1 py-2 px-4 rounded-full text-label-md font-label-md transition-colors ${
                    inputMethod === 'lmp'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  Last Period
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod('due')}
                  className={`flex-1 py-2 px-4 rounded-full text-label-md font-label-md transition-colors ${
                    inputMethod === 'due'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  Due Date
                </button>
              </div>

              <form onSubmit={handleSetupSubmit} className="flex flex-col gap-5">
                {inputMethod === 'lmp' ? (
                  <div>
                    <label className="block text-label-md font-label-md text-on-surface-variant mb-2 ml-2">
                      First day of your last period
                    </label>
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.lmpDate}
                      onChange={(e) => setFormData({ ...formData, lmpDate: e.target.value })}
                      className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md focus:outline-none input-glow"
                    />
                    <p className="text-body-sm text-on-surface-variant mt-2 ml-2">
                      Most accurate way to calculate your due date.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-label-md font-label-md text-on-surface-variant mb-2 ml-2">
                      Your due date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md focus:outline-none input-glow"
                    />
                    <p className="text-body-sm text-on-surface-variant mt-2 ml-2">
                      Usually provided by your doctor.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-full bg-secondary text-on-secondary font-headline-sm text-headline-sm hover:opacity-90 disabled:opacity-60 transition-all"
                >
                  {submitting ? 'Saving…' : pregnancy ? 'Update' : 'Start Tracking'}
                </button>
              </form>
            </div>
          </div>
        )}

        <FloatingButtons />
      </div>
    </>
  );
}

function EmptyStateView({ onAdd }) {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="max-w-lg mx-auto bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 soft-shadow text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary-container flex items-center justify-center">
          <span
            className="material-symbols-outlined text-secondary text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            pregnant_woman
          </span>
        </div>
        <h2 className="text-headline-lg font-headline-lg text-primary mb-3">
          Start Your Pregnancy Journey
        </h2>
        <p className="text-body-lg text-on-surface-variant mb-8 max-w-md mx-auto">
          Add your pregnancy details to begin tracking week by week.
        </p>
        <div className="bg-surface-container-low rounded-xl p-5 mb-8 text-left">
          <div className="flex items-start gap-3 mb-3">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">check_circle</span>
            <span className="text-body-md text-on-surface-variant">See your baby's size week by week</span>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">check_circle</span>
            <span className="text-body-md text-on-surface-variant">Track kick counts and contractions</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">check_circle</span>
            <span className="text-body-md text-on-surface-variant">Log your weight progress</span>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="bg-secondary text-on-secondary font-headline-sm py-4 px-8 rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 mx-auto shadow-md"
        >
          <span className="material-symbols-outlined">add</span>
          Add Pregnancy
        </button>
      </div>
    </div>
  );
}

function BabySizeVisual({ weekData }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !weekData) {
    return (
      <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
        <span className="text-3xl">{weekData?.emoji || '🍓'}</span>
      </div>
    );
  }

  return (
    <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-surface-container-high">
      <img
        src={getWeekImageUrl(weekData.imageTag)}
        alt={weekData.size}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
        loading="lazy"
      />
    </div>
  );
}

function PopulatedView({ pregnancy, onEdit }) {
  const progressPercent = Math.min(100, (pregnancy.currentWeek / 40) * 100);
  const weekData = getWeekData(pregnancy.currentWeek);

  // Format weight: show grams under 1 kg, kg above
  const weightDisplay =
    weekData.weightG >= 1000
      ? `${(weekData.weightG / 1000).toFixed(2)} kg`
      : `${weekData.weightG} g`;

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-headline-lg-mobile md:text-headline-xl font-headline-xl text-primary mb-2">
            Your Pregnancy Journey
          </h2>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <span className="text-headline-sm font-headline-sm">
              Week {pregnancy.currentWeek}, Day {pregnancy.currentDay}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="text-body-lg">{pregnancy.daysToGo} Days to Go</span>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="bg-primary text-on-primary font-label-md py-3 px-6 rounded-full hover:bg-surface-tint transition-colors flex items-center gap-2 shadow-sm self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Update Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 flex flex-col gap-6">

          <section className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant">
            <h3 className="text-headline-sm font-headline-sm text-primary mb-6">
              Journey Progress
            </h3>

            <div className="relative pt-6 pb-10">
              <div className="absolute h-3 w-full bg-surface-container-high rounded-full top-1/2 -translate-y-1/2"></div>
              <div
                className="absolute h-3 bg-primary rounded-full top-1/2 -translate-y-1/2 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
              <div
                className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${progressPercent}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-surface-container-lowest border-4 border-primary flex items-center justify-center shadow-md">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </div>
                <span className="text-label-md text-primary font-bold whitespace-nowrap mt-12">
                  Week {pregnancy.currentWeek}
                </span>
              </div>
            </div>

            {/* ── Enhanced Baby Size card ────────────────────── */}
            <div className="mt-4 p-4 bg-surface-container-low rounded-2xl">
              <div className="flex items-start gap-4">
                <BabySizeVisual weekData={weekData} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-body-lg font-bold text-on-surface">
                    Baby is the size of a {weekData.size}!
                  </h4>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    Approx. {weekData.lengthCm} cm • {weightDisplay}
                  </p>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    {pregnancy.trimester} • Due {formatDate(pregnancy.expectedDueDate)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-body-sm text-on-surface-variant leading-relaxed">
                {weekData.description}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/kick-counter"
              className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant flex flex-col justify-between hover:bg-surface-container-low transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-on-primary-fixed text-2xl">footprint</span>
              </div>
              <div>
                <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1">Kick Counter</h3>
                <p className="text-body-sm text-on-surface-variant">Track daily fetal movements.</p>
              </div>
            </Link>

            <Link
              to="/weight-logger"
              className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant flex flex-col justify-between hover:bg-secondary-fixed transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-secondary-fixed-dim flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-on-secondary-fixed text-2xl">monitor_weight</span>
              </div>
              <div>
                <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1">Weight Tracker</h3>
                <p className="text-body-sm text-on-surface-variant">Log weekly weight progress.</p>
              </div>
            </Link>

            <Link
              to="/contraction-timer"
              className="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant flex flex-col sm:flex-row items-center sm:justify-between gap-4 hover:bg-surface-container-low transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-tertiary-fixed flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-on-tertiary-fixed text-3xl">timer</span>
                </div>
                <div>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface">Contraction Timer</h3>
                  <p className="text-body-sm text-on-surface-variant">Ready for when the time comes.</p>
                </div>
              </div>
              <span className="bg-surface text-primary border-2 border-primary hover:bg-surface-container-high px-6 py-2 rounded-full font-label-md transition-colors whitespace-nowrap">
                Open Timer
              </span>
            </Link>
          </section>
        </div>

        <div className="md:col-span-4 flex flex-col gap-6">
          {/* ── Week-specific Tip of the Week ─────────────── */}
          <section className="bg-secondary-fixed rounded-2xl p-6 soft-shadow">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary">lightbulb</span>
              <h3 className="text-headline-sm font-headline-sm text-on-surface">Tip of the Week</h3>
            </div>
            <h4 className="text-body-lg font-bold text-on-surface mb-2">
              Week {pregnancy.currentWeek}
            </h4>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {weekData.tip}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}