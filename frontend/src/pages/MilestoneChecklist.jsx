// src/pages/MilestoneChecklist.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { milestonesApi } from '../api/assessments';
import { MILESTONE_AREAS } from '../utils/constants';

const AREA_ICONS = {
  'Gross Motor': 'directions_walk',
  'Fine Motor': 'back_hand',
  'Language': 'record_voice_over',
  'Cognitive': 'psychology',
  'Social': 'diversity_3',
  'Self-Help': 'restaurant',
  'Hearing/Vision': 'visibility',
};

export default function MilestoneChecklist() {
  const [searchParams] = useSearchParams();
  const babyId = searchParams.get('babyId');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [configs, setConfigs] = useState([]);
  const [activeArea, setActiveArea] = useState('Gross Motor');
  const [status, setStatus] = useState({}); // configId -> 'achieved' | 'notYet' | 'unsure'
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await milestonesApi.getConfigs();
      setConfigs(list || []);
    } catch (err) {
      setError(err.message || 'Could not load milestones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const itemsForArea = useMemo(
    () => configs.filter((c) => c.area === activeArea),
    [configs, activeArea]
  );

  const setItemStatus = (id, s) => setStatus((prev) => ({ ...prev, [id]: s }));

  const totals = useMemo(() => {
    const answered = Object.keys(status).length;
    return { answered, total: configs.length };
  }, [status, configs]);

  const handleSubmit = async () => {
    if (!babyId) {
      alert('Please open a baby profile first, then start milestones.');
      return;
    }
    setSubmitting(true);
    try {
      const items = configs.map((c) => ({
        configId: c.id,
        achieved: status[c.id] === 'achieved' ? true
                : status[c.id] === 'notYet' ? false
                : null,
      }));
      const assessment = await milestonesApi.submit(babyId, items);
      setResult(assessment);
    } catch (err) {
      setError(err.message || 'Could not submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">

          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
              <div>
                <h2 className="text-headline-xl font-headline-xl text-on-surface mb-2">
                  Developmental Milestones
                </h2>
                <p className="text-body-lg text-on-surface-variant max-w-2xl">
                  Evaluate progress across 7 areas. Items not yet achieved will be flagged for review.
                </p>
              </div>
              <span className="text-label-md font-label-md text-primary bg-primary-fixed px-3 py-1 rounded-full uppercase">
                {totals.answered} / {totals.total} answered
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-5 soft-shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-headline-sm font-headline-sm text-on-surface">Progress</span>
                <span className="text-headline-sm font-headline-sm text-primary">
                  {totals.total > 0 ? Math.round((totals.answered / totals.total) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${totals.total > 0 ? (totals.answered / totals.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading milestones…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : result ? (
            <ResultView result={result} babyId={babyId} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Tabs */}
              <div className="md:col-span-12">
                <div className="flex gap-2 border-b border-surface-variant pb-2 overflow-x-auto">
                  {MILESTONE_AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => setActiveArea(area)}
                      className={`px-4 py-2 text-body-md whitespace-nowrap transition-colors flex items-center gap-1 ${
                        activeArea === area
                          ? 'text-primary border-b-2 border-primary font-bold'
                          : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {AREA_ICONS[area]}
                      </span>
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="md:col-span-8 flex flex-col gap-4">
                {itemsForArea.length === 0 ? (
                  <p className="text-center text-on-surface-variant py-8">No items in this area.</p>
                ) : (
                  itemsForArea.map((item) => (
                    <div
                      key={item.id}
                      className="bg-surface-container-lowest rounded-2xl p-5 soft-shadow"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined">
                            {AREA_ICONS[item.area]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-body-lg font-semibold text-on-surface mb-1">
                            {item.description}
                          </h3>
                          <p className="text-body-sm text-on-surface-variant">
                            Expected by ~{item.expectedAgeMonths} months
                            {item.isCritical && (
                              <span className="ml-2 bg-error-container text-on-error-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Critical
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setItemStatus(item.id, 'achieved')}
                          className={`py-2 rounded-full text-label-md font-label-md transition-all ${
                            status[item.id] === 'achieved'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                          }`}
                        >
                          ✓ Achieved
                        </button>
                        <button
                          onClick={() => setItemStatus(item.id, 'notYet')}
                          className={`py-2 rounded-full text-label-md font-label-md transition-all ${
                            status[item.id] === 'notYet'
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                          }`}
                        >
                          Not yet
                        </button>
                        <button
                          onClick={() => setItemStatus(item.id, 'unsure')}
                          className={`py-2 rounded-full text-label-md font-label-md transition-all ${
                            status[item.id] === 'unsure'
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                              : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                          }`}
                        >
                          Unsure
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar summary */}
              <div className="md:col-span-4 flex flex-col gap-4">
                <div className="bg-surface-container-lowest rounded-2xl p-5 soft-shadow">
                  <h3 className="text-headline-md font-headline-md text-on-surface mb-3">
                    Summary
                  </h3>
                  {MILESTONE_AREAS.map((area) => {
                    const areaItems = configs.filter((c) => c.area === area);
                    const answered = areaItems.filter((i) => status[i.id]).length;
                    return (
                      <div
                        key={area}
                        className="flex justify-between items-center py-2 border-b border-surface-container last:border-0"
                      >
                        <span className="text-body-sm text-on-surface">{area}</span>
                        <span className={`text-label-md font-label-md px-2 py-1 rounded-md ${
                          answered === areaItems.length && areaItems.length > 0
                            ? 'text-primary bg-primary-fixed'
                            : 'text-tertiary bg-tertiary-fixed'
                        }`}>
                          {answered} / {areaItems.length}
                        </span>
                      </div>
                    );
                  })}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || totals.answered < totals.total}
                    className="w-full mt-4 py-3 bg-primary text-on-primary rounded-full text-body-md font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {submitting ? 'Submitting…' : 'Submit Assessment'}
                  </button>
                  {totals.answered < totals.total && (
                    <p className="text-body-sm text-on-surface-variant text-center mt-2">
                      Please answer all {totals.total} items.
                    </p>
                  )}
                </div>

                <Link
                  to={babyId ? `/baby/${babyId}` : '/babies'}
                  className="text-center text-primary font-label-md text-label-md hover:underline"
                >
                  ← Back to baby profile
                </Link>
              </div>
            </div>
          )}
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}

function ResultView({ result, babyId }) {
  const notAchieved = result.totalDelays || 0;
  const isConcerning = notAchieved > 0;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className={`rounded-[2rem] p-6 border-2 ${
        isConcerning
          ? 'bg-[#fff4e5] text-[#b45309] border-[#fed7aa]'
          : 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
      }`}>
        <div className="flex items-start gap-4">
          <span
            className="material-symbols-outlined text-3xl mt-1"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isConcerning ? 'warning' : 'verified'}
          </span>
          <div>
            <h3 className="text-headline-sm font-headline-sm font-bold mb-1">
              {isConcerning ? 'Delays Detected' : 'All Milestones Achieved'}
            </h3>
            <p className="text-body-md">
              {isConcerning
                ? `${notAchieved} item${notAchieved === 1 ? '' : 's'} not yet achieved. Discuss with a pediatric specialist.`
                : 'Great progress! Keep encouraging your baby\'s development.'}
            </p>
            <div className="mt-3">
              <span className="bg-white/40 px-3 py-1 rounded-full text-label-md font-label-md font-bold">
                {result.percentAchieved}% achieved
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-between">
        {babyId && (
          <Link
            to={`/baby/${babyId}`}
            className="px-6 py-3 rounded-full border-2 border-primary text-primary font-label-md hover:bg-primary-fixed"
          >
            Back to Baby
          </Link>
        )}
        {isConcerning && (
          <Link
            to="/specialists"
            className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md hover:opacity-90"
          >
            Find a Specialist
          </Link>
        )}
      </div>
    </div>
  );
}