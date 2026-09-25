// frontend/src/pages/AdminAssessments.jsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApi } from '../api/admin';

const RISK_BADGE = {
  Green: 'bg-primary-container/30 text-on-primary-container',
  Yellow: 'bg-secondary-container text-on-secondary-container',
  Red: 'bg-error-container text-on-error-container',
  Low: 'bg-primary-container/30 text-on-primary-container',
  Medium: 'bg-secondary-container text-on-secondary-container',
  High: 'bg-error-container text-on-error-container',
};

export default function AdminAssessments() {
  const [tab, setTab] = useState('symptoms');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (tab === 'symptoms') data = await adminApi.assessmentsSymptoms();
      else if (tab === 'milestones') data = await adminApi.assessmentsMilestones();
      else data = await adminApi.assessmentsMchat();
      setItems(data.items || data.assessments || []);
    } catch (err) {
      setError(err.message || 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  return (
    <AdminLayout activePage="assessments">
      <div className="mb-6">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-1">
          Assessments
        </h2>
        <p className="text-body-md text-on-surface-variant">
          All assessments submitted across the platform.
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-outline-variant/30">
        {[
          { key: 'symptoms', label: 'Symptom' },
          { key: 'milestones', label: 'Milestone' },
          { key: 'mchat', label: 'M-CHAT' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-3 text-body-md font-semibold transition-colors ${
              tab === t.key
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-soft overflow-hidden border border-outline-variant/10">
        {loading ? (
          <div className="p-16 flex justify-center"><LoadingSpinner /></div>
        ) : error ? (
          <div className="p-16 text-center">
            <p className="text-error mb-4">{error}</p>
            <button onClick={load} className="px-6 py-2 rounded-full bg-primary text-on-primary">Retry</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {tab === 'symptoms' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20">
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Baby</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">By</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Date</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Score</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md">
                  {items.map((a) => (
                    <tr key={a.id}>
                      <td className="p-4 font-bold">{a.babyName}</td>
                      <td className="p-4 text-on-surface-variant">{a.assessedByName}</td>
                      <td className="p-4 text-on-surface-variant text-body-sm">
                        {a.assessedAt ? new Date(a.assessedAt).toLocaleString() : '—'}
                      </td>
                      <td className="p-4">{a.totalScore}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-label-md ${RISK_BADGE[a.riskLevel] || ''}`}>
                          {a.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">No symptom assessments yet.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {tab === 'milestones' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20">
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Baby</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">By</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Date</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">% Achieved</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Delays</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md">
                  {items.map((a) => (
                    <tr key={a.id}>
                      <td className="p-4 font-bold">{a.babyName}</td>
                      <td className="p-4 text-on-surface-variant">{a.assessedByName}</td>
                      <td className="p-4 text-on-surface-variant text-body-sm">
                        {a.assessedAt ? new Date(a.assessedAt).toLocaleString() : '—'}
                      </td>
                      <td className="p-4">{a.percentAchieved}%</td>
                      <td className="p-4">{a.totalDelays}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">No milestone assessments yet.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {tab === 'mchat' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20">
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Baby</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">By</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Date</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Score</th>
                    <th className="p-4 text-label-md font-bold text-on-surface-variant">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-md">
                  {items.map((a) => (
                    <tr key={a.id}>
                      <td className="p-4 font-bold">{a.babyName}</td>
                      <td className="p-4 text-on-surface-variant">{a.assessedByName}</td>
                      <td className="p-4 text-on-surface-variant text-body-sm">
                        {a.assessedAt ? new Date(a.assessedAt).toLocaleString() : '—'}
                      </td>
                      <td className="p-4">{a.totalRiskScore}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-label-md ${RISK_BADGE[a.riskLevel] || ''}`}>
                          {a.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">No M-CHAT assessments yet.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}