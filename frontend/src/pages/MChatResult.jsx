// src/pages/MChatResult.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import ErrorState from '../components/ErrorState';
import { formatDate } from '../utils/formatters';

const RISK_STYLES = {
  Low: {
    title: 'Low Risk',
    sub: 'OPTIMAL RESULT',
    icon: 'sentiment_very_satisfied',
    ringColor: 'border-emerald-300',
    innerBg: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    subColor: 'text-emerald-600',
  },
  Medium: {
    title: 'Medium Risk',
    sub: 'FOLLOW-UP RECOMMENDED',
    icon: 'sentiment_neutral',
    ringColor: 'border-amber-300',
    innerBg: 'bg-amber-50',
    textColor: 'text-amber-700',
    subColor: 'text-amber-600',
  },
  High: {
    title: 'High Risk',
    sub: 'SPECIALIST CONSULTATION',
    icon: 'emergency',
    ringColor: 'border-red-300',
    innerBg: 'bg-red-50',
    textColor: 'text-red-700',
    subColor: 'text-red-600',
  },
};

export default function MChatResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { assessment, babyId } = location.state || {};

  if (!assessment) {
    return (
      <>
        <div className="min-h-screen bg-background text-on-background font-body-md">
          <DashboardNavbar activePage="babies" />
          <main className="max-w-[1200px] mx-auto px-4 py-12">
            <ErrorState
              title="No screening to show"
              message="Please complete an M-CHAT-R screening first."
            />
            <div className="text-center mt-6">
              <Link
                to="/mchat"
                className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md"
              >
                Start Screening
              </Link>
            </div>
          </main>
          <FloatingButtons />
        </div>
      </>
    );
  }

  const risk = RISK_STYLES[assessment.riskLevel] || RISK_STYLES.Low;
  const totalAnswered = 20;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md antialiased pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 md:px-6 py-8 md:py-10 space-y-8">

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
              <button
                onClick={() => navigate(babyId ? `/baby/${babyId}` : '/dashboard')}
                className="hover:text-primary flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back
              </button>
              <span>/</span>
              <span className="text-on-surface font-semibold">M-CHAT-R Result</span>
            </div>
            <h1 className="text-headline-xl font-headline-xl text-on-surface">
              M-CHAT-R Screening Result
            </h1>
            <p className="text-body-md text-on-surface-variant">
              Here is a summary of the screening result.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-secondary-container/30 border-2 border-secondary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  face_3
                </span>
              </div>
              <div>
                <p className="text-body-sm text-on-surface-variant">
                  Assessment completed
                </p>
                <p className="text-body-md text-on-surface font-semibold">
                  {formatDate(assessment.assessedAt, {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-surface to-surface-container-low rounded-[2rem] p-8 md:p-10 border border-primary-fixed flex flex-col items-center text-center relative overflow-hidden">

            <div className={`relative w-44 h-44 rounded-full bg-white p-3 shadow-md border-4 ${risk.ringColor} flex items-center justify-center shrink-0`}>
              <div className={`w-full h-full rounded-full ${risk.innerBg} flex flex-col items-center justify-center text-center p-3`}>
                <span
                  className={`material-symbols-outlined text-[32px] ${risk.textColor} mb-1`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {risk.icon}
                </span>
                <span className={`text-headline-md font-headline-md font-bold ${risk.textColor} leading-none`}>
                  {risk.title}
                </span>
                <span className={`text-[10px] font-label-md ${risk.subColor} mt-1.5 uppercase tracking-wider`}>
                  {risk.sub}
                </span>
              </div>
            </div>

            <div className="mt-6 max-w-xl space-y-2">
              <div className="inline-block px-4 py-1 rounded-full bg-white text-primary font-bold text-body-md border border-primary-fixed shadow-sm">
                Risk Score: <span className="text-on-surface font-extrabold">{assessment.totalRiskScore}</span>
              </div>
              <p className="text-body-lg font-bold text-on-surface leading-snug pt-2">
                {assessment.actionPlan}
              </p>
              <p className="text-label-md text-on-surface-variant italic pt-1">
                This screening result is not a diagnosis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-variant flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <div>
                <div className="text-headline-md font-headline-md font-bold text-on-surface">{totalAnswered}</div>
                <div className="text-label-md text-on-surface-variant">Questions Answered</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-5 border border-primary-fixed flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  thumb_up
                </span>
              </div>
              <div>
                <div className="text-headline-md font-headline-md font-bold text-on-surface">
                  {totalAnswered - assessment.totalRiskScore}
                </div>
                <div className="text-label-md text-on-surface-variant">Typical responses</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-5 border border-amber-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  visibility
                </span>
              </div>
              <div>
                <div className="text-headline-md font-headline-md font-bold text-on-surface">
                  {assessment.totalRiskScore}
                </div>
                <div className="text-label-md text-on-surface-variant">Responses to monitor</div>
              </div>
            </div>
          </div>

          {/* ── NEW: Reports & Exports ─────────────────────── */}
          {babyId && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface">
                    Reports & Exports
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Download a clinical PDF version of this screening or the full health report.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link
                  to={`/reports/mchat/${babyId}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-secondary text-secondary font-label-md text-label-md hover:bg-secondary-fixed transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                  Download M-CHAT-R PDF
                </Link>
                <Link
                  to={`/reports/full/${babyId}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-error text-on-error font-label-md text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(186,26,26,0.25)]"
                >
                  <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                  Download Full Report
                </Link>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 justify-center">
            {babyId && (
              <Link
                to={`/baby/${babyId}`}
                className="px-5 py-3 rounded-xl border-2 border-outline-variant bg-white hover:bg-surface-container-low text-on-surface font-bold text-body-sm transition"
              >
                Back to Baby
              </Link>
            )}
            <button
              onClick={() => navigate('/mchat' + (babyId ? `?babyId=${babyId}` : ''))}
              className="px-5 py-3 rounded-xl border-2 border-outline-variant bg-white hover:bg-surface-container-low text-on-surface font-bold text-body-sm transition"
            >
              Retake Screening
            </button>
            <Link
              to="/specialists"
              className="px-5 py-3 rounded-xl bg-secondary text-on-secondary font-bold text-body-sm hover:opacity-90 transition"
            >
              Find a Specialist
            </Link>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}