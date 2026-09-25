// src/pages/ContractionTimer.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { pregnancyApi } from '../api/pregnancy';
import { useAuth } from '../context/AuthContext';
import { formatDate, timeAgo } from '../utils/formatters';

const INTENSITIES = ['Mild', 'Moderate', 'Severe'];
const TRIMESTER_LABEL = ['', '1st', '2nd', '3rd'];

const INTENSITY_STYLE = {
  Mild:     { bg: 'bg-primary-container',    dot: 'bg-primary',         ring: 'bg-primary-fixed' },
  Moderate: { bg: 'bg-secondary',            dot: 'bg-secondary-fixed', ring: 'bg-secondary-fixed' },
  Severe:   { bg: 'bg-error',                dot: 'bg-error-container', ring: 'bg-error-container' },
};

// 5-1-1 clinical threshold
const FIVE_ONE_ONE = { intervalMins: 5, durationSec: 60, continuousMins: 60 };

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

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

// ── Main Page ────────────────────────────────────────────
export default function ContractionTimer() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pregnancy, setPregnancy] = useState(null);
  const [contractions, setContractions] = useState([]);

  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [intensity, setIntensity] = useState('Moderate');
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const startRef = useRef(null);
  const lastEndRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, list] = await Promise.all([
        pregnancyApi.getTracker(),
        pregnancyApi.listContractions().catch(() => []),
      ]);
      setPregnancy(p);
      setContractions(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Could not load contraction timer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isActive]);

  const derived = useMemo(() => calcDerived(pregnancy), [pregnancy]);

  // "Session" = contractions in the last 60 minutes, sorted ascending by start time
  const session = useMemo(() => {
    const cutoff = Date.now() - 60 * 60 * 1000;
    return contractions
      .filter((c) => new Date(c.startTime).getTime() >= cutoff)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [contractions]);

  const latest = contractions[0] || null;

  const sessionCount = session.length;
  const avgDuration = sessionCount > 0
    ? Math.round(session.reduce((s, c) => s + (c.durationSeconds || 0), 0) / sessionCount)
    : 0;
  const avgInterval = sessionCount > 1
    ? Math.round(
        session.reduce((s, c) => s + (c.intervalMinutes || 0), 0) / (sessionCount - 1)
      )
    : (latest?.intervalMinutes || 0);

  const totalSessionMins = sessionCount > 1
    ? Math.round(
        (new Date(session[sessionCount - 1].startTime) - new Date(session[0].startTime)) / 60000
      )
    : 0;

  // Labor-status heuristic — honest, based only on logged data
  const laborStatus = useMemo(() => {
    if (sessionCount < 3 || avgInterval === 0) {
      return { label: 'Gathering data', tone: 'neutral', detail: 'Log a few contractions to see your pattern.' };
    }
    if (avgInterval <= FIVE_ONE_ONE.intervalMins && avgDuration >= FIVE_ONE_ONE.durationSec) {
      return { label: 'Meeting 5-1-1 criteria', tone: 'alert', detail: 'Consider calling your labor ward.' };
    }
    if (avgInterval <= 8) {
      return { label: 'Active phase pattern', tone: 'active', detail: 'Approaching 5-1-1 — keep monitoring.' };
    }
    return { label: 'Early / latent phase', tone: 'neutral', detail: 'Rest, hydrate, and continue tracking.' };
  }, [sessionCount, avgInterval, avgDuration]);

  const freqPct = avgInterval > 0
    ? Math.min(100, Math.max(0, ((10 - avgInterval) / (10 - FIVE_ONE_ONE.intervalMins)) * 100))
    : 0;
  const durPct = avgDuration > 0
    ? Math.min(100, (avgDuration / FIVE_ONE_ONE.durationSec) * 100)
    : 0;

  const handleStart = () => {
    setIsActive(true);
    setSeconds(0);
    setError(null);
    startRef.current = new Date();
  };

  const handleEnd = async () => {
    setIsActive(false);
    if (seconds < 3) { setSeconds(0); return; }
    setSaving(true);
    try {
      const endTime = new Date();
      const startTime = startRef.current || endTime;
      const intervalMinutes = lastEndRef.current
        ? Math.max(0, Math.round((startTime - lastEndRef.current) / 60000))
        : 0;

      const saved = await pregnancyApi.createContraction({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationSeconds: seconds,
        intervalMinutes,
        intensity,
      });
      setContractions((prev) => [saved, ...prev]);
      lastEndRef.current = endTime;
      setSeconds(0);
      setSaveFeedback(true);
      setTimeout(() => setSaveFeedback(false), 2200);
    } catch (err) {
      setError(err.message || 'Could not save contraction');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    setError(null);
  };

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">
          {loading ? (
            <LoadingSpinner label="Loading contraction timer…" />
          ) : error && !pregnancy ? (
            <ErrorState message={error} onRetry={load} />
          ) : !pregnancy ? (
            <NoPregnancyState />
          ) : (
            <div className="flex flex-col gap-6">

              <ContextBanner
                user={user}
                pregnancy={pregnancy}
                derived={derived}
                sessionCount={sessionCount}
              />

              <CurrentContractionCard
                isActive={isActive}
                seconds={seconds}
                intensity={intensity}
                setIntensity={setIntensity}
                saving={saving}
                saveFeedback={saveFeedback}
                error={error}
                onStart={handleStart}
                onEnd={handleEnd}
                onReset={handleReset}
              />

              <StatTiles
                lastDuration={latest?.durationSeconds || 0}
                avgInterval={latest?.intervalMinutes || 0}
                sessionCount={sessionCount}
                totalSessionMins={totalSessionMins}
              />

              <GuidelineCard
                avgInterval={avgInterval}
                avgDuration={avgDuration}
                freqPct={freqPct}
                durPct={durPct}
                laborStatus={laborStatus}
                sessionCount={sessionCount}
              />

              <WaveformChart contractions={session} />

              <HistoryList contractions={contractions} />
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
            timer
          </span>
        </div>
        <h3 className="text-headline-lg font-headline-lg text-primary mb-3">
          Start your pregnancy first
        </h3>
        <p className="text-body-md text-on-surface-variant mb-6">
          Set up your pregnancy tracker to begin timing contractions.
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

function ContextBanner({ user, pregnancy, derived, sessionCount }) {
  const initials = (user?.fullName || 'You')
    .split(' ').map((s) => s[0]).join('').slice(0, 2);

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 soft-shadow border border-surface-variant">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-surface-container-high/40">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-primary/20"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 font-headline-md font-bold">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="bg-primary-fixed-dim text-on-primary-fixed-variant px-2.5 py-0.5 rounded-full text-[10px] font-label-md uppercase tracking-wider">
                {TRIMESTER_LABEL[derived?.trimester || 1]} Trimester
              </span>
              <span className="bg-secondary-fixed text-secondary px-2.5 py-0.5 rounded-full text-[10px] font-label-md font-bold">
                Week {derived?.currentWeek || 0} • Day {derived?.currentDay || 0}
              </span>
            </div>
            <h1 className="text-headline-sm font-headline-sm text-on-surface truncate">
              {user?.fullName || 'Your'}'s Contraction Timer
            </h1>
            <p className="text-body-sm text-on-surface-variant mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-tertiary">calendar_today</span>
                {formatDate(new Date())}
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-secondary font-bold">
                Due {pregnancy.expectedDueDate ? formatDate(pregnancy.expectedDueDate) : '—'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-full">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            sessionCount > 0 ? 'bg-secondary-fixed text-secondary' : 'bg-surface-container-highest text-tertiary'
          }`}>
            <span className="material-symbols-outlined text-[18px]">timer</span>
          </div>
          <div className="text-left">
            <p className="text-label-md font-label-md text-on-surface font-bold">
              {sessionCount > 0 ? `${sessionCount} in last hour` : 'No recent logs'}
            </p>
            <p className="text-label-md text-secondary">
              {sessionCount > 0 ? 'Keep tracking' : 'Start when ready'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pt-4 -mb-1">
        <SubTab to="/kick-counter"       icon="footprint" label="Kick Counter" />
        <SubTab to="/weight-logger"      icon="scale"     label="Weight Tracker" />
        <SubTab active                    icon="timer"     label="Contraction Timer" />
        <SubTab to="/pregnancy"          icon="psychiatry" label="Baby Size & Growth" />
      </div>
    </section>
  );
}

function SubTab({ to, icon, label, active }) {
  const cls = active
    ? 'bg-on-background text-surface-container-lowest shadow-sm'
    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high';

  if (active) {
    return (
      <span className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap flex items-center gap-2 ${cls}`}>
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
        {label} <span className="text-[11px] opacity-70">(Active)</span>
      </span>
    );
  }
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap flex items-center gap-2 transition-colors ${cls}`}
    >
      <span className="material-symbols-outlined text-[16px] text-primary">{icon}</span>
      {label}
    </Link>
  );
}

function CurrentContractionCard({
  isActive, seconds, intensity, setIntensity,
  saving, saveFeedback, error,
  onStart, onEnd, onReset,
}) {
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const display = `${hh}:${mm}:${ss}`;
  const intStyle = INTENSITY_STYLE[intensity] || INTENSITY_STYLE.Moderate;

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-10 soft-shadow border border-surface-variant relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] font-label-md uppercase tracking-wider text-secondary font-bold block">
            Contraction tracker
          </span>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">
            {isActive ? 'Current Contraction' : 'Ready When You Are'}
          </h2>
        </div>

        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-colors ${
          isActive
            ? 'bg-secondary-fixed text-on-secondary-fixed'
            : 'bg-surface-container text-on-surface-variant'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-secondary animate-ping' : 'bg-outline'}`} />
          <span>
            {isActive ? 'Contraction in progress…'
              : saveFeedback ? 'Saved'
              : 'Resting between waves'}
          </span>
        </div>
      </div>

      {error && (
        <div className="relative z-10 mb-4 bg-error-container text-on-error-container px-4 py-3 rounded-xl text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      {/* Big timer */}
      <div className="relative z-10 py-6 flex flex-col items-center justify-center">
        <div className={`absolute w-72 h-72 md:w-80 md:h-80 rounded-full pointer-events-none transition-opacity duration-500 ${
          isActive ? 'bg-secondary-container/20 animate-pulse' : 'bg-surface-container-low/40'
        }`} />
        <div className={`absolute w-56 h-56 md:w-64 md:h-64 rounded-full pointer-events-none transition-colors duration-500 ${
          isActive ? 'bg-secondary-fixed/40' : 'bg-surface-container-high/30'
        }`} />

        <div className="relative z-10 text-center select-none">
          <div className="text-[64px] md:text-[88px] leading-none font-bold text-on-surface tracking-tight">
            {display}
          </div>
          <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest mt-3">
            {isActive ? 'Duration • Wave active' : 'Duration • Resting'}
          </p>
        </div>

        {/* Intensity selector / display */}
        {isActive ? (
          <div className="relative z-10 w-full max-w-xs mt-6 flex items-center justify-center gap-2 text-on-surface-variant text-label-md font-label-md">
            <span>{intensity}</span>
            <div className="flex gap-1.5">
              <span className={`w-6 h-2 rounded-full ${intensity !== 'Severe' ? 'bg-primary-container' : 'bg-surface-container-high'}`} />
              <span className={`w-6 h-2 rounded-full ${intensity !== 'Mild' ? 'bg-secondary' : 'bg-surface-container-high'}`} />
              <span className={`w-6 h-2 rounded-full ${intensity === 'Severe' ? 'bg-error' : 'bg-surface-container-high'}`} />
            </div>
            <span className="font-bold text-secondary">{intensity} wave</span>
          </div>
        ) : (
          <div className="relative z-10 mt-6">
            <p className="text-label-md font-label-md text-on-surface-variant text-center mb-2">
              Intensity for next contraction
            </p>
            <div className="flex gap-2 justify-center">
              {INTENSITIES.map((level) => {
                const s = INTENSITY_STYLE[level];
                const selected = intensity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setIntensity(level)}
                    className={`px-4 py-2 rounded-full text-label-md font-label-md transition-all ${
                      selected
                        ? `${s.bg} text-white shadow-sm`
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Primary action */}
      <div className="relative z-10 pt-4 flex flex-col items-center gap-4">
        <button
          onClick={isActive ? onEnd : onStart}
          disabled={saving}
          className={`w-full max-w-md py-5 px-8 rounded-full text-headline-md font-headline-md tracking-wide shadow-md active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60 ${
            isActive
              ? 'bg-secondary text-on-secondary hover:opacity-95'
              : 'bg-primary text-on-primary hover:bg-on-primary-container'
          }`}
        >
          <span className="material-symbols-outlined text-[28px]">
            {isActive ? 'stop_circle' : 'play_circle'}
          </span>
          {saving ? 'Saving…' : isActive ? 'END CONTRACTION' : 'START CONTRACTION'}
        </button>

        {/* Secondary controls */}
        <div className="flex items-center gap-2.5 pt-2 flex-wrap justify-center">
          <button
            type="button"
            disabled
            title="Pause is not supported while timing a contraction"
            className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md cursor-not-allowed opacity-60 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">pause</span>
            Pause
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={saving || (!isActive && seconds === 0)}
            className="px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">replay</span>
            Reset
          </button>
        </div>

        {saveFeedback && (
          <span className="text-label-md font-label-md text-primary font-bold mt-1">
            Contraction saved ✓
          </span>
        )}
      </div>
    </section>
  );
}

function StatTiles({ lastDuration, avgInterval, sessionCount, totalSessionMins }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-surface-container-lowest rounded-2xl p-4 soft-shadow border border-surface-variant flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[24px]">timer</span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider">
            Last contraction duration
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-lg font-headline-lg text-on-surface">
              {lastDuration || '—'}
              {lastDuration ? ' sec' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-4 soft-shadow border border-surface-variant flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
          <span className="material-symbols-outlined text-[24px]">acute</span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider">
            Contraction frequency
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-lg font-headline-lg text-secondary">
              {avgInterval ? `Every ${avgInterval} min` : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-4 soft-shadow border border-surface-variant flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface shrink-0">
          <span className="material-symbols-outlined text-[24px]">format_list_numbered</span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider">
            Last hour
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-lg font-headline-lg text-on-surface">
              {sessionCount} {sessionCount === 1 ? 'Contraction' : 'Contractions'}
            </span>
          </div>
          <p className="text-[11px] text-tertiary">
            {totalSessionMins > 0 ? `${totalSessionMins} min window` : 'Session window'}
          </p>
        </div>
      </div>
    </section>
  );
}

function GuidelineCard({ avgInterval, avgDuration, freqPct, durPct, laborStatus, sessionCount }) {
  const toneClasses =
    laborStatus.tone === 'alert' ? 'text-error font-bold'
    : laborStatus.tone === 'active' ? 'text-secondary font-bold'
    : 'text-tertiary';

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 soft-shadow border border-surface-variant">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <span className="text-label-md font-label-md uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">info</span>
          Clinical guideline: the 5-1-1 rule
        </span>
        <span className="bg-surface-container-lowest text-on-surface-variant px-2.5 py-1 rounded-full text-label-md font-label-md font-semibold self-start md:self-auto">
          Based on ACOG guidance
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            "When contractions occur every <strong className="text-on-surface font-semibold">5 minutes</strong>,
            last for <strong className="text-on-surface font-semibold">1 full minute</strong> each, and have
            consistently continued for at least <strong className="text-on-surface font-semibold">1 continuous hour</strong>,
            call your hospital or labor ward."
          </p>
          <div className="mt-3 p-3 rounded-md bg-surface-container-lowest flex items-start gap-2 text-on-surface text-body-sm">
            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">bedtime</span>
            <span>
              {sessionCount < 3
                ? 'Log a few contractions to see your pattern.'
                : avgInterval > 5
                ? `Currently ${avgInterval}-minute intervals. Stay hydrated and monitor at home.`
                : `Currently ${avgInterval}-minute intervals with ${avgDuration}s duration — review the rule above.`}
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-label-md font-label-md">
            <span className="text-on-surface font-semibold">Your status</span>
            <span className={toneClasses}>{laborStatus.label}</span>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            {laborStatus.detail}
          </p>

          <div className="space-y-2 pt-1">
            <div>
              <div className="flex justify-between text-[11px] font-label-md text-on-surface-variant mb-1">
                <span>{avgInterval ? `Current: ${avgInterval} min apart` : 'Frequency'}</span>
                <span>Target: {FIVE_ONE_ONE.intervalMins} min apart</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${freqPct}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-label-md text-on-surface-variant mb-1">
                <span>{avgDuration ? `Current: ${avgDuration}s avg` : 'Duration'}</span>
                <span>Target: {FIVE_ONE_ONE.durationSec}s avg</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-500"
                  style={{ width: `${durPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WaveformChart({ contractions }) {
  const W = 760, H = 180;
  const padL = 30, padR = 30, padT = 30, padB = 50;
  const plotW = W - padL - padR;
  const baselineY = H - padB;

  if (!contractions || contractions.length === 0) {
    return (
      <section className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant">
        <div className="mb-2">
          <span className="text-[10px] font-label-md uppercase tracking-wider text-primary font-bold">
            Waveform
          </span>
          <h3 className="text-headline-md font-headline-md text-on-surface">
            Contraction Pattern &amp; Interval Progression
          </h3>
        </div>
        <p className="text-body-sm text-on-surface-variant py-8 text-center">
          Log contractions to see your waveform pattern.
        </p>
      </section>
    );
  }

  const t0 = new Date(contractions[0].startTime).getTime();
  const tLast = contractions[contractions.length - 1];
  const tEnd = new Date(tLast.endTime).getTime();
  const span = Math.max(1, tEnd - t0);

  const xFor = (t) => padL + ((t - t0) / span) * plotW;
  // Peak height: 60s → padT+10, 0s → baseline
  const yForDuration = (sec) => {
    const maxDur = 90;
    const height = Math.min(1, (sec || 0) / maxDur) * (baselineY - padT - 10);
    return baselineY - height;
  };

  // Build path: baseline → peak → baseline for each contraction
  const segments = contractions.map((c, i) => {
    const peakX = xFor(new Date(c.startTime).getTime());
    const peakY = yForDuration(c.durationSeconds);
    const peakHalfWidth = 20; // px
    return { peakX, peakY, duration: c.durationSeconds, interval: c.intervalMinutes, time: new Date(c.startTime), idx: i };
  });

  let path = `M ${padL} ${baselineY}`;
  const circles = [];
  const labels = [];
  const intervalLabels = [];

  segments.forEach((s, i) => {
    const { peakX, peakY, duration, interval, time } = s;
    // curve up to peak
    path += ` C ${peakX - 25} ${baselineY}, ${peakX - 12} ${peakY}, ${peakX} ${peakY}`;
    // curve back down
    path += ` C ${peakX + 12} ${peakY}, ${peakX + 25} ${baselineY}, ${peakX + 30} ${baselineY}`;

    circles.push({ cx: peakX, cy: peakY, isLatest: i === segments.length - 1, duration });

    // Time label below
    labels.push({
      x: peakX,
      y: baselineY + 20,
      text: time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    });

    // Duration label above peak
    labels.push({
      x: peakX,
      y: peakY - 8,
      text: `${duration}s`,
      bold: true,
      color: '#0b1c30',
    });

    // Interval label between this and previous
    if (i > 0 && interval > 0) {
      const prev = segments[i - 1];
      const midX = (prev.peakX + peakX) / 2;
      intervalLabels.push({
        x: midX,
        y: baselineY - 8,
        text: `${interval}m apart`,
      });
    }
  });

  // Close the path
  path += ` L ${padL + plotW} ${baselineY} L ${padL} ${baselineY} Z`;

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 soft-shadow border border-surface-variant">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] font-label-md text-primary uppercase tracking-wider block font-bold">
            Waveform telemetry
          </span>
          <h3 className="text-headline-md font-headline-md text-on-surface">
            Contraction Pattern &amp; Interval Progression
          </h3>
        </div>
        <div className="flex items-center gap-4 text-label-md font-label-md text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span>Duration (sec)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary-container" />
            <span>Interval (min)</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[640px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            <defs>
              <linearGradient id="waveFill" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#8a486f" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#8a486f" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal guides */}
            {[padT + 10, padT + (baselineY - padT) / 2, baselineY].map((y, i) => (
              <line
                key={i}
                x1={padL} x2={padL + plotW}
                y1={y} y2={y}
                stroke="#eff4ff" strokeDasharray={i === 2 ? undefined : '4 4'} strokeWidth="1.5"
              />
            ))}

            {/* Y-axis labels */}
            <text x={20} y={padT + 14} textAnchor="end" fontSize="10" fill="#71787f">90s</text>
            <text x={20} y={(padT + baselineY) / 2 + 4} textAnchor="end" fontSize="10" fill="#71787f">45s</text>
            <text x={20} y={baselineY + 4} textAnchor="end" fontSize="10" fill="#71787f">0s</text>

            {/* Waveform fill */}
            <path d={path} fill="url(#waveFill)" stroke="#8a486f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Peak markers */}
            {circles.map((c, i) => (
              <circle
                key={i}
                cx={c.cx} cy={c.cy}
                r={c.isLatest ? 6 : 5}
                fill={c.isLatest ? '#8a486f' : '#8a486f'}
                stroke="#ffffff"
                strokeWidth={c.isLatest ? 2 : 1}
              />
            ))}

            {/* Duration + time labels */}
            {labels.map((l, i) => (
              <text
                key={i}
                x={l.x} y={l.y}
                textAnchor="middle"
                fontSize={l.bold ? 11 : 10}
                fontWeight={l.bold ? '700' : '400'}
                fill={l.color || '#71787f'}
                fontFamily={l.bold ? 'Quicksand, sans-serif' : 'Nunito Sans, sans-serif'}
              >
                {l.text}
              </text>
            ))}

            {/* Interval labels */}
            {intervalLabels.map((l, i) => (
              <g key={i}>
                <line
                  x1={l.x - 25} x2={l.x + 25}
                  y1={baselineY - 18} y2={baselineY - 18}
                  stroke="#76b6e3" strokeDasharray="3 3" strokeWidth="2"
                />
                <text
                  x={l.x} y={baselineY - 24}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#17648d"
                  fontFamily="Nunito Sans, sans-serif"
                >
                  {l.text}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-on-surface-variant text-label-md font-label-md gap-2">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-primary">trending_up</span>
          {contractions.length < 2
            ? 'Log more contractions to see a trend.'
            : `Tracking ${contractions.length} contractions in the last hour.`}
        </span>
        <span className="text-tertiary">
          {contractions.length} data {contractions.length === 1 ? 'point' : 'points'}
        </span>
      </div>
    </section>
  );
}

function HistoryList({ contractions }) {
  const shown = contractions.slice(0, 10);

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-[10px] font-label-md uppercase tracking-wider text-tertiary">
            History
          </span>
          <h3 className="text-headline-sm font-headline-sm text-on-surface">
            Contraction Log
          </h3>
        </div>
        <span className="text-label-md text-on-surface-variant">
          {contractions.length} total
        </span>
      </div>

      {shown.length === 0 ? (
        <p className="text-body-md text-on-surface-variant text-center py-6">
          No contractions logged yet. Start a session above.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {shown.map((c) => {
            const s = INTENSITY_STYLE[c.intensity] || INTENSITY_STYLE.Mild;
            return (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-full ${s.ring} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-[20px] text-secondary">timer</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-md font-semibold text-on-surface">
                      {c.durationSeconds} sec
                    </p>
                    <p className="text-body-sm text-on-surface-variant truncate">
                      {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' • '}
                      {timeAgo(c.startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {c.intervalMinutes > 0 && (
                    <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-label-md font-label-md">
                      Interval: {c.intervalMinutes}m
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-label-md font-label-md ${
                    c.intensity === 'Severe'
                      ? 'bg-error-container text-on-error-container'
                      : c.intensity === 'Moderate'
                      ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                      : 'bg-primary-fixed text-on-primary-fixed-variant'
                  }`}>
                    {c.intensity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Care team card */}
      <div className="mt-6 bg-secondary-fixed/40 border-l-4 border-secondary rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">support_agent</span>
          <h4 className="text-body-md font-bold text-on-secondary-fixed">
            When to contact your care team
          </h4>
        </div>
        <ul className="space-y-1.5 text-body-sm text-on-surface mb-3">
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 shrink-0">check_box</span>
            <span>Contractions meeting the 5-1-1 rule.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 shrink-0">check_box</span>
            <span>Bleeding, fluid leakage, or reduced fetal movement.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 shrink-0">check_box</span>
            <span>Severe pain, dizziness, or if in doubt — always call.</span>
          </li>
        </ul>
        <div className="flex items-center justify-between pt-2 border-t border-secondary-container">
          <span className="text-label-md font-label-md text-secondary font-bold">
            Your logs are self-reported
          </span>
          <Link
            to="/emergency"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-on-secondary text-label-md font-label-md hover:bg-on-secondary-fixed-variant transition-all"
          >
            <span className="material-symbols-outlined text-[15px]">emergency</span>
            Emergency
          </Link>
        </div>
      </div>
    </section>
  );
}