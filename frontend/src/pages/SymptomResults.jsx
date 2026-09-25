// src/pages/SymptomResults.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';
import ErrorState from '../components/ErrorState';

const RISK_STYLES = {
  Green: {
    title: 'Low Risk',
    icon: 'sentiment_satisfied',
    color: 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]',
  },
  Yellow: {
    title: 'Moderate Risk',
    icon: 'sentiment_neutral',
    color: 'bg-[#fff4e5] text-[#b45309] border-[#fed7aa]',
  },
  Red: {
    title: 'High Risk — Consult Specialist',
    icon: 'emergency',
    color: 'bg-error-container text-on-error-container border-error',
  },
};

export default function SymptomResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { assessment, babyId } = location.state || {};

  if (!assessment) {
    return (
      <>
        <div className="min-h-screen bg-background text-on-background font-body-md">
          <DashboardNavbar activePage="babies" />
          <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
            <ErrorState
              title="No assessment to show"
              message="Please complete a symptom check first."
            />
            <div className="text-center mt-6">
              <Link
                to="/symptoms"
                className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90"
              >
                Start Symptom Check
              </Link>
            </div>
          </main>
          <FloatingButtons />
        </div>
      </>
    );
  }

  const risk = RISK_STYLES[assessment.riskLevel] || RISK_STYLES.Green;
  const presentSymptoms = (assessment.answers || []).filter((a) => a.present);

  return (
    <>
      <div className="min-h-screen bg-background text-on-background font-body-md pb-32 md:pb-0">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">

          {/* Progress */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-label-md font-label-md text-on-surface-variant">Step 3 of 4</span>
              <span className="text-label-md font-label-md text-primary">Results & Guidance</span>
            </div>
            <div className="h-[12px] bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-3/4 transition-all"></div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto flex flex-col gap-6">

            <div className="text-center mb-4">
              <h2 className="text-headline-xl font-headline-xl text-primary mb-2">Assessment Summary</h2>
              <p className="text-body-lg text-on-surface-variant">
                Rule-based scoring has produced the risk level below.
              </p>
            </div>

            {/* Risk level card */}
            <div className={`rounded-[2rem] p-6 border-2 ${risk.color} flex items-start gap-4 shadow-sm`}>
              <span
                className="material-symbols-outlined text-3xl shrink-0 mt-1"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {risk.icon}
              </span>
              <div className="flex-1">
                <h4 className="text-headline-sm font-headline-sm font-bold mb-1">{risk.title}</h4>
                <p className="text-body-md opacity-90">{assessment.recommendationText}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <span className="bg-white/40 px-3 py-1 rounded-full text-label-md font-label-md font-bold">
                    Score: {assessment.totalScore}
                  </span>
                  {assessment.emergencyAlert && (
                    <span className="bg-error text-on-error px-3 py-1 rounded-full text-label-md font-label-md font-bold uppercase">
                      Emergency Alert
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Red flags triggered */}
            {assessment.triggeringRedFlags && assessment.triggeringRedFlags.length > 0 && (
              <div className="bg-error-container rounded-2xl p-5 border border-error/20">
                <h4 className="text-headline-sm font-headline-sm text-on-error-container mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    warning
                  </span>
                  Red Flags Detected
                </h4>
                <ul className="list-disc list-inside text-body-sm text-on-error-container space-y-1">
                  {assessment.triggeringRedFlags.map((flag, i) => (
                    <li key={i}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Symptoms reported */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow border border-outline-variant/30">
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">
                Symptoms Reported ({presentSymptoms.length})
              </h3>
              <div className="flex flex-col gap-3">
                {presentSymptoms.length > 0 ? (
                  presentSymptoms.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 bg-surface-container rounded-xl p-3">
                      <span className="material-symbols-outlined text-primary mt-0.5">
                        {s.isRedFlag ? 'warning' : 'check_circle'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-md text-on-surface font-semibold">{s.symptomText}</p>
                        <p className="text-body-sm text-on-surface-variant">{s.category}</p>
                        {s.guidanceText && (
                          <p className="text-body-sm text-primary mt-1">{s.guidanceText}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-body-md text-on-surface-variant">No symptoms selected.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-between items-center gap-3 border-t border-outline-variant/30 pt-6">
              <button
                onClick={() => navigate('/symptoms')}
                className="px-6 py-3 rounded-full border-2 border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-lowest"
              >
                New Assessment
              </button>
              <div className="flex gap-3">
                {babyId && (
                  <Link
                    to={`/baby/${babyId}`}
                    className="px-6 py-3 rounded-full border-2 border-primary text-primary font-label-md text-label-md hover:bg-primary-fixed"
                  >
                    Back to Baby
                  </Link>
                )}
                <Link
                  to="/specialists"
                  className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:scale-95 transition-transform"
                >
                  Find a Specialist
                </Link>
              </div>
            </div>
          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}