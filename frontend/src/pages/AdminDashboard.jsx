// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApi } from '../api/admin';

const styles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
  .soft-shadow { box-shadow: 0 4px 20px rgba(118, 182, 227, 0.05); }
`;

const ROLE_BADGE = {
  Admin: 'bg-error-container text-on-error-container',
  Caregiver: 'bg-primary-container/30 text-on-primary-container',
  PregnantMother: 'bg-secondary-container text-on-secondary-container',
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.analytics();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const exportCSV = () => {
    if (!stats) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Users', stats.totalUsers],
      ['Total Babies', stats.totalBabies],
      ['Total Specialists', stats.totalSpecialists],
      ['Admins', stats.usersByRole?.admins || 0],
      ['Caregivers', stats.usersByRole?.caregivers || 0],
      ['Mothers', stats.usersByRole?.mothers || 0],
      ['Symptoms (configs)', stats.contentCounts?.symptoms || 0],
      ['Milestones (configs)', stats.contentCounts?.milestones || 0],
      ['Education Articles', stats.contentCounts?.education || 0],
      ['Emergency Contacts', stats.contentCounts?.emergency || 0],
      ['Risk Rules', stats.contentCounts?.risks || 0],
      ['Total Assessments', stats.totalAssessments],
      ['High Risk Alerts', stats.highRiskAlerts],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartcare-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{styles}</style>
      <AdminLayout activePage="dashboard">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in-up">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1">
              System Overview
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Monitor platform health, user activity, and critical alerts.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={load}
              disabled={loading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-primary text-primary font-headline-sm hover:bg-primary-container/10 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
              Refresh
            </button>
            <button
              onClick={exportCSV}
              disabled={!stats}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-headline-sm hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export Report
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading analytics…" />
        ) : error ? (
          <div className="bg-surface-container-lowest rounded-xl p-16 text-center">
            <p className="text-error mb-4">{error}</p>
            <button onClick={load} className="px-6 py-2 rounded-full bg-primary text-on-primary">
              Retry
            </button>
          </div>
        ) : !stats ? (
          <div className="bg-surface-container-lowest rounded-xl p-16 text-center text-on-surface-variant">
            No analytics available.
          </div>
        ) : (
          <>
            {/* ── Three summary cards ─────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Users */}
              <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/10 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-container/20 rounded-full blur-xl group-hover:bg-primary-container/30 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-surface-container-high rounded-2xl">
                    <span className="material-symbols-outlined text-primary">group</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary-fixed px-2.5 py-1 rounded-full">
                    Live
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                    Total Users
                  </h3>
                  <p className="text-headline-xl font-headline-xl text-on-surface">
                    {stats.totalUsers}
                  </p>
                  <p className="text-body-sm text-on-surface-variant mt-2">
                    {stats.usersByRole?.admins || 0} admins ·{' '}
                    {stats.usersByRole?.caregivers || 0} caregivers ·{' '}
                    {stats.usersByRole?.mothers || 0} mothers
                  </p>
                </div>
              </div>

              {/* Baby Profiles */}
              <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/10 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary-container/40 rounded-full blur-xl group-hover:bg-secondary-container/60 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-secondary-container rounded-2xl text-on-secondary-container">
                    <span className="material-symbols-outlined">child_care</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-secondary bg-secondary-fixed px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                    Baby Profiles
                  </h3>
                  <p className="text-headline-xl font-headline-xl text-on-surface">
                    {stats.totalBabies}
                  </p>
                  <p className="text-body-sm text-on-surface-variant mt-2">
                    Tracked across the platform
                  </p>
                </div>
              </div>

              {/* Specialists */}
              <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/10 relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-container/20 rounded-full blur-xl group-hover:bg-primary-container/30 transition-all"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-surface-container-high rounded-2xl">
                    <span className="material-symbols-outlined text-primary">medical_services</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary-fixed px-2.5 py-1 rounded-full">
                    {Math.min(100, (stats.totalSpecialists || 0) * 20)}%
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                    Specialists
                  </h3>
                  <p className="text-headline-xl font-headline-xl text-on-surface mb-2">
                    {stats.totalSpecialists}
                  </p>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (stats.totalSpecialists || 0) * 20)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Bottom: content inventory + recent users ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Content Inventory */}
              <div className="xl:col-span-2 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 soft-shadow border border-outline-variant/10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-headline-sm font-headline-sm text-on-surface">
                    Content Inventory
                  </h3>
                  <span className="text-body-sm text-on-surface-variant">
                    Real counts from database
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  <InventoryRow
                    label="Symptoms"
                    value={stats.contentCounts?.symptoms || 0}
                    max={Math.max(
                      stats.contentCounts?.symptoms || 0,
                      stats.contentCounts?.milestones || 0,
                      1
                    )}
                    color="bg-primary"
                  />
                  <InventoryRow
                    label="Milestones"
                    value={stats.contentCounts?.milestones || 0}
                    max={Math.max(
                      stats.contentCounts?.symptoms || 0,
                      stats.contentCounts?.milestones || 0,
                      1
                    )}
                    color="bg-primary"
                  />
                  <InventoryRow
                    label="Specialists"
                    value={stats.contentCounts?.specialists || 0}
                    max={Math.max(
                      stats.contentCounts?.symptoms || 0,
                      stats.contentCounts?.milestones || 0,
                      1
                    )}
                    color="bg-secondary"
                  />
                  <InventoryRow
                    label="Education"
                    value={stats.contentCounts?.education || 0}
                    max={Math.max(
                      stats.contentCounts?.symptoms || 0,
                      stats.contentCounts?.milestones || 0,
                      1
                    )}
                    color="bg-primary"
                  />
                  <InventoryRow
                    label="Emergency"
                    value={stats.contentCounts?.emergency || 0}
                    max={Math.max(
                      stats.contentCounts?.symptoms || 0,
                      stats.contentCounts?.milestones || 0,
                      1
                    )}
                    color="bg-primary"
                  />
                  <InventoryRow
                    label="Risk Rules"
                    value={stats.contentCounts?.risks || 0}
                    max={Math.max(
                      stats.contentCounts?.symptoms || 0,
                      stats.contentCounts?.milestones || 0,
                      1
                    )}
                    color="bg-primary"
                  />
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/10 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-headline-sm font-headline-sm text-on-surface">
                    Recent Users
                  </h3>
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '420px' }}>
                  {(stats.recentUsers || []).map((u) => (
                    <div
                      key={u.id}
                      className="p-3 rounded-2xl bg-surface-bright border border-outline-variant/20 flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 font-bold">
                        {(u.fullName || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className="text-body-sm font-semibold text-on-surface truncate">
                            {u.fullName}
                          </h4>
                          <span className="text-[10px] text-outline whitespace-nowrap pt-0.5">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <p className="text-body-sm text-on-surface-variant truncate mb-2">
                          {u.email}
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ROLE_BADGE[u.role] || 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!stats.recentUsers || stats.recentUsers.length === 0) && (
                    <p className="text-body-sm text-on-surface-variant text-center py-6">
                      No users yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </AdminLayout>
    </>
  );
}

function InventoryRow({ label, value, max, color }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <span className="w-28 text-body-md text-on-surface-variant shrink-0">
        {label}
      </span>
      <div className="flex-1 bg-surface-container-high h-3 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <span className="w-8 text-body-md font-semibold text-on-surface text-right shrink-0">
        {value}
      </span>
    </div>
  );
}