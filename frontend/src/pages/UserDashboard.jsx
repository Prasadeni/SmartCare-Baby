// src/pages/UserDashboard.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { useAuth } from '../context/AuthContext';
import { babiesApi } from '../api/babies';
import { pregnancyApi } from '../api/pregnancy';
import { symptomsApi, mchatApi, milestonesApi } from '../api/assessments';
import { getWeekData } from '../data/pregnancyWeeks';
import { formatAge, formatDate, formatWeight, getInitial, timeAgo } from '../utils/formatters';

function calcWeekFromDueDate(dueDateStr) {
  if (!dueDateStr) return null;
  const due = new Date(dueDateStr);
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

const TIP_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const EVENT_ICONS = {
  symptom:   { icon: 'stethoscope',    bg: 'bg-primary-fixed',     fg: 'text-primary' },
  mchat:     { icon: 'psychology_alt', bg: 'bg-secondary-fixed',   fg: 'text-secondary' },
  milestone: { icon: 'flag',           bg: 'bg-primary-fixed',     fg: 'text-primary' },
  weight:    { icon: 'monitor_weight', bg: 'bg-secondary-fixed',   fg: 'text-secondary' },
  kick:      { icon: 'footprint',      bg: 'bg-primary-fixed',     fg: 'text-primary' },
  note:      { icon: 'edit_note',      bg: 'bg-tertiary-fixed',    fg: 'text-tertiary' },
};

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [babies, setBabies] = useState([]);
  const [pregnancy, setPregnancy] = useState(null);
  const [activity, setActivity] = useState([]);

  const isMother = user?.role === 'PregnantMother';

  const greetingKey = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'goodMorning';
    if (h < 18) return 'goodAfternoon';
    return 'goodEvening';
  }, []);

  const tipKey = TIP_KEYS[new Date().getDay() % 7];

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [babyList, preg] = await Promise.all([
        babiesApi.list().catch(() => []),
        isMother ? pregnancyApi.getTracker().catch(() => null) : Promise.resolve(null),
      ]);
      setBabies(babyList || []);
      setPregnancy(preg || null);

      const feed = [];
      const babiesToScan = (babyList || []).slice(0, 3);
      const babyPromises = [];

      babiesToScan.forEach((b) => {
        babyPromises.push(
          symptomsApi.history(b.id).catch(() => []).then((list) =>
            list.map((x) => ({
              type: 'symptom',
              date: x.assessedAt,
              babyName: b.name,
              text: `${x.riskLevel === 'Red' ? 'High' : x.riskLevel === 'Yellow' ? 'Moderate' : 'Low'} risk symptom check`,
              meta: `Score ${x.totalScore}`,
            }))
          )
        );
        babyPromises.push(
          mchatApi.list(b.id).catch(() => []).then((list) =>
            list.map((x) => ({
              type: 'mchat',
              date: x.assessedAt,
              babyName: b.name,
              text: `M-CHAT-R screening — ${x.riskLevel} risk`,
              meta: `Score ${x.totalRiskScore}`,
            }))
          )
        );
        babyPromises.push(
          milestonesApi.list(b.id).catch(() => []).then((list) =>
            list.map((x) => ({
              type: 'milestone',
              date: x.assessedAt,
              babyName: b.name,
              text: `Milestone check — ${x.percentAchieved}% achieved`,
              meta: x.totalDelays > 0 ? `${x.totalDelays} delayed` : 'All on track',
            }))
          )
        );
      });

      if (isMother && preg) {
        babyPromises.push(
          pregnancyApi.listWeightLogs().catch(() => []).then((list) =>
            list.slice(0, 3).map((x) => ({
              type: 'weight',
              date: x.logDate,
              babyName: null,
              text: `Logged weight — ${x.weightKg} kg`,
              meta: `Week ${x.gestationalAgeWeeks}`,
            }))
          )
        );
        babyPromises.push(
          pregnancyApi.listKicks().catch(() => []).then((list) =>
            list.slice(0, 3).map((x) => ({
              type: 'kick',
              date: x.timestamp,
              babyName: null,
              text: `Kick session — ${x.count} movements`,
              meta: `${x.durationMinutes} min`,
            }))
          )
        );
      }

      const results = await Promise.all(babyPromises);
      results.forEach((list) => feed.push(...list));
      feed.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivity(feed.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Could not load your data');
    } finally {
      setLoading(false);
    }
  }, [isMother]);

  useEffect(() => { load(); }, [load]);

  const hasContent = babies.length > 0 || !!pregnancy;
  const derived = useMemo(() => calcWeekFromDueDate(pregnancy?.expectedDueDate), [pregnancy]);

  return (
    <>
      <div className="min-h-screen overflow-x-hidden font-body-md bg-background">
        <DashboardNavbar activePage="dashboard" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10 pb-32">
          <section className="mb-6">
            <div className="flex items-center gap-2 text-body-sm text-on-surface-variant mb-2">
              <span className="material-symbols-outlined text-[16px] text-primary">wb_sunny</span>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface flex items-center gap-2 mb-1">
              {t(`dashboard.${greetingKey}`)}, {user?.fullName?.split(' ')[0] || ''}
              <span className="material-symbols-outlined text-secondary-container text-[32px] md:text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              {hasContent ? t('dashboard.familyOverview') : t('dashboard.getStarted')}
            </p>
          </section>

          {loading ? (
            <LoadingSpinner label={t('dashboard.loadingFamily')} />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : !hasContent ? (
            <EmptyHome navigate={navigate} isMother={isMother} t={t} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 flex flex-col gap-6">

                {isMother && pregnancy && derived && (
                  <PregnancyCard pregnancy={pregnancy} derived={derived} navigate={navigate} t={t} />
                )}

                {isMother && !pregnancy && (
                  <section className="bg-secondary-container rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_rgba(138,72,111,0.08)]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            pregnant_woman
                          </span>
                        </div>
                        <div>
                          <p className="text-label-md font-label-md uppercase tracking-wider text-on-secondary-container">
                            {t('dashboard.activePregnancy')}
                          </p>
                          <h3 className="text-headline-md font-headline-md text-on-surface">
                            {t('dashboard.trackPregnancy')}
                          </h3>
                          <p className="text-body-sm text-on-surface-variant">
                            {t('dashboard.trackPregnancyDesc')}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/pregnancy"
                        className="bg-secondary text-on-secondary px-6 py-3 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all duration-200 self-start md:self-auto whitespace-nowrap"
                      >
                        + {t('dashboard.addPregnancy')}
                      </Link>
                    </div>
                  </section>
                )}

                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-headline-md font-headline-md text-on-surface">
                      {t('dashboard.myBabies')}{' '}
                      {babies.length > 0 && (
                        <span className="text-on-surface-variant text-body-md font-normal">({babies.length})</span>
                      )}
                    </h3>
                    <Link
                      to="/add-baby"
                      className="flex items-center gap-1 text-primary font-label-md text-label-md hover:underline transition-all duration-200"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      {t('dashboard.addBaby')}
                    </Link>
                  </div>

                  {babies.length === 0 ? (
                    <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(118,182,227,0.05)] text-center">
                      <p className="text-body-md text-on-surface-variant mb-4">{t('dashboard.noBabiesYet')}</p>
                      <Link
                        to="/add-baby"
                        className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all duration-200"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        {t('dashboard.addFirstBaby')}
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {babies.map((baby) => (
                        <BabyCard key={baby.id} baby={baby} navigate={navigate} t={t} />
                      ))}
                    </div>
                  )}
                </section>

                <section className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-headline-sm font-headline-sm text-on-surface">{t('dashboard.recentActivity')}</h3>
                    <Link to="/reports" className="text-primary text-label-md font-label-md hover:underline">
                      {t('dashboard.viewReports')}
                    </Link>
                  </div>

                  {activity.length === 0 ? (
                    <p className="text-body-sm text-on-surface-variant text-center py-6">
                      {t('dashboard.noActivity')}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {activity.map((ev, idx) => {
                        const meta = EVENT_ICONS[ev.type] || EVENT_ICONS.note;
                        return (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full ${meta.bg} flex items-center justify-center shrink-0`}>
                              <span className={`material-symbols-outlined text-[20px] ${meta.fg}`}>
                                {meta.icon}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-body-sm font-semibold text-on-surface truncate">
                                {ev.text}
                                {ev.babyName && (
                                  <span className="text-on-surface-variant font-normal"> · {ev.babyName}</span>
                                )}
                              </p>
                              <p className="text-label-md text-on-surface-variant">
                                {ev.meta} · {timeAgo(ev.date)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              <div className="md:col-span-4 flex flex-col gap-6">
                <section className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(118,182,227,0.05)]">
                  <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">{t('dashboard.quickActions')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <QuickAction to="/symptoms" icon="stethoscope" label={t('actions.symptoms')} />
                    <QuickAction to="/milestones" icon="flag" label={t('actions.milestones')} />
                    <QuickAction to="/mchat" icon="psychology_alt" label={t('actions.mchat')} />
                    <QuickAction to="/growth" icon="straighten" label={t('actions.growth')} />
                    <QuickAction to="/vaccinations" icon="vaccines" label={t('actions.vaccines')} />
                    <QuickAction to="/specialists" icon="medical_information" label={t('actions.specialists')} />
                  </div>
                </section>

                <section className="bg-secondary-fixed rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(138,72,111,0.08)]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      lightbulb
                    </span>
                    <h3 className="text-headline-sm font-headline-sm text-on-surface">{t('dashboard.todayTip')}</h3>
                  </div>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    {t(`tips.${tipKey}`)}
                  </p>
                </section>
              </div>
            </div>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}

function PregnancyCard({ pregnancy, derived, navigate, t }) {
  const weekData = getWeekData(derived.currentWeek);
  const [imgErr, setImgErr] = useState(false);
  const progressPct = Math.min(100, (derived.currentWeek / 40) * 100);

  const weightDisplay =
    weekData.weightG >= 1000
      ? `${(weekData.weightG / 1000).toFixed(2)} kg`
      : `${weekData.weightG} g`;

  return (
    <section className="relative bg-gradient-to-br from-secondary-container to-secondary-fixed rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_rgba(138,72,111,0.1)] overflow-hidden">
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-secondary/10 rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                pregnant_woman
              </span>
            </div>
            <div>
              <p className="text-label-md font-label-md uppercase tracking-wider text-on-secondary-fixed-variant">
                {t('dashboard.activePregnancy')}
              </p>
              <h3 className="text-headline-md font-headline-md text-on-surface">
                {t('dashboard.week')} {derived.currentWeek}, {t('dashboard.day')} {derived.currentDay}
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                {derived.daysToGo} {t('dashboard.daysToGo')} · {t('dashboard.due')} {formatDate(pregnancy.expectedDueDate)}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/pregnancy')}
            className="bg-secondary text-on-secondary px-6 py-3 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all duration-200 self-start md:self-auto whitespace-nowrap"
          >
            {t('dashboard.openPregnancyTracker')}
          </button>
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-label-md font-label-md text-on-secondary-fixed-variant">
              {t('dashboard.pregnancyProgress')}
            </span>
            <span className="text-label-md font-label-md text-secondary font-bold">
              {Math.round(progressPct)}%
            </span>
          </div>
          <div className="h-3 w-full bg-surface/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="bg-surface/70 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white bg-surface-container-high flex items-center justify-center">
            {imgErr ? (
              <span className="text-2xl">{weekData.emoji || '🍓'}</span>
            ) : (
              <img
                src={`https://loremflickr.com/120/120/${weekData.imageTag}`}
                alt={weekData.size}
                className="w-full h-full object-cover"
                onError={() => setImgErr(true)}
                loading="lazy"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-label-md font-label-md uppercase tracking-wider text-on-secondary-fixed-variant">
              {t('dashboard.babySizeOf')}
            </p>
            <p className="text-headline-sm font-headline-sm text-on-surface truncate">
              {weekData.size}
            </p>
            <p className="text-label-md text-on-surface-variant">
              ~{weekData.lengthCm} cm · {weightDisplay}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BabyCard({ baby, navigate, t }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(118,182,227,0.05)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        {baby.photoUrl && !imgErr ? (
          <img
            src={baby.photoUrl}
            alt={baby.name}
            className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-primary/20"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 font-headline-lg text-2xl font-bold">
            {getInitial(baby.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-headline-sm font-headline-sm text-on-surface truncate">{baby.name}</p>
          <p className="text-body-sm text-on-surface-variant truncate">{formatAge(baby.dob)}</p>
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
        {baby.birthHeightCm ? (
          <span className="bg-surface-container px-3 py-1 rounded-full text-label-md font-label-md text-on-surface-variant">
            {baby.birthHeightCm} cm
          </span>
        ) : null}
      </div>

      <button
        onClick={() => navigate(`/baby/${baby.id}`)}
        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all duration-200"
      >
        <span className="material-symbols-outlined text-[18px]">visibility</span>
        {t('dashboard.viewProfile')}
      </button>
    </div>
  );
}

function QuickAction({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="bg-surface-container hover:bg-surface-container-high p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-2 group active:scale-[0.98] transition-all duration-200"
    >
      <div className="w-11 h-11 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary-fixed transition-all duration-200">
        <span className="material-symbols-outlined text-primary text-[24px]">{icon}</span>
      </div>
      <span className="text-label-md font-label-md text-on-surface">{label}</span>
    </Link>
  );
}

function EmptyHome({ navigate, isMother, t }) {
  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-[0_4px_20px_rgba(118,182,227,0.05)] text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-fixed flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {isMother ? 'pregnant_woman' : 'child_care'}
        </span>
      </div>
      <h3 className="text-headline-lg font-headline-lg text-primary mb-3">
        {t('dashboard.welcomeTitle')}
      </h3>
      <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg mx-auto">
        {isMother ? t('dashboard.welcomeMotherDesc') : t('dashboard.welcomeCaregiverDesc')}
      </p>

      <div className={`grid grid-cols-1 ${isMother ? 'md:grid-cols-2' : ''} gap-4 max-w-2xl mx-auto`}>
        {isMother && (
          <button
            onClick={() => navigate('/pregnancy')}
            className="bg-secondary text-on-secondary rounded-2xl p-6 flex flex-col items-center text-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200"
          >
            <span className="material-symbols-outlined text-4xl">pregnant_woman</span>
            <span className="font-headline-sm text-headline-sm">{t('dashboard.startPregnancyTracker')}</span>
          </button>
        )}
        <button
          onClick={() => navigate('/add-baby')}
          className="bg-primary text-on-primary rounded-2xl p-6 flex flex-col items-center text-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200"
        >
          <span className="material-symbols-outlined text-4xl">child_care</span>
          <span className="font-headline-sm text-headline-sm">{t('dashboard.addABaby')}</span>
        </button>
      </div>
    </div>
  );
}