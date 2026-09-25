// src/pages/KickCounter.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { pregnancyApi } from '../api/pregnancy';
import { useAuth } from '../context/AuthContext';
import { formatDate, timeAgo } from '../utils/formatters';
import { getWeekData } from '../data/pregnancyWeeks';

const GOAL = 10;

// ── Helpers ──────────────────────────────────────────────
function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
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

const TRIMESTER_LABEL = ['', '1st', '2nd', '3rd'];

function isSameDay(a, b) {
  const x = new Date(a), y = new Date(b);
  return x.getFullYear() === y.getFullYear() &&
         x.getMonth() === y.getMonth() &&
         x.getDate() === y.getDate();
}

function groupByDay(kicks) {
  const map = new Map();
  kicks.forEach((k) => {
    const d = new Date(k.timestamp);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    const entry = map.get(key) || { date: d, total: 0, sessions: [] };
    entry.total += k.count || 0;
    entry.sessions.push(k);
    map.set(key, entry);
  });
  return [...map.values()].sort((a, b) => a.date - b.date);
}

// ── Main Page ────────────────────────────────────────────
export default function KickCounter() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pregnancy, setPregnancy] = useState(null);
  const [history, setHistory] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const startTimeRef = useRef(null);

  // ── Load ────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, kicks] = await Promise.all([
        pregnancyApi.getTracker(),
        pregnancyApi.listKicks().catch(() => []),
      ]);
      setPregnancy(p);
      setHistory(Array.isArray(kicks) ? kicks : []);
    } catch (err) {
      setError(err.message || 'Could not load kick counter');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  // ── Timer ───────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const derived = useMemo(() => calcDerived(pregnancy), [pregnancy]);
  const weekData = useMemo(
    () => getWeekData(derived?.currentWeek || 4),
    [derived]
  );

  // Today's saved kicks
  const todaySessions = useMemo(
    () => history.filter((h) => isSameDay(h.timestamp, new Date())),
    [history]
  );
  const todaySavedCount = todaySessions.reduce((s, h) => s + (h.count || 0), 0);
  const todayTotal = todaySavedCount + (isRunning ? count : 0);

  // Last 7 days
  const last7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push({ date: d, total: 0, sessions: [] });
    }
    const byDay = groupByDay(history);
    const byKey = new Map(byDay.map((d) => [d.date.toISOString().slice(0, 10), d]));
    return days.map((d) => {
      const match = byKey.get(d.date.toISOString().slice(0, 10));
      return match ? { ...d, ...match } : d;
    });
  }, [history]);

  // Stats
  const completedSessions = history.filter((h) => h.count >= GOAL && h.durationMinutes > 0);
  const avgTimeTo10 = completedSessions.length
    ? Math.round(completedSessions.reduce((s, h) => s + h.durationMinutes, 0) / completedSessions.length)
    : null;

  const peakWindow = useMemo(() => {
    if (!history.length) return null;
    const buckets = new Array(12).fill(0); // 2-hour buckets (0-2, 2-4, …)
    history.forEach((h) => {
      const hr = new Date(h.timestamp).getHours();
      buckets[Math.floor(hr / 2)] += h.count || 0;
    });
    const max = Math.max(...buckets);
    if (max === 0) return null;
    const idx = buckets.indexOf(max);
    const fmt = (h) => {
      const suffix = h >= 12 ? 'PM' : 'AM';
      const hh = h % 12 === 0 ? 12 : h % 12;
      return `${hh} ${suffix}`;
    };
    return `${fmt(idx * 2)} – ${fmt((idx * 2 + 2) % 24)}`;
  }, [history]);

  const consistency = useMemo(() => {
    const daysWithSessions = last7.filter((d) => d.sessions.length > 0).length;
    return Math.round((daysWithSessions / 7) * 100);
  }, [last7]);

  const targetMetToday = todayTotal >= GOAL;

  // ── Actions ─────────────────────────────────────────────
  const handleStart = () => {
    setCount(0);
    setElapsed(0);
    setIsRunning(true);
    setError(null);
    startTimeRef.current = new Date();
  };

  const handleKick = () => {
    if (!isRunning) return;
    setCount((c) => c + 1);
  };

  const handleEnd = async () => {
    if (!isRunning) return;
    setIsRunning(false);
    if (count === 0) {
      setCount(0);
      setElapsed(0);
      return;
    }
    setSaving(true);
    try {
      const durationMinutes = Math.max(1, Math.round(elapsed / 60));
      const kick = await pregnancyApi.createKick({
        count,
        durationMinutes,
        timestamp: startTimeRef.current?.toISOString(),
      });
      setHistory((prev) => [kick, ...prev]);
      setSaveFeedback(true);
      setTimeout(() => setSaveFeedback(false), 2200);
      setCount(0);
      setElapsed(0);
    } catch (err) {
      setError(err.message || 'Could not save session');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setCount(0);
    setElapsed(0);
    setIsRunning(false);
    setError(null);
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">
          {loading ? (
            <LoadingSpinner label="Loading kick counter…" />
          ) : error && !pregnancy ? (
            <ErrorState message={error} onRetry={load} />
          ) : !pregnancy ? (
            <NoPregnancyState />
          ) : (
            <div className="flex flex-col gap-8">

              <ContextBanner
                user={user}
                pregnancy={pregnancy}
                derived={derived}
                targetMet={targetMetToday}
                todayTotal={todayTotal}
              />

              <TodaySession
                isRunning={isRunning}
                count={count}
                elapsed={elapsed}
                todayTotal={todayTotal}
                todaySavedCount={todaySavedCount}
                saving={saving}
                saveFeedback={saveFeedback}
                error={error}
                onStart={handleStart}
                onKick={handleKick}
                onEnd={handleEnd}
                onReset={handleReset}
              />

              <WeeklyChart last7={last7} currentDayIndex={6} />

              <StatTiles
                avgTimeTo10={avgTimeTo10}
                peakWindow={peakWindow}
                consistency={consistency}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <BabyDevelopmentCard week={derived?.currentWeek || 0} weekData={weekData} />
                <RecentSessionsCard history={history} />
                <CareTeamCard user={user} />
              </div>

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
            footprint
          </span>
        </div>
        <h3 className="text-headline-lg font-headline-lg text-primary mb-3">
          Start your pregnancy first
        </h3>
        <p className="text-body-md text-on-surface-variant mb-6">
          Set up your pregnancy tracker to begin counting fetal movements.
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

function ContextBanner({ user, pregnancy, derived, targetMet, todayTotal }) {
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
              {user?.fullName || 'Your'}'s Kick Counter
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
            targetMet ? 'bg-primary-fixed text-primary' : 'bg-surface-container-highest text-tertiary'
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {targetMet ? 'check_circle' : 'footprint'}
            </span>
          </div>
          <div className="text-left">
            <p className="text-label-md font-label-md text-on-surface font-bold">
              {targetMet ? 'Kick target met' : 'Kick target in progress'}
            </p>
            <p className="text-label-md text-secondary">
              {todayTotal} of {GOAL} today
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pt-4 -mb-1">
        <SubTab active icon="footprint" label="Kick Counter" />
        <SubTab to="/weight-logger" icon="scale" label="Weight Tracker" />
        <SubTab to="/contraction-timer" icon="timer" label="Contraction Timer" />
        <SubTab to="/pregnancy" icon="psychiatry" label="Baby Size & Growth" />
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

function TodaySession({
  isRunning, count, elapsed, todayTotal, todaySavedCount,
  saving, saveFeedback, error,
  onStart, onKick, onEnd, onReset,
}) {
  // SVG ring progress — circumference 2πr = 2π * 70 ≈ 439.82
  const CIRC = 439.82;
  const pct = Math.min(todayTotal / GOAL, 1);
  const dashOffset = CIRC - pct * CIRC;

  const hh = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  const displayElapsed = `${hh}:${mm}:${ss}`;

  const sessionStart = isRunning
    ? new Date(Date.now() - elapsed * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 soft-shadow border border-surface-variant">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-container pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-label-md font-label-md uppercase tracking-wider text-primary font-bold">
              Movement Session
            </span>
            {isRunning && (
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[10px] font-label-md font-bold">
                Running
              </span>
            )}
            {saveFeedback && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[10px] font-label-md font-bold">
                Saved
              </span>
            )}
          </div>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg font-bold text-on-surface">
            Today's Kick Count
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1 max-w-2xl">
            Tap the button each time you feel your baby move. Recommended: track 10 distinct movements within 2 hours.
          </p>
        </div>
        <Link
          to="/education"
          className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0"
          aria-label="Guidance"
          title="Movement guidance"
        >
          <span className="material-symbols-outlined text-[20px]">info</span>
        </Link>
      </div>

      {error && (
        <div className="mt-4 bg-error-container text-on-error-container px-4 py-3 rounded-xl text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      {/* Counter */}
      <div className="my-6 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-secondary-fixed/40 border border-secondary-container mb-6 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
          <span className="text-headline-sm font-headline-sm text-secondary font-bold">
            {todayTotal} Movements
          </span>
          <span className="text-tertiary text-body-sm">(Goal: {GOAL} kicks)</span>
        </div>

        <div className="relative flex items-center justify-center my-4">
          {/* Decorative pulses */}
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-primary-fixed/30 animate-pulse pointer-events-none -z-10" />
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-secondary-fixed/20 pointer-events-none -z-10" />

          {/* Progress ring */}
          <svg className="w-60 h-60 sm:w-72 sm:h-72 -rotate-90 absolute" viewBox="0 0 160 160">
            <circle
              cx="80" cy="80" r="70"
              fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
              className="text-surface-container-highest"
            />
            <circle
              cx="80" cy="80" r="70"
              fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              className="text-primary transition-all duration-700 ease-out"
            />
          </svg>

          {/* Tappable button */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md group-hover:bg-primary/30 transition duration-300" />
            <button
              onClick={isRunning ? onKick : onStart}
              className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-on-background text-surface-container-lowest flex flex-col items-center justify-center p-5 shadow-xl hover:shadow-2xl transition-all duration-150 transform active:scale-95 focus:outline-none"
            >
              <span className="material-symbols-outlined text-[40px] mb-1">
                {isRunning ? 'footprint' : 'play_arrow'}
              </span>
              <span className="text-headline-lg font-headline-lg tracking-wide text-center leading-tight">
                {isRunning ? <>COUNT<br />KICK</> : <>START<br />SESSION</>}
              </span>
              <span className="text-label-md text-[12px] text-surface-container-highest mt-1.5 opacity-80">
                {isRunning ? '+ Tap each flutter' : 'Begin tracking'}
              </span>
            </button>
          </div>
        </div>

        {saveFeedback && (
          <span className="text-label-md font-label-md text-primary font-bold mt-3">
            Movement recorded! 🎉
          </span>
        )}
      </div>

      {/* Session strip */}
      <div className="bg-surface-container-low rounded-xl p-4 sm:p-5 mb-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 w-full lg:w-auto text-left">
            <div>
              <p className="text-[10px] font-label-md text-tertiary uppercase tracking-wider">Session start</p>
              <p className="text-headline-md font-headline-md text-on-surface mt-0.5">
                {sessionStart}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-label-md text-tertiary uppercase tracking-wider">Current session</p>
              <div className="flex items-center gap-2 mt-0.5">
                {isRunning && <span className="inline-block w-2.5 h-2.5 rounded-full bg-error animate-pulse" />}
                <p className="text-headline-md font-headline-md text-on-surface">
                  {isRunning ? displayElapsed : '00:00:00'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-label-md text-tertiary uppercase tracking-wider">Status</p>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-label-md font-label-md font-bold inline-flex items-center gap-1.5 ${
                  isRunning
                    ? 'bg-primary-fixed text-on-primary-fixed-variant'
                    : 'bg-surface-container text-on-surface-variant'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-primary' : 'bg-outline'}`} />
                  {isRunning ? 'Active' : 'Idle'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:justify-end">
            {!isRunning && (
              <button
                onClick={onStart}
                disabled={saving}
                className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm font-semibold transition-all disabled:opacity-60"
              >
                {todaySavedCount > 0 ? 'New Session' : 'Start Session'}
              </button>
            )}
            {isRunning && (
              <>
                <button
                  onClick={() => {}}
                  disabled
                  title="Pause not yet supported"
                  className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface-variant font-body-sm font-semibold cursor-not-allowed opacity-60"
                >
                  Pause
                </button>
                <button
                  onClick={onEnd}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant font-body-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'End Session'}
                </button>
              </>
            )}
            {!isRunning && (count > 0 || elapsed > 0) && (
              <button
                onClick={onReset}
                className="px-5 py-2.5 rounded-full border-2 border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clinical insight */}
      <div className="p-4 rounded-xl bg-surface-container flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
          lightbulb
        </span>
        <div>
          <p className="text-[10px] font-label-md uppercase text-primary font-bold tracking-wider">
            Clinical insight
          </p>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Babies have natural sleep-wake cycles lasting 20–40 minutes. If movement feels unusually
            reduced, try drinking cold water, lying on your left side, and counting again for 1 hour.
          </p>
        </div>
      </div>
    </section>
  );
}

function WeeklyChart({ last7 }) {
  const W = 1000, H = 220;
  const padL = 40, padR = 40, padT = 20, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const maxY = Math.max(15, ...last7.map((d) => d.total)) + 2;
  const xAt = (i) => padL + (i / (last7.length - 1)) * plotW;
  const yAt = (v) => padT + (1 - v / maxY) * plotH;

  const points = last7.map((d, i) => ({ x: xAt(i), y: yAt(d.total), ...d }));
  const linePts = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPts = `${padL},${padT + plotH} ${linePts} ${padL + plotW},${padT + plotH}`;

  const goalY = yAt(GOAL);
  const todayIdx = last7.length - 1;

  const labels = last7.map((d) =>
    d.date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })
  );

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <span className="text-[10px] font-label-md uppercase tracking-wider text-tertiary">
            Weekly telemetry
          </span>
          <h3 className="text-headline-md font-headline-md text-on-surface">
            Daily Fetal Movement (Past 7 Days)
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-label-md text-on-surface-variant">
            <span className="w-3 h-3 rounded-full bg-primary" />
            Daily total
          </div>
          <div className="flex items-center gap-1.5 text-label-md text-secondary">
            <span className="w-5 h-0.5 bg-secondary" />
            Goal ({GOAL})
          </div>
        </div>
      </div>

      <div className="w-full relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="kickGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#76b6e3" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#76b6e3" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Goal line */}
          <line
            x1={padL} x2={padL + plotW}
            y1={goalY} y2={goalY}
            stroke="#8a486f" strokeDasharray="4 4" strokeOpacity="0.75" strokeWidth="1.5"
          />
          <text x={padL + plotW - 4} y={goalY - 6} textAnchor="end" fontSize="12" fill="#8a486f" fontWeight="700">
            Goal: {GOAL}
          </text>

          {/* Gridlines */}
          {[0.33, 0.66].map((t, i) => (
            <line
              key={i}
              x1={padL} x2={padL + plotW}
              y1={padT + t * plotH} y2={padT + t * plotH}
              stroke="#d3e4fe" strokeWidth="0.8"
            />
          ))}

          {/* Area + line */}
          {last7.length > 1 && (
            <>
              <polygon fill="url(#kickGrad)" points={areaPts} />
              <polyline
                points={linePts}
                fill="none" stroke="#17648d"
                strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </>
          )}

          {/* Points */}
          {points.map((p, i) => {
            const isToday = i === todayIdx;
            return (
              <g key={i}>
                <circle
                  cx={p.x} cy={p.y}
                  r={isToday ? 7.5 : 5.5}
                  fill={isToday ? '#17648d' : '#ffffff'}
                  stroke="#17648d"
                  strokeWidth={isToday ? 3 : 3}
                  className={isToday ? 'animate-pulse' : ''}
                />
                {p.total > 0 && (
                  <text
                    x={p.x}
                    y={p.y - 14}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={isToday ? '#17648d' : '#40484e'}
                  >
                    {p.total}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="flex justify-between px-4 text-[11px] font-label-md text-tertiary pt-2">
          {labels.map((l, i) => (
            <span key={i} className={i === todayIdx ? 'text-primary font-bold' : ''}>
              {i === todayIdx ? `Today (${last7[i].total})` : l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatTiles({ avgTimeTo10, peakWindow, consistency }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-2xl bg-surface-container-lowest soft-shadow border border-surface-variant">
        <span className="text-[10px] font-label-md uppercase tracking-wider text-tertiary">
          Avg. time to {GOAL}
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
          <span className="text-headline-sm font-headline-sm text-on-surface">
            {avgTimeTo10 != null ? `${avgTimeTo10} mins` : '—'}
          </span>
        </div>
        <p className="text-body-sm text-[12px] text-on-surface-variant mt-0.5">
          {avgTimeTo10 != null ? 'Across completed sessions' : 'Complete a session to see this'}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-surface-container-lowest soft-shadow border border-surface-variant">
        <span className="text-[10px] font-label-md uppercase tracking-wider text-tertiary">
          Peak active window
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="material-symbols-outlined text-secondary text-[18px]">bedtime</span>
          <span className="text-headline-sm font-headline-sm text-on-surface">
            {peakWindow || '—'}
          </span>
        </div>
        <p className="text-body-sm text-[12px] text-on-surface-variant mt-0.5">
          {peakWindow ? 'Where most movements cluster' : 'Log more sessions to detect'}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-surface-container-lowest soft-shadow border border-surface-variant">
        <span className="text-[10px] font-label-md uppercase tracking-wider text-tertiary">
          Consistency (last 7 days)
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="material-symbols-outlined text-primary text-[18px]">favorite</span>
          <span className="text-headline-sm font-headline-sm text-on-surface">
            {consistency}%
          </span>
        </div>
        <p className="text-body-sm text-[12px] text-on-surface-variant mt-0.5">
          Days you logged any movement
        </p>
      </div>
    </section>
  );
}

function BabyDevelopmentCard({ week, weekData }) {
  const [imgError, setImgError] = useState(false);

  const weightDisplay =
    weekData.weightG >= 1000
      ? `${(weekData.weightG / 1000).toFixed(2)} kg`
      : `${weekData.weightG} g`;

  return (
    <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center text-center sm:text-left lg:text-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-inner shrink-0 bg-surface-container-high flex items-center justify-center">
          {imgError ? (
            <span className="text-4xl">{weekData.emoji || '🌱'}</span>
          ) : (
            <img
              src={`https://loremflickr.com/200/200/${weekData.imageTag}`}
              alt={weekData.size}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          )}
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start lg:justify-center gap-1.5 text-secondary font-bold text-[11px] font-label-md uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[14px]">child_care</span>
            Baby's development • Week {week}
          </div>
          <h3 className="text-headline-sm font-headline-sm text-on-surface">
            Size of a {weekData.size}
          </h3>
          <p className="text-body-sm text-body-sm text-on-surface-variant mt-2">
            {weekData.description}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-surface-container flex items-center justify-between text-tertiary text-[11px] font-label-md">
        <span>Weight: ~{weightDisplay}</span>
        <span>Length: ~{weekData.lengthCm} cm</span>
      </div>
    </div>
  );
}

function RecentSessionsCard({ history }) {
  const recent = history.slice(0, 3);

  return (
    <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-label-md uppercase tracking-wider text-tertiary">
            History
          </span>
          <h3 className="text-headline-sm font-headline-sm text-on-surface">
            Recent Kick Sessions
          </h3>
        </div>
        {history.length > 3 && (
          <span className="text-label-md font-label-md text-primary font-bold">
            {history.length} total
          </span>
        )}
      </div>

      {recent.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant text-center py-6">
          No sessions recorded yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {recent.map((h, idx) => {
            const isFirst = idx === 0;
            const metGoal = h.count >= GOAL;
            return (
              <div
                key={h.id || idx}
                className={`p-3 rounded-xl flex items-center justify-between ${
                  isFirst
                    ? 'bg-surface-container-low border-l-4 border-primary'
                    : 'bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isFirst ? 'bg-primary-fixed text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {metGoal ? 'check_circle' : 'footprint'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-sm font-semibold text-on-surface truncate">
                      {timeAgo(h.timestamp)}
                    </p>
                    <p className="text-[11px] text-tertiary truncate">
                      {h.durationMinutes} min • {metGoal ? 'Goal met' : 'Short session'}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-body-sm font-bold ${metGoal ? 'text-primary' : 'text-on-surface'}`}>
                    {h.count} kicks
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CareTeamCard({ user }) {
  return (
    <div className="lg:col-span-4 bg-secondary-fixed/40 rounded-2xl p-6 soft-shadow border-l-4 border-secondary flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-secondary text-[22px]">support_agent</span>
          <h3 className="text-headline-sm font-headline-sm text-on-secondary-fixed">
            When to contact your care team
          </h3>
        </div>
        <p className="text-body-sm text-on-surface-variant mb-3">
          Never hesitate to reach out. Trust your instincts if you notice any of these signs:
        </p>
        <ul className="space-y-2 text-body-sm text-on-surface mb-4">
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 shrink-0">check_box</span>
            <span>Fewer than 10 movements over 2 hours, quiet on your side.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 shrink-0">check_box</span>
            <span>Sudden reduction in your baby's usual daily rhythm.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 shrink-0">check_box</span>
            <span>Abdominal discomfort, fluid leak, or dizziness.</span>
          </li>
        </ul>
      </div>
      <div className="pt-3 border-t border-secondary-container flex items-center justify-between">
        <span className="text-label-md font-label-md text-secondary font-bold">
          Contact emergency services if severe
        </span>
        <Link
          to="/emergency"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-on-secondary text-[12px] font-label-md hover:bg-on-secondary-fixed-variant transition-all"
        >
          <span className="material-symbols-outlined text-[15px]">emergency</span>
          Emergency
        </Link>
      </div>
    </div>
  );
}