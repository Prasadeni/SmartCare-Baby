import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import FloatingButtons from '../components/FloatingButtons';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
`;

export default function SymptomResults() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the selected symptoms passed from SymptomCheck.jsx (Backend ready: replace this with API data later)
  const selectedSymptoms = location.state?.symptoms || [];

  // Simple demo logic for risk level (Replace with backend response later)
  const riskLevel = selectedSymptoms.length >= 3 ? 'high' : selectedSymptoms.length >= 1 ? 'moderate' : 'low';

  const riskMessages = {
    low: { title: 'Low Risk', color: 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]', icon: 'sentiment_satisfied' },
    moderate: { title: 'Moderate Risk', color: 'bg-[#fff4e5] text-[#b45309] border-[#fed7aa]', icon: 'sentiment_neutral' },
    high: { title: 'High Risk - Consult Specialist', color: 'bg-error-container text-on-error-container border-error', icon: 'emergency' }
  };

  const currentRisk = riskMessages[riskLevel];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
        <DashboardNavbar activePage="babies" />

        <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">
          
          {/* Progress Indicator - Step 3 of 4 */}
          <div className="mb-8 max-w-2xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-2">
              <span className="text-label-md font-label-md text-on-surface-variant">Step 3 of 4</span>
              <span className="text-label-md font-label-md text-primary">Results & Guidance</span>
            </div>
            <div className="h-[12px] bg-surface-container-high rounded-full overflow-hidden flex">
              <div className="h-full bg-primary rounded-full w-3/4"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            
            {/* Summary Header */}
            <div className="text-center mb-4 animate-fade-in-up">
              <h2 className="text-headline-xl font-headline-xl text-primary mb-2">Assessment Summary</h2>
              <p className="text-body-lg font-body-lg text-on-surface-variant">Based on the symptoms you selected.</p>
            </div>

            {/* Risk Level Alert */}
            <div className={`rounded-[2rem] p-6 border-2 ${currentRisk.color} flex items-start gap-4 shadow-[0_4px_20px_rgba(118,182,227,0.05)] animate-fade-in-up`} style={{ animationDelay: '0.1s' }}>
              <span className="material-symbols-outlined text-3xl shrink-0 mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>{currentRisk.icon}</span>
              <div>
                <h4 className="text-headline-sm font-headline-sm font-bold mb-1">{currentRisk.title}</h4>
                <p className="text-body-md font-body-md opacity-90">Please review the recommendations below. This is not a medical diagnosis.</p>
              </div>
            </div>

            {/* Selected Symptoms Summary */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow border border-outline-variant/30 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">Symptoms Selected ({selectedSymptoms.length})</h3>
              <div className="flex flex-wrap gap-3">
                {selectedSymptoms.length > 0 ? (
                  selectedSymptoms.map((symptom, index) => (
                    <span key={index} className="bg-primary-fixed px-4 py-2 rounded-full text-primary font-label-md text-label-md">
                      {symptom}
                    </span>
                  ))
                ) : (
                  <span className="text-body-md text-on-surface-variant">No specific symptoms selected. General monitoring recommended.</span>
                )}
              </div>
            </div>

            {/* Recommendations (Backend ready: replace this with API response data later) */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-6 soft-shadow border border-outline-variant/30 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">Recommended Next Steps</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-primary mt-1">monitoring</span>
                  <span className="text-body-md text-on-surface-variant">Monitor your baby's temperature and hydration levels over the next 24 hours.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-primary mt-1">medical_services</span>
                  <span className="text-body-md text-on-surface-variant">If symptoms persist or worsen, consult with a pediatric specialist.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-primary mt-1">restaurant</span>
                  <span className="text-body-md text-on-surface-variant">Ensure adequate fluid intake. Try smaller, more frequent feeds.</span>
                </li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center border-t border-outline-variant/30 pt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button onClick={() => navigate('/symptoms')} className="px-12 py-3 rounded-full border-2 border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-lowest transition-colors">
                Go Back
              </button>
              <Link to="/specialists" className="px-12 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:scale-95 transition-transform duration-200 shadow-[0_4px_20px_rgba(118,182,227,0.1)]">
                Find a Specialist
              </Link>
            </div>

          </div>
        </main>

        <FloatingButtons />
      </div>
    </>
  );
}