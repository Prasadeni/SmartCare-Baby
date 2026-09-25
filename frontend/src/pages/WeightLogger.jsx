// src/pages/WeightLogger.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { pregnancyApi } from '../api/pregnancy';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

// ── Helpers ──────────────────────────────────────────────
function calcDerived(pregnancy) {
  if (!pregnancy?.expectedDueDate) return null;
  const due = new Date(pregnancy.expectedDueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const daysToGo = Math.max(0, Math.floor((due - today) / 86400000));
  const daysSinceLMP = 280 - daysToGo;
  const currentWeek = Math.max(1, Math.min(40, Math.floor(daysSinceLMP / 7)));
  const currentDay = daysSinceLMP % 7;
  let trimester = 1;
  if (currentWeek >= 13) trimester = 2;
  if (currentWeek >= 28) trimester = 3;
  return { daysToGo, currentWeek, currentDay, trimester };
}

function calcGestationalWeek(dateStr, expectedDueDate) {
  if (!dateStr || !expectedDueDate) return null;
  const d = new Date(dateStr);
  const due = new Date(expectedDueDate);
  if (Number.isNaN(d.getTime()) || Number.isNaN(due.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const daysToGo = Math.round((due - d) / 86400000);
  const daysSinceLMP = 280 - daysToGo;
  return Math.max(0, Math.min(42, Math.floor(daysSinceLMP / 7)));
}

function sortLogs(logs) {
  return [...logs].sort(
    (a, b) =>
      (a.gestationalAgeWeeks || 0) - (b.gestationalAgeWeeks || 0) ||
      new Date(a.logDate) - new Date(b.logDate)
  );
}

const IOM = {
  underweight: { total: [12.5, 18], label: 'Underweight' },
  normal:      { total: [11.5, 16], label: 'Normal' },
  overweight:  { total: [7, 11.5],  label: 'Overweight' },
  obese:       { total: [5, 9],     label: 'Obese' },
};

function getIomCategory(bmi) {
  if (!bmi) return IOM.normal;
  if (bmi < 18.5) return IOM.underweight;
  if (bmi < 25)   return IOM.normal;
  if (bmi < 30)   return IOM.overweight;
  return IOM.obese;
}

function fmtKg(v) {
  if (v == null || isNaN(v)) return '—';
  return `${Number(v).toFixed(1)} kg`;
}

// ── Main Page ────────────────────────────────────────────
export default function WeightLogger() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pregnancy, setPregnancy] = useState(null);
  const [logs, setLogs] = useState([]);

  const [unit, setUnit] = useState('kg');
  const [weightInput, setWeightInput] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, weightLogs] = await Promise.all([
        pregnancyApi.getTracker(),
        pregnancyApi.listWeightLogs().catch(() => []),
      ]);
      setPregnancy(p);
      setLogs(Array.isArray(weightLogs) ? weightLogs : []);
    } catch (err) {
      setError(err.message || 'Could not load weight logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const derived = useMemo(() => calcDerived(pregnancy), [pregnancy]);
  const sorted = useMemo(() => sortLogs(logs), [logs]);

  const prePregnancyWeight =
    pregnancy?.prePregnancyWeightKg ?? (sorted[0]?.weightKg ?? null);

  const latest = sorted[sorted.length - 1] || null;
  const currentWeight = latest?.weightKg ?? null;
  const totalGain =
    currentWeight != null && prePregnancyWeight != null
      ? currentWeight - prePregnancyWeight
      : null;

  const previous = sorted[sorted.length - 2] || null;
  const weeklyChange =
    latest && previous ? latest.weightKg - previous.weightKg : null;

  const heightCm = pregnancy?.heightCm ?? null;
  const bmi =
    prePregnancyWeight != null && heightCm
      ? prePregnancyWeight / Math.pow(heightCm / 100, 2)
      : null;
  const iom = getIomCategory(bmi);

  const gainStatus =
    totalGain == null ? 'Unknown'
    : totalGain < iom.total[0] * (derived?.currentWeek / 40) * 0.8 ? 'Below Range'
    : totalGain > iom.total[1] * (derived?.currentWeek / 40) * 1.2 ? 'Above Range'
    : 'On Track';

  const autoWeek = useMemo(
    () =>
      calcGestationalWeek(entryDate, pregnancy?.expectedDueDate)
      ?? derived?.currentWeek
      ?? null,
    [entryDate, pregnancy, derived]
  );

  useEffect(() => {
    if (currentWeight != null && !weightInput) {
      setWeightInput(
        unit === 'kg' ? currentWeight.toFixed(1) : (currentWeight * 2.20462).toFixed(1)
      );
    }
  }, [currentWeight, weightInput, unit]);

  const handleUnitToggle = (u) => {
    if (u === unit) return;
    const n = parseFloat(weightInput);
    if (!isNaN(n) && n > 0) {
      setWeightInput(
        u === 'kg' ? (n / 2.20462).toFixed(1) : (n * 2.20462).toFixed(1)
      );
    }
    setUnit(u);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const n = parseFloat(weightInput);
      if (isNaN(n) || n <= 0) throw new Error('Enter a valid weight');
      const weightKg = unit === 'kg' ? n : n / 2.20462;

      const week =
        calcGestationalWeek(entryDate, pregnancy?.expectedDueDate)
        ?? derived?.currentWeek
        ?? 0;

      await pregnancyApi.createWeightLog({
        logDate: entryDate,
        weightKg: Number(weightKg.toFixed(2)),
        gestationalAgeWeeks: week,
        notes: notes.trim() || null,
      });

      setSaveSuccess(true);
      setNotes('');
      await load();
      setTimeout(() => setSaveSuccess(false), 2200);
    } catch (err) {
      setError(err.message || 'Could not save weight');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this weight entry? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await pregnancyApi.deleteWeightLog(id);
      setLogs((prev) => prev.filter((l) => (l._id || l.id) !== id));
    } catch (err) {
      alert(err.message || 'Could not delete entry');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">
          {loading ? (
            <LoadingSpinner label="Loading weight tracker…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : !pregnancy ? (
            <NoPregnancyState />
          ) : (
            <div className="flex flex-col gap-8">

              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <p className="text-body-sm font-semibold text-on-surface">
                    Self-reported readings
                  </p>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    These readings are entered manually and have not been verified by a
                    clinician. Share them with your obstetrician at your next visit — they
                    don't replace a clinical assessment.
                  </p>
                </div>
              </div>

              <ContextBanner
                user={user}
                pregnancy={pregnancy}
                derived={derived}
                prePregnancy={prePregnancyWeight}
                current={currentWeight}
                totalGain={totalGain}
                bmi={bmi}
                iomLabel={iom.label}
                gainStatus={gainStatus}
                entryCount={sorted.length}
              />

              <QuickEntry
                unit={unit}
                onUnitToggle={handleUnitToggle}
                weightInput={weightInput}
                setWeightInput={setWeightInput}
                entryDate={entryDate}
                setEntryDate={setEntryDate}
                autoWeek={autoWeek}
                notes={notes}
                setNotes={setNotes}
                saving={saving}
                saveSuccess={saveSuccess}
                onSubmit={handleSubmit}
                currentWeight={currentWeight}
                weeklyChange={weeklyChange}
                gainStatus={gainStatus}
                entryCount={sorted.length}
              />

              <ProgressChart
                logs={sorted}
                prePregnancy={prePregnancyWeight}
                currentWeek={derived?.currentWeek || 0}
                iom={iom}
              />

              <HistoryTable
                logs={sorted}
                prePregnancy={prePregnancyWeight}
                onDelete={handleDelete}
                deletingId={deletingId}
              />

              <EducationCard trimester={derived?.trimester || 1} />
            </div>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}

// ── Sub-components ───────────────────────────────────────

function NoPregnancyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-lg mx-auto bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 soft-shadow text-center">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            monitor_weight
          </span>
        </div>
        <h3 className="text-headline-lg font-headline-lg text-primary mb-3">
          Start your pregnancy first
        </h3>
        <p className="text-body-md text-on-surface-variant mb-6">
          Set up your pregnancy tracker to log and monitor weight progress.
        </p>
        <Link
          to="/pregnancy"
          className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-full font-label-md text-label-md hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">pregnant_woman</span>
          Go to Pregnancy Tracker
        </Link>
      </div>
    </div>
  );
}

function ContextBanner({ user, pregnancy, derived, prePregnancy, current, totalGain, bmi, iomLabel, gainStatus, entryCount }) {
  const statusColor =
    gainStatus === 'On Track' ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
    : gainStatus === 'Below Range' || gainStatus === 'Above Range' ? 'bg-[#fff4e5] text-[#b45309] border-[#fed7aa]'
    : 'bg-surface-container text-on-surface-variant border-outline-variant';

  const badges = ['', '1st', '2nd', '3rd'];

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 soft-shadow border border-surface-variant">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-surface-container-high/40">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-primary/20" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 font-headline-md font-bold">
              {(user?.fullName || 'You').split(' ').map((s) => s[0]).join('').slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="bg-primary-fixed-dim text-on-primary-fixed-variant px-2.5 py-0.5 rounded-full text-[10px] font-label-md uppercase tracking-wider">
                {badges[derived?.trimester || 1]} Trimester
              </span>
              <span className="bg-surface-container-highest text-on-primary-container px-2.5 py-0.5 rounded-full text-[10px] font-label-md">
                Week {derived?.currentWeek || 0} of 40
              </span>
              {entryCount > 0 && (
                <span className="bg-secondary-fixed text-secondary px-2.5 py-0.5 rounded-full text-[10px] font-label-md font-bold">
                  {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
                </span>
              )}
            </div>
            <h1 className="text-headline-sm font-headline-sm text-on-surface truncate">
              {user?.fullName || 'You'}
            </h1>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Due <strong className="text-on-surface">{pregnancy.expectedDueDate ? formatDate(pregnancy.expectedDueDate) : '—'}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-surface-container-low px-4 py-3 rounded-xl">
          <Stat label="Pre-Pregnancy" value={fmtKg(prePregnancy)} />
          <Divider />
          <Stat label="Current" value={fmtKg(current)} accent="primary" />
          <Divider />
          <Stat
            label="Total Gain"
            value={totalGain != null ? `${totalGain >= 0 ? '+' : ''}${totalGain.toFixed(1)} kg` : '—'}
            accent="secondary"
          />
          <Divider />
          <span className={`px-3 py-1.5 rounded-full text-label-md font-label-md border ${statusColor} inline-flex items-center gap-1`}>
            <span className="material-symbols-outlined text-[14px]">insights</span>
            {gainStatus === 'On Track' && bmi ? `BMI ${bmi.toFixed(1)} · ${iomLabel}` : gainStatus}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pt-4 -mb-1">
        <SubTab to="/kick-counter" emoji="👣" label="Kick Counter" />
        <SubTab active emoji="⚖️" label="Weight Tracker" />
        <SubTab to="/contraction-timer" emoji="⏱️" label="Contraction Timer" />
        <SubTab to="/pregnancy" emoji="🌱" label="Baby Size & Growth" />
      </div>
    </section>
  );
}

function Stat({ label, value, accent }) {
  const color = accent === 'primary' ? 'text-primary' : accent === 'secondary' ? 'text-secondary' : 'text-on-surface';
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-label-md uppercase tracking-wider text-tertiary">{label}</span>
      <span className={`text-headline-sm font-headline-sm ${color}`}>{value}</span>
    </div>
  );
}

function Divider() {
  return <span className="w-px h-8 bg-outline-variant/50" />;
}

function SubTab({ to, emoji, label, active }) {
  const cls = active
    ? 'bg-primary text-on-primary shadow-[0_2px_12px_rgba(23,100,141,0.25)]'
    : 'text-on-surface-variant hover:bg-surface-container-low';
  const content = (
    <>
      <span>{emoji}</span>
      {label}
      {active && <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />}
    </>
  );
  if (active) {
    return (
      <span className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap flex items-center gap-2 ${cls}`}>
        {content}
      </span>
    );
  }
  return (
    <Link to={to} className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap flex items-center gap-2 transition-all ${cls}`}>
      {content}
    </Link>
  );
}

function QuickEntry({
  unit, onUnitToggle, weightInput, setWeightInput,
  entryDate, setEntryDate, autoWeek,
  notes, setNotes, saving, saveSuccess, onSubmit,
  currentWeight, weeklyChange, gainStatus, entryCount,
}) {
  const displayValue = (() => {
    if (currentWeight == null) return '—';
    return unit === 'kg' ? currentWeight.toFixed(1) : (currentWeight * 2.20462).toFixed(1);
  })();

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-5 md:p-8 soft-shadow border border-surface-variant">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-6 border-b border-surface-container-high/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-label-md uppercase tracking-wider text-secondary font-bold">
              Bio-Metric
            </span>
            <span className="bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded-full text-[10px] font-label-md font-bold">
              {entryCount > 0 ? `Add entry · ${entryCount} logged` : 'First entry'}
            </span>
          </div>
          <h2 className="text-headline-md font-headline-md text-on-surface">
            Current Weight &amp; Quick Entry
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 p-6 rounded-xl bg-surface-container-low flex flex-col justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[48px] leading-none font-bold text-on-background tracking-tight">
                {displayValue}
              </span>
              <span className="text-headline-md font-headline-md text-tertiary font-semibold">
                {unit}
              </span>
            </div>
            {weeklyChange != null && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  {weeklyChange >= 0 ? 'trending_up' : 'trending_down'}
                </span>
                <span className="text-label-md font-label-md text-primary font-bold">
                  {weeklyChange >= 0 ? '+' : ''}{weeklyChange.toFixed(1)} kg
                </span>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-surface-container-high/50 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shrink-0" />
            <p className="text-body-sm text-on-primary-container font-semibold">
              {gainStatus === 'On Track' ? 'Gain rate within recommended range'
                : gainStatus === 'Below Range' ? 'Below recommended range — discuss with your doctor'
                : gainStatus === 'Above Range' ? 'Above recommended range — discuss with your doctor'
                : 'Log a weight to track your gain rate'}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-body-sm font-semibold text-on-surface">Enter weight</label>
                <div className="flex items-center bg-surface-container-high p-0.5 rounded-full gap-0.5">
                  <button
                    type="button"
                    onClick={() => onUnitToggle('kg')}
                    className={`px-3 py-1 rounded-full text-[11px] font-label-md transition-all ${
                      unit === 'kg' ? 'bg-surface-container-lowest text-primary shadow-sm font-bold' : 'text-tertiary'
                    }`}
                  >kg</button>
                  <button
                    type="button"
                    onClick={() => onUnitToggle('lbs')}
                    className={`px-3 py-1 rounded-full text-[11px] font-label-md transition-all ${
                      unit === 'lbs' ? 'bg-surface-container-lowest text-primary shadow-sm font-bold' : 'text-tertiary'
                    }`}
                  >lbs</button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-full bg-surface-container-lowest text-on-surface font-headline-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-tertiary">
                  {unit}
                </span>
              </div>
            </div>

            <div>
              <label className="text-body-sm font-semibold text-on-surface block mb-2">Date</label>
              <input
                type="date"
                value={entryDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setEntryDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-full bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-body-sm font-semibold text-on-surface block mb-2">
                Gestational week
              </label>
              <div className="w-full px-4 py-3 rounded-full bg-surface-container-low text-on-surface text-body-sm flex items-center justify-between">
                <span className="font-semibold">
                  {autoWeek != null && autoWeek > 0 ? `Week ${autoWeek}` : '—'}
                </span>
                <span className="text-[10px] text-tertiary uppercase tracking-wider">
                  auto
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-8">
              <label className="text-body-sm font-semibold text-on-surface block mb-2">Observation notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Morning weight after light breakfast"
                className="w-full px-4 py-3 rounded-full bg-surface-container-low text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-4">
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 px-5 rounded-full font-label-md text-label-md shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
                  saveSuccess
                    ? 'bg-primary text-on-primary'
                    : 'bg-on-primary-fixed text-on-primary hover:bg-on-primary-fixed-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {saveSuccess ? 'check' : 'save'}
                </span>
                {saving ? 'Saving…' : saveSuccess ? 'Saved!' : 'Save weight'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function ProgressChart({ logs, prePregnancy, currentWeek, iom }) {
  if (!logs || logs.length === 0 || prePregnancy == null) {
    return (
      <section className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant">
        <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">Weight Progress</h3>
        <p className="text-body-sm text-on-surface-variant">
          Log at least one weight to see your progress chart.
        </p>
      </section>
    );
  }

  const W = 760, H = 320;
  const padL = 55, padR = 30, padT = 30, padB = 45;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const lowTotal  = iom.total[0];
  const highTotal = iom.total[1];
  const maxGain = highTotal + 3;
  const minY = Math.max(0, prePregnancy - 3);
  const maxY = prePregnancy + maxGain + 3;

  const xAt = (wk) => padL + (Math.min(40, Math.max(0, wk)) / 40) * plotW;
  const yAt = (kg) => padT + (1 - (kg - minY) / (maxY - minY)) * plotH;

  const corridorPts = [
    `${xAt(0)},${yAt(prePregnancy + lowTotal * 0.02)}`,
    `${xAt(13)},${yAt(prePregnancy + lowTotal * 0.18)}`,
    `${xAt(27)},${yAt(prePregnancy + lowTotal * 0.65)}`,
    `${xAt(40)},${yAt(prePregnancy + lowTotal)}`,
    `${xAt(40)},${yAt(prePregnancy + highTotal)}`,
    `${xAt(27)},${yAt(prePregnancy + highTotal * 0.65)}`,
    `${xAt(13)},${yAt(prePregnancy + highTotal * 0.18)}`,
    `${xAt(0)},${yAt(prePregnancy + highTotal * 0.02)}`,
  ].join(' ');

  const points = logs.map((l) => ({
    x: xAt(l.gestationalAgeWeeks || 0),
    y: yAt(l.weightKg),
    week: l.gestationalAgeWeeks,
    kg: l.weightKg,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  const lastPoint = points[points.length - 1];
  const tooltipX = Math.min(W - padR - 90, Math.max(padL, lastPoint.x - 42));
  const tooltipY = Math.max(padT + 8, lastPoint.y - 55);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const v = maxY - t * (maxY - minY);
    return { v, y: padT + t * plotH };
  });

  const xTicks = [8, 16, 22, 26, 28, 34, 40];

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[10px] font-label-md uppercase tracking-wider text-primary font-bold">
            Biometrics
          </span>
          <h3 className="text-headline-md font-headline-md text-on-surface mt-0.5">
            Weight Progress Throughout Pregnancy
          </h3>
        </div>
        <span className="bg-surface-container text-on-surface px-3 py-1 rounded-full text-label-md font-label-md">
          Baseline: {prePregnancy.toFixed(1)} kg
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-3 bg-surface-container-low px-4 py-2 rounded-full">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1.5 rounded-full bg-on-primary-container" />
          <span className="text-body-sm text-on-surface">Your logged weight</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-primary-fixed/60" />
          <span className="text-body-sm text-on-surface">Recommended healthy range (IOM)</span>
        </div>
      </div>

      <div className="relative w-full bg-surface rounded-xl p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <defs>
            <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c9e6ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffd8ea" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#17648d" />
              <stop offset="100%" stopColor="#004768" />
            </linearGradient>
          </defs>

          {yTicks.map((t, i) => (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={t.y} y2={t.y} stroke="#d3e4fe" strokeDasharray="3 3" strokeWidth="1" />
              <text x={padL - 8} y={t.y + 4} textAnchor="end" fontSize="11" fill="#576065">
                {t.v.toFixed(0)} kg
              </text>
            </g>
          ))}

          <polygon points={corridorPts} fill="url(#corridorGrad)" />

          <line
            x1={padL} x2={W - padR}
            y1={yAt(prePregnancy)} y2={yAt(prePregnancy)}
            stroke="#c0c7cf" strokeDasharray="4 4" strokeWidth="1"
          />

          {points.length >= 2 && (
            <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#004768" stroke="#ffffff" strokeWidth="2" />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="#40484e"
              >
                {p.kg.toFixed(1)}
              </text>
            </g>
          ))}

          {lastPoint && (
            <>
              <circle cx={lastPoint.x} cy={lastPoint.y} r="10" fill="#ffaeda" opacity="0.4" className="animate-ping" />
              <circle cx={lastPoint.x} cy={lastPoint.y} r="6" fill="#8a486f" stroke="#ffffff" strokeWidth="2.5" />
              <g transform={`translate(${tooltipX}, ${tooltipY})`}>
                <rect width="84" height="34" rx="8" fill="#0b1c30" opacity="0.9" />
                <text x="42" y="15" fill="#ffffff" fontSize="10" textAnchor="middle">
                  Week {lastPoint.week || currentWeek}
                </text>
                <text x="42" y="28" fill="#ffaeda" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {lastPoint.kg.toFixed(1)} kg
                </text>
              </g>
            </>
          )}

          {xTicks.map((w) => (
            <text
              key={w}
              x={xAt(w)}
              y={H - 12}
              textAnchor="middle"
              fontSize="11"
              fill={w === currentWeek ? '#17648d' : '#576065'}
              fontWeight={w === currentWeek ? 'bold' : 'normal'}
            >
              W{w}{w === currentWeek ? ' (Today)' : ''}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}

function HistoryTable({ logs, prePregnancy, onDelete, deletingId }) {
  if (!logs || logs.length === 0) {
    return (
      <section className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant">
        <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">Weight History</h3>
        <p className="text-body-sm text-on-surface-variant">
          No weight logs yet. Add your first measurement above.
        </p>
      </section>
    );
  }

  const reversed = [...logs].reverse();
  const first = logs[0];
  const last = logs[logs.length - 1];

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] font-label-md uppercase tracking-wider text-secondary font-bold">
            Records
          </span>
          <h3 className="text-headline-md font-headline-md text-on-surface">
            Weight History Log
          </h3>
        </div>
        <div className="flex items-center gap-3 text-body-sm text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">trending_up</span>
            <strong className="text-on-surface">{logs.length}</strong> {logs.length === 1 ? 'entry' : 'entries'}
          </span>
          <span className="text-outline-variant">•</span>
          <span>
            From <strong className="text-on-surface">Week {first.gestationalAgeWeeks}</strong> to <strong className="text-on-surface">Week {last.gestationalAgeWeeks}</strong>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-tertiary text-[10px] font-label-md uppercase tracking-wider">
              <th className="py-3 px-4 rounded-l-xl">Week</th>
              <th className="py-3 px-4">Date recorded</th>
              <th className="py-3 px-4">Logged weight</th>
              <th className="py-3 px-4">Weekly change</th>
              <th className="py-3 px-4">Total gain</th>
              <th className="py-3 px-4">Notes</th>
              <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reversed.map((l, i) => {
              const idx = logs.length - 1 - i;
              const prev = idx > 0 ? logs[idx - 1] : null;
              const change = prev ? l.weightKg - prev.weightKg : null;
              const total = prePregnancy != null ? l.weightKg - prePregnancy : null;
              const id = l._id || l.id;

              return (
                <tr key={id || i} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-on-surface">
                    Week {l.gestationalAgeWeeks || '—'}
                  </td>
                  <td className="py-3 px-4 text-body-sm text-on-surface-variant">
                    {formatDate(l.logDate)}
                  </td>
                  <td className="py-3 px-4 font-bold text-on-surface">
                    {Number(l.weightKg).toFixed(1)} kg
                  </td>
                  <td className={`py-3 px-4 font-semibold ${change == null ? 'text-tertiary' : change >= 0 ? 'text-primary' : 'text-secondary'}`}>
                    {change == null ? '—' : `${change >= 0 ? '+' : ''}${change.toFixed(1)} kg`}
                  </td>
                  <td className={`py-3 px-4 font-semibold ${total == null ? 'text-tertiary' : total >= 0 ? 'text-primary' : 'text-secondary'}`}>
                    {total == null ? '—' : `${total >= 0 ? '+' : ''}${total.toFixed(1)} kg`}
                  </td>
                  <td className="py-3 px-4 text-body-sm text-on-surface-variant max-w-[200px] truncate">
                    {l.notes || '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDelete(id)}
                      disabled={deletingId === id}
                      className="w-8 h-8 rounded-full hover:bg-error-container hover:text-error flex items-center justify-center text-on-surface-variant transition-colors disabled:opacity-50 inline-flex"
                      title="Delete entry"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {deletingId === id ? 'hourglass_top' : 'delete'}
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EducationCard({ trimester }) {
  const content = trimester === 3
    ? {
        title: 'Understanding 3rd Trimester Weight Gain',
        body: 'During the third trimester, maternal weight gain concentrates around rapid fetal maturation and metabolic reserve support. Here\'s how a typical gain is distributed:',
        items: [
          { icon: 'child_care', color: 'primary', value: '~3.5 kg', label: "Baby's weight", desc: 'Organ, bone and neural sheath growth.' },
          { icon: 'water_drop', color: 'secondary', value: '~2.0 kg', label: 'Blood & fluids', desc: 'Increased plasma volume to nourish the placenta.' },
          { icon: 'vital_signs', color: 'primary', value: '~1.5 kg', label: 'Placenta & amniotic', desc: 'Protective fluid cushion and oxygen exchange.' },
          { icon: 'shield_with_heart', color: 'secondary', value: '~2.0 kg', label: 'Maternal reserves', desc: 'Uterine muscle and post-birth lactation energy.' },
        ],
      }
    : trimester === 2
    ? {
        title: 'Understanding 2nd Trimester Weight Gain',
        body: 'The second trimester is when most women gain steadily — about 0.4 kg per week. Here\'s where it typically goes:',
        items: [
          { icon: 'child_care', color: 'primary', value: '~1.0 kg', label: "Baby's weight", desc: 'Rapid growth and organ development.' },
          { icon: 'water_drop', color: 'secondary', value: '~1.5 kg', label: 'Blood & fluids', desc: 'Blood volume increases to support the placenta.' },
          { icon: 'vital_signs', color: 'primary', value: '~0.8 kg', label: 'Placenta & amniotic', desc: 'Growing placenta and increasing amniotic fluid.' },
          { icon: 'shield_with_heart', color: 'secondary', value: '~1.0 kg', label: 'Maternal reserves', desc: 'Fat stores for third-trimester growth.' },
        ],
      }
    : {
        title: 'Understanding 1st Trimester Weight Gain',
        body: 'Most women gain only 0.5–2 kg in the first trimester. Here\'s what\'s happening in your body:',
        items: [
          { icon: 'child_care', color: 'primary', value: '~30 g', label: "Baby's weight", desc: 'Rapid cell division and organ formation.' },
          { icon: 'water_drop', color: 'secondary', value: '~0.7 kg', label: 'Blood & fluids', desc: 'Blood volume begins to expand early.' },
          { icon: 'vital_signs', color: 'primary', value: '~0.2 kg', label: 'Placenta & amniotic', desc: 'Placenta is forming; amniotic fluid begins.' },
          { icon: 'shield_with_heart', color: 'secondary', value: '~0.6 kg', label: 'Maternal reserves', desc: 'Uterine growth and early fat stores.' },
        ],
      };

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 md:p-8 soft-shadow border border-surface-variant">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary text-[24px]">lightbulb</span>
          </div>
          <div>
            <span className="text-[10px] font-label-md uppercase tracking-wider text-secondary font-bold">
              Educational Insight
            </span>
            <h3 className="text-headline-md font-headline-md text-on-surface">{content.title}</h3>
          </div>
        </div>
        <span className="bg-surface-container-lowest text-on-surface-variant px-3 py-1.5 rounded-full text-label-md font-label-md">
          Based on ACOG / IOM guidelines
        </span>
      </div>

      <p className="text-body-md text-on-surface-variant mb-5 max-w-4xl">{content.body}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {content.items.map((it, i) => (
          <div key={i} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className={`material-symbols-outlined text-[22px] ${it.color === 'secondary' ? 'text-secondary' : 'text-primary'}`}>
                {it.icon}
              </span>
              <span className={`text-headline-sm font-headline-sm ${it.color === 'secondary' ? 'text-secondary' : 'text-primary'}`}>
                {it.value}
              </span>
            </div>
            <h4 className="text-body-sm font-bold text-on-surface mb-1">{it.label}</h4>
            <p className="text-body-sm text-on-surface-variant leading-snug">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}