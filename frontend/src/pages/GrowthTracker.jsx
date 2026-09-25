// src/pages/GrowthTracker.jsx
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { growthApi } from '../api/growth';
import { babiesApi } from '../api/babies';
import { formatDate } from '../utils/formatters';

const METRICS = {
  weight: { key: 'weightKg', label: 'Weight (kg)', unit: 'kg', color: '#17648d' },
  height: { key: 'heightCm', label: 'Height (cm)', unit: 'cm', color: '#8a486f' },
  head: { key: 'headCircumferenceCm', label: 'Head (cm)', unit: 'cm', color: '#576065' },
};

export default function GrowthTracker() {
  const [searchParams] = useSearchParams();
  const babyIdParam = searchParams.get('babyId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baby, setBaby] = useState(null);
  const [records, setRecords] = useState([]);
  const [activeMetric, setActiveMetric] = useState('weight');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    recordedAt: new Date().toISOString().split('T')[0],
    weightKg: '',
    heightCm: '',
    headCircumferenceCm: '',
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pick baby: either from ?babyId= or first baby
      let babyData = null;
      if (babyIdParam) {
        babyData = await babiesApi.get(babyIdParam);
      } else {
        const babies = await babiesApi.list();
        babyData = babies?.[0] || null;
      }
      setBaby(babyData);

      if (babyData) {
        const recs = await growthApi.list(babyData.id);
        setRecords(recs || []);
      }
    } catch (err) {
      setError(err.message || 'Could not load growth data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [babyIdParam]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!baby) return;
    setSubmitting(true);
    try {
      const created = await growthApi.create({
        babyId: baby.id,
        recordedAt: form.recordedAt,
        weightKg: Number(form.weightKg) || 0,
        heightCm: Number(form.heightCm) || 0,
        headCircumferenceCm: Number(form.headCircumferenceCm) || 0,
      });
      setRecords((prev) =>
        [...prev, created].sort((a, b) => a.babyAgeMonths - b.babyAgeMonths)
      );
      setForm({
        recordedAt: new Date().toISOString().split('T')[0],
        weightKg: '',
        heightCm: '',
        headCircumferenceCm: '',
      });
    } catch (err) {
      setError(err.message || 'Could not save measurement');
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = records.map((r) => ({
    age: r.babyAgeMonths,
    weightKg: r.weightKg,
    heightCm: r.heightCm,
    headCircumferenceCm: r.headCircumferenceCm,
  }));

  const latest = records[records.length - 1];
  const metric = METRICS[activeMetric];

  const getPercentile = (key) => {
    if (!latest) return null;
    if (key === 'weightKg') return latest.weightPercentile;
    if (key === 'heightCm') return latest.heightPercentile;
    return latest.headPercentile;
  };

  return (
    <>
      <div className="min-h-screen flex flex-col font-body-md text-body-md bg-background antialiased pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">

          {baby && (
            <Link
              to={`/baby/${baby.id}`}
              className="inline-flex items-center gap-2 text-primary font-label-md text-label-md mb-4 hover:opacity-80"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              {baby.name}'s profile
            </Link>
          )}

          <div className="mb-6">
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1">
              Growth Tracking
            </h2>
            <p className="text-body-md text-on-surface-variant">
              {baby ? `Monitoring ${baby.name}'s growth over time.` : 'Add a baby to start tracking growth.'}
            </p>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading growth data…" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : !baby ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 soft-shadow text-center">
              <p className="text-body-md text-on-surface-variant mb-4">
                You don't have any babies yet.
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
            <div className="flex flex-col md:flex-row gap-6">

              {/* Left: form + percentiles */}
              <div className="w-full md:w-1/3 flex flex-col gap-6">

                {/* New Entry Form */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow">
                  <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">
                    New Measurement
                  </h3>
                  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-1">
                        Date
                      </label>
                      <input
                        name="recordedAt"
                        value={form.recordedAt}
                        onChange={handleChange}
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full bg-surface-bright border border-outline-variant rounded-full px-4 py-3 font-body-md outline-none input-glow"
                      />
                    </div>
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-1">
                        Weight (kg)
                      </label>
                      <input
                        name="weightKg"
                        value={form.weightKg}
                        onChange={handleChange}
                        placeholder="e.g. 6.5"
                        step="0.1"
                        type="number"
                        required
                        className="w-full bg-surface-bright border border-outline-variant rounded-full px-4 py-3 font-body-md outline-none input-glow"
                      />
                    </div>
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-1">
                        Height (cm)
                      </label>
                      <input
                        name="heightCm"
                        value={form.heightCm}
                        onChange={handleChange}
                        placeholder="e.g. 62.0"
                        step="0.1"
                        type="number"
                        required
                        className="w-full bg-surface-bright border border-outline-variant rounded-full px-4 py-3 font-body-md outline-none input-glow"
                      />
                    </div>
                    <div>
                      <label className="block text-label-md text-on-surface-variant mb-1">
                        Head Circumference (cm)
                      </label>
                      <input
                        name="headCircumferenceCm"
                        value={form.headCircumferenceCm}
                        onChange={handleChange}
                        placeholder="e.g. 41.5"
                        step="0.1"
                        type="number"
                        required
                        className="w-full bg-surface-bright border border-outline-variant rounded-full px-4 py-3 font-body-md outline-none input-glow"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-2 w-full bg-primary text-on-primary rounded-full py-3 font-label-md hover:scale-95 disabled:opacity-60 transition-transform"
                    >
                      {submitting ? 'Saving…' : 'Record Measurement'}
                    </button>
                  </form>
                </div>

                {/* Latest Percentiles */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow">
                  <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">
                    Latest Percentiles
                  </h3>
                  {!latest ? (
                    <p className="text-body-sm text-on-surface-variant">
                      No measurements recorded yet.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <PercentileBar
                        label="Weight"
                        percentile={latest.weightPercentile}
                        value={`${latest.weightKg} kg`}
                      />
                      <PercentileBar
                        label="Height"
                        percentile={latest.heightPercentile}
                        value={`${latest.heightCm} cm`}
                        color="secondary"
                      />
                      <PercentileBar
                        label="Head"
                        percentile={latest.headPercentile}
                        value={`${latest.headCircumferenceCm} cm`}
                        color="tertiary"
                      />
                    </div>
                  )}
                </div>

                <Link
                  to="/vaccinations"
                  className="bg-secondary-fixed rounded-2xl p-5 soft-shadow flex items-center gap-4 hover:opacity-95 transition-opacity"
                >
                  <span className="material-symbols-outlined text-secondary text-3xl">
                    vaccines
                  </span>
                  <div>
                    <p className="text-body-md font-bold text-on-surface">
                      Vaccination Schedule
                    </p>
                    <p className="text-body-sm text-on-surface-variant">
                      View {baby.name}'s vaccine records
                    </p>
                  </div>
                </Link>
              </div>

              {/* Right: chart + records */}
              <div className="w-full md:w-2/3 flex flex-col gap-6">

                {/* Chart */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow">
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <h3 className="text-headline-sm font-headline-sm text-on-surface">
                      Growth Progress
                    </h3>
                    <div className="flex gap-2">
                      {Object.entries(METRICS).map(([key, m]) => (
                        <button
                          key={key}
                          onClick={() => setActiveMetric(key)}
                          className={`px-4 py-1 rounded-full font-label-md transition-colors ${
                            activeMetric === key
                              ? 'bg-surface-container-high text-primary'
                              : 'bg-surface-bright text-on-surface-variant border border-outline-variant hover:bg-surface-container-low'
                          }`}
                        >
                          {m.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {chartData.length < 2 ? (
                    <div className="h-[300px] flex items-center justify-center bg-surface-container-low rounded-lg">
                      <p className="text-body-md text-on-surface-variant text-center px-4">
                        Need at least 2 measurements to draw a chart.<br />
                        <span className="text-body-sm">
                          Record another measurement to see the trend.
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5eeff" />
                          <XAxis
                            dataKey="age"
                            label={{ value: 'Age (months)', position: 'insideBottom', offset: -5 }}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              background: '#fff',
                              border: '1px solid #c0c7cf',
                              borderRadius: '8px',
                            }}
                            formatter={(value) => [`${value} ${metric.unit}`, metric.label]}
                            labelFormatter={(label) => `Age ${label} months`}
                          />
                          <Line
                            type="monotone"
                            dataKey={metric.key}
                            stroke={metric.color}
                            strokeWidth={3}
                            dot={{ r: 5, fill: metric.color }}
                            activeDot={{ r: 7 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* History table */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow">
                  <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">
                    Measurement History
                  </h3>
                  {records.length === 0 ? (
                    <p className="text-body-md text-on-surface-variant text-center py-6">
                      No measurements yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-outline-variant/30">
                            <th className="py-2 text-label-md text-on-surface-variant font-bold">Age</th>
                            <th className="py-2 text-label-md text-on-surface-variant font-bold">Date</th>
                            <th className="py-2 text-label-md text-on-surface-variant font-bold">Weight</th>
                            <th className="py-2 text-label-md text-on-surface-variant font-bold">Height</th>
                            <th className="py-2 text-label-md text-on-surface-variant font-bold">Head</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...records].reverse().map((r) => (
                            <tr key={r.id} className="border-b border-outline-variant/10">
                              <td className="py-3 text-body-sm font-semibold text-on-surface">
                                {r.babyAgeMonths} mo
                              </td>
                              <td className="py-3 text-body-sm text-on-surface-variant">
                                {formatDate(r.recordedAt)}
                              </td>
                              <td className="py-3 text-body-sm text-on-surface">
                                {r.weightKg} kg
                              </td>
                              <td className="py-3 text-body-sm text-on-surface">
                                {r.heightCm} cm
                              </td>
                              <td className="py-3 text-body-sm text-on-surface">
                                {r.headCircumferenceCm} cm
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

function PercentileBar({ label, percentile, value, color = 'primary' }) {
  if (percentile == null) return null;
  const bg = color === 'secondary'
    ? 'bg-secondary'
    : color === 'tertiary'
    ? 'bg-tertiary'
    : 'bg-primary';
  const text = color === 'secondary'
    ? 'text-secondary'
    : color === 'tertiary'
    ? 'text-tertiary'
    : 'text-primary';

  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <span className="text-body-sm text-on-surface-variant">{label}</span>
        <span className={`text-label-md font-label-md ${text}`}>
          {value} • {percentile}th
        </span>
      </div>
      <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className={`h-full ${bg} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, percentile))}%` }}
        ></div>
      </div>
    </div>
  );
}